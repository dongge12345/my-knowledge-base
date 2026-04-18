import { MaterialDefinition } from "../types/material";

export class MaterialInstallerService {
  buildInstallPlan(material: MaterialDefinition): string {
    const versionSuffix = material.version ? `@${material.version}` : "";
    return `npm install ${material.name}${versionSuffix}`;
  }
}
