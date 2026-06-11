# Renature App

Este documento contém o passo a passo exato para rodar o projeto Renature na sua máquina local e testar diretamente no seu celular físico.

O projeto é dividido em duas partes principais:

1. **Backend:** Servidor em Node.js (API e Banco de Dados)
2. **Frontend:** Aplicativo Mobile em React Native (Expo)

## ⚙️ Passo 1: Configurando o Backend (Servidor)

Abra o terminal, navegue até a pasta onde deseja salvar o projeto e faça o clone:

```bash
git clone https://github.com/lucasborges04/renature-mobile-project.git
cd renature-mobile-project/renatue-backend
```

Instale todas as dependências do servidor:

```bash
npm install
```

## Passo 2: Configurando o arquivo .env (MUITO IMPORTANTE)

Dentro da pasta do backend (renature-backend), crie um arquivo novo chamado `.env`.
Copie o texto abaixo e cole dentro desse arquivo.

```
PORT=3000
MONGO_URI=coloque_a_nossa_string_de_conexao_aqui
JWT_SECRET=coloque_um_segredo_aqui_como_terra_app_secret_123
EMAIL_USER=lucasbborges2004@gmail.com
EMAIL_PASS=coloque_a_senha_de_aplicativo_do_gmail_aqui
```

Peça pelo WhatsApp as chaves reais para substituir no arquivo antes de rodar o servidor.

## Passo 3: Configurando o Frontend

Abra um novo terminal (recomendado abrir o terminal dividido) e entre na pasta do frontend.

```bash
cd renature-mobile-project-main
```

Instale as dependências do aplicativo.

```bash
npm install
```
