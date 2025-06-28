;; https://github.com/PrestonKnopp/tree-sitter-gdscript/blob/master/src/grammar.json
;; https://github.com/PrestonKnopp/tree-sitter-gdscript/blob/master/src/node-types.json

[
    (array)
    (base_call)
    (binary_operator)
    (call)
    (dictionary)
    (false)
    (float)
    (get_node)
    (identifier)
    (integer)
    (node_path)
    (null)
    (parenthesized_expression)
    (string)
    (subscript)
    (true)
    (unary_operator)
] @_attribute_expression

[
    (class_definition)
    (constructor_definition)
    (enum_definition)
    (for_statement)
    (function_definition)
    (if_statement)
    (match_statement)
    (while_statement)
] @_compound_statement

[
    (_primary_expression)
    (await_expression)
    (conditional_expression)
] @_expression

[
    (default_parameter)
    (identifier)
    (typed_default_parameter)
    (typed_parameter)
] @_parameters

[
    (_primary_expression)
    (pattern_binding)
] @_pattern

[
    (array)
    (attribute)
    (base_call)
    (binary_operator)
    (call)
    (dictionary)
    (false)
    (float)
    (get_node)
    (identifier)
    (integer)
    (node_path)
    (null)
    (parenthesized_expression)
    (string)
    (string_name)
    (subscript)
    (true)
    (unary_operator)
] @_primary_expression