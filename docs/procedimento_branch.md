## Atualização de Branch: Orientação para todos

Você deve orientar os alunos de cada grupo/fase a seguir estes passos. Vamos usar a `fase_4` como exemplo:

**Passo 1: Sincronizar a branch local com as últimas atualizações da `main`**

O aluno responsável pela `fase_4` precisa abrir o terminal/Git Bash e executar os seguintes comandos:

```bash
# 1. Mudar para a branch da fase dele
git checkout fase_4

# 2. Trazer as últimas atualizações da branch 'main' do repositório remoto
git pull origin main
```

**O que acontece aqui?** O comando `git pull origin main` vai tentar mesclar as 42 alterações que estão na `main` dentro da branch `fase_4`. É **muito provável que ocorram conflitos de merge** aqui, pois os mesmos arquivos podem ter sido alterados em ambos os lugares.

*   **Se houver conflitos:** O aluno precisará resolvê-los localmente no seu editor de código (como o VS Code, que tem uma ótima ferramenta para isso). Ele precisará abrir os arquivos marcados, escolher quais linhas de código manter, e depois finalizar o merge com `git add .` e `git commit`. Esta é uma habilidade crucial.

**Passo 2: Enviar a branch atualizada de volta para o GitHub**

Depois de resolver os conflitos e garantir que a branch `fase_4` agora contém tanto as suas próprias alterações quanto as atualizações da `main`, o aluno deve enviá-la de volta ao GitHub.

```bash
# Envia a branch 'fase_4' agora atualizada
git push origin fase_4
```

**Passo 3: Criar o Pull Request**

Agora que a branch no GitHub está atualizada, o aluno pode ir até a página do repositório. O GitHub geralmente mostra um aviso amarelo com um botão **"Compare & pull request"** para a branch recém-atualizada.

O aluno deve clicar nesse botão, dar um título e uma descrição para o Pull Request e criá-lo.

**Passo 4: Sua Ação como Professor (Revisão)**

*   Você será notificado sobre o novo Pull Request.
*   Você poderá ver todas as alterações na aba "Files changed".
*   Você pode deixar comentários, solicitar mudanças ou, se estiver tudo certo, clicar no botão verde **"Merge pull request"**.

Ao fazer o merge, o trabalho da `fase_4` será oficialmente incorporado à `main` de forma segura e revisada.

### Qual a ordem para fazer o merge das fases?

Como várias branches estão desatualizadas, a ordem importa. Recomendo começar pelas mais antigas ou mais fundamentais.

1.  Escolha uma branch para ser a primeira (ex: `fase_1`).
2.  Peça para o aluno da `fase_1` seguir os passos acima (atualizar com a `main` e criar o PR).
3.  Revise e faça o merge do PR da `fase_1`.
4.  **Agora a `main` foi atualizada!**
5.  Peça para o aluno da próxima branch (ex: `fase_3`) fazer o mesmo processo. Ele agora vai puxar uma `main` que já contém o trabalho da `fase_1`, diminuindo a chance de conflitos futuros.
