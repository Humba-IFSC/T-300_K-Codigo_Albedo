/**
 * ============================================================================
 * MOBILE CONTROLS - Configurações Pré-definidas
 * ============================================================================
 * 
 * Este arquivo contém configurações prontas para diferentes tipos de jogos.
 * Basta importar e usar!
 * 
 * COMO USAR:
 * 
 * import { MobileControls } from './MobileControls.js';
 * import { CONFIGS } from './MobileControlsConfigs.js';
 * 
 * // Usar configuração pré-definida:
 * this.mobileControls = new MobileControls(this, CONFIGS.TOP_DOWN_RPG);
 * 
 * // Ou customizar a partir de uma configuração:
 * const customConfig = {
 *     ...CONFIGS.TOP_DOWN_RPG,
 *     joystick: {
 *         ...CONFIGS.TOP_DOWN_RPG.joystick,
 *         baseRadius: 80  // Customiza apenas o que precisa
 *     }
 * };
 * this.mobileControls = new MobileControls(this, customConfig);
 */

// ============================================================================
// CONFIGURAÇÕES PRÉ-DEFINIDAS
// ============================================================================

export const CONFIGS = {
    
    /**
     * TOP DOWN RPG
     * Ideal para jogos de RPG vistos de cima (Zelda-like, Pokemon-like)
     */
    TOP_DOWN_RPG: {
        joystick: {
            enabled: true,
            baseRadius: 60,
            stickRadius: 30,
            maxDistance: 50,
            alpha: 0.6,
            deadZone: 0.2
        },
        buttons: [
            { action: 'interact', label: 'A', color: 0x00FF00, position: 'right-bottom' },
            { action: 'run', label: 'B', color: 0xFF0000, position: 'left-top' },
            { action: 'menu', label: 'X', color: 0x0000FF, position: 'top' }
        ],
        buttonRadius: 50,
        buttonAlpha: 0.8,
        buttonSpacing: 20,
        autoDetectMobile: true,
        alwaysShow: false
    },
    
    /**
     * PLATAFORMA
     * Ideal para jogos de plataforma (Mario-like, Sonic-like)
     * Usa botões direcionais em vez de joystick
     */
    PLATFORMER: {
        joystick: {
            enabled: false  // Desabilitado para plataforma
        },
        buttons: [
            { action: 'left', label: '◄', color: 0x888888, position: 'left-bottom' },
            { action: 'right', label: '►', color: 0x888888, position: 'right-bottom' },
            { action: 'jump', label: 'A', color: 0x00FF00, position: 'right-top' },
            { action: 'attack', label: 'B', color: 0xFF0000, position: 'top' }
        ],
        buttonRadius: 50,
        buttonAlpha: 0.8,
        buttonSpacing: 15,
        autoDetectMobile: true,
        alwaysShow: false
    },
    
    /**
     * TWIN STICK SHOOTER
     * Ideal para jogos de tiro com dois joysticks (um para mover, outro para atirar)
     * Nota: Esta configuração usa apenas um joystick, você precisará adicionar o segundo manualmente
     */
    TWIN_STICK: {
        joystick: {
            enabled: true,
            baseRadius: 55,
            stickRadius: 25,
            maxDistance: 45,
            alpha: 0.7,
            deadZone: 0.15
        },
        buttons: [
            { action: 'fire', label: '🔫', color: 0xFF0000, position: 'right-bottom' },
            { action: 'reload', label: 'R', color: 0xFFFF00, position: 'right-top' },
            { action: 'grenade', label: 'G', color: 0xFF8800, position: 'top' }
        ],
        buttonRadius: 45,
        buttonAlpha: 0.75,
        buttonSpacing: 20,
        autoDetectMobile: true,
        alwaysShow: false
    },
    
    /**
     * AÇÃO SIMPLES
     * Configuração minimalista com apenas 2 botões
     */
    SIMPLE_ACTION: {
        joystick: {
            enabled: true,
            baseRadius: 60,
            stickRadius: 30,
            maxDistance: 50,
            alpha: 0.6,
            deadZone: 0.2
        },
        buttons: [
            { action: 'action', label: 'A', color: 0x00FF00, position: 'right-bottom' },
            { action: 'special', label: 'B', color: 0xFF0000, position: 'top' }
        ],
        buttonRadius: 55,
        buttonAlpha: 0.8,
        buttonSpacing: 20,
        autoDetectMobile: true,
        alwaysShow: false
    },
    
    /**
     * PUZZLE
     * Ideal para jogos de puzzle que não precisam de movimento constante
     */
    PUZZLE: {
        joystick: {
            enabled: false  // Não precisa de joystick
        },
        buttons: [
            { action: 'select', label: '✓', color: 0x00FF00, position: 'right-bottom' },
            { action: 'cancel', label: '✕', color: 0xFF0000, position: 'left-bottom' },
            { action: 'hint', label: '?', color: 0x0000FF, position: 'top' }
        ],
        buttonRadius: 55,
        buttonAlpha: 0.9,
        buttonSpacing: 25,
        autoDetectMobile: true,
        alwaysShow: false
    },
    
    /**
     * RACER/DRIVING
     * Ideal para jogos de corrida ou direção
     */
    RACER: {
        joystick: {
            enabled: true,
            baseRadius: 70,
            stickRadius: 35,
            maxDistance: 55,
            alpha: 0.7,
            deadZone: 0.1
        },
        buttons: [
            { action: 'accelerate', label: '▲', color: 0x00FF00, position: 'right-bottom' },
            { action: 'brake', label: '▼', color: 0xFF0000, position: 'right-top' },
            { action: 'nitro', label: 'N', color: 0xFF8800, position: 'top' }
        ],
        buttonRadius: 50,
        buttonAlpha: 0.85,
        buttonSpacing: 15,
        autoDetectMobile: true,
        alwaysShow: false
    },
    
    /**
     * BEAT EM UP
     * Ideal para jogos de luta (Streets of Rage, Double Dragon)
     */
    BEAT_EM_UP: {
        joystick: {
            enabled: true,
            baseRadius: 60,
            stickRadius: 30,
            maxDistance: 50,
            alpha: 0.6,
            deadZone: 0.2
        },
        buttons: [
            { action: 'attack', label: 'A', color: 0xFF0000, position: 'right-bottom' },
            { action: 'jump', label: 'B', color: 0x00FF00, position: 'left-top' },
            { action: 'special', label: 'X', color: 0xFFFF00, position: 'top' },
            { action: 'grab', label: 'Y', color: 0xFF8800, position: 'left-bottom' }
        ],
        buttonRadius: 48,
        buttonAlpha: 0.8,
        buttonSpacing: 18,
        autoDetectMobile: true,
        alwaysShow: false
    },
    
    /**
     * MINIMAL
     * Configuração ultra-minimalista (só joystick, sem botões)
     */
    MINIMAL: {
        joystick: {
            enabled: true,
            baseRadius: 60,
            stickRadius: 30,
            maxDistance: 50,
            alpha: 0.5,
            deadZone: 0.2
        },
        buttons: [],  // Sem botões
        autoDetectMobile: true,
        alwaysShow: false
    },
    
    /**
     * TESTING
     * Configuração para testes em desktop (sempre visível)
     */
    TESTING: {
        joystick: {
            enabled: true,
            baseRadius: 60,
            stickRadius: 30,
            maxDistance: 50,
            alpha: 0.8,
            deadZone: 0.2
        },
        buttons: [
            { action: 'test1', label: '1', color: 0xFF0000, position: 'right-bottom' },
            { action: 'test2', label: '2', color: 0x00FF00, position: 'left-top' },
            { action: 'test3', label: '3', color: 0x0000FF, position: 'top' }
        ],
        buttonRadius: 50,
        buttonAlpha: 0.9,
        buttonSpacing: 20,
        autoDetectMobile: false,
        alwaysShow: true  // SEMPRE VISÍVEL para testes
    }
};

