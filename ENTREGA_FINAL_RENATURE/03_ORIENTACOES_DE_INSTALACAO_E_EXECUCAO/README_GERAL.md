# Orientacoes de instalacao e execucao

O Renature possui dois componentes:

- `renature-mobile-project-main`: aplicativo Expo/React Native.
- `renature-backend`: API Node.js/Express.

## Pre-requisitos

- Node.js 22 LTS ou versao compativel.
- npm 10 ou superior.
- Git.
- Expo Go para execucao em desenvolvimento.
- Conta MongoDB Atlas para executar um backend proprio.
- Conta Brevo para recuperacao de senha.

## Instalacao

```bash
git clone https://github.com/lucasborges04/renature-mobile-project.git
cd renature-mobile-project
cd renature-backend
npm install
cd ../renature-mobile-project-main
npm install
```

## Execucao do aplicativo com a API publicada

Crie `renature-mobile-project-main/.env`:

```env
EXPO_PUBLIC_API_URL=https://renature-api.onrender.com/api
```

Execute:

```bash
cd renature-mobile-project-main
npx expo start --clear
```

Leia o QR Code com o Expo Go.

## Execucao de um backend proprio

Crie `renature-backend/.env` com base em `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_SECRET=segredo-forte
EMAIL_USER=remetente-verificado
BREVO_API_KEY=xkeysib-...
```

Execute:

```bash
cd renature-backend
npm run dev
```

No `.env` do mobile, informe uma URL HTTPS publica ou o endereco acessivel pelo
dispositivo. Para avaliacao externa, utilize a API hospedada no Render.

## Geracao release

O projeto nao usa Flutter. APK e AAB sao gerados com EAS Build:

```bash
npm install --global eas-cli
eas login
cd renature-mobile-project-main
eas build --platform android --profile preview
eas build --platform android --profile production
```

O perfil `preview` gera APK instalavel. O perfil `production` gera AAB assinado.
