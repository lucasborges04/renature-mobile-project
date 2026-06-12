# Renature App

Este documento contém o passo a passo exato para rodar o projeto Renature na sua máquina local e testar diretamente no seu celular físico.

O projeto é dividido em duas partes principais:

1. **Backend:** Servidor em Node.js (API e Banco de Dados)
2. **Frontend:** Aplicativo Mobile em React Native (Expo)

## ⚙️ Passo 1: Configurando o Backend (Servidor)

Abra o terminal, navegue até a pasta onde deseja salvar o projeto e faça o clone:

```bash
git clone https://github.com/lucasborges04/renature-mobile-project.git
cd renature-mobile-project/renature-backend
```

Instale todas as dependências do servidor:

```bash
npm install
```

## Passo 2: Configurando o arquivo .env (MUITO IMPORTANTE)

Dentro da pasta do backend (renature-backend), crie um arquivo novo chamado `.env`. No projeto tem o arquivo `.env.example` caso queira seguir por lá.
Copie o texto abaixo e cole dentro do `.env` que você criou.

```
PORT=3000
MONGO_URI=coloque_a_nossa_string_de_conexao_aqui
JWT_SECRET=coloque_um_segredo_aqui_como_terra_app_secret_123
EMAIL_USER=lucasbborges2004@gmail.com
EMAIL_PASS=coloque_a_senha_de_aplicativo_do_gmail_aqui
```

Peça pelo WhatsApp as chaves reais para substituir no arquivo antes de rodar o servidor.

### Ligando o Servidor (Backend)

Com as dependências instaladas, inicie o servidor com o seguinte comando:

```bash
npm run dev
```

Se no terminal aparecer a seguinte mensagem, é porque deu tudo certo e o seu servidor está ligado.

"Tentando conectar ao MongoDB Atlas...  
Conectado ao MongoDB Atlas com sucesso!  
Servidor rodando perfeitamente na porta 3000  
Teste a API acessando: http://localhost:3000/api/status"

Deixe esse terminal aberto e rodando.

## Passo 3: Configurando o Frontend

Abra um novo terminal (recomendado abrir o terminal dividido) e entre na pasta do frontend.

```bash
cd renature-mobile-project-main
```

Instale as dependências do aplicativo.

```bash
npm install
```

## Passo 4: Conectando o App ao Servidor Local

Para que o aplicativo no celular consiga conversar com o backend no seu computador, ambos precisam estar conectados na mesma rede Wi-Fi.

## Passo 5: Rodando o aplicativo

Com o IP configurado e o backend já rodando no outro terminal, inicie o Expo no terminal do frontend:

```bash
npm run start
```

Um grande QR Code aparecerá no seu terminal.

## Passo 6: Testando no Celular Físico

1. Baixe o aplicativo Expo Go no seu celular (disponível na Google Play e App Store).
2. Garanta que o celular está exatamente na mesma rede Wi-Fi do computador.
3. Abra o Expo Go, clique em "Scan QR Code" e aponte a câmera para o QR Code no terminal.
4. Aguarde o "Building JavaScript bundle" chegar a 100%.

Pronto! O Renature App está rodando no seu celular, conectado ao banco de dados e pronto para uso.
