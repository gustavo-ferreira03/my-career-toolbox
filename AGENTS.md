# Agent Instructions for OpenCode

## ⛔ 3 HARD RULES — READ BEFORE DOING ANYTHING

### 1. NEVER use the Glob tool

Glob **silently returns empty results** in this project. You will think files don't exist when they do.

**Use `find` or `ls` via Bash instead.** Example: `find data/input -type f` or `ls profile/`.

### 2. Resumes are LaTeX ONLY

**NEVER generate Markdown resumes.** Always use `templates/output/latex/curriculo_template.tex` as the base. Output `.tex` to `data/output/latex/`, then compile with `npm run compile-latex`.

**Copy the preamble (everything before `\begin{document}`) VERBATIM from the template. Only modify content between `\begin{document}` and `\end{document}`. NEVER strip `\` from LaTeX commands.**

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
| `writing-linkedin-posts` | LinkedIn post creation (hooks, formats, voice, engagement) |
| `linkedin-authority-builder` | LinkedIn content strategy (pillars, positioning, weekly rhythm) |
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
2. **ALWAYS process `data/input/` first** — before generating ANY output, check `data/input/` for unprocessed files and extract them into `profile/`. Do NOT skip this even if `profile/` already has data.
3. **Never modify `templates/`** — structural references only
4. **Always output to `data/output/`** — never overwrite inputs
5. **Never commit `data/` or `profile/`** — they contain personal information
6. **Merge intelligently** when updating profile — ask before removing information
7. **Read relevant skills** before generating any output (see skills table above)

## User Language

Mixed Portuguese/English: narrative in Brazilian Portuguese, technical terms in English.
Generate outputs in whatever language the user requests (default: same as conversation).

## Plain Text Only in Generated Outputs

NEVER use emojis, unicode arrows, em-dashes, en-dashes, fancy quotes, or any decorative unicode characters in generated outputs (resumes, LinkedIn content, cover letters, pitches, etc.). Use only plain ASCII/Latin characters: regular hyphens, standard bullet points, straight quotes, "->" instead of arrow symbols.

## Quick Architecture

```
data/input/     → User drops files here
profile/        → Knowledge base (agent generates/maintains)
data/output/    → Generated outputs go here
templates/      → Structural references (never modify)
```

## MCP LinkedIn Server (`mcp-linkedin/`)

The project includes a Model Context Protocol server that automates LinkedIn via a headless browser (Patchright). Understand these rules before using any LinkedIn tool.

### Architecture

- **8 tool modules** in `src/tools/`: session, profile-read, profile-write, skills, jobs, resume, apply, post
- **Singleton browser** in `src/browser.ts`: one `BrowserContext` shared across all tools
- **Persistent cookies** at `~/.linkedin-mcp/profile/` survive logout
- **Anti-detection**: Patchright (Playwright fork), human-like delays, warm-up visits to Google/GitHub before LinkedIn

### Session lifecycle (3 different meanings of "session")

| What | Lifecycle | Storage |
|---|---|---|
| Browser context | Created on first tool use, destroyed by `logout` or process exit | In-memory singleton in `browser.ts` |
| LinkedIn auth | Cookies in persistent profile dir | On disk at `~/.linkedin-mcp/profile/` (survives logout) |
| Post rate limit | Resets on `logout` or process restart | In-memory counter in `post.ts` |

### Tool call order matters

- `login` opens a **headed** (visible) browser so the user can type credentials and handle 2FA/captcha
- All other tools use **headless** (invisible) browser by default
- `getBrowser()` now detects headless-to-headed transitions and recreates the browser automatically
- If `login` times out or the browser seems stuck, call `logout` first to force a clean state, then `login` again

### Post rate limiting

- Max 3 posts per session (in-memory counter)
- `create_post` checks the limit before opening the editor
- `publish_post` increments the counter (only counted when actually published)
- `logout` resets the counter -- use it to start a fresh posting session
- Creating a post without publishing does NOT count toward the limit

### LinkedIn UI is fragile

- CSS selectors and button text change frequently (LinkedIn redesigns often)
- All locators are centralized in `src/utils/locators.ts` -- fix them there, not inline
- Post editor is a Quill-based contenteditable div (`.ql-editor`), not a textarea -- requires `keyboard.type()`, not `fill()`
- Button text is bilingual (PT-BR + EN) -- locators use regex patterns like `/publicar|post/i`

### Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `login` does not open a window | Browser context was already created headless by another tool | Call `logout` first, then `login` |
| `Target page, context or browser has been closed` | Browser process died or was killed externally | Call `logout` to clean up singletons, then `login` |
| `Rate limit reached` even after logout | Old MCP process still running (code not reloaded) | Restart OpenCode to restart the MCP server process |
| `Not logged in` after successful login | Cookies not loaded on first navigation | `ensureLoggedIn()` retries 3 times with backoff -- this is usually transient |
| Post editor did not open | LinkedIn changed the "Start a post" button | Update `startPostButton` in `src/utils/locators.ts` |

### When modifying MCP server code

1. Edit files in `mcp-linkedin/src/`
2. Run `npx tsc --noEmit --project mcp-linkedin/tsconfig.json` to type-check
3. **Restart OpenCode** for changes to take effect (the MCP server is a child process)
4. Never modify browser profile data directly -- use `logout`/`login` to reset

---

## Everything Else

All workflows, writing rules, LaTeX template details, PT-BR quality guidelines, and examples are in:

1. **`.agents/skills/career-assistant/SKILL.md`** — The main reference
2. **`templates/profile/*.md`** — Knowledge base structure
3. **`.cursorrules`** — Additional configuration
