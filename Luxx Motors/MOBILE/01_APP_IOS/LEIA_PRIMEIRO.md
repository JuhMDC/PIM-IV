# LUXX MOTORS — aplicativo iOS integrado ao sistema web

**Entrega:** 16 de outubro de 2026  
**Tecnologias:** React Native + Expo SDK 57 + TypeScript; API já existente em ASP.NET Core 8 + SQL Server + Entity Framework Core.

## O que foi desenvolvido

O diretório **`mobile/`** contém o projeto do aplicativo para iPhone com:

- Início personalizado com identidade LUXX MOTORS e destaques;
- Catálogo de veículos vindo do **mesmo SQL Server do site** por uma API REST;
- Busca por marca, modelo, cor e ano; filtros por marca;
- Detalhes de veículos, imagens, informações e preços da API;
- Favoritos persistidos localmente;
- Formulário de test-drive com data e horário (registro na tabela `TESTDRIVE`);
- Simulação de financiamento pelo sistema Price e registro de proposta na tabela `FINANCIAMENTO`;
- Cadastro/reutilização de cliente na tabela `CLIENTE` para vincular solicitações;
- Estados de carregamento, erros de rede e demonstração offline claramente identificada.

A planilha **Carros.xlsx** contém marca/modelo/cor, mas não preço, ano ou quilometragem. Por isso o modo demonstração apresenta **25 referências reais da planilha, sem inventar preços ou anos**. As 26 fotografias do projeto acompanham a entrega. Com a API configurada, os valores são obtidos do banco.

O diretório **`backend_patch/`** contém **somente os arquivos novos/alterados**, para mesclar com o projeto ASP.NET atual. Não inclui dados de clientes, banco de dados em execução ou credenciais.

## Estrutura

```
LUXX_MOTORS_Entrega/
├── mobile/
│   ├── app/                    # Rotas e telas Expo Router
│   ├── src/components/         # Cartões, campos, componentes reutilizáveis
│   ├── src/context/            # Estado catálogo/favoritos
│   ├── src/data/               # Mapeamento das fotos e catálogo demonstrativo
│   ├── src/lib/                # API HTTP, validações, cálculo de parcelas
│   ├── assets/                 # Logo e fotos fornecidos
│   ├── tests/                  # Testes unitários de lógica
│   ├── package.json
│   └── .env.example
└── backend_patch/
    └── LuxxMotorsAPI/
        ├── Models/Program.cs                   # Substituição do original (com backup)
        ├── Controllers/MobileController.cs     # Novo controller público limitado
        └── wwwroot/veiculos/                   # Fotos públicas, somente veículos
```

## 1. Aplicar a integração no backend ASP.NET Core

**Faça backup do projeto atual.** Use como base os arquivos do `PIM-ATUALIZADO.zip` que você enviou (a versão com JWT e `AuthController`). A cópia mais antiga da concessionária tem diferenças e não corresponde ao patch.

Na pasta extraída do seu projeto, copie o conteúdo de `backend_patch/LuxxMotorsAPI/` para a pasta `LuxxMotorsAPI/`, mantendo os caminhos. No `Program.cs` do original, ele fica em **`LuxxMotorsAPI/Models/Program.cs`** (posição incomum, mas é onde veio no arquivo enviado). Esse arquivo foi modificado para adicionar:

- Limite de requisições aos formulários públicos (5 por minuto por endereço IP);
- Servir fotografias em `wwwroot/veiculos/` com `UseStaticFiles()`;
- Manter autenticação JWT para os demais controladores;
- Nova API específica para o aplicativo: `api/mobile`.

Configure localmente (fora do controle de versão) a **connection string** `ConnectionStrings:DefaultConnection` e as chaves `Jwt:Key`, `Jwt:Issuer` e `Jwt:Audience`, conforme a instalação atual. Não coloque senhas reais no código ou no aplicativo.

Inicie o SQL Server com as tabelas originais e rode o projeto na máquina/servidor com **.NET 8**:

```bash
dotnet restore LuxxMotorsAPI/LuxxMotorsAPI.csproj
dotnet run --project LuxxMotorsAPI/LuxxMotorsAPI.csproj
```

Teste em um navegador na máquina do servidor:

```text
http://localhost:5107/api/mobile/veiculos
http://localhost:5107/api/mobile/veiculos/filtros
```

A URL/porta depende de `launchSettings.json` ou do seu servidor. Se aparecerem veículos como JSON, a leitura está funcionando. Se ocorrer erro 500, confira primeiro a conexão com o SQL Server e as correspondências entre o modelo Entity Framework e as colunas reais.

**Importante:** os controllers administrativos antigos (`/api/clientes`, `/api/veiculos`, etc.) continuam protegidos; o celular **nunca consulta dados pessoais de clientes** por esses endpoints. `POST /api/mobile/testdrives` grava em `TESTDRIVE` e `POST /api/mobile/financiamentos` em `FINANCIAMENTO`, vinculando-se a `CLIENTE`.

### Contratos da API mobile

