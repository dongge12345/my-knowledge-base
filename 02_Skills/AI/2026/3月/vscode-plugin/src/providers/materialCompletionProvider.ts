import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { ResourceEntry } from "../types/material";
import { readJsonFile } from "../utils/fs";

export class MaterialCompletionProvider implements vscode.CompletionItemProvider {
  constructor(private readonly outputDir: string) {}

  provideCompletionItems(): vscode.ProviderResult<vscode.CompletionItem[]> {
    const indexPath = path.join(this.outputDir, "resource-index.json");
    if (!fs.existsSync(indexPath)) {
      return [];
    }

    const entries = readJsonFile<ResourceEntry[]>(indexPath) ?? [];
    return entries.map((entry) => {
      const item = new vscode.CompletionItem(entry.name, vscode.CompletionItemKind.Module);
      item.detail = `${entry.kind} · ${entry.path}`;
      return item;
    });
  }
}
