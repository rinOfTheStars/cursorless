;; Note that we don't just import `javascript.scm` because that includes
;; `javascript.jsx.scm`, and tree-sitter would complain because those node
;; types are not defined in the typescript grammar.

;; import javascript.core.scm

;;!! class Foo { bar(); }
;;!              ^^^^^^
(_
  (method_signature) @statement.start
  .
  ";"? @statement.end
)

;;!! function foo(aaa = 0) {}
;;!               ^^^----
(required_parameter
  (identifier) @value.leading.endOf
  value: (_) @value
  !type
) @_.domain

;;!! function foo(aaa: number = 0) {}
;;!               ^^^------------
(required_parameter
  type: (_) @value.leading.endOf
  value: (_) @value
) @_.domain

;;!! function foo(aaa?: Ccc = "ddd") {}
;;!               ^^^--------------
(optional_parameter
  type: (_) @value.leading.endOf
  value: (_) @value
) @_.domain

;;!! enum Foo { }
;;!  ^^^^^^^^^^^^
;;!            ^
(enum_declaration
  (enum_body
    "{" @interior.start.endOf @name.iteration.start.endOf @value.iteration.start.endOf
    "}" @interior.end.startOf @name.iteration.end.startOf @value.iteration.end.startOf
  )
) @type @interior.domain

;;!! enum Foo { aaa, bbb }
;;!             ^^^  ^^^
(enum_body
  name: (_) @name
)

;;!! enum Foo { aaa = 0, bbb = 1 }
;;!             ^^^      ^^^
;;!                   ^        ^
(enum_assignment
  name: (_) @name @value.leading.endOf
  value: (_) @value
) @_.domain

;;!! function foo(aaa: number = 0) {}
;;!               ^^^------------
(required_parameter
  (identifier) @name
) @_.domain

;;!! function foo(aaa?: number) {}
;;!               ^^^---------
(optional_parameter
  (identifier) @name
) @_.domain

;;!! function foo(...aaa: number[]) {}
;;!                  ^^^
(_
  (rest_pattern
    (identifier) @name
  )
) @_.domain

