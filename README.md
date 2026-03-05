# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Configuração

Siga os passos abaixo para preparar o ambiente de production-ready com EmailJS, Google Sheets e reCAPTCHA. Hospedagens estáticas gratuitas (Vercel, Netlify) funcionam 100% com essa abordagem.

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (como exemplo o `.env.example` fornecido):

```bash
cp .env.example .env
```

Preencha as variáveis usando as orientações dos próximos passos.

### 2. Configurar EmailJS

1. Crie uma conta no [EmailJS](https://www.emailjs.com/) (plano gratuito).
2. Adicione um **Email Service** (ex: Gmail) e anote o **Service ID** (`VITE_EMAILJS_SERVICE_ID`).
3. Vá em **Email Templates** e crie dois templates:
   - **Template Admin** (Aviso de novo pedido). Anote o **Template ID** (`VITE_EMAILJS_TEMPLATE_ID_ADMIN`).
   - **Template Client** (Confirmação para o cliente). Anote o **Template ID** (`VITE_EMAILJS_TEMPLATE_ID_CLIENT`).
4. Dentro dos templates criados, inclua as variáveis que a loja envia, colocando-as entre _chaves_ ou duplas-chaves do EmailJS:
   - `{{nome}}`: Nome do cliente
   - `{{email}}`: E-mail do cliente
   - `{{itens}}`: Lista em texto formatada com Qtd, Nome e Tamanho dos itens
   - `{{total}}`: Total formatado em Reais (R$).
5. Em **Account > API Keys**, pegue sua **Public Key** (`VITE_EMAILJS_PUBLIC_KEY`). Adicione também o e-mail administrador que receberá as vendas no form field correspondente do seu Template Admin ou fixo/previsível no `.env` se for rotear globalmente (por padrão, os templates já decidem os _To Emails_ usando as opções gráficas do EmailJS ou o form parameter `to_email` correspondente).

### 3. Configurar Planilha no Google Sheets

1. Crie uma nova planilha.
2. Na primeira linha (cabeçalho), crie as colunas:
   - `Data`, `Hora`, `Nome Cliente`, `Email Cliente`, `Produto`, `Tamanho`, `Quantidade`, `Preço Unitário`, `Subtotal`, `Total do Pedido`.
3. Pegue o ID da planilha (o código gigante que fica na URL entre `/d/` e `/edit`).

### 4. Configurar Web App do Apps Script

1. Abra Extensões > **Apps Script** na própria planilha ou acesse o painel de Scripts.
2. Substitua o código pelo conteúdo do nosso arquivo `apps-script.js`.
3. Dentro dele, insira a ID que você copiou: `const SHEET_ID = 'SEU_ID_AQUI'`.
4. Clique em **Implantar** (Deploy) > **Nova implantação**.
5. Selecione o tipo **App da Web** (Web App).
6. Configurações:
   - Executar como: _Você (seu email)_
   - Quem tem acesso: _Qualquer pessoa_ (Isso dá permissão CORS para envios anônimos POST).
7. Clique em Implantar (Você precisará "autorizar acesso" ao ser avisado sobre Google Safety restrictions).
8. Copie a **URL do App da Web** que vai gerar.
9. Coloque no seu `.env` na constante `VITE_APPS_SCRIPT_URL`.

### 5. Configurar Google reCAPTCHA v2

1. Vá ao painel do [reCAPTCHA](https://www.google.com/recaptcha/about/).
2. Crie para um novo site marcando o tipo **reCAPTCHA v2 -> Caixa de seleção "Não sou um robô"**.
3. Em domínios, ponha `localhost` e os domínios final do Vercel/Netlify.
4. Pegue a **Chave de Site** (Site Key).
5. Defina no `.env` como `VITE_RECAPTCHA_SITE_KEY`.

### 6. Deployment Final

Pronto! Faça o seu commit e envie para Vercel, Netlify ou GitHub Pages. Apenas não se esqueça de ir nas _Environment Variables_ no painel (Vercel/Netlify) e adicionar todas as `VITE_*` chaves que você colocou no arquivo `.env` para que rodem na versão online!
