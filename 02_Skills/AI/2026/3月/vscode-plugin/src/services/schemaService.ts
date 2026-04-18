import * as path from "path";
import { ComponentMeta } from "../types/material";
import { writeJsonFile, writeTextFile } from "../utils/fs";

interface JsonSchemaProperty {
  type: string;
  title: string;
}

export class SchemaService {
  generateSchema(meta: ComponentMeta): Record<string, unknown> {
    const properties = meta.props.reduce<Record<string, JsonSchemaProperty>>((current, prop) => {
      current[prop.name] = {
        type: prop.type === "TSBooleanKeyword" ? "boolean" : prop.type,
        title: prop.name
      };
      return current;
    }, {});

    return {
      title: `${meta.componentName}Schema`,
      type: "object",
      properties,
      "x-component-methods": meta.methods,
      "x-component-slots": meta.slots
    };
  }

  generateMarkdown(meta: ComponentMeta): string {
    const propsTable = meta.props.length
      ? meta.props.map((prop) => `| ${prop.name} | ${prop.type} | ${prop.required ? "Y" : "N"} |`).join("\n")
      : "| - | - | - |";

    const methodTable = meta.methods.length
      ? meta.methods.map((method) => `| ${method.name} | ${method.params.join(", ")} |`).join("\n")
      : "| - | - |";

    const slotTable = meta.slots.length
      ? meta.slots.map((slot) => `| ${slot.name} |`).join("\n")
      : "| - |";

    return `# ${meta.componentName}

## Source

\`${meta.sourceFile}\`

## Props

| Name | Type | Required |
| --- | --- | --- |
${propsTable}

## Methods

| Name | Params |
| --- | --- |
${methodTable}

## Slots

| Name |
| --- |
${slotTable}
`;
  }

  persistArtifacts(outputDir: string, docsDir: string, meta: ComponentMeta): { schemaPath: string; docPath: string } {
    const schemaPath = path.join(outputDir, `${meta.componentName}.schema.json`);
    const docPath = path.join(docsDir, `${meta.componentName}.md`);

    writeJsonFile(schemaPath, this.generateSchema(meta));
    writeTextFile(docPath, this.generateMarkdown(meta));

    return { schemaPath, docPath };
  }
}