(
  ;;!! function foo();
  ;;!  ^^^^^^^^^^^^^^^
  (function_signature) @namedFunction
  (#not-parent-type? @namedFunction export_statement)
)

(export_statement
  (function_signature)
) @namedFunction

;; Define these here because these node types don't exist in javascript.
(_
  [
    ;;!! class Foo { foo() {} }
    ;;!              ^^^^^^^^
    ;;!! interface Foo { foo(): void; }
    ;;!                  ^^^^^^^^^^^^
    (method_signature
      name: (_) @name
    )

    ;;!! class Foo { abstract foo(): void; }
    ;;!              ^^^^^^^^^^^^^^^^^^^^^
    (abstract_method_signature
      name: (_) @name
    )

    ;;!! class Foo {
    ;;!!   (public | private | protected) foo = () => {};
    ;;!                                   ^^^^^^^^^^^^^^^
    ;;!!   (public | private | protected) foo = function() {};
    ;;!                                   ^^^^^^^^^^^^^^^^^^^^
    ;;!!   (public | private | protected) foo = function *() {};
    ;;!                                   ^^^^^^^^^^^^^^^^^^^^^^
    ;;!! }
    (public_field_definition
      value: [
        (function_expression
          !name
        )
        (generator_function
          !name
        )
        (arrow_function)
      ]
    )
  ] @namedFunction.start @name.domain.start
  .
  ";"? @namedFunction.end @name.domain.end
)

(_
  ;;!! (public | private | protected) foo = ...;
  ;;!  -----------------------------------------
  (public_field_definition
    name: (_) @name @value.leading.endOf
    !type
    value: (_)? @value @name.trailing.startOf
  ) @_.domain.start
  .
  ";"? @_.domain.end
)

(_
  ;;!! (public | private | protected) foo: Bar = ...;
  ;;!  ----------------------------------------------
  (public_field_definition
    name: (_) @name @type.leading.endOf
    type: (_
      ":"
      (_) @type
    ) @value.leading.endOf
    value: (_)? @value
  ) @_.domain.start
  .
  ";"? @_.domain.end
)

(
  (type_alias_declaration
    value: (_) @value
  ) @_.domain
  (#not-parent-type? @_.domain export_statement)
)
(export_statement
  (type_alias_declaration
    value: (_) @value
  )
) @_.domain

[
  (interface_declaration)
  (object_type)
] @namedFunction.iteration

;; Special cases for `(let | const | var) foo = ...;` because the full statement
;; is actually a grandparent of the `name` node, so we want the domain to include
;; this full grandparent statement.
(
  [
    ;;!! (const | let) aaa: Bbb = 0;
    ;;!                     ^^^
    ;;!                   xxxxx
    ;;!  ---------------------------
    (lexical_declaration
      (variable_declarator
        type: (type_annotation
          (_) @type
        ) @type.removal
      )
    )

    ;;!! var aaa: Bbb = 0;
    ;;!           ^^^
    ;;!         xxxxx
    ;;!  -----------------
    ;; Note that we can't merge this with the variable declaration above because
    ;; of https://github.com/tree-sitter/tree-sitter/issues/1442#issuecomment-1584628651
    (variable_declaration
      (variable_declarator
        type: (type_annotation
          (_) @type
        ) @type.removal
      )
    )
  ] @_.domain
  (#not-parent-type? @_.domain export_statement)

  ;; Handle multiple variable declarators in one statement, eg
  ;;!! (let | const | var) aaa: Bbb = ..., ccc: Ddd = ...;
  ;;!  -------------------------^^^-------------^^^-------
  (#allow-multiple! @type)
)

(
  (export_statement
    (_
      ;;!! export (const | let | var) aaa: Bbb = 0;
      ;;!                                  ^^^
      ;;!                                xxxxx
      ;;!  ----------------------------------------
      (variable_declarator
        type: (type_annotation
          (_) @type
        ) @type.removal
      )
    )
  ) @_.domain

  ;; Handle multiple variable declarators in one statement, eg
  ;;!! export (let | const | var) aaa: Bbb = ..., ccc: Ddd = ...;
  ;;!  --------------------------------^^^-------------^^^-------
  (#allow-multiple! @type)
)

;;!! (const | let | var) aaa: Ccc = 0, bbb: Ddd = 0;
;;!1                          ^^^
;;!1                        xxxxx
;;!1                     ------------
;;!2                                        ^^^
;;!2                                      xxxxx
;;!2                                   ------------
(
  (_
    (variable_declarator
      type: (type_annotation
        (_) @type
      ) @type.removal
    ) @_.domain
  ) @_dummy
  (#has-multiple-children-of-type? @_dummy variable_declarator)
)

;;!! function ccc(aaa: string) {}
;;!                    ^^^^^^
(formal_parameters
  (required_parameter
    pattern: (_) @_.leading.endOf
    type: (_
      ":"
      (_) @type
    )
  ) @_.domain
)

;;!! function ccc(aaa?: string) {}
;;!                     ^^^^^^
(formal_parameters
  (optional_parameter
    "?" @_.leading.endOf
    type: (_
      ":"
      (_) @type
    )
  ) @_.domain
)

;;!! function ccc(): string {}
;;!                  ^^^^^^
;;!! ccc(): string {}
;;!         ^^^^^^
(_
  parameters: (_) @_.leading.endOf
  return_type: (_
    ":"
    (_) @type
  )
) @_.domain

;;!! new Aaa<Bbb>()
;;!      ^^^^^^^^
(new_expression
  constructor: (_) @type.start
  type_arguments: (_)? @type.end
)

;;!! Map<string, number>
;;!      ^^^^^^  ^^^^^^
;;!! useState<string>()
;;!           ^^^^^^
(
  (type_arguments
    (_)? @_.leading.endOf
    .
    (_) @type
    .
    (_)? @_.trailing.startOf
  ) @_dummy
  (#not-parent-type? @_dummy type_assertion)
  (#insertion-delimiter! @type ", ")
)

;;!! Map<string, number>
;;!      ^^^^^^^^^^^^^^
(
  (type_arguments
    .
    "<" @type.iteration.start.endOf
    ">" @type.iteration.end.startOf
    .
  ) @_dummy
  (#not-parent-type? @_dummy type_assertion)
)

;;!! function foo<A>() {}
;;!               ^
;;!! const foo = <A>() => {}
;;!               ^
(type_parameters
  (_) @type
)

;;!! catch(error: unknown) {}
;;!        ^^^^^^^^^^^^^^
(catch_clause
  parameter: (_) @argumentOrParameter.start
  type: (_
    (_) @argumentOrParameter.end
  )?
)

;;!! catch(error: unknown) {}
;;!        ^^^^^
;;!               ^^^^^^^
(catch_clause
  parameter: (_) @name @type.leading.endOf @_.domain.start
  type: (_
    (_) @type @_.domain.end
  )?
)

;;!! interface Aaa {}
;;!! type Aaa = Bbb;
(
  [
    (type_alias_declaration)
    (interface_declaration)
  ] @type
  (#not-parent-type? @type export_statement)
)

;;!! export interface Aaa {}
;;!! export type Aaa = Bbb;
(export_statement
  [
    (type_alias_declaration)
    (interface_declaration)
  ]
) @type

;;!! aaa as Bbb
;;!         ^^^
;;!     xxxxxxx
;;!  ----------
(as_expression
  (_) @_.leading.endOf
  (_) @type
) @_.domain

;;!! aaa as const
;;!         ^^^
;;!     xxxxxxx
;;!  ----------
(as_expression
  (_) @_.leading.endOf
  "const" @type
) @_.domain

;;!! aaa satisfies Bbb
;;!                ^^^
;;!     xxxxxxxxxxxxxx
;;!  -----------------
(satisfies_expression
  (_) @_.leading.endOf
  [
    (generic_type)
    (predefined_type)
  ] @type
) @_.domain

;;!! abstract class MyClass {}
;;!  ^^^^^^^^^^^^^^^^^^^^^^^^^
(
  (abstract_class_declaration) @class @type
  (#not-parent-type? @class export_statement)
)

;;!! export abstract class MyClass {}
;;!  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
(export_statement
  (abstract_class_declaration)
) @class @type

;;!! interface Type { name: string; }
;;!                   ^^^^
;;!                   xxxxxx
;;!                   ------------
(_
  (property_signature
    name: (_) @name @collectionKey @type.leading.endOf
    type: (_
      ":"
      (_) @type @collectionKey.trailing.startOf
    )
  ) @_.domain.start
  .
  ";"? @_.domain.end
)

;;!! interface Type { name: string; }
;;!                 ^^^^^^^^^^^^^^^^^
(object_type) @collectionKey.iteration

;; Non-exported statements
(
  [
    (ambient_declaration)
    (abstract_class_declaration)
    (enum_declaration)
    (function_signature)
    (import_alias)
    (interface_declaration)
    (internal_module)
    (module)
    (type_alias_declaration)
  ] @statement
  (#not-parent-type? @statement export_statement)
)

;; Statements with optional trailing `;`
(_
  [
    (property_signature)
    (public_field_definition)
    (abstract_method_signature)
  ] @statement.start
  .
  ";"? @statement.end
)

;; () => number
(function_type
  "=>" @disqualifyDelimiter
)
