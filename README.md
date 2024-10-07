# CEDARScript

[![PyPI version](https://badge.fury.io/py/cedarscript-grammar.svg)](https://pypi.org/project/cedarscript-grammar/)
[![Python Versions](https://img.shields.io/pypi/pyversions/cedarscript-grammar.svg)](https://pypi.org/project/cedarscript-grammar/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## A SQL-like language for code analysis and transformations

`CEDARScript` (_Concise Examination, Development, And Refactoring Script_) is a **SQL**-like language designed to _concisely_:
1. **Express code manipulations and refactorings** (if you know what you want to change in your code);
   - The CEDARScript runtime can edit any file in the code base according to the commands it reads
2. **Perform code analysis** to quickly get to know a large code base without having to read all contents of all files.
   - The CEDARScript runtime searches through the whole code base and only returns the desired results

## Key Features:

- **SQL-like syntax** for intuitive code querying and manipulation;
- Shows improved results in refactoring benchmarks when compared to standard diff formats
   - See [`Gemini 1.5 PRO` improved performance (on par with Sonnet 3.5)](https://github.com/Aider-AI/aider/pull/1897#issue-2563049442)
- **Reduced token usage** via semantic-level code transformations, not character-by-character matching;
    - **Scalable to larger codebases** with minimal token usage;
    - **Project-wide refactorings** can be performed with a single, concise command
    - Avoids wasted time and tokens on failed search/replace operations caused by misplaced spaces, indentations or typos;
- **High-level abstractions** for complex refactoring operations via refactoring languages (currently supports Rope syntax);
- **[Relative indentation](grammar.js#L301-L366)** for easily maintaining proper code structure;
- Allows fetching or modifying targeted parts of code;
- **Locations in code**: Doesn't use line numbers. Instead, offers [more resilient alternatives](grammar.js#L241-L297), like:
    - **[Line](grammar.js#L243-L246)** markers. Ex:
        - `LINE "if name == 'some name':"`
    - **[Identifier](grammar.js#L248-L251)** markers (`VARIABLE`, `FUNCTION`, `CLASS`). Ex:
        - `FUNCTION 'my_function'`
- **Language-agnostic design** for versatile code analysis
- **[Code analysis operations](grammar.js#L192-L219)** return results in XML format for easier parsing and processing by LLM (Large Language Model) systems.

## Projects using the CEDARScript Language

1. [CEDARScript AST Parser (Python)](https://github.com/CEDARScript/cedarscript-ast-parser-python)
2. [CEDARScript Editor](https://github.com/CEDARScript/cedarscript-editor-python)
3. [CEDARScript Prompt Engineering](https://github.com/CEDARScript/cedarscript-llm-prompt-engineering)
   - Provides prompts that teach `CEDARScript` to LLMs
   - Also includes real conversations held via Aider in which an LLM uses this language to propose code modifications
4. [CEDARScript Integrations](https://github.com/CEDARScript/cedarscript-integrations) - Provides `CEDARScript` [_edit format_](https://aider.chat/docs/llms/editing-format.html) for [Aider](https://aider.chat/)

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

1. Create a browser extension that allows web-chat interfaces of Large Language Models to tackle larger file changes
2. Select a model to fine-tune so that it natively understands `CEDARScript`;
3. Provide language extensions that will improve how LLMs interact with other resource types;
4. Explore using it as an **LLM-Tool Interface**

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
