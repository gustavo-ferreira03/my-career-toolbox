# ❓ Frequently Asked Questions

[🇬🇧 English](FAQ.md) | [🇨🇳 中文](FAQ_CN.md)

---

## General Questions

### Q: Will this help me avoid AI detectors?

**A:** The primary goal is improving writing quality and authenticity. As a side effect, natural writing is less likely to trigger AI detection, but that's not the main purpose. We focus on teaching you *why* text sounds AI-generated and *how* to fix it—not on "gaming" detection systems.

---

### Q: Can I use this for my dissertation/thesis?

**A:** Yes, if you're using AI to draft text expressing *your own original research and ideas*. Many scholars now use AI as a writing assistant. The key is that the intellectual contribution must be yours.

**Appropriate scenario:**
- You conducted research, developed arguments, and have clear ideas
- You used AI to help draft text expressing those ideas
- You're now improving the naturalness of that draft
- ✅ This is ethical use of AI assistance

**Inappropriate scenario:**
- You asked AI to generate ideas, arguments, or "research" you didn't actually conduct
- You're trying to disguise work that isn't your intellectual contribution
- ❌ This is academic misconduct

---

### Q: What if I'm not in social sciences?

**A:** The core principles apply across fields:
- Varying sentence rhythm
- Removing mechanical transitions
- Adding specificity over abstraction
- Natural citation integration

Discipline-specific guidance currently focuses on social sciences, but contributions for other fields are welcome! The detection and rewriting strategies work for any academic writing.

---

### Q: Do the scripts require internet connection?

**A:** No. All analysis runs locally using Python's standard library. There are:
- No API calls
- No data sent anywhere
- No external dependencies
- Complete privacy for your work

---

### Q: Can I use this for languages other than English?

**A:** Currently optimized for English academic writing. The principles (sentence variation, specificity, natural flow) may transfer to other languages, but:
- Detection patterns are English-specific
- Examples are in English
- Transition word lists are English-based

Contributions for other languages would be valuable additions to the project!

---

### Q: How does this compare to commercial AI detection tools (like GPTZero, Turnitin)?

**A:** This tool serves a different purpose:

**Commercial detectors:**
- Tell you "this is probably AI-written" (yes/no)
- Black box scoring
- Don't teach you anything

**This tool:**
- Shows you *why* text sounds AI-generated
- Teaches you *how* to fix it
- Helps you develop better writing skills
- Focuses on learning and improvement, not just detection

Think of it as a writing coach rather than a detector.

---

## Technical Questions

### Q: Why Python 3.7+? Can I use an older version?

**A:** Python 3.7 is required for features like:
- `statistics.stdev()` behavior
- String formatting methods
- File encoding handling (especially important for Windows)

Most systems from 2018+ have Python 3.7 or higher. If you're on an older system, upgrading Python is recommended for security and compatibility.

---

### Q: Can I integrate this into my own tools/workflows?

**A:** Yes! MIT License allows:
- ✅ Use in commercial projects
- ✅ Modification and redistribution
- ✅ Integration into other tools
- ✅ Use in closed-source projects

Just include the copyright notice from the LICENSE file.

---

### Q: The detector says my human-written text is "AI-like." What gives?

**A:** The detector identifies *patterns common in AI writing*, which can also appear in:
- Template-heavy academic prose
- Overly formal writing
- Text with repetitive structures

If your human-written text triggers warnings, that's actually useful feedback—it means your writing has patterns that make it less engaging. The rewriting strategies will help improve it!

---

### Q: Can I use this with AI models other than ChatGPT?

**A:** Absolutely! The patterns apply to text from:
- ChatGPT (all versions)
- Claude
- Gemini
- DeepSeek
- Any other LLM

AI writing patterns are fairly consistent across models because they stem from how transformers generate text (statistical next-token prediction).

---

## Usage Questions

### Q: How long does it take to humanize a paper?

**A:** Depends on length and AI detection level:
- **Abstract (150-250 words):** 10-15 minutes
- **Section (1000 words):** 30-45 minutes
- **Full paper (6000-8000 words):** 2-4 hours

With practice, you'll get faster as you internalize the patterns.

---

### Q: Should I humanize everything or just problem areas?

**A:** Run the detector first, then prioritize:
1. **High concern areas** (red flags) - Address these first
2. **Moderate concern areas** (yellow flags) - Fix if time permits
3. **Low concern areas** (green) - These are fine, focus elsewhere

