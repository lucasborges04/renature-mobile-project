# README — Fluxo de trabalho do projeto Renature

Este documento reúne o passo a passo básico para colaborar no projeto de extensão **Renature** usando Git e GitHub de forma organizada.

## Objetivo

Manter um fluxo de trabalho simples, padronizado e seguro para que todos consigam contribuir com o projeto sem sobrescrever alterações de outras pessoas.

## Regras principais

### 1. Sempre criar uma nova branch a partir da branch principal

Para desenvolver uma nova funcionalidade, correção ou melhoria, **não trabalhe diretamente na branch principal**.

A branch deve ser criada a partir da branch `main` (ou `master`, dependendo do nome usado no repositório).

Exemplo:

```bash
git checkout main
git pull origin main
git checkout -b nome-da-sua-branch
```

Sugestões de nomes para branch:

* `feat/tela-login`
* `fix/correcao-navbar`
* `docs/atualizacao-readme`

### 2. Sempre atualizar a branch principal antes de começar

Antes de iniciar qualquer tarefa, atualize a branch principal local com as alterações mais recentes do repositório remoto.

Exemplo:

```bash
git checkout main
git pull origin main
```

Isso ajuda a evitar conflitos e garante que sua nova branch será criada a partir da versão mais atual do projeto.

### 3. Padrão de mensagem de commit

As mensagens de commit devem seguir um padrão simples e objetivo.

Exemplos:

```bash
git commit -m "feat: adiciona tela inicial"
git commit -m "fix: corrige erro no formulário"
```

Padrões mais usados:

* `feat:` para nova funcionalidade
* `fix:` para correção de bug ou erro
* `docs:` para alterações em documentação
* `style:` para ajustes de formatação/estilo sem mudar lógica
* `refactor:` para reorganização de código sem alterar funcionalidade
* `test:` para criação ou alteração de testes
* `chore:` para tarefas de manutenção

## Fluxo recomendado para contribuir

### 1. Clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd nome-do-projeto
```

### 2. Entrar na branch principal e atualizar

```bash
git checkout main
git pull origin main
```

### 3. Criar uma nova branch para sua tarefa

```bash
git checkout -b feat/minha-alteracao
```

### 4. Fazer as alterações no projeto

Após editar os arquivos, verifique o que foi alterado:

```bash
git status
```

### 5. Adicionar os arquivos modificados

```bash
git add .
```

Ou, se preferir, adicionar arquivos específicos:

```bash
git add nome-do-arquivo
```

### 6. Criar um commit com mensagem padronizada

```bash
git commit -m "feat: descreve a alteração realizada"
```

### 7. Enviar a branch para o repositório remoto

```bash
git push origin nome-da-sua-branch
```

### 8. Abrir um Pull Request

Depois do push, abra um **Pull Request (PR)** para que a alteração seja revisada antes de entrar na branch principal.

## Boas práticas importantes

* **Nunca commitar diretamente na `main`**.
* **Sempre dar `pull` na branch principal antes de criar uma nova branch**.
* **Fazer commits pequenos e descritivos**.
* **Nomear a branch de forma clara** para facilitar a identificação.
* **Revisar as alterações antes de enviar**.
* **Abrir Pull Request para revisão**, em vez de fazer merge direto.

## Exemplo completo

```bash
git clone URL_DO_REPOSITORIO
cd nome-do-projeto

git checkout main
git pull origin main

git checkout -b feat/cadastro-usuario

# faz as alterações no código

git add .
git commit -m "feat: adiciona funcionalidade de cadastro de usuário"
git push origin feat/cadastro-usuario
```

## Observação

Caso o repositório use `master` em vez de `main`, basta substituir o nome da branch nos comandos.

---

Documento criado para orientar os integrantes do projeto **Renature** no fluxo de contribuição com Git e GitHub.
