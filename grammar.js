const SELECT_FILENAMESPATHS_TARGET = seq('FILE', choice('NAMES', 'PATHS'))
const SELECT_OTHER_TARGETS = choice(
  seq('FILE', 'CONTENTS'),
  seq('CLASS', choice('NAMES', 'CONTENTS')),
  seq('FUNCTION', choice('NAMES', 'SIGNATURES', 'CONTENTS')),
  seq('METHOD', choice('NAMES', 'SIGNATURES', 'CONTENTS')),
  seq('VARIABLE', choice('NAMES', 'CONTENTS')),
  'IDENTIFIERS'
);
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
    /\s|\r?\n/,
    $.comment
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
    /**
    Syntax: CREATE FILE "<path/to/new-file>" WITH CONTENT '''<content>''';
    Only for new files. Fails if file already exists.
    */
    create_command: $ => seq(
      'CREATE', $.singlefile_clause,
      'WITH', $.content_clause
    ),

    /**
    Syntax: RM FILE "<path/to/file>";
    Use cases: Delete file from the codebase
    */
    rm_file_command: $ => seq(
      'RM', $.singlefile_clause
    ),

    /**
    Syntax: MV FILE "<source-file>" TO "<target-file>";
    Use cases: Renaming a file, moving a file to another path (target file is overwritten if existing).
    <example><goal>Rename "old.js", then move "config.json" to "production" folder</goal>
    ```CEDARScript
    -- Rename "old.js"
    MV FILE "src/old.js" TO "src/new.js";
    -- Overwrite development config with production config
    MV FILE "production/config.ini" TO "development/config.ini";
    ```
    </example>
    */
    mv_file_command: $ => seq(
      'MV', $.singlefile_clause, $.to_value_clause
    ),

    /**
    Syntax (simplified): UPDATE <singlefile or identifier_from_file> <update type>;
    <use-cases>
    - Creating or replacing classes, functions or other code in existing files/classes/functions
    - Replacing specific lines of existing code
    - Performing complex code transformations using refactoring patterns
    - etc...
    </use-cases>
    */
    update_command: $ => seq(
      'UPDATE',
      choice(
        field('singleFile_clause',
          seq(
            $.singlefile_clause,
            choice(
              $.update_delete_region_clause,
              $.update_move_mos_clause,
              seq(
                choice(
                  $.insert_clause,
                  $.replace_region_clause
                ),
                seq('WITH', choice($.content_clause, $.content_from_segment))
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
              seq(
                choice(
                  $.insert_clause,
                  $.replace_region_clause
                ),
                seq('WITH', choice($.content_clause, $.content_from_segment))
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
    Syntax: (VARIABLE|FUNCTION|CLASS) "<name>" [OFFSET <offset>] FROM FILE "<path/to/file>"
    Use cases: Specify an identifier in a given file.
    <params>
    - `<name>`: Identifies the name of a variable, function or class as the item of interest in the file.
    - `<offset>`: Specifies how many items to skip. Mandatory when there are 2 or more matching elements. See details in `offset_clause`.
    </params>
    */
    identifier_from_file: $ => seq(
      $.identifierMarker, 'FROM', $.singlefile_clause,
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
    /**
    lineMarker: Points to specific line via its trimmed contents.
    *NEVER* use an ambiguous line (one that appears 2 or more times) as reference. Instead, prefer a different, nearby line.
    */
    lineMarker: $ => seq('LINE', field('lineMarker', $.string), optional($.offset_clause)),
    /**
    identifierMarker: Points to an identifier (variable, function or class).
    Use `OFFSET <n>` to pinpoint which (if there are 2 or more with same name)
    */
    identifierMarker: $ => seq(field('identifier', choice('VARIABLE', 'FUNCTION', 'METHOD', 'CLASS')), field('identifierMarker', $.string), optional($.offset_clause)),
    marker: $ => choice($.lineMarker, $.identifierMarker),
    /**
    relpos_beforeafter: Points to region immediately before or after a `marker`
    */
    relpos_beforeafter: $ => field('relpos_beforeafter', seq(choice('BEFORE', 'AFTER'), $.marker)),
    /**
    relpos_inside: Points to inside `identifierMarker` (either the body's TOP or BOTTOM region). The reference indentation level is the body's.
    Syntax: INSIDE (FUNCTION|CLASS) "<name>" [OFFSET <offset>] (TOP|BOTTOM)
    Use cases: When inserting content either at the TOP or BOTTOM of a function or class body.
    Examples: <ul>
    <li>INSIDE FUNCTION my_function OFFSET 1 BOTTOM -- at the BOTTOM of the function body</li>
    <li>INSIDE FUNCTION my_function TOP -- at the TOP of the function body</li>
    </ul>
    */
    relpos_inside: $ => seq('INSIDE', field('inside', $.identifierMarker), field('topOrBottom', choice('TOP', 'BOTTOM'))),
    relpos_bai: $ => field('relpos_bai', choice($.relpos_beforeafter, $.relpos_inside)),
    /**
    relpos_at: points to a specific `lineMarker`
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
    Field `offset`: Integer to identify how many matches to skip. *MANDATORY* iff there are 2 or more matching elements.
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
    <li>`INSIDE (FUNCTION|CLASS)`: Reference is the body of the function or class</li>
    <li>`(BEFORE|AFTER) (LINE|FUNCTION|CLASS)`: Reference is line, function, or class, regardless of whether BEFORE or AFTER is used</li>
    When `rel_indent` is 0, code is put at the same level as the reference.
    */
    relative_indentation: $ => seq('RELATIVE INDENTATION', field('rel_indent', $.number)),

    content_from_segment: $ => seq(
      optional($.singlefile_clause),
      $.marker_or_segment,
      optional($.relative_indentation)
    ),

    /**
<details topic="Relative Indent Strings">
<summary>A relative indent prefix is used within strings in CONTENT blocks to simplify matching indentation with the existing code being changed</summary>
<p>Syntax:</p>
<ol>
<li>`@N:` is the relative indent prefix</li>
<li>`N` is an integer representing the relative indent *level* (can be negative)</li>
<li>`content` is the actual code or text for that line</li>
</ol>
<examples>
<li>'@7:single-quote-string'</li>
<li>"@-3:double-quote-string"</li>
<li>r"@0:raw-string"</li>
<li>'''
@0:multi
@-1:line
'''</li>
<li>"""
@0:multi
@-1:line
"""</li>
</examples>

<p>Key points:</p>
<ol>
<li>Each line must start with `@N:` where `N` represents the indentation level</li>
<li>Indentation level *MUST* change logically with code structure:
   - *MUST* increment N when entering a new block (class body, function body, if statement, loop, etc.)
   - *MUST* Decrement N when exiting a block
 </li>
<li>The actual content follows immediately after the prefix (@N:)</li>
</ol>

<example>
[...] WITH CONTENT '''
@0:class myClass:
@1:def myFunction(param):
@2:if param > 0:
@3:print("Positive")
@2:else:
@3:print("Non-positive")
@2:return param * 2
@0:class nextClass:
'''
</example>

Remember: The relative indentation prefix (@N:) is used to indicate the logical structure
of the code. The CEDARScript interpreter will handle the actual formatting and indentation
in the target code file.
    */
    content_clause: $ => seq('CONTENT', field('content', $.string)),

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

    comment: $ => token(prec(-1, seq(
      '--',
      optional(/[^\n]+/)
    ))),

    command_separator: $ => ';'

  }
});
