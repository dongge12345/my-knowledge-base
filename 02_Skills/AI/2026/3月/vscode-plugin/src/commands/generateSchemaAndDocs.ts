import * as path from "path";
import * as vscode from "vscode";
import { ComponentMeta } from "../types/material";
import { ConfigService } from "../services/configService";
import { ComponentParserService } from "../services/componentParserService";
import { SchemaService } from "../services/schemaService";
import { info, warn } from "../utils/messages";

export async function generateSchemaAndDocsCommand(meta?: ComponentMeta): Promise<ComponentMeta | undefined> {
  const editor = vscode.window.activeTextEditor;
  const workspaceRoot = ConfigService.getWorkspaceRoot();
  const config = ConfigService.loadConfig();

  if (!editor || !workspaceRoot) {
    warn("请先打开工作区并选中一个组件源码文件。");
    return undefined;
  }

  const parser = new ComponentParserService();
  const schemaService = new SchemaService();
  const componentMeta = meta ?? parser.extractFromFile(editor.document.uri.fsPath);

  const outputDir = path.join(workspaceRoot, config.schema?.outputDir ?? ".lowcode-assistant/schema");
  const docsDir = path.join(workspaceRoot, config.schema?.docsDir ?? ".lowcode-assistant/docs");
  const artifacts = schemaService.persistArtifacts(outputDir, docsDir, componentMeta);

  info(`Schema 与文档已生成：${path.basename(artifacts.schemaPath)} / ${path.basename(artifacts.docPath)}`);
  return componentMeta;
}
