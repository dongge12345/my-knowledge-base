import * as fs from "fs";
import * as path from "path";
import { AssistantConfig, ResourceEntry } from "../types/material";
import { ensureDirSync, writeJsonFile } from "../utils/fs";

export class ResourceService {
  refreshIndex(workspaceRoot: string, outputDir: string, config: AssistantConfig): ResourceEntry[] {
    const resources: ResourceEntry[] = [];

    for (const dir of config.resourceDirs) {
      const absoluteDir = path.join(workspaceRoot, dir);
      if (!fs.existsSync(absoluteDir)) {
        continue;
      }

      const children = fs.readdirSync(absoluteDir, { withFileTypes: true });
      for (const child of children) {
        if (child.isFile()) {
          resources.push({
            name: child.name,
            path: path.join(absoluteDir, child.name),
            kind: "component"
          });
        }
      }
    }

    for (const material of config.materials) {
      resources.push({
        name: material.name,
        path: material.source,
        kind: "material"
      });
    }

    ensureDirSync(outputDir);
    writeJsonFile(path.join(outputDir, "resource-index.json"), resources);
    return resources;
  }
}
