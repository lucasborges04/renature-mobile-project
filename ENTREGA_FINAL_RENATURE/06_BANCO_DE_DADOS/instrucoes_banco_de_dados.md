# Instrucoes do banco de dados

O Renature utiliza MongoDB Atlas.

## Criacao

1. Crie um projeto no MongoDB Atlas.
2. Crie um cluster gratuito.
3. Crie um usuario de banco com senha forte.
4. Configure a lista de acesso de rede.
5. Obtenha a connection string.
6. Configure `MONGO_URI` no Render.

## Estrutura

Os schemas Mongoose ficam em `renature-backend/src/models`. As colecoes sao
criadas quando os primeiros documentos sao persistidos.

## Carga inicial

Execute:

```bash
cd renature-backend
npm run seed
```

## Backup

Com MongoDB Database Tools instalado:

```bash
mongodump --uri="MONGODB_URI" --out=backup-renature
```

Para restaurar:

```bash
mongorestore --uri="MONGODB_URI_DESTINO" backup-renature
```

Antes de entregar um backup, remova ou anonimize:

- e-mails e nomes reais;
- hashes de senha;
- tokens de recuperacao;
- demais dados pessoais.

Nunca registre a connection string em arquivos versionados.