- `GET /api/mobile/veiculos` — catálogo sem credenciais; `id`, `marca`, `modelo`, `ano`, `preco`, `cor`, `cambio`, `status`, `categoria`, `quilometragem`, `imagemUrl`.
- `GET /api/mobile/veiculos/filtros` — marcas, modelos, cores, câmbios e IDs de modelos.
- `POST /api/mobile/testdrives` — `idVeiculo`, `dataAgendamento` (`AAAA-MM-DD`), `horario` (`HH:MM`), `nome`, `email`, `telefone`, `cpf`, `dataNascimento` (`AAAA-MM-DD`). Retorna número de protocolo.
- `POST /api/mobile/financiamentos` — `idVeiculo`, `entrada`, `parcelas`, `taxaMensal` e os mesmos dados pessoais. O valor financiado é calculado **no servidor**, com o preço atual do banco.

Os registros de novos clientes precisam de CPF válido, nome, e-mail, telefone e data de nascimento. Se um CPF já estiver cadastrado, o backend exige correspondência do nome, e-mail e data de nascimento. Se ainda não houver vendedor na tabela `VENDEDOR`, não será possível agendar test-drive: o backend retornará um erro descritivo, em vez de criar um vendedor aleatório.

## 2. Rodar o aplicativo no iPhone

Requisitos: computador com Node.js 22 ou superior, conexão com a internet para instalar os pacotes, e o iPhone com acesso de rede ao servidor.

```bash
cd mobile
npm install
npx expo install --fix
cp .env.example .env
```

Edite o arquivo `.env` definindo o endereço real da API. **O iPhone não acessa o `localhost` do computador.** Exemplo:

```dotenv
EXPO_PUBLIC_API_URL=https://api.luxxmotors.seudominio.com.br
```

**Em produção, use HTTPS válido.** Para teste local no simulador iOS no mesmo Mac, `http://localhost:5107` pode ser usado conforme a configuração do simulador; para iPhone físico, utilize um endereço de rede/HTTPS acessível. Configurações de segurança do iOS podem bloquear HTTP comum.

Depois execute:

```bash
npx expo start
```

Abra com **Expo Go compatível com o SDK 57** ou gere um build de desenvolvimento para o iPhone. No Mac com Xcode é possível iniciar o simulador usando `npx expo start --ios` com as dependências devidamente instaladas. Para instalar sem Expo Go ou distribuir via App Store, gere um build iOS pelo **EAS Build**, com a conta Apple e as assinaturas apropriadas. A identidade `ios.bundleIdentifier` do `app.json` é um valor inicial e deve ser confirmada antes de distribuir.

Os favoritos são locais, não sincronizados com contas. Os formulários enviam dados reais **apenas quando a API estiver conectada**. Enquanto não há acesso ao servidor, o app entra em demonstração e bloqueia envios para não fingir que salvou no banco.

## 3. Testes

```bash
cd mobile
npm test
npm run typecheck
```

`npm test` cobre matemática financeira, validação de CPF, validação de datas e normalização. `npm run typecheck` verifica os tipos quando as dependências estiverem instaladas.

## 4. Condições antes de colocar em produção

Este projeto é uma **base funcional de código**, não um aplicativo iOS já compilado ou uma integração homologada com o SQL Server real. São necessárias validações no ambiente de vocês:

1. **Testar os scripts e tabelas reais do SQL Server** — a documentação e os modelos do código diferem em alguns nomes e obrigatoriedades de colunas, portanto os POSTs ainda precisam de teste de integração.
2. **Revisar o site existente** — várias páginas web chamam `/api/veiculos` e `/api/clientes` sem token, enquanto a versão atual da API exige JWT. A API mobile não modifica essas páginas; a correção do fluxo web deve ser tratada antes de uso público.
3. **Reforçar identidade e antiautomação** — o endpoint público de interesse exige dados cadastrais e tem rate limiting, mas a conferência do CPF por nome/e-mail/data de nascimento **não substitui autenticação ou verificação de e-mail/SMS (OTP)**. Implementar OTP, monitoramento, proteção contra abuso e revisão de acesso antes de receber clientes reais.
4. **LGPD** — inserir política de privacidade publicada, transparência no tratamento de CPF/contatos e medidas adequadas de retenção, consentimento quando aplicável e acesso.
5. **Financiamento** — as parcelas são apenas simulações pela Tabela Price. Não existe integração bancária, consulta de crédito, CET, IOF nem aprovação automática.
6. **Hospedagem** — disponibilizar a Web API e as fotos em HTTPS, configurar SQL Server em servidor, backups, credenciais seguras, registro de logs sem dados sensíveis e serviços de disponibilidade.
7. **Testar no iOS** — instalar pacotes, executar no Expo/iPhone ou simulador, testar as telas e conferir se salvar/consultar na API efetivamente funciona.

## Limitações da validação realizada nesta entrega

Foi feita inspeção dos fontes recebidos, conferência do mapeamento das imagens, testes de lógica TypeScript e análise sintática/transpilação dos arquivos `.ts`/`.tsx`. **Não foi possível fazer `npm install`, executar um simulador iOS, compilar a Web API C# ou acessar o banco SQL Server neste ambiente.** Logo, o backend, a navegação no iPhone e o fluxo ponta a ponta requerem testes no seu ambiente.
