/**
 * Sistema de objetos empurráveis/arrastáveis estilo Zelda antigo
 * 
 * Características:
 * - Objetos podem ser empurrados quando o jogador anda contra eles
 * - Segurar uma tecla permite arrastar o objeto de forma contínua
 * - Objetos colidem com paredes e outros obstáculos
 * - Animação do jogador enquanto empurra
 */

import { InteractionIcon } from '../ui/InteractionIcon.js';

export class PushableObject {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x - posição X inicial
     * @param {number} y - posição Y inicial
     * @param {string} texture - textura do objeto
     * @param {Object} options - opções adicionais
     */
    constructor(scene, x, y, texture, options = {}) {
        this.scene = scene;
        
        // Criar sprite com física
        this.sprite = scene.physics.add.sprite(x, y, texture);
        // NÃO usar setImmovable para permitir overlap funcionar
        this.sprite.setPushable(false); // Impede ser empurrado pela física normal
        this.sprite.body.setSize(
            options.bodyWidth || this.sprite.width,
            options.bodyHeight || this.sprite.height
        );
        
        // Configurações
        this.pushSpeed = options.pushSpeed || 120; // Velocidade ao ser empurrado (mais rápido para ser smooth)
        this.pushDistance = options.pushDistance || 32; // Distância de um "push" (um tile)
        this.canBePushed = options.canBePushed !== false; // Ativado por padrão
        
        // Estado de movimento
        this.isPushing = false;
        this.pushDirection = null;
        this.targetPosition = { x: x, y: y };
        this.startPosition = { x: x, y: y };
        this.pushProgress = 0;
        
        // Referência ao pusher (jogador)
        this.pusher = null;
        
        // Estado de agarrado (grab)
        this.isGrabbed = false;
        this.grabber = null;
        
        // Callback quando o objeto é empurrado
        this.onPushStart = options.onPushStart || null;
        this.onPushEnd = options.onPushEnd || null;
        
        // Impedir movimento diagonal
        this.sprite.body.setMaxVelocity(this.pushSpeed, this.pushSpeed);
    }
    
    /**
     * Tenta empurrar o objeto em uma direção
     * @param {string} direction - 'up', 'down', 'left', 'right'
     * @param {Phaser.Physics.Arcade.Sprite} pusher - quem está empurrando
     * @returns {boolean} - se o push foi iniciado
     */
    push(direction, pusher) {
        if (!this.canBePushed || this.isPushing) {
            return false;
        }
        
        // Calcular posição alvo
        const targetX = this.sprite.x;
        const targetY = this.sprite.y;
        
        switch (direction) {
            case 'up':
                this.targetPosition = { x: targetX, y: targetY - this.pushDistance };
                break;
            case 'down':
                this.targetPosition = { x: targetX, y: targetY + this.pushDistance };
                break;
            case 'left':
                this.targetPosition = { x: targetX - this.pushDistance, y: targetY };
                break;
            case 'right':
                this.targetPosition = { x: targetX + this.pushDistance, y: targetY };
                break;
            default:
                return false;
        }
        
        // Verificar se há espaço para mover (checar colisão com tiles)
        if (!this._canMoveToPosition(this.targetPosition)) {
            return false;
        }
        
        // Iniciar o push
        this.isPushing = true;
        this.pushDirection = direction;
        this.pusher = pusher;
        this.startPosition = { x: this.sprite.x, y: this.sprite.y };
        this.pushProgress = 0;
        
        // Callback
        if (this.onPushStart) {
            this.onPushStart(this, direction);
        }
        
        return true;
    }
    
    /**
     * Verifica se o objeto pode se mover para uma posição
     * @private
     */
    _canMoveToPosition(position) {
        // Aqui você pode adicionar lógica mais complexa
        // Por exemplo, verificar colisão com tiles ou outros objetos
        // Por enquanto, simplesmente retorna true
        return true;
    }
    
