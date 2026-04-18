import * as path from "path";
import * as vscode from "vscode";
import { AssistantConfig } from "../types/material";
import { readJsonFile } from "../utils/fs";

const DEFAULT_CONFIG: AssistantConfig = {
  materials: [],
  resourceDirs: ["src/components"],
  schema: {
    outputDir: ".lowcode-assistant/schema",
    docsDir: ".lowcode-assistant/docs"
  }
};

export class ConfigService {
  static getWorkspaceRoot(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  }

  static getOutputDir(): string | undefined {
    const workspaceRoot = this.getWorkspaceRoot();
    if (!workspaceRoot) {
      return undefined;
    }

    const outputDir = vscode.workspace
      .getConfiguration("lowcodeAssistant")
      .get<string>("outputDir", ".lowcode-assistant");

    return path.join(workspaceRoot, outputDir);
  }

  static loadConfig(): AssistantConfig {
    const workspaceRoot = this.getWorkspaceRoot();
    if (!workspaceRoot) {
      return DEFAULT_CONFIG;
    }

    const configPath = vscode.workspace
      .getConfiguration("lowcodeAssistant")
      .get<string>("configPath", "lowcode-assistant.config.json");

    const resolvedPath = path.join(workspaceRoot, configPath);
    return {
      ...DEFAULT_CONFIG,
      ...readJsonFile<AssistantConfig>(resolvedPath)
    };
  }
}
