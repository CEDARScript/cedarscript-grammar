# Onboarding Capabilities

This capability is designed to help developers, AI assistants, and other tools quickly gain a comprehensive understanding
of a project's structure, conventions, and context.

## Key Onboarding Features

1. **Convention Discovery**:
   CEDARScript can automatically extract coding conventions from designated files like `CONVENTIONS.md`:

   ```sql
   SELECT CONVENTIONS
   FROM ONBOARDING;
   ```

2. **Context Retrieval**:
   Quickly access project context from files like `.context.md` or `.contextdocs.md`:

   ```sql
   SELECT CONTEXT
   FROM ONBOARDING;
   ```

3. **Comprehensive Project Overview**:
   Gather all essential project information in one query:

   ```sql
   SELECT *
   FROM ONBOARDING;
   ```
µ