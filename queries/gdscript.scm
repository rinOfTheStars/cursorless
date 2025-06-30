;; https://github.com/PrestonKnopp/tree-sitter-gdscript/blob/master/src/grammar.json
;; https://github.com/PrestonKnopp/tree-sitter-gdscript/blob/master/src/node-types.json

[
    (class_definition)
    (constructor_definition)
    (enum_definition)
    (for_statement)
    (function_definition)
    (if_statement)
    (match_statement)
    (while_statement)
    (break_statement)
    (class_name_statement)
    (const_statement)
    (continue_statement)
    (export_variable_statement)
    (expression_statement)
    (extends_statement)
    (onready_variable_statement)
    (pass_statement)
    (return_statement)
    (signal_statement)
    (variable_statement)
    ;; (breakpoint_statement) not sure if this should count
] @statement

[
    (attribute_call)
    (base_call)
    (call)
] @functionCall @functionCallee

(lambda) @anonymousFunction