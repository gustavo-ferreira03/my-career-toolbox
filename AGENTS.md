# Instruções para Agentes de IA

Este repositório foi construído **especificamente para ser operado por agentes de inteligência artificial** (Cursor, Copilot, Cline, OpenCode, etc). O objetivo é automatizar a otimização de perfis do LinkedIn e a geração de currículos em LaTeX e Markdown.

## ⚠️ REGRA CRÍTICA: Skills São Obrigatórias

**ANTES de tomar qualquer ação sobre carreira do usuário, você DEVE:**

1. **Ler as skills relevantes** em `.agents/skills/`:
   - `tech-resume-optimizer/SKILL.md` - Para otimizar currículos técnicos
   - `resume-ats-optimizer/SKILL.md` - Para currículos ATS-compliant
   - `linkedin-profile-optimizer/SKILL.md` - Para perfis LinkedIn
   - `copywriting/SKILL.md` - Para redação profissional e impactante
   - `writing-skills/SKILL.md` - Para regras de tom e voz

2. **NÃO inicie nenhuma redação ou otimização** sem antes ter consultado as skills
3. **Aplique 100% das metodologias** descritas nas skills - não ignore nada
4. **Siga as métricas, fórmulas e exemplos** fornecidos nas skills

### Por Que Skills São Obrigatórias?
- Contêm metodologias profissionais testadas
- Definem o tom correto (sem jargão, sem emojis)
- Ensinam como estruturar resultados e impacto
- Garantem qualidade consistente

**Se você não ler e aplicar as skills, o resultado será mediocre e não alcançará o objetivo.**

---

## O Fluxo de Trabalho Obrigatório

Quando o usuário pedir para gerar, otimizar ou reescrever um currículo/perfil, siga **estas etapas nesta ordem exata**:

### Etapa 1: Coleta Automática de Dados

O usuário **não precisa** colar seus dados no chat. Você deve procurá-los.

1. **Verifique `data/input/`** usando ferramentas como `glob` ou `bash ls`.
2. **Se encontrar PDFs** (`Profile.pdf`, `Resume.pdf`, etc):
   - Execute imediatamente:
     ```bash
     npm run build && npm run extract-pdf
     ```
   - Espere o comando terminar
   - Leia o arquivo `.txt` gerado diretamente
3. **Se encontrar `.txt`** já existentes, leia-os diretamente
4. **Se não encontrar nada**, avise o usuário:
   > "Não encontrei dados em `data/input/`. Por favor, coloque seu perfil do LinkedIn ou currículo em PDF lá (ex: `Profile.pdf`)"

### Etapa 2: Selecione e Leia os Templates

**NUNCA modifique os templates**. Eles são apenas moldes de referência.

- **Para LinkedIn:** `templates/LINKEDIN_TEMPLATE.md`
- **Para Currículo LaTeX:** `templates/latex/curriculo_template.tex`
- **Para Currículo Markdown:** `templates/RESUME_TEMPLATE.md`

### Etapa 3: Aplique as Skills de Otimização (OBRIGATÓRIO)

**LEIA AS SKILLS ANTES DE PROSSEGUIR.** Elas contêm as metodologias que você DEVE seguir.

Consulte as metodologias em `.agents/skills/`:

- **`tech-resume-optimizer/SKILL.md`** e **`resume-ats-optimizer/SKILL.md`** → Para currículos
- **`linkedin-profile-optimizer/SKILL.md`** → Para perfis do LinkedIn
- **`copywriting/SKILL.md`** e **`writing-skills/SKILL.md`** → Para redação natural e impactante

**Você DEVE:**
- Ler as fórmulas de bullet points (ex: [Verbo de Ação] + [O que] + [Ferramenta] + [Impacto])
- Aplicar as métricas corretas (escala, performance, impacto financeiro)
- Seguir o tom definido (sem emojis, sem jargão vazio)
- Usar os exemplos como referência
- Aplicar 100% das regras, não escolha parcial

### Etapa 4: Gere o Arquivo Final

