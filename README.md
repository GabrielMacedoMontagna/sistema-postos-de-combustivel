# ⛽ PostoRadar Brasil

> Sistema inteligente, moderno e 100% estático para consulta de postos de combustíveis por estado (UF), fiscalização da ANP, busca por endereço com raio no mapa e estações de recarga elétrica (eletropostos).

Desenvolvido para alta performance no navegador e hospedagem gratuita no **GitHub Pages**, o **PostoRadar Brasil** implementa todas as diretrizes do documento de especificações (`descricao.txt`), permitindo consultar mais de **21.000 postos cadastrados na ANP** em todos os **27 estados brasileiros**.

---

## 🚀 Funcionalidades Principais

### 1. 🗺️ Consulta e Navegação Catalogada por Estado (UF)
- **27 Unidades Federativas:** Dados particionados em arquivos estáticos otimizados (`static/data/postos/[UF].json`).
- **Carregamento Sob Demanda:** O usuário seleciona o estado desejado (ex.: SP, RJ, MG, RS, etc.) no topo da página; o sistema baixa apenas os dados do estado escolhido com cache em memória instantâneo.
- **Seletor de Cidades do Estado:** Ao escolher um estado, a lista de cidades é dinamicamente preenchida com todos os municípios disponíveis naquele estado.
- **Transição de Câmera:** O mapa Leaflet centraliza e ajusta o zoom automaticamente na capital ou região geográfica do estado selecionado.

### 2. 📍 Busca por Endereço, Rua, Bairro ou CEP com Raio no Mapa
- **Geocodificação Gratuita e Sem Chave:** Suporte a conversão de endereços em coordenadas geográficas via **OpenStreetMap (Nominatim)** e **BrasilAPI** (para CEPs).
- **Círculo Visual no Mapa:** Ao buscar um endereço ou CEP (ou ao ativar o GPS), o mapa desenha um círculo translúcido com o raio selecionado.
- **Seletor de Raio Interativo:** Filtre os postos em um raio de **5 km**, **10 km**, **20 km** ou visualize todos os postos do estado ("Sem raio").
- **Detecção Automática de Estado:** Se o endereço digitado pertencer a outro estado, o sistema detecta e migra automaticamente para o estado correto.

### 3. 🏷️ Identificação de Bandeira e Postos Independentes
- **Distribuidoras Vinculadas:** Identificação visual e cores por marca: **Vibra (Petrobras)**, **Ipiranga**, **Shell / Raízen**, **ALE**, **Rodoil**, **Dislub**, etc.
- **Bandeira Branca (Independente):** Diferenciação clara para postos sem exclusividade de bandeira, explicando a norma da ANP que exige a exibição da distribuidora fornecedora em cada bico de abastecimento.

### 4. 🛡️ Integração com Fiscalizações da ANP
- **Dados Oficiais:** Base com código SIMP, número de autorização de revenda e razão social oficial da ANP.
- **Status de Conformidade:** Badges explicativos de conformidade:
  - `REGULAR` (Em conformidade com as normas da ANP e INMETRO)
  - `NOTIFICADO` (Autuado com processo administrativo ou adequação pendente)
  - `INTERDITADO` (Bomba ou posto temporariamente lacrado)
  - `PENDENTE / NÃO INFORMADO`
- **Direitos do Consumidor e Testes Obrigatórios:**
  - **Teste da Proveta:** Teor legal de 27% de etanol anidro na gasolina (tolerância de ±1%).
  - **Teste da Bomba de 20 Litros:** Medida-padrão aferida pelo INMETRO (tolerância máxima de ±100 ml).
  - **Termodensímetro do Etanol:** Verificação instantânea da densidade na própria bomba (0,8075 a 0,8110 g/cm³).
  - **Canal de Denúncias:** Discagem para a central gratuita da ANP (**0800 970 0267**).

### 5. ⚡ Eletropostos & Mobilidade Elétrica
- **Filtro Rápido:** Localize rapidamente postos com infraestrutura de recarga para carros 100% elétricos (BEV) e híbridos plug-in (PHEV).
- **Especificações Técnicas:**
  - Quantidade de vagas e conectores (**CCS 2**, **Type 2**, **CHAdeMO**).
  - Potência em kW (recarga normal AC ou rápida/ultrarrápida DC).
  - Tarifa por kWh praticada ou gratuidade.
  - Rede parceira (Shell Recharge, Raízen Power, EDP, etc.).

### 6. 💰 Preços de Combustíveis e Paridade 70% Etanol x Gasolina
- Exibição de Gasolina Comum, Gasolina Aditivada, Etanol Hidratado, Diesel S10 e GNV.
- **Cálculo da Regra dos 70%:** O sistema analisa a paridade `(Etanol / Gasolina)` e aponta qual combustível é economicamente vantajoso.
- **Calculadora Interativa Integrada:** Permite personalizar o consumo do veículo, capacidade do tanque e quilometragem mensal para calcular a economia em R$.

### 7. 🏪 Lojas de Conveniência e Serviços
- Redes mapeadas: **AM/PM**, **Select**, **BR Mania**, etc.
- Comodidades: calibrador de pneus gratuito, troca de óleo, lavagem e funcionamento 24 horas.

