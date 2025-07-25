import {
  getCellIndex,
  getCursorlessApi,
  openNewNotebookEditor,
  runCursorlessCommand,
} from "@cursorless/vscode-common";
import * as assert from "assert";
import { window } from "vscode";
import { endToEndTestSetup, sleepWithBackoff } from "../endToEndTestSetup";
import { getPlainNotebookContents } from "../notebook";

// Check that setSelection is able to focus the correct cell
suite("Edit new cell", async function () {
  endToEndTestSetup(this);

  test("drink cell", () =>
    runTest("drink cell", "editNewLineBefore", 0, ["", "hello"]));
  test("pour cell", () =>
    runTest("pour cell", "editNewLineAfter", 1, ["hello", ""]));
});

async function runTest(
  spokenForm: string,
  command: string,
  expectedActiveCellIndex: number,
  expectedNotebookContents: string[],
) {
  const { hatTokenMap } = (await getCursorlessApi()).testHelpers!;
  const notebook = await openNewNotebookEditor(["hello"]);

  await hatTokenMap.allocateHats();

  assert.equal(notebook.cellCount, 1);

  await runCursorlessCommand({
    version: 1,
    action: command,
    targets: [
      {
        type: "primitive",
        selectionType: "notebookCell",
        mark: {
          type: "cursor",
        },
      },
    ],
  });

  await sleepWithBackoff(100);

  assert.equal(notebook.cellCount, 2);

  const activeCelIndex = getCellIndex(
    notebook,
    window.activeTextEditor!.document,
  );

  assert.equal(activeCelIndex, expectedActiveCellIndex);

  assert.deepStrictEqual(
    getPlainNotebookContents(notebook),
    expectedNotebookContents,
  );
}
