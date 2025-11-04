### O que são as regras de proteção de branch?

As regras de proteção de branch permitem que você imponha certas condições antes que o código possa ser integrado (merged) à branch principal. Algumas das regras mais comuns são:

*   **Exigir um Pull Request antes de fazer o merge:** Todas as alterações devem ser propostas através de um Pull Request, o que permite a discussão e revisão do código.
*   **Exigir aprovações:** Você pode definir que um ou mais membros da equipe revisem e aprovem o Pull Request antes que ele possa ser integrado.
*   **Exigir que as verificações de status passem:** É possível integrar ferramentas de automação que rodam testes no código. O Pull Request só poderá ser integrado se todos os testes passarem.
*   **Impedir pushes forçados (force pushing):** Previne que o histórico de commits da branch seja reescrito de forma destrutiva.

### Passo a passo para proteger sua branch `main`

Siga estes passos para configurar a proteção da sua branch principal e estabelecer um fluxo de trabalho com Pull Requests para todos no repositório:

1.  **Acesse as configurações do seu repositório:** Na página principal do seu repositório no GitHub, clique na aba "Settings" (Configurações).

2.  **Navegue até a seção de branches:** No menu lateral esquerdo, clique em "Branches" (Ramos).

3.  **Adicione uma nova regra de proteção:** Clique no botão "Add branch protection rule" (Adicionar regra de proteção de branch).

4.  **Defina o nome da branch:** No campo "Branch name pattern" (Padrão de nome de branch), digite `main`.

5.  **Configure as regras de proteção:**
    *   **Marque a opção "Require a pull request before merging" (Exigir um pull request antes de fazer o merge).** Isso impedirá que qualquer pessoa, inclusive você, envie código diretamente para a branch `main`. Todas as alterações deverão ser propostas via Pull Request.
    *   Opcionalmente, marque **"Require approvals" (Exigir aprovações)** e defina o número de aprovações necessárias (por exemplo, `1`). Isso significa que o Pull Request de um aluno precisará da sua aprovação (ou de outro colega) para ser integrado.
    *   Considere marcar **"Dismiss stale pull request approvals when new commits are pushed" (Dispensar aprovações de pull request obsoletas quando novos commits forem enviados).** Se um aluno receber uma aprovação e depois enviar mais alterações, a aprovação anterior será removida, garantindo que o código final seja revisado.

6.  **Salve as alterações:** Role a página para baixo e clique em "Create" (Criar) ou "Save changes" (Salvar alterações).

### Como todos contribuirão agora?

Com a branch `main` protegida, o fluxo de trabalho para os alunos será o seguinte, que é o padrão utilizado no mercado de desenvolvimento de software:

1.  **Criar uma nova branch:** Em vez de trabalhar diretamente na `main`, cada aluno criará uma nova branch para a sua tarefa ou funcionalidade (ex: `feature/nome-da-funcionalidade` ou `correcao/nome-do-bug`).
2.  **Fazer os commits:** O aluno trabalhará normalmente, fazendo seus commits nessa nova branch.
3.  **Abrir um Pull Request:** Quando o trabalho estiver concluído, o aluno abrirá um Pull Request no GitHub, propondo a integração da sua branch de trabalho na branch `main`.
4.  **Revisão do código:** Você (e outros alunos, se desejar) poderá revisar as alterações, fazer comentários e solicitar ajustes diretamente no Pull Request.
5.  **Merge do Pull Request:** Após a aprovação e a passagem de quaisquer verificações automáticas, o Pull Request poderá ser integrado à branch `main` de forma segura.
