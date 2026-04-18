import * as vscode from "vscode";
import { ConfigService } from "../services/configService";
import { MaterialInstallerService } from "../services/materialInstallerService";
import { warn } from "../utils/messages";

export async function installMaterialCommand(): Promise<void> {
  const config = ConfigService.loadConfig();
  if (!config.materials.length) {
    warn("当前配置中没有可安装物料，请先维护 lowcode-assistant.config.json。");
    return;
  }

  const picked = await vscode.window.showQuickPick(
    config.materials.map((material) => ({
      label: material.name,
      description: material.description,
      detail: material.version,
      material
    })),
    {
      placeHolder: "选择要安装的物料"
    }
  );

  if (!picked) {
    return;
  }

  const plan = new MaterialInstallerService().buildInstallPlan(picked.material);
  void vscode.window.showInformationMessage(`建议执行：${plan}`);
}
