# CEDARScript

[![PyPI version](https://badge.fury.io/py/cedarscript-grammar.svg)](https://pypi.org/project/cedarscript-grammar/)
[![Python Versions](https://img.shields.io/pypi/pyversions/cedarscript-grammar.svg)](https://pypi.org/project/cedarscript-grammar/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents
- [What is CEDARScript?](#what-is-cedarscript)
- [How to use it?](#how-to-use-it)
- [CEDARScript ELI5'ed](#cedarscript-eli5ed)
- [Technical Overview](#technical-overview)
- [Key Features](#key-features)
- [Supported Languages](#supported-languages)
- [How can CEDARScript be used](#how-can-cedarscript-be-used)
- [Examples](#examples)
- [Proposals](#proposals)
- [Related](#related)

## What is CEDARScript?

A SQL-like language for efficient code analysis and transformations.

Most useful for AI code assistants.

It's a domain-specific language designed to improve how AI coding assistants interact with codebases and communicate their code modification intentions.
It provides a standardized way to express complex code modification and analysis operations, making it easier for
AI-assisted development tools to understand and execute these tasks.

## How to use it

1. You can easily [install a tool that supports CEDARScript](https://github.com/CEDARScript/cedarscript-integration-aider/blob/main/README.md#installation).
2. Then, just ask the AI assistant to fix a bug or something in your codebase.

The assistant will write `CEDARSCript` commands that will be executed by the CEDARScript runtime editor.

## CEDARScript ELI5'ed
<details>
    <summary>The Magical Librarian analogy</summary>

Imagine a vast _library_ (`your codebase`) with millions of _books_ (`files`) across thousands of _shelves_ (`directories`).
Traditional code editing is like manually searching through each book, line by line, character by character, to find
relevant information or make changes.

**CEDARScript**, on the other hand, is like having a **magical librarian** with superpowers, like:

1. **_TurboKognition_ Boost** (`Code Analysis`):
    - This librarian can act as an _Omniscient Cataloger_ who can instantly tell you where any piece of information is
located across all books.
    - Want to know every place where a specific _protagonist_ (`function`) is mentioned Or where he/she was born?
      Or find all the _chapters_ (`classes`) that discuss a particular _topic_ (`variable usage`)?
      The librarian provides this information immediately, without having to flip through pages (`waste precious tokens`)
2. **The _GanzPunktGenau_ Editing Powers** (`Code Manipulation`):
    - When you want to make changes, instead of specifying exact page and line numbers, you can give high-level instructions.
      For example, _"Add this new paragraph after the first mention of 'dragons' in the fantasy section"_ or
      _"Move the chapter about 'time travel' to come before 'parallel universes' in all science fiction books."_
      The librarian understands these abstract instructions and makes the precise edits across all relevant books, handling
      details like page layout and consistent formatting.

This _magical librarian_ (`CEDARScript`) collaborates with the LLM and allows it to assume the role of an **Architect**
who can work with your vast library of code at a _higher_ level, making both understanding and modifying your codebase
faster and more intuitive. It bridges the gap between the LLM's _**high-level intent**_ and the _nitty-gritty details_
of code structure, allowing the **_architect_** to focus on the '_what_' while it handles the '_how_' of code analysis
and modification.

Audio overview / Podcasts
There are a few podcasts discussing CEDARScript you can listen to:
1. [Aider and the CEDARScript Advantage](https://open.spotify.com/episode/44ojEcwqFDujny82kibKK9?si=DTx_vMfxTpaAtjZULdVFMA) (~18 minutes)
1. [AI coding assistants and the Magical Librarian](https://open.spotify.com/show/4JAc8gphNlUspLV0XxjhQB)
2. [CEDARScript's _TurboKognition_ and _GanzPunktGenau_ editing](https://open.spotify.com/episode/79xCOfrvMZJPenLdKJiNZj?si=Mo2ofU_lRYKwxRZoCPJn6Q)
3. [Discussion of an LLM chat held during a benchmark and some command examples](https://podcasters.spotify.com/pod/show/elifarley/episodes/CEDARScript-chat-during-a-benchmark-test--command-examples-e2ptlq4)

</details>

## Technical Overview
`CEDARScript` (_Concise Examination, Development, And Refactoring Script_) is a **SQL**-like language designed to
lower costs and improve the efficiency and accuracy of AI code assistants. It enables offloading low-level code syntax and 
structure concerns, such as indentation and line counting, from the LLMs.
It aims to improve how AI coding assistants interact with codebases and communicate their code modification intentions
by providing a _standardized and concise_ way to express complex code analysis and modification operations, making it easier for
AI-assisted development tools to understand and execute these tasks.

**CEDARScript transforms LLMs from code writers into code _architects_.**

The **Architect** doesn't need to specify every tiny detail - instead of spending expensive tokens writing out
complete code changes, it simply provides high-level blueprints using **CEDARScript** commands like
`UPDATE FILE "main.py" MOVE FUNCTION "execute" INSERT AFTER FUNCTION "plan"`.

This **division of labor** between the architect and CEDARScript is not just _efficient_ - it's _economical_.
The **Architect** (_LLM_) conserves valuable resources (_tokens_) by focusing on strategic decisions rather than
character- or line-level editing tasks.

The CEDARScript runtime then handles all the minute details - precise line numbers, indentation counts, and syntax 
consistency - at zero token cost.

Let's get to know the two primary functions offered by CEDARScript:

1. **Code Analysis** to quickly get to know a large code base without having to read all contents of all files.
   - The CEDARScript runtime searches through the whole code base and only returns the relevant results,
thus reducing the token traffic between the LLM and the user;
   - This can be used to more quickly understand key aspects of the codebase, search for all or specific _identifiers_ (classes, 
methods, functions or variables) defined across ALL files of the project or in specific ones, etc.
   - Search results can include not only identifier definitions (in whole or only the signature or summary), 
but also call-sites and usages of an identifier;
     - These results can be useful not only when the LLM needs to read them, but also when the LLM wants to show some
parts of the code to the user (_why send a function to the user if the LLM can simply [`SELECT`](grammar.js#L191-L224) it and have the CEDARScript runtime show the contents?_)
2. **Code Manipulation and Refactoring**:
   - The [**CEDARScript runtime**](https://github.com/CEDARScript/cedarscript-editor-python) _bears the brunt of file
editing_ by locating the exact line numbers and characters to change, which indentation levels to apply to each line and
so on, allowing the _CEDARScript commands_ to focus instead on higher levels of abstraction, like 
[identifier](grammar.js#L248-L251) names, [line](grammar.js#L243-L246) markers, relative 
[indentations](grammar.js#L306-L370) and [positions](grammar.js#L241-L300)
(`AFTER`, `BEFORE`, `INTO` a function, its `BODY`, at the `TOP` or `BOTTOM` of it...)

## Key Features:

- **Learning Curve**
  - For _humans_: its **SQL-like syntax** allows for _intuitive_ code querying and manipulation (however, **humans don't
even need to learn it**, as its **primary purpose** is to offer _LLMs_ an easy language with which they can write simple,
concise commands to modify code or analyse it);
  - For _AIs_: some prompt engineering is enough to enable most LLMs (even cheaper ones like **Gemini _Flash_**) to
learn it well. Other forms of fine-tuning are planned, so that even SLMs (Small Language Models) like 
[Microsoft's Phi 3](https://azure.microsoft.com/en-us/blog/introducing-phi-3-redefining-whats-possible-with-slms/) could
be able to learn CEDARScript. This has the potential to unlock locally-deployed SLMs to be used as AI code assistants.
- Shows **improved results** in **refactoring benchmarks** when compared to standard diff formats
   - [**Gemini 1.5 _Flash_** _outperformed_ Claude **3.5 Sonnet**](https://github.com/CEDARScript/cedarscript-integration-aider?tab=readme-ov-file#performance-comparison)
     - Pass rate: **76.4%** (beats Sonnet 3.5 at `64.0%`)
     - Well-formed cases: **94.4%** (beats Sonnet 3.5 at `76.4%`)
- **Reduced token usage** via semantic-level code transformations, not character-by-character matching;
    - **Scalable to larger codebases** with minimal token usage;
    - **Project-wide refactorings** can be performed with a single, concise command
    - Avoids wasted time and tokens on failed search/replace operations caused by misplaced spaces, indentations or typos;
- **High-level abstractions** for complex refactoring operations via refactoring languages (currently supports Rope syntax);
- **[Relative indentation](grammar.js#L306-L370)** for easily maintaining proper code structure;
- Allows fetching or modifying targeted parts of code;
- **Locations in code**: Doesn't use line numbers. Instead, offers [more resilient alternatives](grammar.js#L241-L300), like:
    - **[Line](grammar.js#L243-L246)** markers. Ex:
        - `LINE "if name == 'some name':"`
    - **[Identifier](grammar.js#L248-L251)** markers (`VARIABLE`, `FUNCTION`, `CLASS`). Ex:
        - `FUNCTION 'my_function'`
- **Language-agnostic design** for versatile code analysis
- **[Code analysis operations](grammar.js#L192-L219)** return results in XML format for easier parsing and processing by LLM (Large Language Model) systems.

## Supported Languages

Currently, `CEDARScript` theoretically supports **Python, Kotlin, PHP, Rust, Go, C++, C, Java, Javascript, Lua, FORTRAN, Scala and C#**,
but only **Python** has been tested so far.

**Cobol** and **MatLab**: Initial queries for these languages are ready, but the Tree-Sitter parsers for them still need to be included.

## Projects using the CEDARScript Language

1. [CEDARScript Integration: Aider](https://github.com/CEDARScript/cedarscript-integration-aider) - Provides 
`CEDARScript` [_edit format_](https://aider.chat/docs/llms/editing-format.html) for [Aider](https://aider.chat/)
2. [CEDARScript AST Parser (Python)](https://github.com/CEDARScript/cedarscript-ast-parser-python)
3. [CEDARScript Editor](https://github.com/CEDARScript/cedarscript-editor-python)
4. [CEDARScript Prompt Engineering](https://github.com/CEDARScript/cedarscript-llm-prompt-engineering)
   - Provides prompts that teach `CEDARScript` to LLMs
   - Also includes real conversations held via Aider in which an LLM uses this language to propose code modifications

## How can CEDARScript be used?

### Improving LLM <-> codebase interactions

`CEDARScript` can be used as a way to standardize and improve how AI coding assistants interact with codebases, learn about your code, and communicate their code modification intentions while keeping token usage _low_.
This efficiency allows for more complex operations within token limits.

It provides a concise way to express complex code modification and analysis operations, making it easier for AI-assisted development tools to understand and perform these tasks.

### Use as a refactoring language / _diff_ format

One can use `CEDARScript` to concisely and unambiguously represent code modifications at a higher level than a standard diff format can.

IDEs can store the local history of files in CEDARScript format, and this can also be used for searches.

### Other Ideas to Explore
- Code review systems for automated, in-depth code assessments
- Automated code documentation and explanation tools
- ...

## Examples

Quick example: turn a method into a top-level function, using `CASE` filter with REGEX:

```sql
UPDATE FILE "baseconverter.py"
MOVE FUNCTION "convert"
INSERT BEFORE class "BaseConverter"
  RELATIVE INDENTATION 0;

-- Update the call sites in encode() and decode() methods to use the top-level convert() function
UPDATE CLASS "BaseConverter"
  FROM FILE "baseconverter".py
REPLACE BODY
WITH CASE -- Filter each line in the function body through this CASE filter
  WHEN   REGEX r"self\.convert\((.*?)\)"
  THEN REPLACE r"convert(\1)"
END;
```

Use an ED script to change a function:

```sql
UPDATE FILE "app/main.py" REPLACE FUNCTION "calculate_total" WITH ED '''
-- Add type hints to parameters
1s/calculate_total(base_amount, tax_rate, discount, apply_shipping)/calculate_total(base_amount: float, tax_rate: float, discount: float, apply_shipping: bool) -> float/

-- Add docstring after function definition
1a
    """
    Calculate the total amount including tax, shipping, and discount.

    Args:
        base_amount: Base price of the item
        tax_rate: Tax rate as decimal (e.g., 0.1 for 10%)
        discount: Discount as decimal (e.g., 0.2 for 20%)
        apply_shipping: Whether to add shipping cost

    Returns:
        float: Final calculated amount rounded to 2 decimal places
    """
.

-- Add logging before return
/return/i
    logger.info(f"Calculated total amount: {subtotal:.2f}")
.
''';
```

There are [many more examples](test/corpus) to look at...

# Proposals
See [current proposals](proposals/)

# Related

1. [.QL](https://en.wikipedia.org/wiki/.QL) - Object-oriented query language that enables querying Java source code using SQL-like syntax;
2. [JQL (Java Query Language)](https://github.com/fmbenhassine/jql) - Allows querying Java source code with SQL. It's designed for Java code analysis and linting;
3. [Joern](https://github.com/joernio/joern) - While primarily focused on C/C++, Joern is an open-source code analysis platform that uses a custom graph database to store code property graphs. It allows querying code using a Scala-based domain-specific language; 
4. [Codebase Context Suite](https://agentic-insights.github.io/codebase-context-spec/) - A comprehensive tool for managing codebase context, generating prompts, and enhancing development workflows;
5. [CONVENTIONS.md](https://aider.chat/docs/usage/conventions.html)

# See Also
1. [OpenAI Fine-tuning](https://platform.openai.com/docs/guides/fine-tuning/common-use-cases)
2. [llm-context.py](https://github.com/cyberchitta/llm-context.py)
3. [`Gemini 1.5 PRO` improved performance (on par with Sonnet 3.5)](https://github.com/Aider-AI/aider/pull/1897#issue-2563049442)

# Unrelated

1. [Cedar Policy Language](https://www.cedarpolicy.com/) _('CEDARScript' is _not_ a policy language. 'Cedar' and 'CEDARScript' are totally unrelated.)_
