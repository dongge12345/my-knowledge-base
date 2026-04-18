# GitHub Pages 部署说明

这份说明基于当前仓库状态，整理了从本地仓库到公开知识库网站上线的具体步骤。

## 已准备完成的内容

仓库里已经包含这些文件：

- `mkdocs.yml`：站点配置
- `docs/index.md`：站点首页
- `scripts/build_catalog.py`：目录与概要生成脚本
- `.github/workflows/deploy-pages.yml`：GitHub Pages 自动部署工作流
- `requirements.txt`：站点构建依赖

也就是说，剩下的工作主要是操作层面的：初始化 Git 仓库、推送到 GitHub，并开启 Pages。

## 首次发布步骤

### 1. 在本地重新初始化 Git 仓库

在项目根目录执行：

```powershell
git init
git branch -M main
git add .
git commit -m "初始化个人知识库站点"
```

### 2. 在 GitHub 创建远程仓库

在 GitHub 上新建一个公开仓库。

建议设置：

- 仓库名：`paipaiHighLevel`
- 可见性：`Public`
- 不要勾选初始化 `README`、`.gitignore` 或 `License`

### 3. 绑定本地仓库与 GitHub 远程仓库

把 `<你的 GitHub 用户名>` 替换成你自己的 GitHub 用户名：

```powershell
git remote add origin https://github.com/<你的 GitHub 用户名>/paipaiHighLevel.git
git push -u origin main
```

### 4. 开启 GitHub Pages

在 GitHub 仓库页面中：

1. 打开 `Settings`
2. 打开 `Pages`
3. 在 `Build and deployment` 中把 `Source` 设为 `GitHub Actions`

完成后，仓库中已经准备好的工作流会自动负责构建和部署。

## 工作流会做什么

每次向 `main` 分支推送时，`.github/workflows/deploy-pages.yml` 都会自动触发。

工作流会依次执行：

1. 检出仓库代码
2. 安装 Python 和站点依赖
3. 运行 `scripts/build_catalog.py`
4. 通过 `mkdocs build` 构建静态站点
5. 将生成的 `site/` 目录部署到 GitHub Pages

## 日常更新方式

首次部署完成后，你平时只需要这样更新：

```powershell
git add .
git commit -m "更新知识库"
git push origin main
```

推送完成后：

- GitHub Actions 会重新生成目录页和概要页
- GitHub Pages 会重新发布站点
- 线上知识库会同步为最新内容

## 预期网站地址

GitHub Pages 第一次部署成功后，网站地址通常是：

```text
https://<你的 GitHub 用户名>.github.io/paipaiHighLevel/
```

## 可选的本地预览

如果你想在推送前先本地预览，可以执行：

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts/build_catalog.py
mkdocs serve
```

然后访问：

```text
http://127.0.0.1:8000/
```

## 常见问题

### 网站没有更新

先打开 GitHub 仓库的 `Actions` 页面，确认最近一次工作流执行成功。

### 自动生成页里的 GitHub 链接没有出现

这些链接依赖 GitHub Actions 构建时自动注入的 `GITHUB_REPOSITORY` 环境变量。本地离线运行时，可能暂时看不到这些链接。

### 自动生成页里显示“未知”更新时间

这通常说明对应文件还没有 Git 提交历史，或者当前目录还没有正确初始化为 Git 仓库。

## 下一步推荐优化

在基础部署跑通之后，下一阶段很适合继续优化站点体验：

- 突出最近更新的日记内容
- 更清晰地区分 PARA 各区域
- 增加标签页或专题索引
- 补一个更有个人风格的首页介绍