    /**
     * Atualizar o estado do objeto (chamar no update da scene)
     */
    update() {
        if (!this.isPushing) {
            this.sprite.setVelocity(0);
            return;
        }
        
        // Verificar se o pusher ainda está empurrando (próximo e se movendo)
        if (this.pusher) {
            const distToPusher = Phaser.Math.Distance.Between(
                this.pusher.x, this.pusher.y,
                this.sprite.x, this.sprite.y
            );
            
            const pusherMoving = Math.abs(this.pusher.body.velocity.x) > 10 || 
                                Math.abs(this.pusher.body.velocity.y) > 10;
            
            // Se o pusher parou ou se afastou muito, cancelar o empurrão
            if (!pusherMoving || distToPusher > 50) {
                this.sprite.setVelocity(0);
                this.isPushing = false;
                this.pusher = null;
                this.pushDirection = null;
                return;
            }
        }
        
        // Movimento suave usando interpolação
        const currentX = this.sprite.x;
        const currentY = this.sprite.y;
        const targetX = this.targetPosition.x;
        const targetY = this.targetPosition.y;
        
        // Calcular distância restante
        const remainingDist = Math.sqrt(
            Math.pow(targetX - currentX, 2) + 
            Math.pow(targetY - currentY, 2)
        );
        
        // Se chegou no destino (margem de 1 pixel)
        if (remainingDist < 1) {
            // Finalizar movimento
            this.sprite.setPosition(targetX, targetY);
            this.sprite.setVelocity(0);
            this.isPushing = false;
            
            // Callback
            if (this.onPushEnd) {
                this.onPushEnd(this, this.pushDirection);
            }
            
            this.pusher = null;
            this.pushDirection = null;
        } else {
            // Continuar movimento suave
            const dirX = (targetX - currentX) / remainingDist;
            const dirY = (targetY - currentY) / remainingDist;
            
            this.sprite.setVelocity(
                dirX * this.pushSpeed,
                dirY * this.pushSpeed
            );
        }
    }
    
    /**
     * Verifica se o jogador está em posição de empurrar
     */
    canPlayerPush(player, direction) {
        if (!this.canBePushed || this.isPushing) return false;
        
        const distance = Phaser.Math.Distance.Between(
            player.x, player.y,
            this.sprite.x, this.sprite.y
        );
        
        // Player precisa estar perto o suficiente
        return distance < 40;
    }
    
    /**
     * Agarra o objeto (grab) - permite empurrar E puxar
     */
    grab(grabber) {
        if (!this.canBePushed) return false;
        
        this.isGrabbed = true;
        this.grabber = grabber;
        return true;
    }
    
    /**
     * Solta o objeto (release)
     */
    release() {
        this.isGrabbed = false;
        this.grabber = null;
        this.isPushing = false;
        this.sprite.setVelocity(0);
    }
    
    /**
     * Desabilita o objeto (não pode mais ser empurrado)
     */
    disable() {
        this.canBePushed = false;
    }
    
    /**
     * Habilita o objeto
     */
    enable() {
        this.canBePushed = true;
    }
    
    /**
     * Destrói o objeto
     */
    destroy() {
        this.sprite.destroy();
    }
}

/**
 * Gerenciador de objetos empurráveis
 * Facilita o gerenciamento de múltiplos objetos empurráveis em uma cena
 */
export class PushableObjectManager {
    /**
     * @param {Phaser.Scene} scene
     * @param {Phaser.Physics.Arcade.Sprite} player
     */
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.objects = [];
        this.grabKeys = []; // Teclas para agarrar/empurrar
        this.autoPush = false; // Desativado - agora precisa segurar tecla
        
