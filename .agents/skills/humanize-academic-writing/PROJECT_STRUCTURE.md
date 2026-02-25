# Project Structure

```
humanize-academic-writing/
│
├── README.md                          # Main project documentation
├── QUICKSTART.md                      # 5-minute getting started guide
├── LICENSE                            # MIT License
├── CONTRIBUTING.md                    # Contribution guidelines
├── .gitignore                         # Git ignore rules
├── SKILL.md                           # Core Cursor skill file
│
├── docs/                              # Detailed documentation
│   ├── rewriting-principles.md        # 10 detailed rewriting strategies
│   ├── examples.md                    # 8+ before/after transformations
│   └── social-science-patterns.md     # Discipline-specific guidance
│
├── scripts/                           # Analysis tools
│   ├── ai_detector.py                 # Detect AI writing patterns
│   ├── text_analyzer.py               # Analyze text quality metrics
│   └── requirements.txt               # Python dependencies (none!)
│
└── tests/                             # Sample files
    ├── sample_ai_text.txt             # Example AI-generated text
    └── sample_humanized_text.txt      # Example humanized version
```

## File Descriptions

### Root Level

**README.md** (417 lines)
- Comprehensive project documentation
- Installation instructions
- Usage guide
- FAQ
- Examples
- Academic integrity statement

**SKILL.md** (450+ lines)
- Core skill file used by Cursor AI
- Workflow and strategies
- Step-by-step rewriting process
- Integration with scripts
- Discipline-specific notes

**QUICKSTART.md** (200+ lines)
- Fast 5-minute setup
- First test instructions
- Common use cases
- Troubleshooting tips

**LICENSE**
- MIT License
- Free to use and modify

**CONTRIBUTING.md** (150+ lines)
- How to contribute
- Code of conduct
- Pull request process
- Academic integrity guidelines

**.gitignore**
- Excludes Python cache
- Excludes user data files
- Excludes temporary files

### Documentation (`docs/`)

**rewriting-principles.md** (700+ lines)
- 10 detailed rewriting strategies
- Detection methods for each pattern
- Fix strategies with examples
- Discipline-specific notes
- Transformation checklist

**examples.md** (270+ lines)
- 8 complete before/after examples:
  - Introduction paragraphs
  - Literature reviews
  - Methods sections
  - Findings sections
  - Discussion sections
  - Abstracts
  - Conclusions
  - Citation-heavy paragraphs
- Detailed rationales for each change

**social-science-patterns.md** (400+ lines)
- 5 discipline-specific guides:
  - Sociology
  - Anthropology
  - Political Science
  - Education
  - Psychology
- Non-native speaker considerations
- Common mistakes by discipline
- Citation style differences

### Scripts (`scripts/`)

**ai_detector.py** (450+ lines)
- Detects 6 AI patterns:
  1. Sentence uniformity
  2. Mechanical transitions
  3. Abstract language
  4. Vocabulary diversity
  5. Passive voice overuse
  6. Paragraph patterns
- Provides AI probability score
- Detailed or JSON output
- No external dependencies

**text_analyzer.py** (380+ lines)
- Analyzes text quality:
  - Sentence length stats
  - Vocabulary richness (TTR)
  - Academic word usage
  - Transition word density
  - Passive voice percentage
  - Readability metrics
- Compare two texts mode
- No external dependencies

**requirements.txt**
- Currently: No dependencies!
- Uses Python standard library only
- Optional enhancements listed as comments

### Tests (`tests/`)

**sample_ai_text.txt**
- Example AI-generated academic text
- Shows all common AI patterns
- Use for testing detector

**sample_humanized_text.txt**
- Humanized version of sample
- Shows proper academic style
- Use for comparison testing

## Key Features by Component

### SKILL.md
✅ Cursor AI automatically detects when to use
✅ Strategy-based rewriting approach
✅ Explains rationale for each change
✅ Discipline-aware guidance

### ai_detector.py
✅ 6 pattern detection algorithms
✅ Overall AI probability score
✅ Detailed fix recommendations
✅ Works with any text length

### text_analyzer.py
✅ Quantitative quality metrics
✅ Before/after comparison mode
✅ Visual indicators in reports
✅ Academic vocabulary analysis

### Documentation
✅ 1,370+ lines of detailed guidance
✅ 8+ complete transformation examples
✅ 5 discipline-specific guides
✅ Non-native speaker support

## Usage Modes

### Mode 1: Cursor Integration
1. Copy to `~/.cursor/skills/`
2. Restart Cursor
3. Ask: "Humanize this academic writing"
4. AI applies skill automatically

### Mode 2: Standalone Scripts
1. Detect patterns: `python scripts/ai_detector.py text.txt`
2. Analyze quality: `python scripts/text_analyzer.py text.txt`
3. Compare versions: `python scripts/text_analyzer.py before.txt after.txt --compare`

### Mode 3: Learning Tool
1. Study examples in `docs/examples.md`
2. Understand patterns in `docs/rewriting-principles.md`
3. Apply principles manually
4. Verify with scripts

## Target Users

1. **Social science researchers** (sociology, anthropology, political science, education, psychology)
2. **Non-native English speakers** using AI to draft papers
3. **Students and academics** improving AI-assisted writing
4. **Writing instructors** teaching academic writing patterns

## Ethical Framework

✅ **Appropriate**: Improving your own ideas drafted with AI
✅ **Appropriate**: Learning better academic writing
✅ **Appropriate**: Non-native speakers improving naturalness
❌ **Inappropriate**: Disguising plagiarism
❌ **Inappropriate**: Fabricating research
❌ **Inappropriate**: Avoiding detection for dishonest reasons

## Statistics

- **Total Documentation**: ~1,370 lines
- **Code**: ~830 lines (Python)
- **Examples**: 8+ complete transformations
- **Disciplines Covered**: 5
- **AI Patterns Detected**: 6
- **Text Metrics Analyzed**: 10+
- **External Dependencies**: 0

## Getting Started

**Fastest path (1 minute):**
```bash
python scripts/ai_detector.py tests/sample_ai_text.txt --detailed
```

**Full setup (5 minutes):**
See [QUICKSTART.md](QUICKSTART.md)

**Deep dive:**
Read [SKILL.md](SKILL.md) and [docs/rewriting-principles.md](docs/rewriting-principles.md)

## Next Steps for Development

Potential enhancements:
1. More discipline examples (economics, geography, communication)
2. Non-English language support
3. GUI interface
4. VS Code extension
5. Web demo
6. Training materials/workshops

## License

MIT License - Free to use, modify, and distribute.

## Questions?

- Read the [README.md](README.md)
- Check [QUICKSTART.md](QUICKSTART.md)
- Open GitHub issue
- Contribute improvements

---

**Ready to use?** Start with the quickstart guide or try the sample detection!
