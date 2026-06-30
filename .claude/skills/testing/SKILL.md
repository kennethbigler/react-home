---
name: testing
description: >-
  Test generation standards and verification requirements for this repo. Use
  whenever writing, generating, or reviewing tests, or before declaring code
  complete to confirm tests and verification pass.
---

The authoritative content for this skill lives in the shared Cursor rule so that
Claude Code and Cursor stay in sync from a single source. Read it now:

@../../../.cursor/rules/testing.mdc

Follow the guidance in that file. Ignore its `globs` / `alwaysApply` frontmatter
keys — they are Cursor-specific and do not apply here.

NOTE: In Cursor this rule is `alwaysApply: true` (always in context). As a Claude
Code skill it is loaded on demand instead. If you want it always available in
Claude Code, move its content into CLAUDE.md.
