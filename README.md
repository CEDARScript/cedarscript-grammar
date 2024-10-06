# CEDARScript (Concise Examination, Development, And Refactoring Script)

## A SQL-like language for code analysis and transformations

CEDARScript is a SQL-like language designed to concisely:
1. **Express code manipulations and refactorings** (if you know what you want to change in your code);
  - The CEDARScript runtime can edit any file in the code base according to the commands it reads
3. **Perform code analysis** to quickly get to know a large code base without having to read all contents of all files.
  - The CEDARScript runtime searches through the whole code base and only returns the desired results

## Usage

CEDARScript can be used to improve how AI coding assistants interact with codebases, learn about your code, and communicate their code modification intentions while keeping token usage _low_.
This efficiency allows for more complex operations within token limits.

It provides a standardized way to express complex code modification and analysis operations, making it easier for AI-assisted development tools to understand and execute these tasks.

## Key Features:

- **SQL-like syntax** for intuitive code querying and manipulation;
- **Reduced token usage** via semantic-level code transformations, not character-by-character matching;
  - **Scalable to larger codebases** with minimal token usage;
  - **Project-wide refactorings** can be performed with a single, concise command
  - Avoids wasted time and tokens on failed search/replace operations caused by misplaced spaces, indentations or typos;
- **High-level abstractions** for complex refactoring operations via refactoring languages (currently supports Rope syntax);
- **[Relative indentation](grammar.js#L301-L366)** for easily maintaining proper code structure;
- Allows fetching or modify targeted parts of code;
- **Locations in code**: Doesn't use line numbers. Instead, offers [more resilient alternatives](grammar.js#L241-L297), like:
  - **[Line](grammar.js#L243-L246)** markers. Ex:
    - `LINE "if name == 'some name':"`
  - **[Identifier](grammar.js#L248-L251)** markers (`VARIABLE`, `FUNCTION`, `CLASS`). Ex:
    - `FUNCTION 'my_function'`
- **Language-agnostic design** for versatile code analysis
- **[Code analysis operations](grammar.js#L192-L219)** return results in XML format for easier parsing and processing by LLM systems.

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


# Related

1. [.QL](https://en.wikipedia.org/wiki/.QL) - Object-oriented query language that enables querying Java source code using SQL-like syntax;
2. [JQL (Java Query Language)](https://github.com/fmbenhassine/jql) - Allows querying Java source code with SQL. It's designed for Java code analysis and linting;
3. [Joern](https://github.com/joernio/joern) - While primarily focused on C/C++, Joern is an open-source code analysis platform that uses a custom graph database to store code property graphs. It allows querying code using a Scala-based domain-specific language;


# Unrelated

1. Cedar language
