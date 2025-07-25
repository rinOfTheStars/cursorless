import type {
  Disposable,
  EditableTextEditor,
  FlashDescriptor,
  GeneralizedRange,
  HighlightId,
  IDE,
  InputBoxOptions,
  NotebookEditor,
  OpenUntitledTextDocumentOptions,
  QuickPickOptions,
  RunMode,
  TextDocumentChangeEvent,
  TextEditor,
} from "@cursorless/common";
import { OutdatedExtensionError } from "@cursorless/common";
import {
  fromVscodeRange,
  fromVscodeSelection,
} from "@cursorless/vscode-common";
import { pull } from "lodash-es";
import { v4 as uuid } from "uuid";
import type { ExtensionContext, WorkspaceFolder } from "vscode";
import * as vscode from "vscode";
import { window, workspace } from "vscode";
import { VscodeCapabilities } from "./VscodeCapabilities";
import VscodeClipboard from "./VscodeClipboard";
import VscodeConfiguration from "./VscodeConfiguration";
import { forwardEvent, vscodeOnDidChangeTextDocument } from "./VscodeEvents";
import VscodeFlashHandler from "./VscodeFlashHandler";
import VscodeHighlights, { HighlightStyle } from "./VscodeHighlights";
import { VscodeNotebookEditorImpl } from "./VscodeIdeNotebook";
import VscodeKeyValueStore from "./VscodeKeyValueStore";
import VscodeMessages from "./VscodeMessages";
import { vscodeRunMode } from "./VscodeRunMode";
import { VscodeTextDocumentImpl } from "./VscodeTextDocumentImpl";
import { VscodeTextEditorImpl } from "./VscodeTextEditorImpl";
import { vscodeShowQuickPick } from "./vscodeShowQuickPick";

export class VscodeIDE implements IDE {
  readonly configuration: VscodeConfiguration;
  readonly keyValueStore: VscodeKeyValueStore;
  readonly messages: VscodeMessages;
  readonly clipboard: VscodeClipboard;
  readonly capabilities: VscodeCapabilities;
  private flashHandler: VscodeFlashHandler;
  private highlights: VscodeHighlights;
  private editorMap;

  constructor(private extensionContext: ExtensionContext) {
    this.configuration = new VscodeConfiguration(this);
    this.keyValueStore = new VscodeKeyValueStore(extensionContext);
    this.messages = new VscodeMessages();
    this.clipboard = new VscodeClipboard();
    this.highlights = new VscodeHighlights(extensionContext);
    this.flashHandler = new VscodeFlashHandler(this, this.highlights);
    this.capabilities = new VscodeCapabilities();
    this.editorMap = new WeakMap<vscode.TextEditor, VscodeTextEditorImpl>();
  }

  showQuickPick(
    items: readonly string[],
    options?: QuickPickOptions,
  ): Promise<string | undefined> {
    return vscodeShowQuickPick(items, options);
  }

  setHighlightRanges(
    highlightId: HighlightId | undefined,
    editor: TextEditor,
    ranges: GeneralizedRange[],
  ): Promise<void> {
    const vscodeHighlightId =
      highlightId == null
        ? HighlightStyle.highlight0
        : HighlightStyle[highlightId as keyof typeof HighlightStyle];
    return this.highlights.setHighlightRanges(
      vscodeHighlightId,
      editor as VscodeTextEditorImpl,
      ranges,
    );
  }

  flashRanges(flashDescriptors: FlashDescriptor[]): Promise<void> {
    return this.flashHandler.flashRanges(flashDescriptors);
  }

  get assetsRoot(): string {
    return this.extensionContext.extensionPath;
  }

  get cursorlessVersion(): string {
    return this.extensionContext.extension.packageJSON.version;
  }

  get runMode(): RunMode {
    return vscodeRunMode(this.extensionContext);
  }

  get workspaceFolders(): readonly WorkspaceFolder[] | undefined {
    return workspace.workspaceFolders;
  }

  get activeTextEditor(): VscodeTextEditorImpl | undefined {
    return this.getActiveTextEditor();
  }

  get activeEditableTextEditor(): VscodeTextEditorImpl | undefined {
    return this.getActiveTextEditor();
  }

  private getActiveTextEditor() {
    return window.activeTextEditor != null
      ? this.fromVscodeEditor(window.activeTextEditor)
      : undefined;
  }

