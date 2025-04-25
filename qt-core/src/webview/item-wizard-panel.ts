// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import _ from "lodash";
import * as path from 'path';
import * as vscode from "vscode";

import { QtcliRunner } from '@/qtcli/runner';
import { QtcliAction, openFilesUnder, openUri } from "@/qtcli/common";
import { QtcliRestClient, QtcliRestRequest } from "@/qtcli/rest";
import {
  findQtcliExePath,
  findWorkingDir,
  getDefaultProjectDirSafe,
  setDefaultProjectDir
} from '@/qtcli/commands';
import { getUri, getNonce } from "./utils";
import { 
  PushMessageId, PushMessage, 
  isPushMessage, isCallMessage, 
  CallMessage, CallMessageId, 
} from "./shared/message";

const qtcliApi = new QtcliRestClient();
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

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    panel.onDidDispose(() => { this.dispose() }, null, this._disposables);
    panel.webview.html = createWebviewContent(panel.webview, extensionUri);
    panel.webview.onDidReceiveMessage((m: any) => {
      if (isPushMessage(m)) {
        this._onDidReceivePushMessage(m as PushMessage);
      } else if (isCallMessage(m)) {
        this._onDidReceiveCallMessage(m as CallMessage);
      } else {
        console.warn("Unknown message");
      }
    });

    this._panel = panel;
  }

  public dispose() {
    qtcliApi.delete("/server");
    ItemWizardPanel.instance = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const item = this._disposables.pop();
      if (item) {
        item.dispose();
      }
    }
  }

  public static render(extensionUri: vscode.Uri) {
    if (!ItemWizardPanel.instance) {
      const p = createWebviewPanel(extensionUri);
      ItemWizardPanel.instance = new ItemWizardPanel(p, extensionUri);
    }

    // TODO: check the lifecycle of qtcli
    startQtcliServer(extensionUri); 

    ItemWizardPanel.instance._panel.reveal(PanelColumn);
    ItemWizardPanel.instance._push(PushMessageId.PanelInit, createInitData());
  }

  private async _push(id: PushMessageId, data: unknown) {
    const p: PushMessage = { id, data };
    return this._panel.webview.postMessage(p);
  }

  private async _reply(id: CallMessageId, tag: string, data: unknown) {
    const c: CallMessage = { id, tag, data };
    return this._panel.webview.postMessage(c);
  }

  private async _onDidReceivePushMessage(p: PushMessage) {
    if (p.id === PushMessageId.ViewClosed) {
      this.dispose();
      return;
    }
  }

  private async _onDidReceiveCallMessage(r: CallMessage) {
    if (r.id === CallMessageId.ViewSelectWorkingDir) {
      const dir = r.data?.toString() ?? getDefaultProjectDirSafe();
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
        void this._reply(r.id, r.tag, folder);
      }

      // TODO: send a proper reply when cancelled.
      return;
    }

    if (r.id === CallMessageId.ViewCallQtcliApi) {
      qtcliApi
        .call(r.data as QtcliRestRequest) // TODO: check casting
        .then((res: any) => { this._reply(r.id, r.tag, res); });

      // TODO: send error status thru reply.
      return;
    }

    if (r.id === CallMessageId.ViewCreateItem) {
      qtcliApi
        .call({ method: 'post', endpoint: '/items', data: r.data })
        .then((res: any) => {
          openItemsFromQtcliResponseData(res.data);
          this._reply(r.id, r.tag, res);
          this.dispose();
        });

      return;
    }
  }
}

// helpers
function createInitData() {
  const project = true;
  const workingDir = findWorkingDir(
    project ? QtcliAction.NewProject : QtcliAction.NewFile);

  return {
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

function openItemsFromQtcliResponseData(data: any) {
  const type = _.get(data, "type", "") as string;
  const files = _.get(data, "files", []) as string[];
  const filesDir = _.get(data, "filesDir", "") as string;

  if (type.length === 0 || filesDir.length === 0) {
    return;
  }

  if (type === "project") {
    if (_.get(data, "saveWorkingDir", false) as boolean) {
      let dir = _.get(data, "workingDir", "") as string;
      if (dir.length !== 0) {
        void setDefaultProjectDir(path.normalize(dir));
      }
    }
    
    void openUri(vscode.Uri.file(path.normalize(filesDir)));
  } else {
    void openFilesUnder(path.normalize(filesDir), files);
  }
}