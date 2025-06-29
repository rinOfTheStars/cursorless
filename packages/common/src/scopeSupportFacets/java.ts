import type { LanguageScopeSupportFacetMap } from "./scopeSupportFacets.types";
import { ScopeSupportFacetLevel } from "./scopeSupportFacets.types";

const { supported, unsupported, notApplicable } = ScopeSupportFacetLevel;

export const javaScopeSupport: LanguageScopeSupportFacetMap = {
  disqualifyDelimiter: supported,
  anonymousFunction: supported,
  list: supported,
  switchStatementSubject: supported,

  "argument.actual": supported,
  "argument.actual.iteration": supported,
  "argument.actual.constructor": supported,
  "argument.actual.constructor.iteration": supported,
  "argument.actual.method": supported,
  "argument.actual.method.iteration": supported,
  "argument.formal.constructor": supported,
  "argument.formal.constructor.iteration": supported,
  "argument.formal.method": supported,
  "argument.formal.method.iteration": supported,
  "argument.formal.lambda": supported,
  "argument.formal.lambda.iteration": supported,

  "argumentList.actual.empty": supported,
  "argumentList.actual.singleLine": supported,
  "argumentList.actual.multiLine": supported,
  "argumentList.actual.method.empty": supported,
  "argumentList.actual.method.singleLine": supported,
  "argumentList.actual.method.multiLine": supported,
  "argumentList.actual.constructor.empty": supported,
  "argumentList.actual.constructor.singleLine": supported,
  "argumentList.actual.constructor.multiLine": supported,
  "argumentList.formal.lambda.empty": supported,
  "argumentList.formal.lambda.singleLine": supported,
  "argumentList.formal.lambda.multiLine": supported,
  "argumentList.formal.method.empty": supported,
  "argumentList.formal.method.singleLine": supported,
  "argumentList.formal.method.multiLine": supported,
  "argumentList.formal.constructor.empty": supported,
  "argumentList.formal.constructor.singleLine": supported,
  "argumentList.formal.constructor.multiLine": supported,

  "collectionItem.unenclosed": supported,
  "collectionItem.unenclosed.iteration": supported,

  "branch.if": supported,
  "branch.if.iteration": supported,
  "branch.try": supported,
  "branch.try.iteration": supported,

  "branch.switchCase": supported,
  "branch.switchCase.iteration": supported,
  "branch.ternary": supported,
  "branch.loop": supported,

  class: supported,
  "class.iteration.block": supported,
  "class.iteration.document": supported,

  className: supported,
  "className.iteration.block": supported,
  "className.iteration.document": supported,

  "comment.block": supported,
  "comment.line": supported,

  "condition.doWhile": supported,
  "condition.for": supported,
  "condition.if": supported,
  "condition.switchCase": supported,
  "condition.switchCase.iteration": supported,
  "condition.ternary": supported,
  "condition.while": supported,

  functionCall: supported,
  "functionCall.constructor": supported,
  functionCallee: supported,
  "functionCallee.constructor": supported,

  "namedFunction.constructor": supported,
  "namedFunction.method": supported,
  "namedFunction.method.iteration.class": supported,

  "functionName.constructor": supported,
  "functionName.method": supported,
  "functionName.method.iteration.class": supported,

  "name.argument.formal.constructor": supported,
  "name.argument.formal.constructor.iteration": supported,
  "name.argument.formal.method": supported,
  "name.argument.formal.method.iteration": supported,
  "name.assignment": supported,
  "name.class": supported,
  "name.constructor": supported,
  "name.field": supported,
  "name.foreach": supported,
  "name.method": supported,
  "name.variable": supported,
  "name.iteration.document": supported,
  "name.iteration.block": supported,
  "name.resource": supported,

  ifStatement: supported,
  statement: supported,
  "statement.class": supported,
  "statement.iteration.block": supported,
  "statement.iteration.document": supported,

  "string.singleLine": supported,
  "string.multiLine": supported,

  "textFragment.comment.block": supported,
  "textFragment.comment.line": supported,
  "textFragment.string.singleLine": supported,
  "textFragment.string.multiLine": supported,

  "type.argument.formal.constructor": supported,
  "type.argument.formal.method": supported,
  "type.argument.formal.constructor.iteration": supported,
  "type.argument.formal.method.iteration": supported,
  "type.foreach": supported,
  "type.field": supported,
  "type.field.iteration": supported,
  "type.return": supported,
  "type.variable": supported,
  "type.typeArgument": supported,
  "type.typeArgument.iteration": supported,
  "type.resource": supported,
  "type.cast": supported,
  "type.class": supported,
  "type.enum": supported,
  "type.interface": supported,

  "value.assignment": supported,
  "value.foreach": supported,
  "value.field": supported,
  "value.return": supported,
  "value.return.lambda": supported,
  "value.variable": supported,
  "value.resource": supported,

  "interior.class": supported,
  "interior.function": supported,
  "interior.if": supported,
  "interior.lambda": supported,
  "interior.loop": supported,
  "interior.switchCase": supported,
  "interior.ternary": supported,
  "interior.try": supported,
  "interior.resource": supported,

  /* UNSUPPORTED  */

  fieldAccess: unsupported,

  /* NOT APPLICABLE */

  // Functions (not methods)
  namedFunction: notApplicable,
  "namedFunction.iteration.document": notApplicable,
  "namedFunction.iteration.block": notApplicable,
  functionName: notApplicable,
  "functionName.iteration.document": notApplicable,
  "functionName.iteration.block": notApplicable,
  "argument.formal": notApplicable,
  "argument.formal.iteration": notApplicable,
  "argumentList.formal.empty": notApplicable,
  "argumentList.formal.singleLine": notApplicable,
  "argumentList.formal.multiLine": notApplicable,
  "name.argument.formal": notApplicable,
  "name.argument.formal.iteration": notApplicable,
  "name.function": notApplicable,
  "type.argument.formal": notApplicable,
  "type.argument.formal.iteration": notApplicable,

  // Element and tags
  element: notApplicable,
  tags: notApplicable,
  startTag: notApplicable,
  endTag: notApplicable,
  "interior.element": notApplicable,
  "textFragment.element": notApplicable,
  attribute: notApplicable,
  "key.attribute": notApplicable,
  "value.attribute": notApplicable,

  // Keyword argument
  "name.argument.actual": notApplicable,
  "name.argument.actual.iteration": notApplicable,
  "value.argument.actual": notApplicable,
  "value.argument.actual.iteration": notApplicable,

  // Pattern destructing
  "name.assignment.pattern": notApplicable,
  "name.variable.pattern": notApplicable,
  "value.variable.pattern": notApplicable,

  // Map literal
  map: notApplicable,
  "key.mapPair": notApplicable,
  "key.mapPair.iteration": notApplicable,
  "value.mapPair": notApplicable,
  "value.mapPair.iteration": notApplicable,

  // Default argument value
  "value.argument.formal": notApplicable,
  "value.argument.formal.iteration": notApplicable,
  "value.argument.formal.constructor": notApplicable,
  "value.argument.formal.constructor.iteration": notApplicable,
  "value.argument.formal.method": notApplicable,
  "value.argument.formal.method.iteration": notApplicable,

  // Type alias
  "type.alias": notApplicable,
  "value.typeAlias": notApplicable,

  // Section
  section: notApplicable,
  "section.iteration.document": notApplicable,
  "section.iteration.parent": notApplicable,

  // Command
  command: notApplicable,
  "interior.command": notApplicable,

  // Notebook cell
  notebookCell: notApplicable,
  "interior.cell": notApplicable,

  // Multiple resources
  "value.resource.iteration": notApplicable,
  "type.resource.iteration": notApplicable,
  "name.resource.iteration": notApplicable,

  // Miscellaneous
  "value.yield": notApplicable,
  pairDelimiter: notApplicable,
  regularExpression: notApplicable,
  environment: notApplicable,
};
