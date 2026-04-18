import * as fs from "fs";
import * as path from "path";
import { parse } from "@babel/parser";
import traverse, { NodePath, Visitor } from "@babel/traverse";
import * as t from "@babel/types";
import { ComponentField, ComponentMeta, ComponentMethod, ComponentSlot } from "../types/material";

function inferType(node: t.Node | null | undefined): string {
  if (!node) {
    return "unknown";
  }

  if (t.isTSStringKeyword(node)) {
    return "string";
  }

  if (t.isTSNumberKeyword(node)) {
    return "number";
  }

  if (t.isTSBooleanKeyword(node)) {
    return "boolean";
  }

  if (t.isStringLiteral(node)) {
    return "string";
  }

  if (t.isNumericLiteral(node)) {
    return "number";
  }

  if (t.isBooleanLiteral(node)) {
    return "boolean";
  }

  if (t.isIdentifier(node)) {
    return node.name;
  }

  return node.type;
}

function readObjectFields(node: t.ObjectExpression, bucket: ComponentField[]): void {
  for (const property of node.properties) {
    if (t.isObjectProperty(property) && t.isIdentifier(property.key)) {
      bucket.push({
        name: property.key.name,
        type: inferType(property.value),
        required: false
      });
    }
  }
}

function readMethods(node: t.ObjectExpression, bucket: ComponentMethod[]): void {
  for (const property of node.properties) {
    if (t.isObjectMethod(property) && t.isIdentifier(property.key)) {
      bucket.push({
        name: property.key.name,
        params: property.params.map((param) => (t.isIdentifier(param) ? param.name : "arg"))
      });
    }

    if (
      t.isObjectProperty(property) &&
      t.isIdentifier(property.key) &&
      (t.isArrowFunctionExpression(property.value) || t.isFunctionExpression(property.value))
    ) {
      bucket.push({
        name: property.key.name,
        params: property.value.params.map((param) => (t.isIdentifier(param) ? param.name : "arg"))
      });
    }
  }
}

function readSlots(node: t.ObjectExpression, bucket: ComponentSlot[]): void {
  for (const property of node.properties) {
    if (t.isObjectProperty(property) && t.isIdentifier(property.key)) {
      bucket.push({
        name: property.key.name
      });
    }
  }
}

function visitComponentOptions(pathRef: NodePath<t.ObjectExpression>, meta: ComponentMeta): void {
  for (const property of pathRef.node.properties) {
    if (!t.isObjectProperty(property) || !t.isIdentifier(property.key)) {
      continue;
    }

    if (property.key.name === "props" && t.isObjectExpression(property.value)) {
      readObjectFields(property.value, meta.props);
    }

    if (property.key.name === "methods" && t.isObjectExpression(property.value)) {
      readMethods(property.value, meta.methods);
    }

    if (property.key.name === "slots" && t.isObjectExpression(property.value)) {
      readSlots(property.value, meta.slots);
    }
  }
}

export class ComponentParserService {
  extractFromFile(filePath: string): ComponentMeta {
    const source = fs.readFileSync(filePath, "utf8");
    const componentName = path.basename(filePath, path.extname(filePath));
    const meta: ComponentMeta = {
      componentName,
      sourceFile: filePath,
      props: [],
      methods: [],
      slots: []
    };

    const ast = parse(source, {
      sourceType: "unambiguous",
      plugins: ["typescript", "jsx", "decorators-legacy"]
    });

    const visitor: Visitor = {
      ExportDefaultDeclaration(exportPath: NodePath<t.ExportDefaultDeclaration>) {
        if (t.isObjectExpression(exportPath.node.declaration)) {
          visitComponentOptions(exportPath.get("declaration") as NodePath<t.ObjectExpression>, meta);
        }
      },
      ObjectExpression(objectPath: NodePath<t.ObjectExpression>) {
        const hasInterestingKeys = objectPath.node.properties.some(
          (property: t.ObjectProperty | t.ObjectMethod | t.SpreadElement) =>
            t.isObjectProperty(property) &&
            t.isIdentifier(property.key) &&
            ["props", "methods", "slots"].includes(property.key.name)
        );

        if (hasInterestingKeys) {
          visitComponentOptions(objectPath, meta);
        }
      }
    };

    traverse(ast, visitor);

    return meta;
  }
}
