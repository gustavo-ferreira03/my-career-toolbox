# Instruções para Agentes de IA (AGENTS.md)

Este repositório é projetado ESPECIFICAMENTE para ser operado por Agentes de Inteligência Artificial (como Cursor, Copilot, Cline, ou Opencode). O objetivo principal é automatizar a otimização de perfis do LinkedIn e a geração de currículos em LaTeX e Markdown.

Como um Agente atuando neste repositório, você DEVE seguir as diretrizes abaixo para garantir a segurança dos dados do usuário, o uso do contexto correto, e a qualidade da geração final.

---

## 1. O Fluxo de Trabalho (Workflow) Exigido

Sempre que o usuário pedir para gerar, otimizar ou criar um currículo/perfil no LinkedIn a partir do zero ou de seus dados, execute as etapas abaixo nesta exata ordem:

### Passo 1: Busca de Contexto e Dados (Crucial)
O usuário **NÃO** precisa te dar os dados profissionais dele no chat. É seu dever procurá-los.
1. Use as ferramentas de `read` e `glob` para verificar os dados do usuário na pasta **`data/input/`**.
2. **Se houver arquivos PDF** (como `Profile.pdf` ou `Resume.pdf`), **rode o extrator você mesmo** antes de prosseguir:
   ```bash
   npm run build && npm run extract-pdf
   ```
   Isso evita desperdício de tokens e garante que você leia texto puro.
3. **Se houver arquivos .txt**, leia-os diretamente.
4. **Se não encontrar nada**, avise o usuário: *"Por favor, coloque seu currículo ou perfil do LinkedIn em PDF na pasta `data/input/`."*

### Passo 2: Seleção e Leitura de Templates
NUNCA modifique os arquivos na pasta `templates/`. Eles são apenas moldes.
1. Para gerar um LinkedIn, leia: `templates/LINKEDIN_TEMPLATE.md`
2. Para gerar um currículo LaTeX, leia: `templates/latex/curriculo_template.tex`
3. Para gerar um currículo Markdown puro, leia: `templates/RESUME_TEMPLATE.md`

### Passo 3: Aplicação de Skills
Aplique as metodologias e guidelines que estão instaladas em `.agents/skills/`:
- **`resume-ats-optimizer` e `tech-resume-optimizer`** (Para currículos)
- **`linkedin-profile-optimizer`** (Para perfis)
- **`copywriting` e `writing-skills`** (Para redação atraente e humana)

### Passo 4: Geração do Arquivo Final Seguro
1. Crie o novo arquivo gerado EXCLUSIVAMENTE dentro da pasta `data/output/`. 
   - Exemplo LaTeX: Salve as mudanças em `data/output/latex/meu_curriculo.tex`
   - Exemplo Markdown: Salve em `data/output/markdown/LINKEDIN_OTIMIZADO.md` ou `data/output/markdown/RESUMO_ATS.md`.
2. **NUNCA DEIXE PLACEHOLDERS** (como `[NOME DA EMPRESA]`). O objetivo de ler a pasta de input é justamente substituir todos os placeholders do template pelas informações concretas do usuário.

### Passo 5: Compilação do PDF (se for LaTeX)
1. Após gerar `data/output/latex/meu_curriculo.tex`, rode a compilação:
   ```bash
   npm run compile-latex
   ```
2. Se o log mostrar erros no LaTeX, não pare. Corrija o `.tex` autonomamente e rode o script de novo até o PDF ser gerado com sucesso na pasta `data/output/latex/`.

---

## 2. Regras Rígidas de Redação e Copywriting

- **Tom Humano:** Escreva de forma natural, como se fosse um profissional conversando com outro. Evite buzzwords corporativas vazias ("sinergia", "paradigma", "focado em resultados").
- **Métricas e Impacto:** Siga a fórmula: `[Verbo de Ação] + [O que foi feito] + [Ferramentas utilizadas] + [Impacto/Métrica]`.
- **Caracteres Permitidos:** 
  - Acentos em português são permitidos e encorajados.
  - **PROIBIDO USO DE EMOJIS** (🚀, ✨, etc).
  - **PROIBIDO CARACTERES UNICODE ESPECIAIS** (traços longos, bolinhas não-padrão). Use hífens comuns `-` e asteriscos `*` para listas.

---

## 3. Segurança (Git)

A pasta `data/` está no `.gitignore`. Essa é a garantia de que as informações do usuário nunca irão vazar.
**NUNCA**, sob nenhuma circunstância, rode `git add` ou remova arquivos de `data/` do `.gitignore`.

---

## 4. Integração IDE (.cursorrules)

Os agentes em editores (como Cursor/Copilot) devem sempre carregar as diretrizes deste arquivo (`AGENTS.md`) como fonte principal de verdade para o fluxo de otimização de carreira e gestão dos currículos e arquivos `.tex`.