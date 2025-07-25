import { cCoreScopeSupport } from "./c";
import type { LanguageScopeSupportFacetMap } from "./scopeSupportFacets.types";
import { ScopeSupportFacetLevel } from "./scopeSupportFacets.types";

const { supported, notApplicable } = ScopeSupportFacetLevel;

export const cppScopeSupport: LanguageScopeSupportFacetMap = {
  ...cCoreScopeSupport,

  attribute: supported,
  anonymousFunction: supported,

  "statement.try": supported,
  "statement.foreach": supported,
  "statement.constructor": supported,
  "statement.method": supported,

  "branch.try": supported,
  "branch.try.iteration": supported,

  "argument.actual.constructor.singleLine": supported,
  "argument.actual.constructor.multiLine": supported,
  "argument.actual.constructor.iteration": supported,
  "argument.formal.method.singleLine": supported,
  "argument.formal.method.multiLine": supported,
  "argument.formal.method.iteration": supported,
  "argument.formal.constructor.singleLine": supported,
  "argument.formal.constructor.multiLine": supported,
  "argument.formal.constructor.iteration": supported,
  "argument.formal.lambda.singleLine": supported,
  "argument.formal.lambda.multiLine": supported,
  "argument.formal.lambda.iteration": supported,
  "argument.catch": supported,

  "argumentList.actual.constructor.empty": supported,
  "argumentList.actual.constructor.singleLine": supported,
  "argumentList.actual.constructor.multiLine": supported,
  "argumentList.formal.constructor.empty": supported,
  "argumentList.formal.constructor.singleLine": supported,
  "argumentList.formal.constructor.multiLine": supported,
  "argumentList.formal.lambda.empty": supported,
  "argumentList.formal.lambda.singleLine": supported,
  "argumentList.formal.lambda.multiLine": supported,
  "argumentList.formal.method.empty": supported,
  "argumentList.formal.method.singleLine": supported,
  "argumentList.formal.method.multiLine": supported,

  "functionCall.constructor": supported,
  "functionCallee.constructor": supported,

  "namedFunction.method": supported,
  "namedFunction.iteration.class": supported,
  "namedFunction.constructor": supported,

  "name.argument.formal.method": supported,
  "name.argument.formal.method.iteration": supported,
  "name.argument.formal.constructor": supported,
  "name.argument.formal.constructor.iteration": supported,
  "name.argument.catch": supported,
  "name.constructor": supported,
  "name.foreach": supported,
  "name.method": supported,
  "name.namespace": supported,
  "name.iteration.class": supported,

  "value.argument.formal": supported,
  "value.argument.formal.iteration": supported,
  "value.argument.formal.method": supported,
  "value.argument.formal.method.iteration": supported,
  "value.argument.formal.constructor": supported,
  "value.argument.formal.constructor.iteration": supported,
  "value.foreach": supported,
  "value.field.class": supported,

  "type.argument.formal.method": supported,
  "type.argument.formal.method.iteration": supported,
  "type.argument.formal.constructor": supported,
  "type.argument.formal.constructor.iteration": supported,
  "type.argument.catch": supported,
  "type.foreach": supported,
  "type.typeArgument": supported,
  "type.typeArgument.iteration": supported,

  "interior.lambda": supported,
  "interior.try": supported,
  "interior.foreach": supported,
  "interior.constructor": supported,
  "interior.method": supported,
  "interior.namespace": supported,

  /* NOT APPLICABLE */

  "value.return.lambda": notApplicable,
};
