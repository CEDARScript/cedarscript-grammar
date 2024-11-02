const SELECT_FILENAMESPATHS_TARGET = seq('FILE', choice('NAMES', 'PATHS'))
const SELECT_OTHER_TARGETS = choice(
  seq('FILE', 'CONTENTS'),
  seq('CLASS', choice('NAMES', 'CONTENTS')),
  seq('FUNCTION', choice('NAMES', 'SIGNATURES', 'CONTENTS')),
  seq('METHOD', choice('NAMES', 'SIGNATURES', 'CONTENTS')),
  seq('VARIABLE', choice('NAMES', 'CONTENTS')),
  'IDENTIFIERS'
);

/*
CASE
    WHEN REGEX r"print\((.*?)\)" THEN SUB r"logger.debug(\1)"
    WHEN REGEX r"raise" THEN DELETE
    WHEN PREFIX "try" THEN RELINDENT 1
    WHEN SUFFIX ";" THEN CONTENT '''xxx'''    ELSE CONTENT '''No match'''
END;

CASE
    WHEN <matcher> THEN <action>
    ...
    [ELSE <action>]
END;

-- Matchers (WHEN clause):
WHEN REGEX r"pattern"              -- Regular expression match
WHEN PREFIX "string"              -- Line starts with
WHEN SUFFIX "string"              -- Line ends with
WHEN EMPTY                        -- Empty line
WHEN INDENT <n>                   -- Line has specific indentation level
WHEN LINE_NUMBER <n>              -- Specific line number
WHEN MATCHES_FILE "*.py"          -- File pattern match
WHEN LENGTH > <n>                 -- Line length condition

-- Actions (THEN clause):
THEN SUB r"pattern" r"replacement"           -- Replace with regex capture groups
THEN DELETE                       -- Remove the line
THEN CONTENT '''text'''          -- Replace with specific content
THEN CONTINUE                        -- Skip this line
THEN INDENT +/-n                -- Change indentation
THEN WRAP '''before''' '''after''' -- Wrap line with content
THEN INSERT_BEFORE '''text'''    -- Add content before
THEN INSERT_AFTER '''text'''     -- Add content after
THEN CAPITALIZE                  -- Capitalize line
THEN LOWERCASE                   -- Convert to lowercase
THEN MOVE TO <n>                -- Move line to position

Example usage:
```sql
-- Complex code transformation
UPDATE FILE 'main.py'
REPLACE ALL
CASE
-- Remove trailing semicolons
    WHEN SUFFIX ';'
    THEN REPLACE r'(.*);$' WITH r'\1'

-- Convert print to logging
    WHEN REGEX r'print\((.*?)\)'
    THEN REPLACE r'logger.debug(\1)'

-- Fix indentation
    WHEN INDENT &gt; 4
    THEN INDENT -2

-- Add type hints
    WHEN REGEX r'def (\w+)\((.*?)\):'
    THEN REPLACE r'def \1(\2) -&gt; None:'

-- Remove empty lines in functions
    WHEN EMPTY AND INSIDE FUNCTION
    THEN DELETE

-- Add docstrings
    WHEN DEFINES 'def'
    THEN INSERT_AFTER """""""""    '''TODO: Add documentation.'''"""""""""

-- Fix long lines
    WHEN LENGTH &gt; 80
    THEN WRAP """""""""(\""""""""" """""""""\)"""""""""

-- Add error handling
    WHEN CALLS 'api.request'
    THEN WRAP """""""""try:
    """"""""" """""""""except RequestError as e:
    logger.error(f'API call failed: {e}')
    raise"""""""""

-- Clean up imports
    WHEN IMPORTS '.*'
    THEN SORT

-- Fix comments
    WHEN COMMENT AND NOT PREFIX '# '
    THEN REPLACE r'#(.*)$' WITH r'# \1'

    ELSE SKIP
END;

-- File organization
UPDATE PROJECT
CASE
    WHEN MATCHES_FILE 'test_*.py'
    THEN MOVE TO 'tests/'

    WHEN CONTAINS 'TODO'
    THEN APPEND TO 'todo.txt'

    WHEN COMPLEXITY &gt; 10
    THEN APPEND TO 'refactor.txt'
END;

*/


/**
- WHOLE: the whole chosen item;
- BODY: Only the function body (its *signature* is *NOT* considered);
*/
const BODY_OR_WHOLE = field('bow', choice('BODY', 'WHOLE'))

const DOC_DECORATORS_OR_TYPE = ['DOC', 'DECORATORS', 'TYPE']
const DOC_DECORATORS_OR_TYPE_FIELD = field('ddort', choice(...DOC_DECORATORS_OR_TYPE))
const PARAMS_DOC_DECORATORS_OR_TYPE_FIELD = field('pddort', choice('PARAMETERS', ...DOC_DECORATORS_OR_TYPE))

