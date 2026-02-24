# My Career Toolbox

Ferramentas de IA para otimizar seu perfil do LinkedIn e gerar currículos automaticamente em LaTeX, Markdown e PDF.

Este repositório foi construído para ser usado com agentes de IA (Cursor, Copilot, Cline, OpenCode) - basta fornecer seus dados e o agente faz o resto.

---

## O Que Este Projeto Faz

1. **Extrai dados de PDFs** - Converte seus PDFs do LinkedIn/currículo em texto puro para análise
2. **Otimiza conteúdo com Skills** - Aplica metodologias profissionais de copywriting, métricas de impacto e tone correto
3. **Gera currículos** - Cria versões otimizadas em LaTeX (PDF), Markdown e para ATS
4. **Integra com agentes de IA** - O agente sabe exatamente o que fazer com seus dados

**Importante:** Este repositório contém **skills obrigatórias** (em `.agents/skills/`) que definem como otimizar carreiras. Qualquer ação sobre currículo/perfil DEVE aplicar 100% dessas metodologias.

---

## Como Começar

### Opção 1: Com Agente de IA (Recomendado)

**Pré-requisitos:**
- Node.js 18+
- Uma API key (OpenAI, Anthropic, Google, xAI, etc)

**Passos:**

```bash
# 1. Clone e instale
git clone https://github.com/gustavo-ferreira03/my-career-toolbox.git
cd my-career-toolbox
npm install

# 2. Configure sua API key
cp .env.example .env
# Edite .env e adicione sua API key

# 3. Rode o agente
npm run agent
```

**Próximos passos no agente:**
1. Coloque seu `Profile.pdf` (exportado do LinkedIn) em `data/input/`
2. Peça ao agente: *"Otimize meu perfil do LinkedIn para vaga de [CARGO]"*
3. O agente vai automaticamente:
   - Extrair seu PDF
   - Ler os templates
   - Aplicar skills de otimização
   - Gerar arquivo em `data/output/`

---

### Opção 2: Devcontainer (Zero Configuração)

Se você tem Docker:

1. Abra o projeto no **VS Code**
2. Instale a extensão **Dev Containers**
3. Clique em "Reopen in Container"

Tudo será instalado automaticamente (Node.js, LaTeX, agente, etc).

---

### Opção 3: Manual (Sem Agente)

**Pré-requisitos:**
- Node.js 18+
- LaTeX (`pdflatex`) - ver instruções abaixo

**Instalação do LaTeX:**
- **Ubuntu/Debian:** `sudo apt-get install texlive-latex-base texlive-fonts-recommended`
- **Mac:** `brew install mactex`
- **Windows:** Instale TeX Live ou MiKTeX
- **Ou use Overleaf:** Cole o `.tex` em overleaf.com

**Gerar Currículo:**
```bash
npm run build
cp templates/latex/curriculo_template.tex data/output/latex/meu_curriculo.tex
# Edite data/output/latex/meu_curriculo.tex
npm run compile-latex
```

---

## Estrutura de Pastas

```
my-career-toolbox/
├── data/
│   ├── input/              ← Coloque seus PDFs/TXTs aqui
│   └── output/
│       ├── latex/          ← Currículos LaTeX + PDFs gerados
│       └── markdown/       ← Perfis e currículos Markdown
├── templates/              ← Moldes (NÃO EDITAR)
│   ├── LINKEDIN_TEMPLATE.md
│   ├── RESUME_TEMPLATE.md
│   └── latex/curriculo_template.tex
├── .agents/skills/         ← Metodologias de otimização
├── AGENTS.md              ← Instruções para agentes de IA
└── package.json
```

---

## Usando com Agentes de IA

### Para Agentes (Cursor, Copilot, Cline)

Leia `AGENTS.md` - ele contém todas as instruções sobre como operar este repositório.

**Regra Crítica:** Você DEVE ler e aplicar 100% das skills em `.agents/skills/` antes de otimizar qualquer currículo ou perfil. Sem isso, o resultado será mediocre.

**Em resumo:**
1. Leia as skills relevantes (tech-resume-optimizer, copywriting, etc)
2. O agente busca automaticamente em `data/input/`
3. Aplica 100% das metodologias das skills
4. Gera arquivos finais em `data/output/`

### Exemplo de Prompt

```
"Leia meu currículo em data/input/Profile.pdf, 
aplique as skills de tech-resume-optimizer e 
copywriting, e gere um currículo LaTeX otimizado 
em data/output/latex/curriculo.tex"
```

---

## Privacidade e Segurança

- ✅ Seus dados **nunca são enviados a nenhum servidor** (exceto à API de IA)
- ✅ Pasta `data/` está em `.gitignore` - impossível fazer push acidental
- ✅ Cada agente/projeto tem sua própria cópia isolada
- ⚠️ Nunca modifique `.gitignore` ou rode `git add data/`

---

## Scripts Disponíveis

```bash
npm run build              # Compila TypeScript
npm run extract-pdf        # Extrai PDFs em data/input/ para .txt
npm run compile-latex      # Compila .tex em data/output/latex/ para PDF
npm run agent              # Abre agente opencode interativo
npm run agent:run "msg"    # Executa agente com mensagem
```

---

## Troubleshooting

### "Não encontro meus dados"
→ Coloque o PDF em `data/input/Profile.pdf` e o agente vai extrair automaticamente.

### "LaTeX não compila"
→ Certifique-se de que LaTeX está instalado. Ou use Overleaf: copie o `.tex` para lá.

### "Preciso de ajuda com agente"
→ Leia `AGENTS.md` ou rode `npm run agent` e peça ao agente.

---

## Licença

MIT - Criado e mantido por Gustavo Cosme

**Dúvidas?** Abra uma issue ou consulte `AGENTS.md`
