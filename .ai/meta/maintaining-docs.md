# Maintaining Documentation

Guidelines for creating and maintaining AI documentation.

## Documentation Structure

All AI documentation lives in the `.ai/` directory:

```
.ai/
├── README.md                    # Navigation hub
├── core/                        # Core project information
├── development/                 # Development practices
├── patterns/                    # Code patterns and best practices
└── meta/                        # Documentation maintenance guides
```

## Content Guidelines

### DO:
- Start with high-level overview
- Include specific, actionable requirements
- Show examples of correct implementation
- Reference existing code when possible
- Keep documentation DRY by cross-referencing
- Use bullet points for clarity

### DON'T:
- Create theoretical examples when real code exists
- Duplicate content across multiple files
- Make assumptions about versions - specify exact versions
- Create documentation for obvious functionality

## When to Update Documentation

### Add New Documentation When:
- A new technology/pattern is used in 3+ files
- Common bugs could be prevented by documentation
- Code reviews repeatedly mention the same feedback

### Modify Existing Documentation When:
- Better examples exist in the codebase
- Additional edge cases are discovered
- Implementation details have changed

## Single Source of Truth

- Each piece of information should exist in exactly ONE location
- Other files should reference the source, not duplicate it
- Version numbers live ONLY in `core/technology-stack.md`

## How Claude Code Uses This

Claude Code reads `CLAUDE.md` at session start, which routes to `.ai/` for documentation. The hooks system automatically loads `.claude/memory/context.md` to restore session state.

---

See [sync-guide.md](sync-guide.md) for synchronization rules.
