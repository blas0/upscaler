# Project Documentation

This directory contains all AI-related documentation for the project.

## Two Sources of Truth

1. **`.ai/`** - Static documentation (architecture, patterns, workflows)
2. **`.claude/memory/`** - Dynamic memory (context, decisions, sessions)

## Quick Start

### For Claude Code

Start with [CLAUDE.md](../CLAUDE.md) in the project root. Claude Code's hooks automatically load context from `.claude/memory/` at session start, then reference this `.ai/` directory for detailed documentation.

## Documentation Structure

```
.ai/
├── README.md                    # This file - Navigation hub
├── core/                        # Core project information
│   ├── technology-stack.md      # Version numbers (SINGLE SOURCE)
│   ├── project-overview.md      # What this project is
│   ├── application-architecture.md
│   └── deployment-architecture.md
├── development/                 # Development practices
│   ├── development-workflow.md
│   └── testing-patterns.md
├── patterns/                    # Code patterns
│   ├── database-patterns.md
│   ├── frontend-patterns.md
│   ├── security-patterns.md
│   └── api-and-routing.md
└── meta/                        # Documentation guides
    ├── maintaining-docs.md
    └── sync-guide.md
```

## Navigation

### Core Documentation
- [Technology Stack](core/technology-stack.md) - All versions and dependencies
- [Project Overview](core/project-overview.md) - Project description
- [Application Architecture](core/application-architecture.md) - System design
- [Deployment Architecture](core/deployment-architecture.md) - Deployment details

### Development
- [Development Workflow](development/development-workflow.md) - Setup and workflows
- [Testing Patterns](development/testing-patterns.md) - Testing strategies

### Patterns
- [Database Patterns](patterns/database-patterns.md) - Database implementation
- [Frontend Patterns](patterns/frontend-patterns.md) - Frontend development
- [Security Patterns](patterns/security-patterns.md) - Security guidelines
- [API & Routing](patterns/api-and-routing.md) - API design

### Meta
- [Maintaining Docs](meta/maintaining-docs.md) - Documentation maintenance
- [Sync Guide](meta/sync-guide.md) - Synchronization guidelines

---

**Remember**: Each piece of information exists in ONE location. Use cross-references, never duplicate.
