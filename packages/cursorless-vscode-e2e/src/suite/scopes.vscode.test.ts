import type {
  ScopeSupportFacet,
  ScopeType,
  PlaintextScopeSupportFacet,
} from "@cursorless/common";
import {
  asyncSafety,
  languageScopeSupport,
  scopeSupportFacetInfos,
  ScopeSupportFacetLevel,
  shouldUpdateFixtures,
  plaintextScopeSupportFacetInfos,
} from "@cursorless/common";
import { getScopeTestPathsRecursively } from "@cursorless/node-common";
import { getCursorlessApi, openNewEditor } from "@cursorless/vscode-common";
import { assert } from "chai";
import { groupBy, uniq } from "lodash-es";
import { promises as fsp } from "node:fs";
import { endToEndTestSetup } from "../endToEndTestSetup";
import {
  serializeIterationScopeFixture,
  serializeScopeFixture,
} from "./serializeScopeFixture";
import { shouldSkipScopeTest } from "./shouldSkipTest";

suite("Scope test cases", async function () {
  endToEndTestSetup(this);

  const testPaths = getScopeTestPathsRecursively();

  if (!shouldUpdateFixtures()) {
    const languages = groupBy(testPaths, (test) => test.languageId);

    // This handles the case where a language has no tests, but is still listed
    // in the config. In that case, just using the language ids from the tests
    // would miss the language entirely even though it appears in the config.
    for (const language of Object.keys(languageScopeSupport)) {
      languages[language] ??= [];
    }

    Object.keys(languages)
      .sort()
      .forEach((languageId) => {
        const tests = languages[languageId];
        test(
          `${languageId} facet coverage`,
          asyncSafety(() =>
            testLanguageSupport(
              languageId,
              tests.map((test) => test.facet),
            ),
          ),
        );
      });
  }

  testPaths.forEach(({ path, name, languageId, facet }) =>
    test(
      name,
      asyncSafety(() => {
        if (shouldSkipScopeTest(languageId)) {
          this.ctx.skip();
        }

        return runTest(path, languageId, facet);
      }),
    ),
  );
});

/**
 * Ensures that all supported facets for a language are tested, and that all
 * tested facets are listed as supported in {@link getLanguageScopeSupport}
 * @param languageId The language to test
 * @param testedFacets The facets for {@link languageId} that are tested
 */
async function testLanguageSupport(languageId: string, testedFacets: string[]) {
  const supportedFacets = (() => {
    if (languageId === "plaintext") {
      return Object.keys(plaintextScopeSupportFacetInfos);
    }

    const scopeSupport = languageScopeSupport[languageId];

    if (scopeSupport == null) {
      return [];
    }

    return Object.keys(scopeSupport).filter(
      (facet) =>
        scopeSupport[facet as ScopeSupportFacet] ===
        ScopeSupportFacetLevel.supported,
    );
  })();

  // Assert that all tested facets are supported by the language
  const unsupportedFacets = testedFacets.filter(
    (testedFacet) => !supportedFacets.includes(testedFacet),
  );
  if (unsupportedFacets.length > 0) {
    const values = uniq(unsupportedFacets).sort().join(", ");
    assert.fail(
      `Facets [${values}] are tested but not listed in getLanguageScopeSupport`,
    );
  }

  // Assert that all supported facets are tested
  const untestedFacets = supportedFacets.filter(
    (supportedFacet) => !testedFacets.includes(supportedFacet),
  );
  if (untestedFacets.length > 0) {
    const values = untestedFacets.sort().join(", ");
    assert.fail(`Missing test for scope support facets [${values}]`);
  }
}

async function runTest(file: string, languageId: string, facetId: string) {
  const { ide, scopeProvider } = (await getCursorlessApi()).testHelpers!;
  const { scopeType, isIteration } = getFacetInfo(languageId, facetId);
  const fixture = (await fsp.readFile(file, "utf8"))
    .toString()
    .replaceAll("\r\n", "\n");
  const delimiterIndex = fixture.match(/^---$/m)?.index;

  assert.isDefined(
    delimiterIndex,
    "Can't find delimiter '---' in scope fixture",
  );

  const code = fixture.slice(0, delimiterIndex! - 1);

  await openNewEditor(code, { languageId });

  const editor = ide.activeTextEditor!;

  const [outputFixture, numScopes] = ((): [string, number] => {
    const config = {
      visibleOnly: false,
      scopeType,
    };

    if (isIteration) {
      const iterationScopes = scopeProvider.provideIterationScopeRanges(
        editor,
        {
          ...config,
          includeNestedTargets: false,
        },
      );
      return [
        serializeIterationScopeFixture(code, iterationScopes),
        iterationScopes.length,
      ];
    }

    const scopes = scopeProvider.provideScopeRanges(editor, config);

    return [serializeScopeFixture(facetId, code, scopes), scopes.length];
  })();

  if (shouldUpdateFixtures()) {
    await fsp.writeFile(file, outputFixture);
  } else {
    assert.isAbove(numScopes, 0, "No scopes found");
    assert.equal(outputFixture, fixture);
  }
}

function getFacetInfo(
  languageId: string,
  facetId: string,
): {
  scopeType: ScopeType;
  isIteration: boolean;
} {
  const facetInfo =
    languageId === "plaintext"
      ? plaintextScopeSupportFacetInfos[facetId as PlaintextScopeSupportFacet]
      : scopeSupportFacetInfos[facetId as ScopeSupportFacet];

  if (facetInfo == null) {
    throw Error(`Missing scope support facet info for: ${facetId}`);
  }

  const { scopeType, isIteration } = facetInfo;
  const fullScopeType =
    typeof scopeType === "string" ? { type: scopeType } : scopeType;

  return {
    scopeType: fullScopeType,
    isIteration: isIteration ?? false,
  };
}
