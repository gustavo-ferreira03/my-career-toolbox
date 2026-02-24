# My Career Toolbox

Seu repositório pessoal de informações profissionais, alimentado por IA.

Jogue seus arquivos (currículo PDF, export do LinkedIn, etc.) e deixe o agente fazer o resto: extrair dados, montar sua base de conhecimento, e gerar qualquer output profissional que você precisar.

---

## Como Funciona

```
Você joga arquivos          O agente processa          Você pede qualquer output
    ↓                            ↓                            ↓
data/input/               profile/ (knowledge base)     data/output/
  - PDFs                    - identity.md                 - Currículo personalizado
  - LinkedIn export         - experience.md               - LinkedIn otimizado
  - Descrições de vagas     - skills.md                   - Cover letter
  - Screenshots             - projects.md                 - Prep de entrevista
  - Links                   - education.md                - Resposta a recrutador
                            - stories.md                  - Portfolio
                                                          - Elevator pitch
```

Você nunca precisa preencher nada manualmente. O agente extrai, interpreta e estrutura tudo a partir dos seus arquivos.

---

## Começo Rápido

```bash
# Clone e instale
git clone https://github.com/gustavo-ferreira03/my-career-toolbox.git
cd my-career-toolbox
npm install

# Configure sua API key
cp .env.example .env
# Edite .env com sua chave (OpenAI, Anthropic, Google, etc.)
```

### Uso

1. Coloque seus arquivos em `data/input/` (PDFs do currículo, export do LinkedIn, etc.)
2. Abra o agente (`npm run agent` ou use Cursor/Copilot/OpenCode)
3. Peça ao agente: *"Processe meus arquivos"*
4. Depois peça qualquer output:
   - *"Gere um currículo para esta vaga: [link ou texto]"*
   - *"Otimize meu LinkedIn"*
   - *"Me ajude a responder este recrutador: [mensagem]"*
   - *"Me prepare para uma entrevista na empresa X"*
   - *"Escreva uma cover letter para esta vaga"*
   - *"Crie um elevator pitch de 30 segundos"*

### Com Devcontainer (Zero Configuração)

1. Abra no VS Code
2. Instale extensão **Dev Containers**
3. Clique "Reopen in Container"

Tudo já vem instalado (Node.js, LaTeX, agente).

---

## Estrutura do Projeto

```
├── data/
│   ├── input/              ← Coloque seus arquivos aqui
│   └── output/             ← Outputs gerados pelo agente
│       ├── markdown/
│       └── latex/
├── profile/                ← Knowledge base (gerado pelo agente)
├── templates/
│   ├── profile/            ← Estrutura dos arquivos do knowledge base
│   └── output/             ← Templates de formato de output
├── scripts/
│   ├── extract-pdf.ts      ← Extrai texto de PDFs
│   └── compile-latex.ts    ← Compila LaTeX para PDF
└── .agents/skills/         ← Skills do agente
    ├── career-assistant/           ← Skill principal (orquestra tudo)
    ├── tailored-resume-generator/  ← Personaliza currículo para vagas
    ├── linkedin-profile-optimizer/ ← Otimiza perfil LinkedIn
    ├── copywriting/                ← Princípios de escrita persuasiva
    ├── marketing-psychology/       ← Mental models para persuasão
    └── writing-skills/             ← Meta-skill para criar skills
```

---

## O Que o Agente Faz

| Caso de uso | O que acontece |
|---|---|
| **Processar inputs** | Extrai dados dos seus PDFs/arquivos e popula o knowledge base (`profile/`) |
| **Currículo personalizado** | Lê a vaga + seu perfil e gera currículo tailored (LaTeX/PDF) |
| **LinkedIn** | Analisa seu perfil e gera conteúdo otimizado para cada seção |
| **Resposta a recrutador** | Avalia fit com seus objetivos e gera opções de resposta |
| **Prep de entrevista** | Gera talking points, STAR stories, perguntas para fazer, e gaps para estudar |
| **Cover letter** | Gera carta personalizada conectando suas experiências à vaga |
| **Portfolio** | Gera conteúdo estruturado para site pessoal |
| **Elevator pitch** | Gera versões de 30s, 60s e 2min para diferentes contextos |

---

## Scripts

```bash
npm run extract-pdf      # Extrai texto dos PDFs em data/input/
npm run compile-latex    # Compila arquivos .tex em data/output/latex/
npm run agent            # Abre agente interativo
npm run agent:run "msg"  # Executa agente com uma mensagem
```

---

## Privacidade

- Seus dados pessoais (`data/` e `profile/`) **nunca são commitados** no Git
- Nenhum dado é enviado a terceiros (apenas para a API que você configurar)
- O `.gitignore` protege contra push acidental

---

## Licença

MIT - Gustavo Cosme
