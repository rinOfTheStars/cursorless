import type { LanguageScopeSupportFacetMap } from "./scopeSupportFacets.types";
import { ScopeSupportFacetLevel } from "./scopeSupportFacets.types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { supported, unsupported, notApplicable } = ScopeSupportFacetLevel;

export const gdscriptScopeSupport: LanguageScopeSupportFacetMap = {
    // supported (implemented)
    anonymousFunction: supported,

    "statement.class": supported,
    "statement.iteration.block": supported,
    "statement.iteration.document": supported,
    
    functionCall: supported,
    functionCallee: supported,

    // unsupported (not yet implemented)
    list: unsupported,
    map: unsupported,
    ifStatement: unsupported,

    class: unsupported,
    "class.iteration.block": unsupported, 
    "class.iteration.document": unsupported,
     
    namedFunction: unsupported,
    "namedFunction.method": unsupported,
    //"namedFunction.constructor": unsupported,  -- should this be supported? constructors are always named _init or _static_init
    "namedFunction.iteration.document": unsupported,

    // not applicable (not a language feature)
    command: notApplicable,
    element: notApplicable,
    startTag: notApplicable,
    endTag: notApplicable,
    tags: notApplicable,

};