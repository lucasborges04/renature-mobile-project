# APK e AAB release

Arquivos obrigatorios:

- `renature-v1.0.0-release.apk`
- `renature-v1.0.0-release.aab`

## APK

```bash
eas build --platform android --profile preview
```

## AAB

```bash
eas build --platform android --profile production
```

O EAS Build gerencia a assinatura Android. Preserve o acesso a conta Expo e as
credenciais do projeto para atualizacoes futuras.
