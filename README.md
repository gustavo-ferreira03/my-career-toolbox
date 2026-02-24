# My Career Toolbox

Um repositório de ferramentas e utilitários projetados para ajudar você (ou seus agentes de IA) a otimizar perfis do LinkedIn e gerenciar currículos de forma automatizada usando LaTeX.

## O que este projeto faz?

1. **Geração de Currículos (LaTeX):** Contém templates focados em conversão e escaneamento por sistemas ATS (Applicant Tracking Systems), compiláveis automaticamente via script.
2. **Extração de Dados:** Extrai textos de PDFs (como perfis exportados do LinkedIn ou currículos antigos) para servirem de contexto para IAs.
3. **Templates e Skills para IA:** Inclui exemplos de copywriting e regras instaladas (`.agents/skills`) para garantir que os textos gerados pela IA sejam naturais, profissionais e sem jargões corporativos robóticos.

---

## 🚀 Como Usar

### Pré-requisitos
- Node.js (v18+)
- LaTeX (`pdflatex`) instalado no sistema (opcional, necessário apenas para compilar os PDFs localmente).

**Instalação do LaTeX:**
- Ubuntu/Debian: `sudo apt-get install texlive-latex-base texlive-fonts-recommended`
- Mac: `brew install mactex`
- Windows: Instale TeX Live ou MiKTeX

### 1. Instalação do Projeto
Clone o repositório e instale as dependências:
```bash
git clone https://github.com/gustavo-ferreira03/my-career-toolbox.git
cd my-career-toolbox
npm install
```

### 2. Gerador de Currículos (LaTeX)
O repositório inclui um template limpo, com fonte clássica (serifada) e estrutura inspirada no RxResume, otimizado para caber tudo em uma página contínua.

1. Copie o template da pasta `templates/latex/` para sua pasta pessoal:
   ```bash
   cp templates/latex/curriculo_template.tex data/output/latex/meu_curriculo.tex
   ```
2. Abra `data/output/latex/meu_curriculo.tex` no seu editor favorito e preencha com os seus dados.
3. Compile para PDF rodando:
   ```bash
   npm run compile-latex
   ```
   *O seu novo currículo em PDF será gerado na pasta `data/output/latex/` e todos os arquivos temporários de compilação serão limpos automaticamente.*

**Não quer instalar o LaTeX localmente?**
Sem problemas! Copie o código de `templates/latex/curriculo_template.tex`, cole no [Overleaf](https://www.overleaf.com/), preencha seus dados e baixe o PDF de lá.

### 3. Extração de Perfil (Para IAs)
Se você estiver usando uma IA (como ChatGPT, Claude, ou ferramentas CLI como Copilot/Cursor) para reescrever seu LinkedIn, você pode dar a ela seus dados atuais de forma fácil:

1. Exporte seu perfil do LinkedIn como PDF (no seu perfil do LinkedIn clique em `Mais > Salvar como PDF`).
2. Coloque o arquivo baixado em `data/input/Profile.pdf`.
3. Rode o extrator:
   ```bash
   npm run build
   npm run extract-pdf
   ```
4. Um arquivo `.txt` será gerado. Agora você pode pedir para a sua IA ler esse arquivo e sugerir melhorias baseadas nos arquivos da pasta `templates/`.

---

## 🔒 Privacidade e Segurança
Todos os seus dados pessoais ficam armazenados **exclusivamente** dentro da pasta `data/`. 
O arquivo `.gitignore` do projeto está configurado para **ignorar todo o conteúdo dessa pasta**. Isso garante que você nunca vai 'commitar' e vazar seu currículo ou dados do LinkedIn no GitHub por engano.

---

## 🤖 Integração com Agentes de IA
Este repositório foi construído para ser lido e operado por agentes de inteligência artificial autônomos (como Cursor, Copilot, Cline ou ferramentas CLI).

Na pasta `.agents/skills/`, existem regras de negócio (skills) que ensinam a IA a:
- Escrever como um humano (sem emojis, sem listas com ícones estranhos).
- Usar caracteres padrão de teclados.
- Estruturar resumos e experiências de acordo com as melhores práticas de RH (usando a fórmula de métricas + ferramentas).

### 💡 Exemplo de Prompts para usar com a sua IA
Após colocar seu PDF extraído na pasta `data/input/`, você pode abrir o chat do seu Agente de IA neste projeto e mandar:

**Para otimizar o LinkedIn:**
> "Leia meu perfil extraído em `data/input/Profile.txt` e use a skill `linkedin-profile-optimizer` junto com o template `templates/LINKEDIN_TEMPLATE.md` para recriar o meu LinkedIn focado em [SEU CARGO ALVO]."

**Para gerar o Currículo (LaTeX):**
> "Leia meu perfil extraído em `data/input/Profile.txt`. Use as skills `resume-ats-optimizer` e `tech-resume-optimizer` para preencher o arquivo `data/output/latex/meu_curriculo.tex` (baseado no `templates/latex/curriculo_template.tex`). Mantenha exatamente 1 página e use métricas reais."

---

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.
Criado e mantido por Gustavo Cosme.