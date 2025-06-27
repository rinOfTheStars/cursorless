export const extensionDependencies = [
  // Cursorless access to Tree sitter
  "pokey.parse-tree",

  // Register necessary language-IDs for tests
  "scala-lang.scala", // scala
  "mrob95.vscode-talonscript", // talon
  //"jrieken.vscode-tree-sitter-query", // scm TODO: UNCOMMENT THIS WHEN PUBLISHED TO OPENVSX!
  "mathiasfrohlich.kotlin", // kotlin

  "geequlim.godot-tools", // gdscript (and potentially other godot-related langs if they get tree-sitter parsers!)

  // Necessary for the `drink cell` and `pour cell` tests
  "ms-toolsai.jupyter",
];
