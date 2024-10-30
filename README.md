# CEDARScript

[![PyPI version](https://badge.fury.io/py/cedarscript-grammar.svg)](https://pypi.org/project/cedarscript-grammar/)
[![Python Versions](https://img.shields.io/pypi/pyversions/cedarscript-grammar.svg)](https://pypi.org/project/cedarscript-grammar/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## A SQL-like language for efficient code analysis and transformations

### CEDARScript ELI5'ed
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

This **division of labor** between the architect and CEDARScript is not just _efficient_ - it's _economical_.
The **Architect** (_LLM_) conserves valuable resources (_tokens_) by focusing on strategic decisions rather than
character- or line-level editing tasks.

### Audio overview
There are a few audio discussions you can listen to:
1. [Aider and the CEDARScript Advantage](https://open.spotify.com/episode/44ojEcwqFDujny82kibKK9?si=DTx_vMfxTpaAtjZULdVFMA) (~18 minutes)
1. [AI coding assistants and the Magical Librarian](https://open.spotify.com/show/4JAc8gphNlUspLV0XxjhQB)
2. [CEDARScript's _TurboKognition_ and _GanzPunktGenau_ editing](https://open.spotify.com/episode/79xCOfrvMZJPenLdKJiNZj?si=Mo2ofU_lRYKwxRZoCPJn6Q)
3. [Discussion of an LLM chat held during a benchmark and some command examples](https://podcasters.spotify.com/pod/show/elifarley/episodes/CEDARScript-chat-during-a-benchmark-test--command-examples-e2ptlq4)

### Technical Overview
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

1. [CEDARScript AST Parser (Python)](https://github.com/CEDARScript/cedarscript-ast-parser-python)
2. [CEDARScript Editor](https://github.com/CEDARScript/cedarscript-editor-python)
3. [CEDARScript Prompt Engineering](https://github.com/CEDARScript/cedarscript-llm-prompt-engineering)
   - Provides prompts that teach `CEDARScript` to LLMs
   - Also includes real conversations held via Aider in which an LLM uses this language to propose code modifications
4. [CEDARScript Integration: Aider](https://github.com/CEDARScript/cedarscript-integration-aider) - Provides 
`CEDARScript` [_edit format_](https://aider.chat/docs/llms/editing-format.html) for [Aider](https://aider.chat/)

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

# Planned Features

## Onboarding Capabilities

This capability is designed to help developers, AI assistants, and other tools quickly gain a comprehensive understanding of a project's structure, conventions, and context.

### Key Onboarding Features

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

### Future Enhancements

Ideas to explore:

- Automatic generation of project structure visualizations
- Integration with version control history for context-aware onboarding
- Customizable onboarding queries for specific project needs

# Future Work

1. [Tree-Sitter query language](https://cycode.com/blog/tips-for-using-tree-sitter-queries/) integration, which could open up many possibilities;
2. [Comby](https://github.com/comby-tools/comby) notation for an alternate syntax to express refactorings on code or data formats;
3. Create a browser extension that allows web-chat interfaces of Large Language Models to tackle larger file changes;
4. Select a model to fine-tune so that it natively understands `CEDARScript`;
5. Provide language extensions that will improve how LLMs interact with other resource types;
6. Explore using it as an **LLM-Tool Interface**;

## Tree-Sitter Query Language Integration

This could open up many possibilities, like:

### Advanced Code Analysis: provide statistics about functions in the project

```sql
QUERY LANGUAGE 'tree-sitter'
FROM PROJECT
PATTERN '''
(function_definition
  name: (identifier) @func_name
  parameters: (parameters) @params
  body: (block 
    (return_statement) @return_stmt))
'''
WITH ANALYSIS
  COUNT @func_name AS "Total Functions"
  AVERAGE (LENGTH @params) AS "Avg Parameters"
  PERCENTAGE (IS_PRESENT @return_stmt) AS "Functions with Return";
```

### Concisely modify all methods

Find all classes and their methods in Python files, then insert a print statement after each method definition:

```sql
QUERY LANGUAGE 'tree-sitter'
FROM PROJECT
PATTERN '''
(class_definition
  name: (identifier) @class_name
  body: (block
    (function_definition
      name: (identifier) @method_name)))
'''
WITH ACTIONS
  INSERT AFTER @method_name
  CONTENT '''
@0:    print("Method called:", @method_name)
''';
```

### Cross-language refactoring: replace all calls to "deprecated_function" across Python, JavaScript, and TypeScript files.

```sql
QUERY LANGUAGE 'tree-sitter'
FROM PROJECT
LANGUAGES ["python", "javascript", "typescript"]
PATTERN '''
(call_expression
  function: (identifier) @func_name
  (#eq? @func_name "deprecated_function"))
'''
WITH ACTIONS
  REPLACE @func_name
  WITH CONTENT "new_function";
```

### Custom Linting Rules:
We can define project-specific linting rules using Tree-sitter queries:

```sql
QUERY LANGUAGE 'tree-sitter'
FROM PROJECT
PATTERN '''
(import_statement
  (dotted_name) @import_name
  (#match? @import_name "^(os|sys)$"))
'''
WITH LINT
  SEVERITY "WARNING"
  MESSAGE "Direct import of system modules discouraged. Use custom wrappers instead.";
```

## Comby Notation

To replace 'failUnlessEqual' with 'assertEqual':
```sql
UPDATE PROJECT
REAFCTOR LANGUAGE "comby" 
WITH PATTERN '''
comby 'failUnlessEqual(:[a],:[b])' 'assertEqual(:[a],:[b])' example.py
'''
```

## CEDARScript Browser Extension for LLM Web Interfaces

<details>
<summary>As Large Language Models (LLMs) become increasingly accessible through web-based chat interfaces, there's a growing need to enhance their ability to handle larger codebases and complex file changes. We propose developing a browser extension that leverages CEDARScript to bridge this gap.</summary>   

- **Seamless Integration**: The extension would integrate with popular LLM web interfaces (e.g., ChatGPT, Claude, Gemini) by leveraging [llm-context.py](https://github.com/cyberchitta/llm-context.py), allowing users to work with larger files and codebases directly within these platforms.

- **CEDARScript Translation**: The changes proposed by the LLM would be concisely expressed as `CEDARScript` commands, enabling more efficient token usage.

- **Local File System Access**: The extension could securely access the user's local file system, allowing for direct manipulation of code files based on `CEDARScript` instructions generated by the LLM.

- **Diff Visualization**: Changes proposed by the LLM would be presented as standard diffs _or_ as `CEDARScript` code, allowing users to review and approve modifications before applying them to their codebase.

- **Context Preservation**: The extension would maintain context across chat sessions, enabling long-running refactoring tasks that span multiple interactions.

This browser extension would expand the capabilities of web-based LLM interfaces, allowing developers to leverage these powerful AI tools for more substantial code modification and analysis tasks. By using CEDARScript as an intermediary language, the extension would ensure efficient and accurate communication between the user, the LLM, and the local codebase.

</details>

## Fine-tuning a Model for Native CEDARScript Understanding

<details>
   
<summary>This initiative could enhance the efficiency and effectiveness of AI-assisted code analysis and transformation.</summary>

### Why Fine-tune?

1. **Improved Accuracy**: A fine-tuned model will have a deeper understanding of CEDARScript syntax and semantics, leading to more accurate code analysis and generation.
2. **Efficiency**: Native understanding of CEDARScript will reduce the need for extensive prompting.
3. **Consistency**: A model trained specifically on CEDARScript will produce more consistent and idiomatic output, adhering closely to the language's conventions and best practices.
4. **Extended Capabilities**: Fine-tuning could enable the model to perform more complex CEDARScript operations and understand nuanced aspects of the language that general-purpose models might miss.

### Approach

1. **Model Selection**: We will evaluate various state-of-the-art language models to determine the most suitable base model for fine-tuning. Factors such as model size, pre-training data, and architectural features will be considered.
2. **Dataset Creation**: A comprehensive dataset of CEDARScript examples, covering a wide range of use cases and complexities, will be created. This dataset will include both CEDARScript commands and their corresponding natural language descriptions or intentions.
3. **Fine-tuning Process**: The selected model will undergo fine-tuning using the created dataset. We'll experiment with different fine-tuning techniques, depending on the resources available and the desired outcome.
4. **Evaluation**: The fine-tuned model will be rigorously tested on a held-out test set to assess its performance in understanding and generating CEDARScript. Metrics such as accuracy, fluency, and task completion will be used.
5. **Iterative Improvement**: Based on the evaluation results, we'll iteratively refine the fine-tuning process, potentially adjusting the dataset, fine-tuning parameters, or even the base model selection.

</details>

## LLM-Tool Interface

<details>
   
<summary>As Large Language Models continue to evolve and find applications in various real-world scenarios, there's a growing need for standardized ways for LLMs to interact with external tools and APIs. We envision `CEDARScript` as a potential solution to this challenge.</summary>

- **Standardized Tool Interaction**: `CEDARScript` could serve as an intermediary language between LLMs and various tools, providing a consistent, SQL-like syntax for expressing tool usage intentions.
- **Tool-Agnostic Commands**: By defining a set of generic commands that map to common tool functionalities, `CEDARScript` could simplify the process of integrating new tools and APIs.
- **Complex Tool Pipelines**: The language's SQL-like structure could allow for easy chaining of multiple tool operations, enabling more complex workflows.
- **Abstraction of API Complexity**: CEDARScript could hide the underlying complexity of diverse tool APIs behind a simpler, unified interface.

This approach could potentially enhance LLMs' ability to leverage external tools and capabilities, making it easier to deploy them in diverse real-world applications. Future work could explore the feasibility and implementation of this concept, aiming to create a more seamless integration between LLMs and the tools they use to interact with the world.

</details>

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
