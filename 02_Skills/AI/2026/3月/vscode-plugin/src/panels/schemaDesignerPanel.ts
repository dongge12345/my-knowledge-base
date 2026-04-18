import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { ComponentMeta } from "../types/material";

export class SchemaDesignerPanel {
  private static currentPanel: vscode.WebviewPanel | undefined;

  static createOrShow(context: vscode.ExtensionContext, meta?: ComponentMeta): void {
    const column = vscode.ViewColumn.Beside;

    if (this.currentPanel) {
      this.currentPanel.reveal(column);
      void this.currentPanel.webview.postMessage({
        type: "component-meta",
        payload: meta
      });
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "lowcodeSchemaDesigner",
      "Lowcode Schema Designer",
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, "webview-ui", "dist")
        ]
      }
    );

    this.currentPanel = panel;
    panel.webview.html = this.getHtml(context, panel.webview);
    panel.webview.onDidReceiveMessage((message) => {
      if (message?.type === "ready" && meta) {
        void panel.webview.postMessage({
          type: "component-meta",
          payload: meta
        });
      }
    });
    panel.onDidDispose(() => {
      this.currentPanel = undefined;
    });
  }

  private static getHtml(context: vscode.ExtensionContext, webview: vscode.Webview): string {
    const distDir = path.join(context.extensionPath, "webview-ui", "dist");

    if (!fs.existsSync(distDir)) {
      return `<!DOCTYPE html>
<html lang="zh-CN">
  <body>
    <h2>Lowcode Schema Designer</h2>
    <p>Webview 子应用尚未构建，请先执行 <code>npm install</code> 与 <code>npm run build</code>。</p>
  </body>
</html>`;
    }

    const indexPath = path.join(distDir, "index.html");
    let html = fs.readFileSync(indexPath, "utf8");

    html = html.replace(
      /(?:src|href)="(.+?)"/g,
      (match, assetPath: string) => {
        if (assetPath.startsWith("http")) {
          return match;
        }

        const normalizedAssetPath = assetPath.replace(/^\/+/, "");
        const assetUri = webview.asWebviewUri(vscode.Uri.file(path.join(distDir, normalizedAssetPath)));
        return match.replace(assetPath, assetUri.toString());
      }
    );

    return html;
  }
}
