import * as vscode from "vscode";
import { ComponentMeta } from "../types/material";
import { ComponentParserService } from "../services/componentParserService";
import { info, warn } from "../utils/messages";

export async function extractComponentMetaCommand(): Promise<ComponentMeta | undefined> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    warn("请先打开一个组件源码文件。");
    return undefined;
  }

  const parser = new ComponentParserService();
  const meta = parser.extractFromFile(editor.document.uri.fsPath);
  info(`已抽取组件元信息：${meta.componentName}`);
  return meta;
}
