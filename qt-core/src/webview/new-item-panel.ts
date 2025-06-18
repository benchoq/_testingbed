// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as vscode from 'vscode';

import { createLogger } from 'qt-lib';
import { QtcliRunner } from '@/qtcli/runner';
import { QtcliAction } from '@/qtcli/common';
import { findQtcliExePath } from '@/qtcli/commands';
import { getUri, getNonce } from './utils';
import { CommandId, Command } from '@/webview/shared/message';
import { NewItemCommandHandler } from './new-item-handlers';
import * as texts from '@/texts';
import { ErrorResponse, Issue } from './shared/types';

const logger = createLogger('new-item-panel');
let qtcliRunner: QtcliRunner | undefined = undefined;

// definitions for webview-panel
const PanelColumn = vscode.ViewColumn.One;
const PanelViewType = 'ViewTypeWizard';

// defintions for webview-ui
const UiDistDir = 'webview-ui/dist/';
const UiJsFile = 'index.js';
const UiCssFile = 'index.css';

// dev
const DevHost = "localhost:5173"
const DevEntryPoint = "src/app/main.ts";

export class NewItemPanel {
  public static instance: NewItemPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _disposables: vscode.Disposable[] = [];
  private readonly _cmdHandler = new NewItemCommandHandler();

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    panel.webview.html = createWebviewContent(panel.webview, context);
    this._disposables = [
      panel.onDidDispose(this.dispose.bind(this)),
      panel.webview.onDidReceiveMessage((m) => {
        this._cmdHandler.dispatch(m);
      })
    ];

    this._panel = panel;
    this._cmdHandler.setPanel(this);
  }

  public dispose() {
    NewItemPanel.instance = undefined;
    this._cmdHandler.dispose();

    while (this._disposables.length) {
      const item = this._disposables.pop();
      if (item) {
        item.dispose();
      }
    }
  }

  public close() {
    this._panel.dispose();
  }

  public static render(context: vscode.ExtensionContext) {
    const uri = context.extensionUri;

    if (!NewItemPanel.instance) {
      const root = vscode.Uri.joinPath(uri, UiDistDir)
      const panel = createWebviewPanel(root);
      NewItemPanel.instance = new NewItemPanel(panel, context);
    }

    void startQtcliServer(uri);
    NewItemPanel.instance._panel.reveal(PanelColumn);
  }

  public post(
    id: CommandId,
    payload: unknown,
    tag: string | undefined = undefined
  ) {
    void this._panel.webview.postMessage({ id, payload, tag });
  }

  public postDataReply(cmd: Command, data: unknown) {
    this.post(cmd.id, { data }, cmd.tag);
  }

  public postErrorReply(cmd: Command, error: unknown) {
    this.post(cmd.id, { error }, cmd.tag);
  }

  public postErrorReplyFrom(cmd: Command, msg: string, details: Issue[]) {
    this.postErrorReply(cmd, {
      error: msg,
      details
    } as ErrorResponse);
  }
}

// helpers
function createWebviewPanel(rootDir: vscode.Uri): vscode.WebviewPanel {
  const option = {
    enableScripts: true,
    localResourceRoots: [rootDir]
  };

  return vscode.window.createWebviewPanel(
    PanelViewType,
    texts.newItem.tabText,
    PanelColumn,
    option
  );
}

function createWebviewContent(webview: vscode.Webview, context: vscode.ExtensionContext) {
  const root = UiDistDir.split('/');
  const baseUri = context.extensionUri;
  const js = getUri(webview, baseUri, [...root, UiJsFile]);
  const css = getUri(webview, baseUri, [...root, UiCssFile]);

  const dev = context.extensionMode === vscode.ExtensionMode.Development;
  const devTags = `
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'none';
        img-src https: data:;
        style-src 'unsafe-inline' http://${DevHost};
        script-src http://${DevHost} 'unsafe-eval';
        connect-src ws://${DevHost} http://${DevHost};
      ">
    <script type="module" src="http://${DevHost}/${DevEntryPoint}"></script>
    `;

  const prodTags = `
    <link rel="stylesheet" type="text/css" href="${css.toString()}">
    <script defer nonce="${getNonce()}" src="${js.toString()}"></script>
    `;

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${dev ? devTags : prodTags}
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
    } else {
      logger.error('cannot find qtcli executable');
      return;
    }
  }

  qtcliRunner.run(QtcliAction.ServerControl, 'start');
}
