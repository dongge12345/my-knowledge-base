export interface ComponentField {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}

export interface ComponentMethod {
  name: string;
  params: string[];
  description?: string;
}

export interface ComponentSlot {
  name: string;
  description?: string;
}

export interface ComponentMeta {
  componentName: string;
  sourceFile: string;
  props: ComponentField[];
  methods: ComponentMethod[];
  slots: ComponentSlot[];
}

export interface MaterialDefinition {
  name: string;
  source: "npm" | "git" | "local";
  version?: string;
  description?: string;
}

export interface AssistantConfig {
  materials: MaterialDefinition[];
  resourceDirs: string[];
  schema?: {
    outputDir?: string;
    docsDir?: string;
  };
}

export interface ResourceEntry {
  name: string;
  path: string;
  kind: "component" | "schema" | "document" | "material";
}