// ============================================================================
// PRESETS DE BOTÕES
// ============================================================================

/**
 * Presets de configurações de botões que podem ser combinados
 */
export const BUTTON_PRESETS = {
    
    /**
     * Botões padrão de ação
     */
    ACTION_BUTTONS: [
        { action: 'interact', label: 'A', color: 0x00FF00, position: 'right-bottom' },
        { action: 'cancel', label: 'B', color: 0xFF0000, position: 'left-top' }
    ],
    
    /**
     * Botões de combate básico
     */
    COMBAT_BUTTONS: [
        { action: 'attack', label: 'A', color: 0xFF0000, position: 'right-bottom' },
        { action: 'defend', label: 'B', color: 0x0000FF, position: 'left-top' },
        { action: 'special', label: 'X', color: 0xFFFF00, position: 'top' }
    ],
    
    /**
     * Botões direcionais (para plataforma)
     */
    DPAD_BUTTONS: [
        { action: 'left', label: '◄', color: 0x666666, position: 'left-bottom' },
        { action: 'right', label: '►', color: 0x666666, position: 'right-bottom' },
        { action: 'up', label: '▲', color: 0x666666, position: 'top' },
        { action: 'down', label: '▼', color: 0x666666, position: 'left-top' }
    ],
    
    /**
     * Botão único simples
     */
    SINGLE_BUTTON: [
        { action: 'action', label: 'A', color: 0x00FF00, position: 'right-bottom' }
    ]
};

// ============================================================================
// PRESETS DE JOYSTICK
// ============================================================================