  get visibleTextEditors(): VscodeTextEditorImpl[] {
    return window.visibleTextEditors.map((e) => this.fromVscodeEditor(e));
  }

  get visibleNotebookEditors(): NotebookEditor[] {
    return vscode.window.visibleNotebookEditors.map(
      (editor) => new VscodeNotebookEditorImpl(editor),
    );
  }

  public getEditableTextEditor(editor: TextEditor): EditableTextEditor {
    return editor as EditableTextEditor;
  }

  public async findInDocument(
    query: string,
    editor?: TextEditor,
  ): Promise<void> {
    if (editor != null && !editor.isActive) {
      await this.getEditableTextEditor(editor).focus();
    }
    await vscode.commands.executeCommand("editor.actions.findWithArgs", {
      searchString: query,
    });
  }

  public async findInWorkspace(query: string): Promise<void> {
    await vscode.commands.executeCommand("workbench.action.findInFiles", {
      query,
    });
  }

  public async openTextDocument(path: string): Promise<TextEditor> {
    const textDocument = await workspace.openTextDocument(path);
    return this.fromVscodeEditor(await window.showTextDocument(textDocument));
  }

  public async openUntitledTextDocument(
    options?: OpenUntitledTextDocumentOptions,
  ): Promise<TextEditor> {
    const textDocument = await workspace.openTextDocument(options);
    return this.fromVscodeEditor(await window.showTextDocument(textDocument));
  }

  public async showInputBox(
    options?: InputBoxOptions,
  ): Promise<string | undefined> {
    return await vscode.window.showInputBox(options);
  }

  public async executeCommand<T>(
    command: string,
    ...args: any[]
  ): Promise<T | undefined> {
    return await vscode.commands.executeCommand(command, ...args);
  }

  public onDidChangeTextDocument(
    listener: (event: TextDocumentChangeEvent) => void,
  ): Disposable {
    return vscodeOnDidChangeTextDocument(listener);
  }

  onDidOpenTextDocument = forwardEvent(
    workspace.onDidOpenTextDocument,
    (document) => new VscodeTextDocumentImpl(document),
  );
  onDidCloseTextDocument = forwardEvent(
    workspace.onDidCloseTextDocument,
    (document) => new VscodeTextDocumentImpl(document),
  );
  onDidChangeActiveTextEditor = forwardEvent(
    window.onDidChangeActiveTextEditor,
    (editor) => (editor == null ? editor : this.fromVscodeEditor(editor)),
  );
  onDidChangeVisibleTextEditors = forwardEvent(
    window.onDidChangeVisibleTextEditors,
    (editors) => editors.map((editor) => this.fromVscodeEditor(editor)),
  );
  onDidChangeTextEditorSelection = forwardEvent(
    window.onDidChangeTextEditorSelection,
    ({ textEditor, selections }) => ({
      textEditor: this.fromVscodeEditor(textEditor),
      selections: selections.map(fromVscodeSelection),
    }),
  );
  onDidChangeTextEditorVisibleRanges = forwardEvent(
    window.onDidChangeTextEditorVisibleRanges,
    ({ textEditor, visibleRanges }) => ({
      textEditor: this.fromVscodeEditor(textEditor),
      visibleRanges: visibleRanges.map(fromVscodeRange),
    }),
  );

  public fromVscodeEditor(editor: vscode.TextEditor): VscodeTextEditorImpl {
    if (!this.editorMap.has(editor)) {
      this.editorMap.set(
        editor,
        new VscodeTextEditorImpl(uuid(), this, editor),
      );
    }
    return this.editorMap.get(editor)!;
  }

  handleCommandError(err: Error) {
    if (err instanceof OutdatedExtensionError) {
      void this.showUpdateExtensionErrorMessage(err);
    } else {
      void vscode.window.showErrorMessage(err.message);
    }
  }

  private async showUpdateExtensionErrorMessage(err: OutdatedExtensionError) {
    const item = await vscode.window.showErrorMessage(
      err.message,
      "Check for updates",
    );

    if (item == null) {
      return;
    }

    await vscode.commands.executeCommand(
      "workbench.extensions.action.checkForUpdates",
    );
  }

  disposeOnExit(...disposables: Disposable[]): () => void {
    this.extensionContext.subscriptions.push(...disposables);

    return () => pull(this.extensionContext.subscriptions, ...disposables);
  }
}
