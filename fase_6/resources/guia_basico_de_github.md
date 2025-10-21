# 🐙 Guia Completo de GitHub, JavaScript, HTML, CSS e Phaser para T-300 K

## ÍNDICE GERAL
1. [GitHub para Iniciantes](#github-para-iniciantes)
2. [HTML Essencial](#html-essencial)
3. [CSS Essencial](#css-essencial)
4. [JavaScript Essencial](#javascript-essencial)
5. [Phaser para o Jogo](#phaser-para-o-jogo)

---

# 🐙 GITHUB PARA INICIANTES

## O que é Git e GitHub?

**Git** é um programa que controla versões dos seus arquivos. É como um "Ctrl+Z" super poderoso que:
- Guarda o histórico de todas as mudanças
- Permite voltar para versões antigas
- Ajuda várias pessoas a trabalharem juntas

**GitHub** é um site onde você armazena seus projetos Git na internet. É como um "Google Drive para código".

---

## Instalação e Configuração

### Passo 1: Instalar o Git

**Windows:**
1. Acesse: https://git-scm.com/download/win
2. Baixe e instale (pode deixar tudo padrão)
3. Abra o Git Bash

**Mac/Linux:**
```bash
# Verifique se já tem instalado
git --version

# Se não tiver, instale via terminal
```

### Passo 2: Configurar seu Nome

Abra o terminal e digite:
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

### Passo 3: Criar Conta no GitHub

1. Acesse: https://github.com
2. Clique em **Sign up**
3. Crie sua conta com o mesmo email

---

## Conceitos Básicos

### 📁 Repositório (Repo)
É a pasta do projeto que o Git vigia. Tudo é guardado no histórico.

### 💾 Commit
Um "save point" do projeto. Tirar uma foto de como está o código naquele momento.

**Exemplo de commits bons:**
```
✅ "Criou sistema de puzzles de irradiação"
✅ "Adicionou músicas da Torre Celeste"
✅ "Corrigiu bug no final Bom"

❌ "atualizou"
❌ "muitas mudanças"
```

### 🌿 Branch
Uma "linha do tempo paralela" do projeto. Cada pessoa trabalha na sua.

```
main (projeto principal)
 ├── feature/torre-celeste (você)
 ├── feature/enigmas (colega 1)
 └── bugfix/salvar-progresso (colega 2)
```

### ⬆️ Push e ⬇️ Pull
- **Push**: Enviar suas mudanças para o GitHub
- **Pull**: Buscar mudanças do GitHub

---

## Comandos Essenciais

### Clone: Baixar o Projeto
```bash
# Copia o repositório para seu computador
git clone https://github.com/usuario/t-300-k.git

# Entra na pasta
cd t-300-k
```

### Status: Ver Mudanças
```bash
# Mostra o que foi alterado
git status
```

### Add: Preparar Mudanças
```bash
# Adiciona um arquivo
git add arquivo.js

# Adiciona todos os arquivos
git add .
```

### Commit: Salvar Mudanças
```bash
# Cria um save point com mensagem
git commit -m "Adicionei o enigma 1 de irradiação"
```

### Push: Enviar para o GitHub
```bash
# Envia suas mudanças
git push origin feature/enigmas
```

### Pull: Buscar Mudanças
```bash
# Baixa as mudanças que outros fizeram
git pull origin main
```

---

## Trabalhando com Branches

### Criar uma Nova Branch
```bash
# Cria e entra na branch
git checkout -b feature/tower-celeste

# Ou (comando mais novo)
git switch -c feature/tower-celeste
```

### Mudar de Branch
```bash
git checkout main
git checkout feature/enigmas
```

### Ver Todas as Branches
```bash
git branch
git branch -a  # Inclui remotas
```

### Deletar uma Branch
```bash
git branch -d feature/antiga
```

---

## Fluxo de Trabalho em Equipe (Para T-300 K)

### Seu Dia de Trabalho:

**Manhã: Começar o dia**
```bash
# 1. Entre na pasta do projeto
cd t-300-k

# 2. Volte para a branch main
git checkout main

# 3. Puxe as atualizações
git pull origin main
```

**Durante o dia: Trabalhando em sua feature**
```bash
# 1. Crie sua branch (se ainda não tiver)
git checkout -b feature/meu-enigma

# 2. Faça suas mudanças (edite os arquivos)

# 3. Verifique o que mudou
git status

# 4. Adicione as mudanças
git add .

# 5. Faça um commit
git commit -m "Criei o enigma de emissividade"

# 6. Envie para o GitHub
git push origin feature/meu-enigma
```

**Fim do dia: Sincronizar com a equipe**
```bash
# Puxe mudanças da main (caso alguém tenha atualizado)
git pull origin main

# Se teve conflitos, resolva (veja seção de problemas)

# Envie novamente
git push origin feature/meu-enigma
```

---

## Resolvendo Problemas Comuns

### ❌ "Conflict" - Mesmo arquivo modificado

Às vezes duas pessoas editam o mesmo arquivo. Git não sabe qual versão guardar.

**Como resolver:**
1. Abra o arquivo com conflito
2. Procure por `<<<<<<<` e `>>>>>>>`
3. Escolha qual versão quer (ou misture as duas)
4. Delete as marcas do Git
5. Faça commit novamente

```bash
git add .
git commit -m "Resolvi conflito em enigma.js"
git push origin feature/meu-enigma
```

### ❌ "Permission Denied" ao fazer Push

Você não tem permissão para escrever no repositório.

**Soluções:**
1. Verifique se foi adicionado como membro do repo
2. Gere uma chave SSH: https://docs.github.com/pt/authentication/connecting-to-github-with-ssh
3. Use token de acesso pessoal

### ❌ Mudei errado e quero voltar

```bash
# Ver histórico de commits
git log

# Voltar para um commit anterior
git reset --hard abc1234

# Enviar para o GitHub
git push origin feature/meu-enigma -f  # -f = force
```

---

## Dicas Importantes

✅ **Faça commits pequenos e frequentes**
- Melhor: 5 commits pequenos
- Pior: 1 commit gigante com tudo

✅ **Mensagens claras e em português**
```
git commit -m "Adicionou sistema de save/load"
git commit -m "Corrigiu bug no final Bom"
```

✅ **Sempre puxe antes de pushar**
```bash
git pull origin main
git push origin feature/enigmas
```

✅ **Não trabalhe diretamente na main**
- A main é o projeto funcional
- Sempre crie uma branch para sua feature

✅ **Teste antes de fazer push**
- Verifique se o código funciona
- Rode o jogo localmente