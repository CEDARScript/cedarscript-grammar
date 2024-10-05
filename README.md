# CEDARScript (Concise Examination, Development, And Refactoring Script)

## A SQL-like language for code analysis and transformations

CEDARScript is a SQL-like language designed to concisely express code manipulations
and help LLMs examine and understand codebases.

It can improve how AI coding assistants interact with codebases and communicate their code modification intentions.

Expressing code changes in CEDARScript can significantly reduce token usage when an LLM code assistant wants to change the code base in response to a user request.
This efficiency allows for more complex operations within token limits.

Its aim is to facilitate code analysis, manipulation, and refactoring tasks. It provides a standardized way to express complex code modification and analysis operations, making it easier for AI-assisted development tools to understand and execute these tasks.
With CEDARScript, AI assistants could evolve from error-prone search/replace operations to more reliable coding partners, understanding and transforming code at the semantic level.

## Key Features:

- Reduced token usage via semantic-level code transformations, not character-by-character matching;
- Scalable to larger codebases with minimal token usage; 
- Avoid wasted time and tokens on failed search/replace operations caused by misplaced spaces or typos; 
- SQL-like syntax for intuitive code querying and manipulation; 
- High-level abstractions for complex refactoring operations; 
- Perform project-wide refactorings with a single, concise command 
- Language-agnostic design for versatile code analysis 
- CEDARScript read operations return results in XML format for easier parsing and processing by LLM systems.

## Features

- SQL-like syntax for code manipulation                                                                                                                              
- Support for creating, updating, and deleting files                                                                                                                 
- Ability to select and modify specific parts of code                                                                                                                
- Relative indentation for maintaining proper code structure

## Usage

CEDARScript can be used to:

1. Create new files                                                                                                                                                  
2. Update existing code                                                                                                                                              
3. Delete code or entire files                                                                                                                                       
4. Move code within or between files                                                                                                                                 
5. Select and examine parts of the codebase

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