/**
<about>CEDARScript, SQL-like language used to express code manipulations (via DDL and DML Write commands)
and to help an LLM examine and understand the codebase (via DML Read-Only command)</about>
*/
module.exports = grammar({
  name: 'CEDARScript',

  extras: $ => [
    $.comment,
    /[\s\f\uFEFF\u2060\u200B]|\\\r?\n/
  ],

  rules: {
    source_file: $ => repeat(seq(
      $._command,
      optional($.command_separator)
    )),

    _command: $ => choice(
      // DDL
      $.create_command,
      $.rm_file_command,
      $.mv_file_command,
      // DML (write)
      $.update_command,
      // DML (Read-Only)
      $.select_command,
      prec(-1, alias($.invalid_move_command, $.error))
    ),
    invalid_move_command: $ => seq(
      'MOVE',
      choice('FILE', 'FUNCTION', 'METHOD', 'CLASS', 'VARIABLE'),
    ),
    create_command: $ => seq(
      'CREATE', $.singlefile_clause,
      'WITH', $.content_literal
    ),

    rm_file_command: $ => seq(
      'RM', $.singlefile_clause
    ),

    mv_file_command: $ => seq(
      'MV', $.singlefile_clause, $.to_value_clause
    ),

    update_command: $ => seq(
      'UPDATE',
      choice(
        field('singleFile_clause',
          seq(
            $.singlefile_clause,
            choice(
              $.update_delete_region_clause,
              $.update_move_mos_clause,
              choice(
                seq($.insert_clause, 'WITH',
                  choice($.content_literal, $.content_from_segment)
                ),
                seq($.replace_region_clause, 'WITH',
                  choice($.content_literal, $.content_from_segment, $.case_stmt, $.ed_stmt)
                )
              )
            )
          )
        ),
        field('identifierInFile_clause',
          seq(
            $.identifier_from_file,
            choice(
              $.update_delete_region_clause,
              $.update_move_region_clause,
              choice(
                seq($.insert_clause, 'WITH',
                  choice($.content_literal, $.content_from_segment)
                ),
                seq($.replace_region_clause, 'WITH',
                  choice($.content_literal, $.content_from_segment, $.case_stmt, $.ed_stmt)
                )
              )
            )
          )
        ),
        $.update_project_clause
      )
    ),

    insert_clause: $ => seq('INSERT', $.relpos_bai),

    /**
    replace_region_clause: Define what to be replaced in the chosen function, class or file.
    */
    replace_region_clause: $ => seq('REPLACE', $.region_field),
    // ---

    /**
    refactor_language_field: Only language 'rope' is supported. Works only with Python codebases.
    */
    refactor_language_field: $ => seq('REFACTOR LANGUAGE', field('refactor_language', $.string)),
    pattern_field: $ => seq('PATTERN', field('pattern', $.string)),
    goal_field: $ => seq('GOAL', field('goal', $.string)),

    /**
    update_delete_region_clause: *NOT* top-level command. Used inside the `UPDATE` command to specify deletion of code parts.
    */
    update_delete_region_clause: $ => seq('DELETE', $.region_field),
    // ---

    /**
    update_project_clause: Advanced pattern-based refactorings.
    Indirectly use the `Restructure` class in the 'Rope' refactoring library to perform complex code transformations using patterns.
    These patterns can match and replace code structures in your project.
    */
    update_project_clause: $ => seq('PROJECT', $.refactor_language_field,
      'WITH', $.pattern_field,
      'WITH', $.goal_field,
    ),
    update_move_clause_destination: $ => field('move_destination', seq(
      optional(seq('TO', $.singlefile_clause)), // `TO` can ONLY be used if it points to a different file
      $.insert_clause,
      optional($.relative_indentation)
    )),

    // update_move_mos_clause, update_move_region_clause
    /**
    `MOVE` is only used as part of the UPDATE command for moving code within a file.
    Unlike CREATE, RM, or UPDATE, it is *NOT* a top-level command.
    */
    update_move_mos_clause: $ => seq('MOVE', field('move_mos_source', $.marker_or_segment), $.update_move_clause_destination),
    update_move_region_clause: $ => seq('MOVE', field('move_region_source', $.region_field), $.update_move_clause_destination),
    // ---

    /**
    Syntax: (VARIABLE|FUNCTION|METHOD|CLASS) "<name>" [OFFSET <offset>] FROM FILE "<path/to/file>"
    Use cases: Specify an identifier in a given file.
    <params>
    - `<name>`: Identifies the name of a variable, function or class as the item of interest in the file.
    - `<offset>`: Specifies how many items to skip. Mandatory when there are 2 or more matching elements. See details in `offset_clause`.
    </params>
    */
    identifier_from_file: $ => seq(
      $.identifier_matcher, 'FROM', $.singlefile_clause,
      optional($.where_clause)
    ),

    /**
    Read-only command. Used to glean information about the code base being examined.
    <use-cases>
    - Understanding code structure;
    - Finding relevant files/classes/functions/variables that may deal with a certain topic
       -- (ex.: if a user may want to find all places that deal with payments, search for 'payment')
    - Displaying code elements to user
    - Generating documentation;
    - Automating code navigation.
    </use-cases>
    */
    select_command: $ => seq(
      'SELECT',
      choice(
        seq(field('file_names_paths_target', $.select_filenamespaths_target), 'FROM', $.multifile_clause),
        seq(field('single_or_multifile_target', $.select_other_target), 'FROM', choice($.singlefile_clause, $.multifile_clause))
      ),
      optional($.where_clause),
      optional($.limit_clause)
    ),

    select_filenamespaths_target: $ => SELECT_FILENAMESPATHS_TARGET,
    select_other_target: $ => SELECT_OTHER_TARGETS,

    where_clause: $ => seq(
      'WHERE',
      field('condition', $.condition)
    ),

    conditions_left: $ => choice(
      'NAME',
      'PATH'
    ),
    operator: $ => choice('=', 'LIKE'),
    condition: $ => seq($.conditions_left, $.operator, field('value_or_pattern', $.string)),

    to_value_clause: $ => seq('TO', field('value', $.string)),
    /**
    Syntax: FILE "<path/to/file>"
    Use cases: Specify a file
    */
    singlefile_clause: $ => seq('FILE', field('path', $.string)),
    multifile_clause: $ => seq(
      choice('PROJECT', seq('DIRECTORY', field('directory', $.string))),
      optional($.maxdepth_clause)
    ),

    maxdepth_clause: $ => seq('MAX DEPTH', field('depth', $.number)),

    // <specifying-locations-in-code>

    line_base: $ => seq(optional('LINE'), choice(
      field('line_matcher', choice($.string, $.number)), // match the line content or a context-relative line number
      field('empty', 'EMPTY'), // match empty line
      seq('REGEX', field('regex', $.string)), // match line by REGEX
      seq('PREFIX', field('prefix', $.string)), // match line by its prefix
      seq('SUFFIX', field('suffix', $.string)), // match line by its suffix
      seq('INDENT', 'LEVEL', field('indent_level', $.number)), // Line has indent level
    )),
    line_matcher: $ => seq($.line_base, optional($.offset_clause)),
    identifier_matcher: $ => seq(field('identifier', choice('VARIABLE', 'FUNCTION', 'METHOD', 'CLASS')), field('identifier_matcher', $.string), optional($.offset_clause)),
    marker: $ => choice($.line_matcher, $.identifier_matcher),
    relpos_beforeafter: $ => field('relpos_beforeafter', seq(choice('BEFORE', 'AFTER'), $.marker)),
    relpos_into: $ => seq('INTO', field('into', $.identifier_matcher), field('topOrBottom', choice('TOP', 'BOTTOM'))),
    relpos_bai: $ => field('relpos_bai', choice($.relpos_beforeafter, $.relpos_into)),
    /**
    relpos_at: points to a specific `line_matcher`
    */
    relpos_at: $ => seq('AT', field('at', $.marker)),
    /**
    relpos_segment_start: Points to start of segment
    */
    relpos_segment_start: $ => seq('STARTING', field('starting', choice($.relpos_at, $.relpos_beforeafter))),
    /**
    relpos_segment_end: Points to end of segment
    */
    relpos_segment_end: $ => seq('ENDING', field('ending', choice($.relpos_at, $.relpos_beforeafter))),
    /**
    segment: Points to segment identified by a start and an end pointer
    */
    segment: $ => field('segment', seq('SEGMENT', $.relpos_segment_start, $.relpos_segment_end)),
    marker_or_segment: $ => field('mos', choice($.marker, $.segment)),
    /** region_field:
    - BODY_OR_WHOLE: pre-defined regions
    - DOC_DECORATORS_OR_TYPE_FIELD: An identifier's docstring/kdoc/javadoc/etc or its decorators, or its type (or return type for functions)
    - PARAMS_DOC_DECORATORS_OR_TYPE_FIELD: As in DOC_DECORATORS_OR_TYPE_FIELD, but also includes a function or method's parameters
    - marker_or_segment: more flexible region selection
    */
    region_field: $ => field('region', choice(PARAMS_DOC_DECORATORS_OR_TYPE_FIELD, BODY_OR_WHOLE, $.marker_or_segment)),

    /**
    offset_clause: When a reference is ambiguous (multiple matches exist for it), it must be disambiguated. Setting an OFFSET is a way to do that.
    Field `offset`: An int to set how many matches to skip.
    <examples>
    <li>`OFFSET 0` is the default when there's only one matching element. It means to skip 0 items (so, points to the *1st* match).</li>
    <li>`OFFSET 1` skips 1 matches, so points to the *2nd* matches</li>
    <li>`OFFSET 2` skips 2 matches, so points to the *3rd* matches</li>
    <li>`OFFSET n` skips n matches, thus specifies the (n+1)-th matches</li>
    </examples>
    */
    offset_clause: $ => seq('OFFSET', field('offset', $.number)),

    // </specifying-locations-in-code>

    limit_clause: $ => seq('LIMIT', field('count', $.number)),

    /**
    relative_indentation: Helps maintain proper code structure when inserting or replacing code.
    Sets the indentation level relative to the context specified in the command:
    <li>`INTO (FUNCTION|METHOD|CLASS)`: Reference is the body of the function, method or class</li>
    <li>`(BEFORE|AFTER) (LINE|FUNCTION|METHOD|CLASS)`: Reference is line, function, etc, regardless of whether BEFORE or AFTER is used</li>
    When `rel_indent` is 0, code is put at the same level as the reference.
    */
    relative_indentation: $ => seq('RELATIVE INDENTATION', field('rel_indent', $.number)),

    content_from_segment: $ => seq(
      optional($.singlefile_clause),
      $.marker_or_segment,
      optional($.relative_indentation)
    ),

    content_literal: $ => seq('CONTENT', field('content', $.string)),

    loop_break: $ => field('break', 'BREAK'),
    loop_continue: $ => field('continue', 'CONTINUE'),
    loop_control: $ => choice($.loop_break, $.loop_continue),
    // Actions (THEN clause):
    case_action: $ => choice(
      $.loop_control,
      seq(field('remove', 'REMOVE'), optional($.loop_control)), // Remove line
      seq('SUB', field('pattern', $.string), field('repl', $.string), optional($.loop_control)), // Replace with regex capture groups
      seq('INDENT', field('indent', $.number), optional($.loop_control)), // Change indentation
      seq(choice($.content_literal, $.content_from_segment), optional($.loop_control)) // Replace with specific content
    ),

    // Filters

    case_stmt: $ => seq(
      'CASE', repeat1(seq(
        'WHEN', $.line_base,
        'THEN', $.case_action
      )),
      optional(seq('ELSE', field('else', $.case_action))),
      'END'
    ),
    ed_stmt: $ => seq('ED', field('ed', $.string)),

    // /Filters

    escape_sequence: $ => token(seq(
      '\\',
      choice(
        /[abfnrtv\\"']/,
        /\d{1,3}/,
        /x[0-9a-fA-F]{2}/,
        /u[0-9a-fA-F]{4}/,
        /U[0-9a-fA-F]{8}/,
        /N\{[^}]+\}/
      )
    )),

    string: $ => choice(
      $.raw_string,
      $.single_quoted_string,
      $.multi_line_string
    ),
    raw_string: $ => choice(
      seq(
        'r"',
        repeat(/./),
        '"'
      ),
      seq(
        "r'",
        repeat(/./),
        "'"
      ),
      seq(
        'r"""',
        repeat(/./),
        '"""'
      ),
      seq(
        "r'''",
        repeat(/./),
        "'''"
      )
    ),
    single_quoted_string: $ => choice(
      seq(
        "'",
        repeat(choice(
          /[^'\\\n]/,
          '--',
          $.escape_sequence
        )),
        "'"
      ),
      seq(
        '"',
        repeat(choice(
          /[^"\\\n]/,
          '--',
          $.escape_sequence
        )),
        '"'
      )
    ),
    /**
    multi_line_string: Also useful to avoid escaping quotes
    */
    multi_line_string: $ => choice(
      seq(
        '"""',
        repeat(choice(
          /[^"\\]/,
          '"',
          '""',
          '--',
          $.escape_sequence
        )),
        '"""'
      ),
      seq(
        "'''",
        repeat(choice(
          /[^'\\]/,
          "'",
          "''",
          '--',
          $.escape_sequence
        )),
        "'''"
      )
    ),

    number: $ => seq(optional('-'), /\d+/),

    comment: $ => token(prec(-1, choice(
      seq("--", /.*/),
      seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")
    ))),

    command_separator: $ => ';'

  }
});