---

## 🛠️ Tecnologias Utilizadas

- **Framework Web:** [SvelteKit 3](https://svelte.dev/) com `@sveltejs/adapter-static` (100% estático, pré-renderizado).
- **Linguagem & Reatividade:** [Svelte 5](https://svelte.dev/) com **Runes** (`$state`, `$derived`, `$effect`, `$props`) e [TypeScript](https://www.typescriptlang.org/) em modo strict.
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`.
- **Mapas Interativos:** [Leaflet](https://leafletjs.com/) com OpenStreetMap padrão (100% gratuito, sem necessidade de chave de API paga).
- **Geocodificação:** [Nominatim / OpenStreetMap](https://nominatim.openstreetmap.org/) e [BrasilAPI](https://brasilapi.com.br/) (para CEPs).
- **Ícones:** [@lucide/svelte](https://lucide.dev/).
- **CI/CD:** [GitHub Actions](https://github.com/features/actions) com deploy automático para o **GitHub Pages**.

---

## 📂 Estrutura de Pastas

```text
sistema-postos-de-combustivel/
├── .github/workflows/
│   └── deploy.yml               # Workflow de build e deploy automático no GitHub Pages
├── scripts/
│   └── gerar_postos_estados.py  # Script de ingestão da base oficial ANP e partição por UF
├── static/
│   ├── .nojekyll                # Garante que o GitHub Pages não ignore a pasta _app
│   ├── favicon.svg              # Ícone da aplicação
│   └── data/
│       ├── estados.json         # Índice dos 27 estados (coordenadas, zoom, capitais)
│       └── postos/
│           ├── SP.json          # Postos oficiais de São Paulo
│           ├── RJ.json          # Postos oficiais do Rio de Janeiro
│           ├── MG.json          # Postos oficiais de Minas Gerais
│           └── ... (27 UFs)     # Todos os 27 estados brasileiros
├── src/
│   ├── lib/
│   │   ├── types.ts             # Tipos TypeScript (Posto, Bandeira, Filtros, etc.)
│   │   ├── services/
│   │   │   └── postosClient.ts  # Carregador de estados, geocodificação e filtro em memória
│   │   ├── components/
│   │   │   ├── Navbar.svelte    # Navegação: Seletor de Estado, Cidade, Busca de Endereço e Raio
│   │   │   ├── FiltrosBar.svelte# Filtros rápidos (bandeira, tipo de combustível, EV, 24h)
│   │   │   ├── PostoCard.svelte # Card de exibição do posto com badges e preços
│   │   │   ├── MapaPostos.svelte# Mapa Leaflet com pins e círculo de raio de busca
│   │   │   ├── PostoDetalhesModal.svelte # Modal detalhado com ficha ANP
│   │   │   ├── CalculadoraModal.svelte   # Calculadora de paridade 70% Etanol/Gasolina
│   │   │   └── GuiaANPModal.svelte       # Guia educativo de fiscalização ANP
│   │   └── utils/
│   │       ├── anp.ts           # Formatadores de status ANP
│   │       ├── formatters.ts    # Máscaras de CNPJ, moedas (R$) e paridade
│   │       └── geo.ts           # Cálculo Haversine de distância em km
│   └── routes/
│       ├── +layout.ts           # Configuração de prerender = true e ssr = false
│       ├── +layout.svelte       # Shell da aplicação
│       ├── layout.css           # Tailwind v4 e estilos do mapa
│       └── +page.svelte         # Página principal com os estados reativos
├── package.json
├── tsconfig.json
└── vite.config.ts               # SvelteKit + Static Adapter + Base Path dinâmico
```

---

## 💻 Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 18.x ou superior)
- **npm** (versão 9 ou superior)

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar servidor de desenvolvimento
```bash
npm run dev
```
Abra no navegador em: `http://localhost:5173`

### 3. Checagem de tipagem (TypeScript / Svelte)
```bash
npm run check
```

### 4. Gerar build estático e visualizar prévia
```bash
npm run build
npm run preview
```

---

## 🚀 Como Fazer o Deploy no GitHub Pages

Este repositório já está 100% configurado para deploy contínuo via GitHub Actions!

### Passo a passo para ativar:
1. Crie um repositório no seu GitHub e suba o projeto (`git push origin main`).
2. No seu repositório no GitHub, acesse a aba **Settings** (Configurações).
3. No menu lateral esquerdo, clique em **Pages** (sob a seção "Code and automation").
4. Em **Build and deployment > Source**, selecione a opção **GitHub Actions**.
5. Faça qualquer `git push` na branch `main` (ou acesse a aba **Actions** e execute o workflow manualmente).
6. O GitHub Actions executará o build estático e publicará o site automaticamente no endereço:
   `https://<seu-usuario>.github.io/<nome-do-repositorio>/`

---

## 📌 Licença
Projeto com dados públicos da Agência Nacional do Petróleo, Gás Natural e Biocombustíveis (ANP) e Instituto Brasileiro de Geografia e Estatística (IBGE).