/**
 * Presets de configurações de joystick
 */
export const JOYSTICK_PRESETS = {
    
    /**
     * Joystick padrão
     */
    DEFAULT: {
        enabled: true,
        baseRadius: 60,
        stickRadius: 30,
        maxDistance: 50,
        alpha: 0.6,
        deadZone: 0.2
    },
    
    /**
     * Joystick grande (mais fácil de usar)
     */
    LARGE: {
        enabled: true,
        baseRadius: 80,
        stickRadius: 40,
        maxDistance: 65,
        alpha: 0.6,
        deadZone: 0.2
    },
    
    /**
     * Joystick pequeno (compacto)
     */
    SMALL: {
        enabled: true,
        baseRadius: 45,
        stickRadius: 22,
        maxDistance: 38,
        alpha: 0.6,
        deadZone: 0.2
    },
    
    /**
     * Joystick preciso (para jogos que exigem precisão)
     */
    PRECISE: {
        enabled: true,
        baseRadius: 60,
        stickRadius: 30,
        maxDistance: 50,
        alpha: 0.7,
        deadZone: 0.1  // Dead zone menor
    },
    
    /**
     * Joystick desabilitado
     */
    DISABLED: {
        enabled: false
    }
};

// ============================================================================
// FUNÇÕES HELPER
// ============================================================================

/**
 * Cria uma configuração customizada a partir de um preset
 * @param {string} presetName - Nome do preset (ex: 'TOP_DOWN_RPG')
 * @param {Object} overrides - Propriedades para sobrescrever
 * @returns {Object} Configuração customizada
 */
export function createCustomConfig(presetName, overrides = {}) {
    const preset = CONFIGS[presetName];
    if (!preset) {
        console.warn(`Preset '${presetName}' não encontrado. Usando DEFAULT.`);
        return { ...CONFIGS.TOP_DOWN_RPG, ...overrides };
    }
    
    return {
        ...preset,
        ...overrides,
        joystick: {
            ...preset.joystick,
            ...(overrides.joystick || {})
        }
    };
}

/**
 * Combina preset de joystick com preset de botões
 * @param {Object} joystickPreset - Preset de joystick
 * @param {Array} buttonPreset - Preset de botões
 * @param {Object} options - Opções adicionais
 * @returns {Object} Configuração combinada
 */
export function combinePresets(joystickPreset, buttonPreset, options = {}) {
    return {
        joystick: joystickPreset,
        buttons: buttonPreset,
        buttonRadius: options.buttonRadius || 50,
        buttonAlpha: options.buttonAlpha || 0.8,
        buttonSpacing: options.buttonSpacing || 20,
        autoDetectMobile: options.autoDetectMobile !== undefined ? options.autoDetectMobile : true,
        alwaysShow: options.alwaysShow || false
    };
}

// ============================================================================
// EXEMPLOS DE USO
// ============================================================================

/**
 * EXEMPLO 1: Usar configuração pré-definida
 * 
 * import { MobileControls } from './MobileControls.js';
 * import { CONFIGS } from './MobileControlsConfigs.js';
 * 
 * this.mobileControls = new MobileControls(this, CONFIGS.TOP_DOWN_RPG);
 */

/**
 * EXEMPLO 2: Customizar a partir de um preset
 * 
 * import { MobileControls } from './MobileControls.js';
 * import { CONFIGS, createCustomConfig } from './MobileControlsConfigs.js';
 * 
 * const config = createCustomConfig('TOP_DOWN_RPG', {
 *     joystick: { baseRadius: 80 },
 *     buttonRadius: 60
 * });
 * 
 * this.mobileControls = new MobileControls(this, config);
 */

/**
 * EXEMPLO 3: Combinar presets
 * 
 * import { MobileControls } from './MobileControls.js';
 * import { JOYSTICK_PRESETS, BUTTON_PRESETS, combinePresets } from './MobileControlsConfigs.js';
 * 
 * const config = combinePresets(
 *     JOYSTICK_PRESETS.LARGE,
 *     BUTTON_PRESETS.COMBAT_BUTTONS,
 *     { alwaysShow: true }
 * );
 * 
 * this.mobileControls = new MobileControls(this, config);
 */

/**
 * EXEMPLO 4: Modificar botões de um preset
 * 
 * import { MobileControls } from './MobileControls.js';
 * import { CONFIGS } from './MobileControlsConfigs.js';
 * 
 * const config = {
 *     ...CONFIGS.TOP_DOWN_RPG,
 *     buttons: [
 *         ...CONFIGS.TOP_DOWN_RPG.buttons,
 *         { action: 'inventory', label: 'I', color: 0x8800FF, position: 'left-bottom' }
 *     ]
 * };
 * 
 * this.mobileControls = new MobileControls(this, config);
 */
