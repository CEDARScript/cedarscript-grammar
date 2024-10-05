# CEDARScript (Concise Examination, Development, And Refactoring Script)

## A SQL-like language for code analysis and transformations

CEDARScript is a SQL-like language designed to concisely express:
1. **Code manipulations and refactorings** (if you know what you want to change in your code);
2. **Queries** to quickly get to know a large code base without having to read all contents of all files.

It can be used to improve how AI coding assistants interact with codebases, learn about your code and communicate their code modification intentions while keeping token usage _low_.
This efficiency allows for more complex operations within token limits.

It provides a standardized way to express complex code modification and analysis operations, making it easier for AI-assisted development tools to understand and execute these tasks.

## Key Features:

- SQL-like syntax for intuitive code querying and manipulation; 
- Language-agnostic design for versatile code analysis;
- Reduced token usage via semantic-level code transformations, not character-by-character matching;
- Scalable to larger codebases with minimal token usage;
- Perform project-wide refactorings with a single, concise command;
- Avoid wasted time and tokens on failed search/replace operations caused by misplaced spaces, indentation or other typos; 
- Relative indentation for more easily maintaining proper code structure;
- Ability to get or modify targeted parts of code;
- High-level abstractions for complex refactoring operations via refactoring languages (currently supports Rope syntax);
- Query operations return results in XML format for easier parsing and processing by LLM systems.

## Usage

CEDARScript can be used to:

1. Create new files;
2. Update existing code;
3. Delete parts of code or entire files;
4. Move code within or between files in a single command;
5. Select and examine parts of the codebase;

## Examples

Quick example:

```sql
UPDATE FUNCTION
  FROM FILE "functional.py"
  WHERE NAME = "_conform_to_reference_input"
MOVE WHOLE
INSERT BEFORE LINE "def get_config(self):"
  RELATIVE INDENTATION 0;
```

There are [many more examples](test/corpus) to look at...
