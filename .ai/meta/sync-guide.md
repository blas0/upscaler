# Documentation Sync Guide

How documentation is organized for Claude Code.

## Overview

This project maintains documentation with **two sources of truth**:

1. **`.ai/`** - Static documentation (architecture, patterns, workflows)
2. **`.claude/memory/`** - Dynamic memory (context, decisions, sessions)

Claude Code reads `CLAUDE.md` which routes to these sources. Hooks automatically load memory context at session start.

## Where to Make Changes

**For version numbers** (frameworks, languages, packages):
1. Update `.ai/core/technology-stack.md` (single source of truth)
2. Never duplicate version numbers elsewhere

**For workflow changes** (commands, setup):
1. Update `.ai/development/development-workflow.md`
2. Verify all cross-references work

**For architectural patterns** (how code should be structured):
1. Update appropriate file in `.ai/core/`
2. Add cross-references from related docs

**For code patterns** (how to write code):
1. Update appropriate file in `.ai/patterns/`
2. Add examples from real codebase

## Update Checklist

When making significant changes:

- [ ] Update primary location in `.ai/` directory
- [ ] Verify CLAUDE.md references are still accurate
- [ ] Update cross-references in related `.ai/` files
- [ ] Test links in markdown files

## File Organization

```
/
├── CLAUDE.md                          # Claude Code entry point
├── .ai/                               # Static documentation
│   ├── README.md
│   ├── core/
│   ├── development/
│   ├── patterns/
│   └── meta/
└── .claude/memory/                    # Dynamic memory
    ├── context.md
    ├── decisions.md
    └── sessions/
```

---

**Golden Rule**: Each piece of information exists in ONE location in `.ai/`. Entry points route to `.ai/`.
