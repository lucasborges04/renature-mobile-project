# Codigo-fonte

A pasta `projeto` deve conter uma copia limpa do repositorio, sem `node_modules`,
arquivos `.env`, caches, logs ou credenciais.

## Estrutura

- `renature-mobile-project-main`: aplicativo Expo/React Native.
- `renature-backend`: API Node.js/Express.
- `render.yaml`: configuracao de hospedagem da API.
- `DEPLOY.md`: orientacoes de infraestrutura.

## Pontos de entrada

- Mobile: `renature-mobile-project-main/index.ts` e `App.tsx`.
- Backend: `renature-backend/server.js`.

## Instalacao

Execute `npm install` separadamente nas pastas mobile e backend.

## Seguranca

Os arquivos `.env` nao devem ser incluidos. Utilize os arquivos `.env.example`
como referencia.
