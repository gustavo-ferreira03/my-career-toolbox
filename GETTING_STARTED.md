# Começando Agora

## Próximos Passos

### 1. Prepare seus arquivos

Coloque em `data/input/`:
- `seu_curriculo.pdf` - Seu currículo atual
- `linkedin_profile.pdf` - Export do LinkedIn (opcional)
- Qualquer outro documento profissional (certificados, screenshots, etc.)

**Como exportar seu perfil do LinkedIn como PDF:**
1. Abra seu perfil no LinkedIn
2. Clique no menu de 3 pontos (...)
3. Selecione "Mais" → "Salvar como PDF"

### 2. Processe seus arquivos

Abra o agente (OpenCode, Cursor, Copilot, ou `npm run agent`) e diga:

```
Processe meus arquivos em data/input/ 
e construa/atualize meu knowledge base em profile/
```

O agente vai:
- Extrair texto dos PDFs
- Interpretar suas experiências, skills, educação
- Estruturar tudo nos arquivos em `profile/`
- Confirmar o que foi extraído

### 3. Peça outputs

Agora você pode pedir qualquer coisa:

- **Currículo para uma vaga específica:**
  ```
  Gere um currículo tailored para esta vaga: [colar descrição ou link]
  Formato: PDF / Markdown
  ```

- **Otimizar LinkedIn:**
  ```
  Otimize meu perfil do LinkedIn usando meu knowledge base
  ```

- **Responder recrutador:**
  ```
  Me ajude a responder este recrutador:
  [colar a mensagem que você recebeu]
  ```

- **Preparar entrevista:**
  ```
  Me prepare para entrevista na empresa X para a vaga de [cargo]
  [opcional: colar descrição da vaga]
  ```

- **Cover letter:**
  ```
  Escreva uma cover letter para esta vaga: [link ou descrição]
  ```

- **Portfolio:**
  ```
  Gere conteúdo para meu portfolio pessoal/site
  ```

- **Elevator pitch:**
  ```
  Gere um elevator pitch de 30 segundos / 60 segundos / 2 minutos
  ```

## Estrutura Atual

```
profile/                  ← Knowledge base (gerado pelo agente)
├── identity.md           - Dados pessoais, headline, pitch
├── experience.md         - Experiências profissionais
├── skills.md             - Hard + soft skills
├── projects.md           - Projetos relevantes
├── education.md          - Formação e certificações
└── stories.md            - STAR stories para entrevistas

data/
├── input/                ← Seus arquivos aqui
└── output/               ← Outputs gerados
    ├── markdown/
    └── latex/

templates/
├── profile/              - Templates para o knowledge base
└── output/               - Templates de formato de outputs
```

## Dicas

1. **Quanto mais detalhe melhor** — Se você colocar histórias, contexto, métricas no knowledge base, os outputs ficam muito melhores.

2. **Revise os outputs** — O agente é bom, mas pode não capturar nuances. Sempre revise antes de usar.

3. **Atualize conforme evolui** — Quando muda de job, aprende nova skill, faz novo projeto, coloque os arquivos em `data/input/` e o agente atualiza seu knowledge base.

4. **Use a skill `career-assistant`** — Se usar um agente diretamente (Cursor, Copilot), certifique-se que ele lê `.agents/skills/career-assistant/SKILL.md` primeiro.

## Troubleshooting

**"O agente não consegue extrair de um PDF"**
- Tente converter o PDF para texto manualmente e coloque em `data/input/` como `.txt`

**"Meu knowledge base ficou incompleto"**
- Verifique se todos os seus arquivos foram adicionados a `data/input/`
- Peça ao agente: "Que informação falta no meu profile para gerar bons outputs?"

**"Não consigo compilar LaTeX"**
- Use DevContainer (tem LaTeX pré-instalado)
- Ou use Overleaf: copie o `.tex` para lá e compile

## Support

Leia as skills em `.agents/skills/` para entender melhor como o agente trabalha.

A skill principal é `career-assistant` — ela define todos os 8 workflows disponíveis.
