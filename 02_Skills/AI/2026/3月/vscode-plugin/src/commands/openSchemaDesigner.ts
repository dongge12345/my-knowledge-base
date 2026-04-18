import * as vscode from "vscode";
import { ComponentMeta } from "../types/material";
import { SchemaDesignerPanel } from "../panels/schemaDesignerPanel";

export async function openSchemaDesignerCommand(
  context: vscode.ExtensionContext,
  meta?: ComponentMeta
): Promise<void> {
  SchemaDesignerPanel.createOrShow(context, meta);
}
