import * as vscode from "vscode";
import { extractComponentMetaCommand } from "./commands/extractComponentMeta";
import { generateSchemaAndDocsCommand } from "./commands/generateSchemaAndDocs";
import { installMaterialCommand } from "./commands/installMaterial";
import { openSchemaDesignerCommand } from "./commands/openSchemaDesigner";
import { refreshResourcesCommand } from "./commands/refreshResources";
import { MaterialCompletionProvider } from "./providers/materialCompletionProvider";
import { ConfigService } from "./services/configService";

export function activate(context: vscode.ExtensionContext): void {
  let lastMetaPromise: Promise<Awaited<ReturnType<typeof extractComponentMetaCommand>>> | undefined;

  context.subscriptions.push(
    vscode.commands.registerCommand("lowcodeAssistant.extractComponentMeta", async () => {
      lastMetaPromise = extractComponentMetaCommand();
      await lastMetaPromise;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("lowcodeAssistant.generateSchemaAndDocs", async () => {
      const meta = lastMetaPromise ? await lastMetaPromise : undefined;
      lastMetaPromise = generateSchemaAndDocsCommand(meta);
      await lastMetaPromise;
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("lowcodeAssistant.openSchemaDesigner", async () => {
      const meta = lastMetaPromise ? await lastMetaPromise : undefined;
      await openSchemaDesignerCommand(context, meta);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("lowcodeAssistant.installMaterial", installMaterialCommand)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("lowcodeAssistant.refreshResources", refreshResourcesCommand)
  );

  const outputDir = ConfigService.getOutputDir();
  if (outputDir) {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        [
          { language: "javascript" },
          { language: "typescript" },
          { language: "javascriptreact" },
          { language: "typescriptreact" },
          { language: "json" }
        ],
        new MaterialCompletionProvider(outputDir),
        "@",
        "\""
      )
    );
  }
}

export function deactivate(): void {}
