---
name: self-improvement
description: >-
  Guidelines for continuously improving Cursor/Claude rules based on emerging
  code patterns and best practices. Use when noticing repeated patterns not yet
  captured by a rule, or when adding to / refining the rules in .cursor/rules.
---

The authoritative content for this skill lives in the shared Cursor rule so that
Claude Code and Cursor stay in sync from a single source. Read it now:

@../../../.cursor/rules/self-improvement.mdc

Follow the guidance in that file. Ignore its `globs` / `alwaysApply` frontmatter
keys — they are Cursor-specific and do not apply here.

NOTE: In Cursor this rule is `alwaysApply: true` (always in context). As a Claude
Code skill it is loaded on demand instead. If you want it always available in
Claude Code, move its content into CLAUDE.md.
