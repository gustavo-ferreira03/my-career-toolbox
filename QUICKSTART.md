# Quick Start

Quer otimizar seu perfil do LinkedIn ou currículo em menos de 5 minutos? Comece aqui.

## ⚠️ Aviso Importante

Este repositório usa **skills obrigatórias** (em `.agents/skills/`) que definem como otimizar sua carreira. O agente DEVE ler e aplicar 100% delas para gerar um resultado de qualidade.

Se isso não for feito, o resultado será mediocre e ineficaz.

---

## 3 Passos Rápidos

### 1️⃣ Prepare seus dados

Exporte seu perfil do LinkedIn como PDF:
- Acesse seu perfil > **Mais (...) > Salvar em PDF**
- Salve o arquivo em: `data/input/Profile.pdf`

Ou coloque seu currículo:
- Salve em: `data/input/Resume.pdf`

### 2️⃣ Configure o agente

```bash
# Se ainda não instalou
npm install

# Configure sua API key
cp .env.example .env
nano .env  # ou use seu editor favorito
# Adicione: OPENAI_API_KEY=sk-... (ou outra)
```

### 3️⃣ Rode o agente

```bash
npm run agent
```

Pronto! O agente vai:
- Ler seu PDF automaticamente
- Otimizar seu conteúdo com metodologias profissionais
- Gerar um currículo melhorado em `data/output/`

---

## O Que Esperar

### ✅ O agente vai

- Extrair texto do seu PDF
- Aplicar skills de copywriting e otimização técnica
- Gerar currículo em LaTeX (compilado para PDF)
- Sugerir melhorias no seu perfil

### ❌ O agente NÃO vai

- Enviar seus dados a ninguém (exceto sua API)
- Fazer push no GitHub
- Modificar seus PDFs originais
- Usar emojis (porque é profissional)

---

## Próximas Ações

1. **Revise o arquivo gerado** em `data/output/`
2. **Faça ajustes** se necessário
3. **Baixe o PDF** e use no LinkedIn ou em candidaturas

---

## Precisa de Ajuda?

- Leia `AGENTS.md` para entender como o agente funciona
- Leia `README.md` para detalhes técnicos
- Rode `npm run agent` e peça ajuda ao agente 😉
