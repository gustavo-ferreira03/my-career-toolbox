# Humanize Academic Writing

[🇬🇧 English](README.md) | [🇨🇳 中文](README_CN.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.7+](https://img.shields.io/badge/python-3.7+-blue.svg)](https://www.python.org/downloads/)

An AI skill for Cursor and Claude Code that transforms AI-generated academic text into natural, human-like scholarly writing—specifically designed for social science researchers and non-native English speakers.

---

## ⚡ Quick Start

**Install as Cursor Skill:**
```bash
# Clone the repository
git clone https://github.com/momo2young/humanize-academic-writing.git

# Copy to Cursor skills directory (Windows)
xcopy humanize-academic-writing %USERPROFILE%\.cursor\skills\ /E /I

# Or for macOS/Linux
cp -r humanize-academic-writing ~/.cursor/skills/
```

**Install as Claude Code Skill:**
```bash
# Copy to Claude Code skills directory (Windows)
xcopy humanize-academic-writing %USERPROFILE%\.claude\skills\ /E /I

# Or for macOS/Linux
cp -r humanize-academic-writing ~/.claude/skills/
```

**Use the scripts directly:**
```bash
# Detect AI patterns
python scripts/ai_detector.py your_draft.txt --detailed

# Analyze text quality
python scripts/text_analyzer.py your_draft.txt
```

**In Cursor IDE or Claude Code:**
1. Restart after installation
2. Select your AI-generated text
3. Ask: *"Can you help humanize this academic writing?"*
4. Or invoke directly: `/humanize-academic-writing`

---

## 🎯 What This Does

### ✅ Transforms AI Writing Patterns
- **Detects:** Repetitive structures, mechanical transitions, abstract language
- **Rewrites:** With authentic scholarly voice and natural flow
- **Explains:** What makes text sound AI-generated vs. human-written

### 🎓 Target Audience
- Social science researchers (sociology, anthropology, political science, education, psychology, communication study)
- Non-native English speakers
- Anyone using AI to draft papers based on their own research

### ⚖️ Academic Integrity

**Purpose:** Improve the naturalness of **your own ideas** expressed through AI writing tools.

✅ **Appropriate:** Revising AI drafts of *your own research and arguments*  
❌ **Inappropriate:** Generating ideas you don't have or disguising plagiarism

**Principle:** The goal is authentic communication, not deception.

---

## 📖 Example Transformation

**Before (AI-generated):**
> Social media has become an important aspect of modern communication. Moreover, it has various effects on society. Additionally, researchers have studied this phenomenon extensively...

**After (Humanized):**
> Social media platforms have fundamentally reshaped how individuals communicate, mobilize, and access information. While scholars extensively document these transformations (boyd 2014; van Dijck 2013), debates persist about their democratic implications—particularly regarding echo chambers and polarization (Sunstein 2017).

**What Changed:**
- ❌ Removed mechanical transitions (Moreover, Additionally)
- ❌ Replaced abstractions ("various effects") with specific concepts
- ✅ Added concrete citations and scholarly voice
- ✅ Varied sentence rhythm

---

## 🌟 Key Features

1. **AI Pattern Detection** - Automatically identifies 6+ AI writing markers
2. **Zero Dependencies** - Uses only Python standard library
3. **Completely Local** - No data sent anywhere, full privacy
4. **Discipline-Specific** - Tailored guidance for 5 social science fields
5. **Rich Documentation** - 1370+ lines of principles, examples, and strategies
6. **Open Source** - MIT License, free to use and modify

---

## 📚 Documentation

### English
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute getting started guide
- **[SKILL.md](SKILL.md)** - Core skill file (works with both Cursor and Claude Code)
- **[FAQ.md](FAQ.md)** - Frequently asked questions
- **[docs/rewriting-principles.md](docs/rewriting-principles.md)** - 10 detailed rewriting strategies
- **[docs/examples.md](docs/examples.md)** - 8+ complete before/after examples
- **[docs/social-science-patterns.md](docs/social-science-patterns.md)** - Discipline-specific conventions

### 中文
- **[README_CN.md](README_CN.md)** - 中文版项目文档
- **[QUICKSTART_CN.md](QUICKSTART_CN.md)** - 快速开始指南
- **[FAQ_CN.md](FAQ_CN.md)** - 常见问题
- **[docs/rewriting-principles_CN.md](docs/rewriting-principles_CN.md)** - 改写原则详解
- **[docs/examples_CN.md](docs/examples_CN.md)** - 完整改写示例
- **[docs/social-science-patterns_CN.md](docs/social-science-patterns_CN.md)** - 学科特定指导

### Additional Resources
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Complete project layout
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

---

## 🌍 For Non-Native English Speakers

This skill specifically addresses challenges non-native speakers face with AI-assisted writing:

### Common AI Crutches We Fix
- Over-reliance on formal transitions (Moreover, Furthermore)
- Abstract placeholder phrases ("in terms of," "various aspects")
- Mechanical sentence patterns (all Subject-Verb-Object)

### Your Strengths We Preserve
- Clear logical structure
- Formal academic register
- Precise terminology usage

See [docs/social-science-patterns.md](docs/social-science-patterns.md) for detailed guidance.

---

## 🤝 Contributing

Contributions welcome! Areas where help is especially needed:
- Additional disciplines (economics, geography, communication studies)
- Enhanced detection algorithms
- Examples from other language backgrounds

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

MIT License - Free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

## 📖 Citation

If you use this skill in your research or find it helpful, please consider citing:

```bibtex
@software{humanize_academic_writing,
  author = {MomoYOUNG},
  title = {Humanize Academic Writing: An AI Skill for Social Scientists},
  year = {2025},
  url = {https://github.com/momo2young/humanize-academic-writing}
}
```

---

## 🙏 Acknowledgments

- Inspired by challenges non-native English speakers face in academic publishing
- Informed by writing center pedagogy and composition studies
- Built on principles from *They Say / I Say* and *The Craft of Research*

---

## 📧 Contact

- **GitHub Issues:** [github.com/momo2young/humanize-academic-writing/issues](https://github.com/momo2young/humanize-academic-writing/issues)
- **Email:** pgallerymoon@gmail.com

---

## ⭐ Star This Repository

If this tool helps your research, please star the repository to help others discover it!

---

**Remember:** Use AI tools responsibly. They should help you communicate your ideas more clearly, not replace your intellectual contribution.