        // Teclas de agarrar (Z e F como pedido)
        this.grabKeys.push(scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z));
        this.grabKeys.push(scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F));
        
        // Estado do botão virtual de ação
        this.virtualActionPressed = false;
        
        // Objeto atualmente agarrado
        this.grabbedObject = null;
        
        // Ícone de interação (bem menor)
        this.grabIcon = new InteractionIcon(scene, 'button_x', 0.05);
        this.grabIcon.offsetY = -40;  // Mais próximo do objeto
    }
    
    /**
     * Adiciona um objeto empurrável
     */
    addObject(x, y, texture, options = {}) {
        const obj = new PushableObject(this.scene, x, y, texture, options);
        this.objects.push(obj);
        
        // Adicionar colisão com player
        this.scene.physics.add.collider(this.player, obj.sprite);
        
        return obj;
    }
    
    /**
     * Atualizar todos os objetos (chamar no update da scene)
     */
    update() {
        // Verificar se alguma tecla de agarrar está pressionada OU botão virtual
        const isGrabKeyPressed = this.grabKeys.some(key => key.isDown) || this.virtualActionPressed;
        
        // Se soltou a tecla, soltar o objeto
        if (!isGrabKeyPressed && this.grabbedObject) {
            this.grabbedObject.release();
            this.grabbedObject = null;
        }
        
        // Atualizar cada objeto
        this.objects.forEach(obj => obj.update());
        
        // Se está segurando a tecla, tentar agarrar/mover objeto
        if (isGrabKeyPressed) {
            this._handleGrabbing();
        } else {
            // Não está segurando, mostrar prompt se estiver perto
            this._checkShowPrompt();
        }
    }
    
    /**
     * Verifica se deve mostrar o prompt de "Pressione Z"
     * @private
     */
    _checkShowPrompt() {
        const movement = this.scene.movement;
        if (!movement) return;
        
        const direction = movement.facing;
        let nearObject = null;
        
        // Verificar se está perto de algum objeto
        for (const obj of this.objects) {
            const dx = obj.sprite.x - this.player.x;
            const dy = obj.sprite.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Precisa estar perto (40px)
            if (distance > 40) continue;
            
            // Verificar se está de frente para o objeto
            let facingObject = false;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                facingObject = (dx > 0 && direction === 'right') || (dx < 0 && direction === 'left');
            } else {
                facingObject = (dy > 0 && direction === 'down') || (dy < 0 && direction === 'up');
            }
            
            if (facingObject) {
                nearObject = obj.sprite;
                break;
            }
        }
        
        // Mostrar/esconder ícone
        if (nearObject) {
            this.grabIcon.showAbove(nearObject);
        } else {
            this.grabIcon.hide();
        }
        
        // Atualizar posição do ícone
        this.grabIcon.updatePosition();
    }
    
    /**
     * Verifica se o player está tentando empurrar algum objeto
     * @private
     */
    _checkPushAttempt() {
        // Pegar a direção que o player está olhando
        const movement = this.scene.movement;
        if (!movement) return;
        
        const direction = movement.facing;
        
        // Verificar cada objeto
        for (const obj of this.objects) {
            if (obj.isPushing) continue; // Já está sendo empurrado
            
            // Calcular distância e posição relativa
            const dx = obj.sprite.x - this.player.x;
            const dy = obj.sprite.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Player precisa estar perto (40px)
            if (distance > 40) continue;
            
            // Verificar se está olhando na direção certa
            let correctDirection = false;
            
            if (direction === 'right' && dx > 0 && Math.abs(dx) > Math.abs(dy)) {
                correctDirection = true;
            } else if (direction === 'left' && dx < 0 && Math.abs(dx) > Math.abs(dy)) {
                correctDirection = true;
            } else if (direction === 'down' && dy > 0 && Math.abs(dy) > Math.abs(dx)) {
                correctDirection = true;
            } else if (direction === 'up' && dy < 0 && Math.abs(dy) > Math.abs(dx)) {
                correctDirection = true;
            }
            
            if (!correctDirection) continue;
            
            // Verificar se o player está se movendo
            const isMoving = Math.abs(this.player.body.velocity.x) > 10 || 
                            Math.abs(this.player.body.velocity.y) > 10;
            
            if (isMoving || this.pushKey.isDown) {
                obj.push(direction, this.player);
                break; // Só empurra um objeto por vez
            }
        }
    }
    
    /**
     * Gerencia o sistema de agarrar/empurrar/puxar
     * @private
     */
    _handleGrabbing() {
        const movement = this.scene.movement;
        if (!movement) return;
        
        const direction = movement.facing;
        
        // Se já está agarrando um objeto
        if (this.grabbedObject) {
            // Calcular distância ao objeto
            const dx = this.grabbedObject.sprite.x - this.player.x;
            const dy = this.grabbedObject.sprite.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Se muito longe, soltar
            if (distance > 50) {
                this.grabbedObject.release();
                this.grabbedObject = null;
                return;
            }
            
            // IMPORTANTE: Manter o jogador grudado na caixa
            // Calcular posição ideal do jogador baseado na direção que ele está olhando
            const GRAB_DISTANCE = 28; // Distância que o player fica da caixa (aumentado para evitar entrar)
            let targetPlayerX = this.player.x;
            let targetPlayerY = this.player.y;
            
            // Determinar posição ideal baseado em onde o objeto está
            if (Math.abs(dx) > Math.abs(dy)) {
                // Objeto está à esquerda ou direita
                if (dx > 0) {
                    // Objeto à direita - player deve ficar à esquerda
                    targetPlayerX = this.grabbedObject.sprite.x - GRAB_DISTANCE;
                    targetPlayerY = this.grabbedObject.sprite.y;
                    // Forçar olhar para direita
                    movement.facing = 'right';
                } else {
                    // Objeto à esquerda - player deve ficar à direita
                    targetPlayerX = this.grabbedObject.sprite.x + GRAB_DISTANCE;
                    targetPlayerY = this.grabbedObject.sprite.y;
                    // Forçar olhar para esquerda
                    movement.facing = 'left';
                }
            } else {
                // Objeto está acima ou abaixo
                if (dy > 0) {
                    // Objeto abaixo - player deve ficar acima
                    targetPlayerX = this.grabbedObject.sprite.x;
                    targetPlayerY = this.grabbedObject.sprite.y - GRAB_DISTANCE;
                    // Forçar olhar para baixo
                    movement.facing = 'down';
                } else {
                    // Objeto acima - player deve ficar abaixo
                    targetPlayerX = this.grabbedObject.sprite.x;
                    targetPlayerY = this.grabbedObject.sprite.y + GRAB_DISTANCE;
                    // Forçar olhar para cima
                    movement.facing = 'up';
                }
            }
            
            // Ajustar posição do player suavemente para ficar grudado
            const playerDx = targetPlayerX - this.player.x;
            const playerDy = targetPlayerY - this.player.y;
            const playerDist = Math.sqrt(playerDx * playerDx + playerDy * playerDy);
            
            if (playerDist > 3) {
                // Mover player suavemente para posição correta (reduzido para 0.2 para ser mais suave)
                this.player.x += playerDx * 0.2;
                this.player.y += playerDy * 0.2;
            }
            
            // Esconder ícone quando está agarrado
            this.grabIcon.hide();
            
            // Verificar se está se movendo
            const isMoving = Math.abs(this.player.body.velocity.x) > 10 || 
                            Math.abs(this.player.body.velocity.y) > 10;
            
            if (!isMoving) {
                // Parado, não mover o objeto
                if (this.grabbedObject.isPushing) {
                    this.grabbedObject.sprite.setVelocity(0);
                    this.grabbedObject.isPushing = false;
                }
                return;
            }
            
            // Determinar direção do movimento baseado na VELOCIDADE do player
            // (não na direção que está olhando)
            let pushOrPullDirection = null;
            const velX = this.player.body.velocity.x;
            const velY = this.player.body.velocity.y;
            
            // A caixa se move na mesma direção que o player está se movendo
            if (Math.abs(velX) > Math.abs(velY)) {
                // Movimento horizontal predominante
                if (velX > 10) {
                    pushOrPullDirection = 'right';
                } else if (velX < -10) {
                    pushOrPullDirection = 'left';
                }
            } else {
                // Movimento vertical predominante
                if (velY > 10) {
                    pushOrPullDirection = 'down';
                } else if (velY < -10) {
                    pushOrPullDirection = 'up';
                }
            }
            
            // Tentar mover o objeto
            if (pushOrPullDirection) {
                this.grabbedObject.push(pushOrPullDirection, this.player);
            }
            
        } else {
            // Não está agarrando nada, tentar agarrar objeto próximo
            for (const obj of this.objects) {
                if (obj.isGrabbed) continue;
                
                const dx = obj.sprite.x - this.player.x;
                const dy = obj.sprite.y - this.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Precisa estar perto (40px)
                if (distance > 40) continue;
                
                // Verificar se está de frente para o objeto
                let facingObject = false;
                
                if (Math.abs(dx) > Math.abs(dy)) {
                    facingObject = (dx > 0 && direction === 'right') || (dx < 0 && direction === 'left');
                } else {
                    facingObject = (dy > 0 && direction === 'down') || (dy < 0 && direction === 'up');
                }
                
                if (facingObject) {
                    // Agarrar este objeto
                    obj.grab(this.player);
                    this.grabbedObject = obj;
                    break; // Só agarra um por vez
                }
            }
        }
    }
    
    /**
     * Remove um objeto
     */
    removeObject(obj) {
        const index = this.objects.indexOf(obj);
        if (index > -1) {
            this.objects.splice(index, 1);
            obj.destroy();
        }
    }
    
    /**
     * Define o estado do botão virtual de ação (para mobile)
     * @param {boolean} pressed - se o botão está pressionado
     */
    setVirtualActionButton(pressed) {
        this.virtualActionPressed = pressed;
    }
    
    /**
     * Remove todos os objetos
     */
    clear() {
        this.objects.forEach(obj => obj.destroy());
        this.objects = [];
    }
}