Focus on the most AI-sounding sections for efficient improvement.

---

### Q: Can I use Cursor AI to help with the rewriting itself?

**A:** Yes! That's the intended workflow:
1. Run detector scripts to identify issues
2. Ask Cursor: *"Can you help humanize this paragraph using the humanize-academic-writing skill?"*
3. Cursor applies the rewriting strategies automatically
4. You review and refine

The skill guides Cursor to apply the principles correctly.

---

### Q: Do I need to cite this tool in my paper?

**A:** Not in the paper itself. This is a writing improvement tool (like Grammarly or a writing center).

**Do cite if:**
- You're writing *about* this tool in a methods paper
- You're discussing AI writing tools in your research

**Software citation format available in main README**

---

## Ethical Questions

### Q: Is it ethical to use AI for academic writing at all?

**A:** The academic community is still developing consensus, but general principles:

**Increasingly accepted:**
- AI as writing assistant (like a more advanced grammar checker)
- Improving clarity of your own ideas
- Non-native speakers getting language help

**Generally unacceptable:**
- AI generating ideas you don't have
- AI creating "research" you didn't conduct
- Hiding AI use when your institution requires disclosure

**Best practice:** Check your institution's AI policy and err on the side of transparency.

---

### Q: Should I disclose AI use to journals/advisors?

**A:** Follow your institution/journal policies:
- Many journals now require AI disclosure statements
- Some advisors want to know; others don't mind as long as ideas are yours
- Transparency is generally the safest approach

**Sample disclosure:**
> "AI tools were used to assist with drafting and improving the clarity of the manuscript. All ideas, arguments, and interpretations represent the author's original intellectual contribution."

---

### Q: What's the difference between "editing" and "misconduct"?

**A:** A helpful framework:

**Acceptable editing:**
- Fixing grammar/clarity
- Improving sentence flow
- Making your ideas clearer
- Getting language help as non-native speaker

**Misconduct:**
- Having someone/AI write arguments you don't understand
- Presenting AI-generated ideas as your own thoughts
- Fabricating research you didn't do

**The test:** Can you explain and defend every claim in your paper? If yes, you're fine. If no, that's a problem.

---

## Troubleshooting

### Q: The detector script gives an error. What should I do?

**Common issues:**

**UnicodeEncodeError on Windows:**
- Already fixed in latest version
- Update your copy from GitHub

**"File not found":**
- Check file path is correct
- Use quotes around paths with spaces: `"my file.txt"`

**Import errors:**
- Verify Python 3.7+: `python --version`
- No external dependencies needed

---

### Q: The Cursor skill isn't activating. Help?

**Checklist:**
1. File is named `SKILL.md` (case-sensitive)
2. Located in `~/.cursor/skills/humanize-academic-writing/SKILL.md`
3. You restarted Cursor after installation
4. Try explicitly mentioning it: *"Use the humanize-academic-writing skill"*

---

### Q: Results aren't good enough. What am I doing wrong?

**Common issues:**

**Not addressing root patterns:**
- Don't just remove "Moreover"—vary the whole sentence structure
- Don't just add citations—integrate them naturally

**Not enough specificity:**
- Replace abstractions with concrete concepts
- Ground claims in specific literature/examples

**Still too uniform:**
- Mix short punchy sentences with longer analytical ones
- Vary paragraph openings and transitions

Review `docs/rewriting-principles.md` for deeper guidance.

---

## Contributing

### Q: How can I contribute?

**Ways to help:**
- Add discipline-specific examples (economics, geography, communication)
- Improve detection algorithms
- Translate to other languages
- Share your before/after examples
- Report bugs or suggest features

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

### Q: I found a bug. Where do I report it?

**Report on GitHub Issues:**
- [github.com/momo2young/humanize-academic-writing/issues](https://github.com/momo2young/humanize-academic-writing/issues)

**Include:**
- What you were trying to do
- What happened vs. what you expected
- Error messages (if any)
- Your Python version and OS

---

## Still have questions?

- **GitHub Issues:** [github.com/momo2young/humanize-academic-writing/issues](https://github.com/momo2young/humanize-academic-writing/issues)
- **Email:** pgallerymoon@gmail.com

We're here to help! 🎓
