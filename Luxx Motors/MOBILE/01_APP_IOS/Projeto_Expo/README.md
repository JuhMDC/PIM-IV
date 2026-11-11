# LUXX MOTORS iOS (React Native / Expo)

Consulte o documento **`../LEIA_PRIMEIRO.md`** para instalação completa, migração do backend, rotas e limites de segurança.

### Início rápido

```bash
npm install
npx expo install --fix
cp .env.example .env
# edite EXPO_PUBLIC_API_URL no arquivo .env
npx expo start
```

O catálogo demonstrativo usa a planilha Carros.xlsx (sem preços fictícios). Quando o endpoint `/api/mobile/veiculos` responde, o catálogo é automaticamente substituído pelos dados atuais do banco.
