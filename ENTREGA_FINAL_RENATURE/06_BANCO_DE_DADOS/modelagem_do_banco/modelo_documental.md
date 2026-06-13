# Modelagem do banco MongoDB

## User

- `_id`: ObjectId
- `name`: String, obrigatorio
- `email`: String, obrigatorio, unico, normalizado em minusculas
- `password`: String, hash bcrypt, minimo de oito caracteres
- `avatar`: String
- `points`: Number, padrao 0
- `level`: Number, padrao 1
- `xp`: Number, padrao 0
- `unlockedAchievements`: lista de referencias para Achievement
- `resetPasswordToken`: String temporaria
- `resetPasswordExpire`: Date temporaria
- `createdAt` e `updatedAt`: Date

## Achievement

- `_id`: ObjectId
- `title`: String, obrigatorio e unico
- `description`: String, obrigatorio
- `code`: String, obrigatorio e unico
- `iconName`: String
- `createdAt` e `updatedAt`: Date

## Action

- `_id`: ObjectId
- `user`: referencia obrigatoria para User
- `itemType`: String enumerada
- `pointsEarned`: Number
- `description`: String
- `createdAt` e `updatedAt`: Date

## Relacionamentos

- Um usuario pode possuir varias acoes.
- Uma acao pertence a um usuario.
- Um usuario pode desbloquear varias conquistas.
- Uma conquista pode ser desbloqueada por varios usuarios.
