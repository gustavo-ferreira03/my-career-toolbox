# My Career Toolbox

Otimize seu perfil do LinkedIn e gere currículos profissionais automaticamente.

---

## O Que Faz

- **Extrai dados** de seus PDFs (LinkedIn, currículo)
- **Gera currículos** em LaTeX, Markdown e PDF
- **Integra com agentes de IA** para otimização automática

---

## Começo Rápido

### Com Agente de IA (Recomendado)

```bash
# Instale
git clone https://github.com/gustavo-ferreira03/my-career-toolbox.git
cd my-career-toolbox
npm install

# Configure API key
cp .env.example .env
# Edite .env com sua chave (OpenAI, Anthropic, Google, etc)

# Rode o agente
npm run agent
```

Próximos passos:
1. Coloque seu `Profile.pdf` em `data/input/`
2. Peça ao agente: *"Otimize meu perfil do LinkedIn"*
3. Pegue o resultado em `data/output/`

### Com Devcontainer (Zero Configuração)

1. Abra no VS Code
2. Instale extensão **Dev Containers**
3. Clique "Reopen in Container"

Tudo já vem instalado (Node.js, LaTeX, agente).

### Manual (Sem Agente)

```bash
# Extrair PDF para texto
npm run build && npm run extract-pdf

# Gerar currículo LaTeX
npm run compile-latex

# Ou use Overleaf: copie o .tex para lá
```

---

## Onde Estão Seus Arquivos

```
data/
├── input/      ← Coloque seus PDFs aqui
└── output/
    ├── latex/  ← Currículos em PDF gerados aqui
    └── markdown/
```

---

## Privacidade

✅ Seus dados **nunca são enviados a ninguém** (exceto sua API)  
✅ Pasta `data/` é ignorada no Git  
✅ Impossível fazer push acidental

---

## Scripts

```bash
npm run extract-pdf      # Converte PDFs em texto
npm run compile-latex    # Gera PDFs dos .tex
npm run agent            # Abre agente interativo
npm run agent:run "msg"  # Executa agente com mensagem
```

---

## Dúvidas?

- Leia `AGENTS.md` para entender como o agente funciona
- Rode `npm run agent` e peça ajuda ao agente

---

## Licença

MIT - Gustavo Cosme
