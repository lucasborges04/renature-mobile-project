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

### Entendendo as Variáveis de Ambiente

Para que o projeto funcione perfeitamente, o backend depende de serviços externos. Abaixo está a explicação de cada variável do seu arquivo `.env`:

**1. PORT**: A porta local onde o servidor Node.js vai rodar.
**Como obter:** Não precisa de cadastro. Você pode simplesmente definir como `3000` que é o padrão (ou outra porta de sua preferência que esteja livre no seu computador).

**2. MONGO_URI**: A string de conexão com o banco de dados MongoDB na nuvem, onde ficam salvos os usuários, reciclagens e conquistas.  
**Como obter:**

1. Crie uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Crie um Cluster gratuito (M0 Free).
3. No menu lateral, vá em **Database Access** e crie um usuário com senha.
4. Vá em **Network Access** e adicione o IP `0.0.0.0/0` para permitir acesso global.
5. Vá em **Database**, clique em **Connect** > **Drivers** e copie a string fornecida.
6. **Atenção:** Lembre-se de substituir o trecho `<password>` na string copiada pela senha real que você criou no passo 3 (removendo os símbolos `< >`).

**3. JWT_SECRET**: Uma chave secreta usada pelo servidor para criptografar e validar as sessões (tokens) de login dos usuários.  
**Como obter:**
Essa chave é você quem inventa! Pode ser qualquer texto longo e seguro. Para ambientes de desenvolvimento, você pode usar algo como `renature_secret_key_2026`. ou `renature!` e depois da `!` gerar um Hash aleatório forte.

**4. EMAIL_USER / EMAIL_PASS**: Credenciais do e-mail oficial do projeto, usado para disparar mensagens automáticas (como recuperação de senha).  
**Como obter:**

1. Recomenda-se criar uma conta Gmail exclusiva para o projeto. O `EMAIL_USER` será este endereço (ex: `seuprojeto@gmail.com`).
2. O `EMAIL_PASS` **NÃO** é a senha normal do seu e-mail. Por segurança, o Google exige uma "Senha de Aplicativo".
3. Acesse a gestão da sua Conta Google > **Segurança**.
4. Ative a **Verificação em 2 etapas**.
5. Após ativar, procure pela opção **Senhas de aplicativo** (App Passwords).
6. Gere uma nova senha informando um nome (ex: "Backend Renature").
7. O Google vai gerar uma senha de 16 letras. Copie essa senha (sem os espaços) e coloque na variável `EMAIL_PASS`.

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

**1. Descubra o seu IP Local (IPv4)**

- **No Windows:** Abra o Prompt de Comando (CMD) e digite `ipconfig`. Procure a linha "Endereço IPv4" (ex: `192.168.0.10`).
- **No Mac/Linux:** Abra o terminal e digite `ifconfig` ou `ip a`.

**2. Configure a conexão no projeto**

- Navegue até a pasta do frontend: `cd renature-mobile-project-main`
- Abra o arquivo de serviços da API (`src/services/api.ts`).
- Altere a variável `baseURL` colocando o seu IP no lugar do IP existente, mantendo a porta `3000`.
  - Exemplo: `baseURL: 'http://SEU_IP_AQUI:3000/api'`

**Atenção:** Para que o aplicativo no celular consiga conversar com o backend no seu computador, ambos precisam estar conectados na mesma rede Wi-Fi.

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
