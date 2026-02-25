# Quick Start Guide

Get started with Humanize Academic Writing in 5 minutes.

## Installation

### For Cursor Users

1. **Copy the skill to your Cursor directory:**

**Windows:**
```powershell
xcopy humanize-academic-writing %USERPROFILE%\.cursor\skills\ /E /I
```

**macOS/Linux:**
```bash
cp -r humanize-academic-writing ~/.cursor/skills/
```

2. **Restart Cursor**

3. **Test it:** Open any text file and ask: "Can you help humanize this academic writing?"

### For Script Users Only

No installation needed! Just run:

```bash
python scripts/ai_detector.py tests/sample_ai_text.txt --detailed
```

---

## First Test: Detect AI Patterns

Try the sample file included:

```bash
python scripts/ai_detector.py tests/sample_ai_text.txt --detailed
```

You should see output like:

```
======================================================================
AI WRITING PATTERN DETECTION REPORT
======================================================================

Overall AI Probability: Very High (0.85)
Recommendation: Text shows strong AI patterns. Significant rewriting recommended.

Detailed Analysis:
----------------------------------------------------------------------

1. Sentence Uniformity: 🔴 HIGH CONCERN
   Avg sentence length: 16.8 words, Std dev: 2.3
   → Issue: Sentences are too uniform in length
   → Fix: Mix short (5-10), medium (15-20), and long (25-35) word sentences

2. Mechanical Transitions: 🔴 HIGH CONCERN
   12 sentences (48.0%) start with mechanical transitions
   → Found transitions: moreover, furthermore, additionally, in addition
   → Fix: Replace with implicit connections or varied transitions

3. Abstract Language: 🔴 HIGH CONCERN
   18 abstract phrases found (density: 8.12 per 100 words)
   → Most frequent: various (6x), multiple factors (4x), different (5x)
   → Fix: Replace with specific concepts, named theories, concrete examples
```

---

## Compare Original vs. Humanized

See the difference:

```bash
python scripts/text_analyzer.py tests/sample_ai_text.txt tests/sample_humanized_text.txt --compare
```

Output shows improvements:

```
TEXT COMPARISON REPORT
======================================================================

SENTENCE LENGTH
----------------------------------------------------------------------
Metric               Text 1          Text 2          Change
Mean Length            16.80           18.50          +1.70
Std Deviation           2.30            6.80          +4.50

VOCABULARY
----------------------------------------------------------------------
Type-Token Ratio       0.412           0.587          +0.175

TRANSITIONS
----------------------------------------------------------------------
Density/100 words       8.20            1.40          -6.80

PASSIVE VOICE
----------------------------------------------------------------------
Percentage             45.0%           18.0%         -27.0%
```

---

## Use in Cursor

### Method 1: Natural Request

1. Open your AI-generated text
2. Select a paragraph
3. Ask: "Please humanize this academic writing for a sociology paper"
4. Cursor will automatically detect and apply this skill

### Method 2: Specific Pattern Fixes

Ask for specific improvements:
- "Remove the mechanical transitions from this paragraph"
- "Replace abstract language with specific concepts"
- "Vary the sentence lengths in this section"
- "Add scholarly hedging to this claim"

### Method 3: Section-Specific

- "Humanize this introduction for a political science paper"
- "Make this methods section sound more natural"
- "Improve this literature review - it sounds too AI-generated"

---

## Example Workflow

### Step 1: Analyze
```bash
python scripts/ai_detector.py my_draft.txt --detailed > analysis_report.txt
```

### Step 2: Review Issues
Open `analysis_report.txt` to see what patterns need fixing.

### Step 3: Rewrite in Cursor

Open Cursor and paste problematic paragraphs:

**You:** "Here's a paragraph from my paper. The AI detector found high mechanical transitions and abstract language. Can you help humanize it?

[paste paragraph]"

**Cursor:** Will apply the skill and rewrite with rationale.

### Step 4: Verify Improvements

```bash
python scripts/text_analyzer.py my_draft.txt my_revised.txt --compare
```

---

## Common Use Cases

### Case 1: Introduction Paragraph

**Issue:** "My intro sounds robotic with 'Moreover, Furthermore, Additionally'"

**Solution in Cursor:**
```
"This introduction has too many mechanical transitions. 
Please rewrite it with natural flow for a sociology paper:

[paste intro]"
```

### Case 2: Abstract Language

**Issue:** "Too many phrases like 'various aspects' and 'multiple factors'"

**Solution in Cursor:**
```
"This paragraph is too abstract. Replace vague phrases 
with specific concepts:

[paste paragraph]"
```

### Case 3: Uniform Sentences

**Issue:** "All my sentences are the same length"

**Solution in Cursor:**
```
"Vary the sentence rhythm in this paragraph 
(mix short, medium, long):

[paste paragraph]"
```

---

## Tips for Best Results

### Do This ✅
- Start with the AI detector to identify specific issues
- Provide context: "This is for a sociology paper on social media"
- Ask for rationales: "Explain what made this sound AI-generated"
- Work paragraph-by-paragraph for complex sections

### Avoid This ❌
- Don't paste entire papers at once (work in sections)
- Don't ask to "make it undetectable" (ask to "make it more natural")
- Don't expect one-click fixes (good writing needs judgment)

---

## Keyboard Shortcuts (Cursor)

- `Ctrl/Cmd + L`: Open chat to ask for humanizing
- Select text + `Ctrl/Cmd + K`: Quick command for selected text
- `Ctrl/Cmd + I`: Inline edit mode

---

## Next Steps

1. **Read the full documentation:**
   - [SKILL.md](../SKILL.md) - Core strategies
   - [docs/rewriting-principles.md](../docs/rewriting-principles.md) - Detailed techniques
   - [docs/examples.md](../docs/examples.md) - Before/after examples

2. **Try your own text:**
   - Run the detector on your draft
   - Use Cursor to rewrite problematic sections
   - Compare before/after with text_analyzer

3. **Learn the patterns:**
   - Study the examples in `docs/examples.md`
   - Notice what makes text sound AI-generated
   - Practice applying fixes manually

---

## Troubleshooting

### "The skill isn't being detected in Cursor"
- Restart Cursor after copying the skill
- Check the skill is in the right directory (`~/.cursor/skills/` or `.cursor/skills/`)
- Make sure `SKILL.md` exists in the skill folder

### "Scripts won't run"
- Check Python version: `python --version` (need 3.7+)
- Use `python3` instead of `python` on some systems
- Make sure you're in the right directory

### "Output doesn't look improved"
- Be specific about what patterns to fix
- Provide discipline context (sociology, political science, etc.)
- Review examples in `docs/examples.md` to see expected quality

---

## Getting Help

- **GitHub Issues:** Report bugs or request features
- **Examples:** Check `docs/examples.md` for 8+ complete transformations
- **Principles:** Read `docs/rewriting-principles.md` for detailed guidance

---

**Ready to start?** Try detecting patterns in the sample file:

```bash
python scripts/ai_detector.py tests/sample_ai_text.txt --detailed
```

Then compare it with the humanized version to see the difference!
