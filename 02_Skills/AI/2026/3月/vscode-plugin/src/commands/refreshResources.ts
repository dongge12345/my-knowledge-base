import { ConfigService } from "../services/configService";
import { ResourceService } from "../services/resourceService";
import { info, warn } from "../utils/messages";

export async function refreshResourcesCommand(): Promise<void> {
  const workspaceRoot = ConfigService.getWorkspaceRoot();
  const outputDir = ConfigService.getOutputDir();
  const config = ConfigService.loadConfig();

  if (!workspaceRoot || !outputDir) {
    warn("请先打开工作区。");
    return;
  }

  const resources = new ResourceService().refreshIndex(workspaceRoot, outputDir, config);
  info(`资源索引已刷新，共收集 ${resources.length} 条记录。`);
}
