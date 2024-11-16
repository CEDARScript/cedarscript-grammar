# External command calls to allow LLMs to experiment and learn

## Summary
I propose a language extension to `CEDARScript` to allow arbitrary command execution.
It would work as an escape hatch that connects the LLM to the external environment.

Security implications aside, it holds a lot of potential.

The firs application could be a benchmark to see if the LLM would be able to perform better than the baseline
when solving complex mathematical challenges, e. g. https://epoch.ai/frontiermath

## Examples

```sql
-- Capturing script output

-- Suppose the LLM has difficulty counting letters...
-- It can delegate the counting to a Python script:
CALL LANGUAGE "python" WITH CONTENT '''
print("refrigerator".lower().count('r'))
''';

CALL LANGUAGE "python"
ENV CONTENT '''WORD=rrrrrrrracer'''
WITH CONTENT '''
import os
print(os.environ['WORD'].count('r'))
''';

CALL LANGUAGE "python"
WITH CONTENT r'''
import os
print(os.environ)
''';

CALL COMMAND
WITH CONTENT r'''
#!/usr/bin/python3 -B -O
import sys
print(sys.version)
''';

CALL COMMAND
-- ENV INHERIT (NONE* | ONLY '<vars>' | ALL)
ENV MODE INHERIT ONLY 'PATH, HOME, API_KEY'
-- ENV (r'''<env-spec>''' | FILE "<path>")
ENV CONTENT r'''
OUTPUT_FORMAT=xml
MAX_RESULTS=20
'''
CAPTURE STDOUT -- CAPTURE (ALL* | STDOUT | STDERR)
-- WITH (CONTENT r'''<string>''' | FILE "<path>") 
WITH CONTENT r'''
#!/bin/bash

echo $PATH
echo $HOME
echo $API_KEY $MAX_RESULTS
curl http://something.com/
''';

```

## Syntax in EBNF

```
call_command ::= 
    | 'CALL' 'COMMAND' [env_spec] with_clause
    | 'CALL' 'LANGUAGE' string_literal [env_spec] with_clause

env_spec ::= [env_mode_clause] [env_clause] [capture_clause]

env_mode_clause ::= 'ENV' 'MODE' (
    | 'ISOLATED'                                 (* Default *)
    | 'INHERIT' 'ALL'
    | 'INHERIT' 'ONLY' string_literal           (* Comma-separated list *)
)

env_clause ::= 'ENV' (
    | raw_string_literal                        (* Multiline env vars *)
    | 'FILE' string_literal                     (* Load from file *)
)

capture_clause ::= 'CAPTURE' ('ALL' | 'STDOUT' | 'STDERR')

with_clause ::= 'WITH' (
    | 'CONTENT' raw_string_literal              (* Inline script with optional shebang *)
    | 'FILE' string_literal                     (* Script file with optional shebang *)
)
```