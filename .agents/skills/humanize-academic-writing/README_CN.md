# 🎓 Humanize Academic Writing - 学术写作人性化工具

[🇬🇧 English](README.md) | [🇨🇳 中文](README_CN.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.7+](https://img.shields.io/badge/python-3.7+-blue.svg)](https://www.python.org/downloads/)

一个专为社科学者设计的 AI 技能（支持 Cursor 和 Claude Code），帮助将 AI 生成的**英文**学术文本转化为自然、人性化的学术写作。

**特别适合：** 非英语母语的社科研究者（社会学、人类学、政治学、教育学、心理学、传播学）

> **📝 说明**：本工具帮助改进AI生成的**英文**学术文本。中文文档用中文讲解原则和策略，但所有改写示例保持英文，因为目标是帮助非英语母语者撰写自然的英文学术论文。

---

## ⚡ 快速开始

**安装为 Cursor 技能：**
```bash
# 克隆仓库
git clone https://github.com/momo2young/humanize-academic-writing.git

# 复制到 Cursor 技能目录（Windows）
xcopy humanize-academic-writing %USERPROFILE%\.cursor\skills\ /E /I

# 或者 macOS/Linux
cp -r humanize-academic-writing ~/.cursor/skills/
```

**安装为 Claude Code 技能：**
```bash
# 复制到 Claude Code 技能目录（Windows）
xcopy humanize-academic-writing %USERPROFILE%\.claude\skills\ /E /I

# 或者 macOS/Linux
cp -r humanize-academic-writing ~/.claude/skills/
```

**直接使用脚本：**
```bash
# 检测 AI 模式
python scripts/ai_detector.py your_draft.txt --detailed

# 分析文本质量
python scripts/text_analyzer.py your_draft.txt
```

**在 Cursor 或 Claude Code 中使用：**
1. 安装后重启
2. 选中你的 AI 生成文本
3. 问 AI：*"帮我人性化这段学术写作"*
4. 或直接调用：`/humanize-academic-writing`

---

## 🎯 功能介绍

### ✅ 转换 AI 写作模式
- **检测：** 重复结构、机械过渡词、抽象语言
- **改写：** 使用真实的学术语调和自然流畅性
- **解释：** 什么让文本听起来像 AI 生成 vs. 人类写作

### 🎓 目标用户
- 社科研究者（社会学、人类学、政治学、教育学、心理学）
- 非英语母语者
- 任何使用 AI 起草基于自己研究的论文的人

### ⚖️ 学术诚信

**目的：** 提高通过 AI 写作工具表达的**你自己想法**的自然度。

✅ **适当使用：** 修改*你自己研究和论点*的 AI 草稿  
❌ **不当使用：** 生成你没有的想法或掩盖抄袭

**原则：** 目标是真实的交流，而非欺骗。

---

## 📖 转换示例

**改写前（AI生成）：**
> Social media has become an important aspect of modern communication. Moreover, it has various effects on society. Additionally, researchers have studied this phenomenon extensively...

**改写后（人性化）：**
> Social media platforms have fundamentally reshaped how individuals communicate, mobilize, and access information. While scholars extensively document these transformations (boyd 2014; van Dijck 2013), debates persist about their democratic implications—particularly regarding echo chambers and polarization (Sunstein 2017).

**改动说明：**
- ❌ 删除机械过渡词（Moreover, Additionally）
- ❌ 用具体概念替换抽象表达（"various effects"）
- ✅ 添加具体引用和学术语调
- ✅ 变化句子节奏

---

## 🌟 主要特点

1. **AI 模式检测** - 自动识别 6+ 种 AI 写作标记
2. **零依赖** - 仅使用 Python 标准库
3. **完全本地** - 不发送数据到任何地方，完全隐私
4. **学科专属** - 为 5 个社科学科量身定制指导
5. **丰富文档** - 1370+ 行原则、示例和策略
6. **开源** - MIT 协议，免费使用和修改

---

## 📚 文档

### 中文文档
- **[QUICKSTART_CN.md](QUICKSTART_CN.md)** - 5分钟快速上手指南
- **[FAQ_CN.md](FAQ_CN.md)** - 常见问题
- **[docs/rewriting-principles_CN.md](docs/rewriting-principles_CN.md)** - 10种详细改写策略
- **[docs/examples_CN.md](docs/examples_CN.md)** - 8+个完整前后对比示例
- **[docs/social-science-patterns_CN.md](docs/social-science-patterns_CN.md)** - 学科特定指导

### English Documentation
- **[README.md](README.md)** - Full project documentation (English)
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide
- **[SKILL.md](SKILL.md)** - 核心技能文件（Cursor 和 Claude Code 通用）
- **[FAQ.md](FAQ.md)** - Frequently asked questions
- **[docs/rewriting-principles.md](docs/rewriting-principles.md)** - Detailed principles
- **[docs/examples.md](docs/examples.md)** - Complete examples
- **[docs/social-science-patterns.md](docs/social-science-patterns.md)** - Discipline guidance

### 其他资源
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - 完整项目结构
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - 贡献指南

---

## 🌍 非英语母语者指南

本技能专门解决非母语者在 AI 辅助写作中面临的挑战：

### 我们修复的常见 AI 依赖
- 过度依赖正式过渡词（Moreover, Furthermore）
- 抽象占位短语（"in terms of," "various aspects"）
- 机械句子模式（全是主谓宾结构）

### 我们保留你的优势
- 清晰的逻辑结构
- 正式的学术语域
- 精确的术语使用

详见 [docs/social-science-patterns_CN.md](docs/social-science-patterns_CN.md)

---

## 🤝 贡献

欢迎贡献！特别需要：
- 更多学科示例（经济学、地理学、传播学）
- 改进检测算法
- 来自其他语言背景的示例

详见 [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📄 许可证

MIT License - 可自由使用、修改和分发。详见 [LICENSE](LICENSE)

---

## 📖 引用本项目

如果你在研究中使用了本技能或觉得它有帮助，请考虑引用：

```bibtex
@software{humanize_academic_writing,
  author = {MomoYOUNG},
  title = {Humanize Academic Writing: An AI Skill for Social Scientists},
  year = {2025},
  url = {https://github.com/momo2young/humanize-academic-writing}
}
```

---

## 🙏 致谢

- 灵感来自非英语母语者在学术出版中面临的挑战
- 基于写作中心教学法和写作研究的原则
- 借鉴了 *They Say / I Say* 和 *The Craft of Research* 等风格指南

---

## 📧 联系方式

- **GitHub Issues：** [github.com/momo2young/humanize-academic-writing/issues](https://github.com/momo2young/humanize-academic-writing/issues)
- **邮箱：** pgallerymoon@gmail.com

---

## ⭐ 如果有帮助，请给个 Star！

如果这个工具对你的研究有帮助，请给仓库加星以帮助更多人发现它！

---

**记住：** 请负责任地使用AI工具。它们应该帮助你更清晰地表达想法，而不是取代你的创作能力。