1. **Local obrigatório:** `data/output/`
   - LaTeX → `data/output/latex/curriculo.tex`
   - Markdown → `data/output/markdown/resume_otimizado.md`
2. **Substitua TODOS os placeholders** do template com dados reais do usuário
   - Exemplo: `[NOME COMPLETO]` → `Gustavo Ferreira Cosme`
   - **Nunca deixe `[PLACEHOLDER]` no arquivo final**
3. **Mantenha a formatação e estrutura** do template original

### Etapa 5: Compile LaTeX para PDF (se aplicável)

Se gerou um `.tex`, compile imediatamente:

```bash
npm run compile-latex
```

- O PDF será salvo em `data/output/latex/`
- Se houver erros, **corrija o `.tex` autonomamente** e rode de novo
- Não pare até ter sucesso

---

## Regras de Escrita e Tone

### Tom e Voz
- **Natural e profissional** - escreva como um desenvolvedor conversando com outro
- **Sem jargão corporativo vazio** - evite: "sinergia", "paradigma", "focado em resultados", "pensar fora da caixa"
- **Específico e concreto** - use números, tecnologias reais, resultados mensuráveis

### Fórmula para Bullet Points de Experiência

```
[Verbo de Ação] + [O que foi feito] + [Tecnologia/Ferramenta] + [Resultado/Impacto]
```

**Exemplos:**
- ❌ "Trabalhei com React" 
- ✅ "Implementei componentes reutilizáveis em React, reduzindo o tempo de desenvolvimento em 30%"

- ❌ "Otimizei o banco de dados"
- ✅ "Otimizei queries PostgreSQL com índices, reduzindo latência de 500ms para 120ms para 100K usuários/dia"

### Caracteres e Formatação
- **Acentos em português:** Obrigatório usar (sem é completamente válido)
- **Emojis:** PROIBIDO (🚀, ✨, ⚡, etc)
- **Caracteres especiais:** Use hífens `-` e asteriscos `*`, não travessões longos ou símbolos estranhos
- **Listas:** Use `*` ou `-` simples, não ícones

### Métricas Que Impressionam Recrutadores
- **Escala:** "1M+ usuários", "50K requisições/segundo", "100+ clientes"
- **Performance:** "reduzido de X para Y", "melhoria de X%"
- **Impacto financeiro:** "economizou $XXX", "faturamento de $XXX"
- **Tempo:** "deployment reduzido de 2h para 15min"

---

## Privacidade e Segurança

### Dados do Usuário
- A pasta `data/` está em `.gitignore` - dados nunca vazam
- **NUNCA** rode `git add data/` ou modifique `.gitignore`
- Após gerar os arquivos, o usuário deve revisá-los antes de usar em produção

### Tokens e Eficiência
- **Sempre rode `npm run extract-pdf`** quando houver PDFs - evita ler binários
- **Leia texto, não chat** - evita desperdício de tokens
- **Use `glob` e `read`** para buscar dados, não pergunte ao usuário

---

## Checklist para Antes de Terminar

- [ ] Skills lidas completamente (tech-resume-optimizer, copywriting, etc)
- [ ] Dados coletados de `data/input/` (PDF extraído ou `.txt` lido)
- [ ] Template escolhido e lido
- [ ] 100% das metodologias das skills aplicadas
- [ ] Arquivo gerado em `data/output/` com nome claro
- [ ] ZERO placeholders deixados no arquivo final
- [ ] LaTeX compilado para PDF (se aplicável)
- [ ] Aviso ao usuário sobre onde encontrar o arquivo final

---

## Troubleshooting Comum

### "Error: ENOENT: no such file or directory"
→ Você tentou ler um arquivo que não existe. Verifique o caminho com `bash ls`.

### "LaTeX compilation failed"
→ Corrija o `.tex` manualmente e rode `npm run compile-latex` de novo. Não desista.

### "Placeholder still in file"
→ Releia a seção "Etapa 4" - você DEVE substituir todos os `[PLACEHOLDERS]` por dados reais.

### "User doesn't have data in data/input/"
→ Instrua o usuário: "Coloque `Profile.pdf` em `data/input/` e eu executo o resto automaticamente."
