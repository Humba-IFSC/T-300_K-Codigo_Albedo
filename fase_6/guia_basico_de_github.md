# 🐙 Guia Básico de GitHub para Iniciantes
## Aprenda o essencial para trabalhar em equipe

---

## 🎯 O que você vai aprender?

Este guia ensina o **básico do GitHub** de forma simples, sem complicação. Perfeito para quem nunca usou e precisa começar rápido!

---

## 📖 Índice

1. [O que é Git e GitHub?](#1-o-que-é-git-e-github)
2. [Instalação e Configuração](#2-instalação-e-configuração)
3. [Conceitos Básicos](#3-conceitos-básicos)
4. [Comandos Essenciais](#4-comandos-essenciais)
5. [Trabalhando com Branches](#5-trabalhando-com-branches)
6. [Fluxo de Trabalho em Equipe](#6-fluxo-de-trabalho-em-equipe)
7. [Resolvendo Problemas Comuns](#7-resolvendo-problemas-comuns)
8. [Dicas Importantes](#8-dicas-importantes)

---

## 1. O que é Git e GitHub?

### 🤔 Git
**Git** é um programa que controla versões dos seus arquivos. É como um "Ctrl+Z" super poderoso que:
- Guarda o histórico de todas as mudanças
- Permite voltar para versões antigas
- Ajuda várias pessoas a trabalharem juntas sem bagunçar

### 🌐 GitHub
**GitHub** é um site onde você armazena seus projetos Git na internet. É como um "Google Drive para código".

**Resumindo:**
- **Git** = programa no seu computador
- **GitHub** = site na internet onde você guarda o projeto

---

## 2. Instalação e Configuração

### 📥 Passo 1: Instalar o Git

**Windows:**
1. Acesse: https://git-scm.com/download/win
2. Baixe e instale (pode deixar tudo padrão)
3. Pronto!

**Mac:**
1. Abra o Terminal
2. Digite: `git --version`
3. Se pedir para instalar, aceite

**Linux:**
```bash
sudo apt-get install git
```

---

### ⚙️ Passo 2: Configurar seu Nome

Abra o **terminal** (ou Git Bash no Windows) e digite:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

**Exemplo:**
```bash
git config --global user.name "João Silva"
git config --global user.email "joao.silva@email.com"
```

✅ Pronto! Você está configurado.

---

### 🔑 Passo 3: Criar Conta no GitHub

1. Acesse: https://github.com
2. Clique em **Sign up**
3. Crie sua conta (use o mesmo email que configurou)
4. Confirme o email

---

## 3. Conceitos Básicos

### 📁 Repositório (Repo)
É uma **pasta do projeto** que o Git vigia. Tudo que você faz nela é guardado no histórico.

**Exemplo:** O jogo T-300 K é um repositório.

---

### 💾 Commit
Um **commit** é um "save point" do seu projeto. É como tirar uma foto de como está o código naquele momento.

**Exemplo:**
- Commit 1: "Criei o menu principal"
- Commit 2: "Adicionei música de fundo"
- Commit 3: "Corrigi bug no movimento"

**Cada commit guarda:**
- O que mudou
- Quem mudou
- Quando mudou
- Por que mudou (mensagem)

---

### 🌿 Branch
Uma **branch** (galho) é uma "linha do tempo paralela" do projeto.

**Imagine assim:**
```
main (projeto principal)
  |
  |------- nova-fase (você trabalhando)
  |
  |------- correcao-bug (colega trabalhando)
```

Cada um trabalha na sua branch sem atrapalhar o outro!