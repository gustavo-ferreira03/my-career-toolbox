# Agent Instructions for OpenCode

## ⛔ 3 HARD RULES — READ BEFORE DOING ANYTHING

### 1. NEVER use the Glob tool

Glob **silently returns empty results** in this project. You will think files don't exist when they do.

**Use `find` or `ls` via Bash instead.** Example: `find data/input -type f` or `ls profile/`.

### 2. Resumes are LaTeX ONLY

**NEVER generate Markdown resumes.** Always use `templates/output/latex/curriculo_template.tex` as the base. Output `.tex` to `data/output/latex/`, then compile with `npm run compile-latex`.

The `tailored-resume-generator` skill shows Markdown examples — **IGNORE its format, use LaTeX.**

### 3. Only these skills exist

Do NOT attempt to load skills not on this list — they don't exist and will fail:

| Skill | When to Load |
|---|---|
| `career-assistant` | **ALWAYS — read this first** |
| `tailored-resume-generator` | Resume methodology (ignore its Markdown format) |
| `linkedin-profile-optimizer` | LinkedIn optimization |
| `copywriting` | Persuasive writing (bullets, headlines) |
| `marketing-psychology` | Impact framing (social proof, authority, anchoring) |
| `writing-skills` | Creating/editing skills (advanced) |

Skills like `tech-resume-optimizer`, `resume-ats-optimizer` do NOT exist. Don't try to load them.

---

## Before You Do Anything

**MANDATORY**: Read `.agents/skills/career-assistant/SKILL.md` first.

It defines the entire architecture, 8 core workflows, and all rules.

## What This Project Is

A **professional knowledge management system** (not a resume builder):

1. User drops files (PDFs, job descriptions) in `data/input/`
2. Agent extracts and structures everything into `profile/` (the knowledge base)
3. Agent uses `profile/` to generate any career output the user needs

## Critical Rules

1. **`profile/` is the source of truth** — always read it before generating outputs
2. **Auto-check `data/input/`** — if `profile/` seems empty or incomplete, check `data/input/` for files to extract before telling the user you have no data
3. **Never modify `templates/`** — structural references only
4. **Always output to `data/output/`** — never overwrite inputs
5. **Never commit `data/` or `profile/`** — they contain personal information
6. **Merge intelligently** when updating profile — ask before removing information
7. **Read relevant skills** before generating any output (see skills table above)

## User Language

Mixed Portuguese/English: narrative in Brazilian Portuguese, technical terms in English.
Generate outputs in whatever language the user requests (default: same as conversation).

## Quick Architecture

```
data/input/     → User drops files here
profile/        → Knowledge base (agent generates/maintains)
data/output/    → Generated outputs go here
templates/      → Structural references (never modify)
```

## Everything Else

All workflows, writing rules, LaTeX template details, PT-BR quality guidelines, and examples are in:

1. **`.agents/skills/career-assistant/SKILL.md`** — The main reference
2. **`templates/profile/*.md`** — Knowledge base structure
3. **`.cursorrules`** — Additional configuration
