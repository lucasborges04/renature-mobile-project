# Deploy gratuito: Render + MongoDB Atlas

## 1. Preparar o MongoDB Atlas

1. Acesse o projeto no MongoDB Atlas.
2. Em `Database Access`, crie ou confirme um usuario exclusivo para a API.
3. Em `Network Access`, adicione temporariamente `0.0.0.0/0`.
4. Em `Database > Connect > Drivers`, copie a connection string.
5. Substitua `<password>` pela senha do usuario e defina o banco `renature`.

Exemplo:

```text
mongodb+srv://usuario:senha@cluster.mongodb.net/renature?retryWrites=true&w=majority
```

O acesso `0.0.0.0/0` permite conexoes de qualquer origem. Para um projeto de
demonstracao no Render gratuito, proteja o banco com usuario e senha fortes.

## 2. Publicar o backend no Render

1. Envie estas alteracoes para o GitHub.
2. Entre em https://dashboard.render.com.
3. Selecione `New > Blueprint`.
4. Conecte o repositorio `renature-mobile-project`.
5. O Render detectara o arquivo `render.yaml`.
6. Preencha as variaveis solicitadas:
   - `MONGO_URI`: connection string do Atlas.
   - `EMAIL_USER`: e-mail usado na recuperacao de senha.
   - `EMAIL_PASS`: senha de app desse e-mail.
7. Confirme a criacao do servico gratuito.

O `JWT_SECRET` sera gerado automaticamente pelo Render.

Depois do deploy, teste:

```text
https://NOME-DO-SERVICO.onrender.com/api/status
```

## 3. Apontar o Expo para o Render

Crie `renature-mobile-project-main/.env` a partir de `.env.example`:

```env
EXPO_PUBLIC_API_URL=https://NOME-DO-SERVICO.onrender.com/api
```

Reinicie o Expo limpando o cache:

```bash
npx expo start --clear
```

Valores `EXPO_PUBLIC_*` ficam incluidos no aplicativo e nao devem conter
senhas ou outros segredos. A URL publica da API pode ser usada dessa forma.

## 4. Teste final

1. Abra `/api/status` no navegador.
2. Abra o projeto no Expo Go.
3. Cadastre um novo usuario.
4. Efetue login.
5. Feche e abra o aplicativo para validar a sessao persistida.
6. Apague o usuario no Atlas ou invalide o token para validar o retorno ao login.

No plano gratuito, o Render pode suspender o backend por inatividade. A primeira
requisicao depois desse periodo pode demorar, por isso o app usa timeout maior.
