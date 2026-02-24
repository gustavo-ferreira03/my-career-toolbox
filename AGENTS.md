# Agent Instructions for OpenCode

This repository is a professional knowledge base system designed to work with AI agents.

## Before You Do Anything

**MANDATORY**: Read `.agents/skills/career-assistant/SKILL.md` first.

It defines the entire architecture, 8 core workflows, and all the rules you must follow.

## Quick Summary

This is NOT a resume builder. It's a **professional knowledge management system** where:

1. User drops files (PDFs, job descriptions, links) in `data/input/`
2. You extract, interpret, and structure everything into `profile/` (the knowledge base)
3. You use `profile/` to generate any career output the user needs

## Core Workflows

You have 8 available workflows (all defined in `career-assistant/SKILL.md`):

| User Request | Workflow | Key Steps |
|---|---|---|
| "Process my files" | Process Inputs → Build/Update Knowledge Base | Extract → Interpret → Populate `profile/` |
| "Generate resume for this job" | Generate Tailored Resume | Read job + profile/ → tailor → output |
| "Optimize my LinkedIn" | Optimize LinkedIn Profile | Read profile/ → apply optimization skill → output |
| "Help me respond to recruiter" | Respond to Recruiter | Assess fit → draft response variants |
| "Prepare me for interview" | Prepare for Interview | Extract talking points + STAR stories + gaps |
| "Write cover letter" | Generate Cover Letter | Connect experience to job requirements |
| "Create portfolio content" | Generate Portfolio | Structure projects + experience narratives |
| "Give me an elevator pitch" | Generate Elevator Pitch | Create 30s/60s/2min variants |

## Architecture

```
data/input/              ← User drops files here
         ↓
    [You process]
         ↓
profile/                 ← Knowledge base you generate/maintain
(identity.md, experience.md, skills.md, projects.md, education.md, stories.md)
         ↓
    [User asks for output]
         ↓
data/output/             ← You place all generated content here
```

## Critical Rules

1. **Read `career-assistant/SKILL.md` FIRST** — before ANY user request
2. **`profile/` is the source of truth** — always read it before generating outputs
3. **Never modify `templates/`** — they are structural references only
4. **Always output to `data/output/`** — never overwrite inputs
5. **Never commit `data/` or `profile/`** — they contain personal information
6. **Merge intelligently** when updating profile — ask before removing information
7. **Read relevant skills** before generating (tailored-resume-generator for resumes, linkedin-profile-optimizer for LinkedIn)
8. **DO NOT use glob** — It frequently fails. Use `find` or `ls` commands instead when checking for files

## Skills Available

### Primary (Always Read First)
- **`career-assistant`** — Defines all 8 workflows and the entire system. READ THIS FIRST.

### Specialized (Read When Needed)
- **`tailored-resume-generator`** — Methodology for tailoring resumes to job descriptions
- **`linkedin-profile-optimizer`** — Methodology for LinkedIn optimization
- **`writing-skills`** — Meta-skill for creating/testing other skills (advanced usage)

### Writing & Marketing Quality
- **`copywriting`** — Expert conversion copywriting principles (clarity, specificity, benefits over features, customer language)
  - Use when: Rewriting bullets, headlines, or any content that needs more impact
  - Key principles: Benefits over features, specificity over vagueness, customer language, one idea per section
- **`marketing-psychology`** — 70+ mental models for persuasion and decision-making
  - Use when: Structuring arguments, building credibility, creating urgency, explaining value
  - Key models: Social proof, authority, scarcity, reciprocity, loss aversion, framing, anchoring

## User Language

The user works in mixed Portuguese/English:
- Narrative in Brazilian Portuguese
- Technical terms in English

Generate outputs in whatever language the user requests (default: same as conversation language).

## When to Process Inputs

Process inputs (files in `data/input/`) in these situations:

1. **User says**: "Process my files", "Build my knowledge base", "Extract my data", etc.
2. **User says**: "Generate resume" but `profile/` is empty or outdated
3. **New files appear in `data/input/`** and user asks for any output (you should ask if they want to update first)

## When You Don't Have Enough Information

If `profile/` lacks information needed for a good output, **tell the user what's missing** instead of fabricating content.

Example: *"I need more detail about your experience at Company X. What were the key metrics/results?"*

## Links to Templates

All templates are in `templates/` directory:
- Knowledge base structure: `templates/profile/*.md`
- Output format references: `templates/output/*.md` and `templates/output/latex/*.tex`

Use these as structural references when populating `profile/` or generating outputs.

## Example User Interactions

### Scenario 1: First Time
```
User: "Process my files"
You: Read career-assistant → Process Inputs workflow
     Extract files from data/input/ → Populate profile/ → Report what was extracted
```

### Scenario 2: Generate Resume
```
User: "Generate a resume for this job: [job description]"
You: Read career-assistant + tailored-resume-generator skills
     Read profile/ files → Match to job → Generate tailored resume → Output to data/output/
```

### Scenario 3: Multiple Requests
```
User: "Optimize my LinkedIn and give me an elevator pitch"
You: Read career-assistant skill
     Read profile/ → Generate LinkedIn content → Output
     Read profile/ → Generate 30s/60s/2min pitches → Output
```

## Outputs

All outputs go to `data/output/`:

- Markdown → `data/output/markdown/`
- LaTeX → `data/output/latex/` (then offer to compile with `npm run compile-latex`)
- Structured text → `data/output/`

## Questions?

Everything you need is in:
1. **`.agents/skills/career-assistant/SKILL.md`** — The main reference (all 8 workflows detailed)
2. **`templates/profile/*.md`** — Structure for the knowledge base
3. **`.cursorrules`** — Additional configuration rules
