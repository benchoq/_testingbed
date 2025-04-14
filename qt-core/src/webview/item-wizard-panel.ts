// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from "lodash";
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from "vscode";

import { QtcliRunner } from '@/qtcli/runner';
import { openUri, openFilesUnder, QtcliAction } from "@/qtcli/common";
import {
  findQtcliExePath,
  findWorkingDir,
  getDefaultProjectDirSafe,
  setDefaultProjectDir
} from '@/qtcli/commands';
import { getUri, getNonce } from "./utils";
import { Message, MessageId } from "./shared/message";

let qtcliRunner: QtcliRunner | undefined = undefined;

// definitions for webview-panel
const PanelTitle = "Wizard";
const PanelColumn = vscode.ViewColumn.One;
const PanelViewType = "ViewTypeWizard";

// defintions for webview-ui
const UiRootDir = `webview-ui/dist/`;
const UiJsFile = "index.js";
const UiCssFile = "index.css";

export class ItemWizardPanel {
  public static instance: ItemWizardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _disposables: vscode.Disposable[] = [];
  private _saveWorkDir = true;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    panel.onDidDispose(() => { this.dispose() }, null, this._disposables);
    panel.webview.html = createWebviewContent(panel.webview, extensionUri);
    panel.webview.onDidReceiveMessage(
      this._onMessageFromWebview.bind(this), null, this._disposables
    );

    this._panel = panel;
  }

  public dispose() {
    ItemWizardPanel.instance = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const item = this._disposables.pop();
      if (item) {
        item.dispose();
      }
    }
  }

  public static render(extensionUri: vscode.Uri, type: string) {
    if (!ItemWizardPanel.instance) {
      const p = createWebviewPanel(extensionUri);
      ItemWizardPanel.instance = new ItemWizardPanel(p, extensionUri);
    }

    // TODO: check the lifecycle of qtcli
    startQtcliServer(extensionUri); 

    ItemWizardPanel.instance._panel.reveal(PanelColumn);
    ItemWizardPanel.instance._notify(
      MessageId.Initialize, createDefaultUiConfigs(type));
  }

  private async _notify(messageId: MessageId, payload: unknown) {
    return this._panel.webview.postMessage({ messageId, payload });
  }

  private async _reply(requestId: string, messageId: MessageId, payload: unknown) {
    return this._panel.webview.postMessage({ requestId, messageId, payload });
  }

  private async _onMessageFromWebview(msg: Message) {
    if (msg.requestId) {
      this._onRequest(msg.requestId, msg.messageId, msg.payload)
    } else {
      this._onNotification(msg.messageId, msg.payload)
    }
  }

  private async _onNotification(messageId: MessageId, payload: unknown) {
    if (messageId === MessageId.WizardClosed) {
      this.dispose();
      return;
    }

    if (messageId === MessageId.ItemCreated) {
      const type = _.get(payload, "type", "") as string;
      const files = _.get(payload, "files", []) as string[];
      const filesDir = _.get(payload, "filesDir", "") as string;

      if (type.length !== 0 && filesDir.length !== 0) {
        if (type === "project") {
          if (this._saveWorkDir) {
            let dir = _.get(payload, "workingDir", "") as string;
            if (dir.length !== 0) {
              void setDefaultProjectDir(path.normalize(dir));
            }
          }
          void openUri(vscode.Uri.file(path.normalize(filesDir)));
        } else {
          void openFilesUnder(path.normalize(filesDir), files);
        }
      }

      this.dispose();
      return;
    }

    if (messageId === MessageId.SaveWorkingDirChanged) {
      this._saveWorkDir = _.isEqual(payload, true);
      return;
    }
  }

  private async _onRequest(requestId: string, messageId: MessageId, payload: unknown) {
    if (messageId === MessageId.RequestSelectFolder) {
      const dir = payload?.toString() ?? getDefaultProjectDirSafe();
      const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        canSelectFolders: true,
        canSelectFiles: false,
        openLabel: 'Select directory',
        defaultUri: vscode.Uri.file(dir)
      };

      const folderUri = await vscode.window.showOpenDialog(options);
      if (folderUri && folderUri.length > 0) {
        const folder = folderUri[0]?.fsPath ?? '';
        void this._reply(requestId, messageId, folder);
      }
      return;
    }

    if (messageId === MessageId.RequestCheckDirectoryExists) {
      const exists = fs.existsSync(_.toString(payload))
      void this._reply(requestId, messageId, exists);
    }
  }
}

// helpers
function createDefaultUiConfigs(type: string) {
  const project = (type === "project");
  const workingDir = findWorkingDir(
    project ? QtcliAction.NewProject : QtcliAction.NewFile);

  return {
    type,
    name: (project ? "untitled" : ""),
    workingDir,
    saveWorkingDir: true,
  }
}

function createWebviewPanel(extensionUri: vscode.Uri): vscode.WebviewPanel {
  const option = {
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.joinPath(extensionUri, UiRootDir)
    ]
  }

  return vscode.window.createWebviewPanel(
    PanelViewType, PanelTitle, PanelColumn, option
  );
}

function createWebviewContent(webview: vscode.Webview, baseUri: vscode.Uri) {
  const root = UiRootDir.split("/")
  const js = getUri(webview, baseUri, [...root, UiJsFile]);
  const css = getUri(webview, baseUri, [...root, UiCssFile]);
  const nonce = getNonce();

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Wizard</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" type="text/css" href="${css.toString()}">
        <script defer nonce="${nonce}" src="${js.toString()}"></script>
      </head>
      <body>
        <div id="app"></div>
      </body>
    </html>
  `;
}

async function startQtcliServer(extensionUri: vscode.Uri) {
  if (!qtcliRunner) {
    const exePath = await findQtcliExePath(extensionUri);
    if (exePath) {
      qtcliRunner = new QtcliRunner();
      qtcliRunner.setQtcliExePath(exePath);
    }
  }

  if (qtcliRunner) {
    await qtcliRunner.run(QtcliAction.Server, "start");
    return;
  } 

  console.log("cannot run qtcli")
}
