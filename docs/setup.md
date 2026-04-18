# GitHub Pages Setup Guide

This guide picks up from the current repository state and shows the exact steps to get the public knowledge base online.

## What Is Already Prepared

The repository already contains these files:

- `mkdocs.yml`: site configuration
- `docs/index.md`: site home page
- `scripts/build_catalog.py`: catalog generator
- `.github/workflows/deploy-pages.yml`: GitHub Pages workflow
- `requirements.txt`: Python dependencies for the site build

That means the remaining work is mostly operational: create a new Git repository, push it to GitHub, and enable Pages.

## First-Time Publishing Steps

### 1. Recreate the local Git repository

Run these commands in the project root:

```powershell
git init
git branch -M main
git add .
git commit -m "Initialize personal knowledge base site"
```

### 2. Create the remote repository on GitHub

Create a new public repository on GitHub.

Recommended settings:

- Repository name: `paipaiHighLevel`
- Visibility: `Public`
- Do not initialize with `README`, `.gitignore`, or `License`

### 3. Bind the local repository to GitHub

Replace `<your-github-name>` with your own GitHub username:

```powershell
git remote add origin https://github.com/<your-github-name>/paipaiHighLevel.git
git push -u origin main
```

### 4. Turn on GitHub Pages

In the GitHub repository page:

1. Open `Settings`
2. Open `Pages`
3. Under `Build and deployment`, set `Source` to `GitHub Actions`

After that, the included workflow will handle the build and deployment automatically.

## What The Workflow Does

Each push to `main` triggers `.github/workflows/deploy-pages.yml`.

The workflow performs these steps:

1. Check out the repository
2. Install Python and site dependencies
3. Run `scripts/build_catalog.py`
4. Build the static site with `mkdocs build`
5. Deploy the generated `site/` folder to GitHub Pages

## How Daily Updates Work

After the first deployment, your daily flow becomes:

```powershell
git add .
git commit -m "Update knowledge base"
git push origin main
```

Once the push finishes:

- GitHub Actions rebuilds the catalog
- GitHub Pages republishes the site
- The online knowledge base reflects the latest Markdown content

## Expected Website Address

Once GitHub Pages finishes the first deployment, the site address is usually:

```text
https://<your-github-name>.github.io/paipaiHighLevel/
```

## Optional Local Preview

If you want to preview locally before pushing:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts/build_catalog.py
mkdocs serve
```

Then open:

```text
http://127.0.0.1:8000/
```

## Troubleshooting

### The site did not update

Check the `Actions` tab on GitHub and confirm that the latest workflow run succeeded.

### GitHub links inside the generated pages are missing

Those links are filled automatically during GitHub Actions builds through the `GITHUB_REPOSITORY` environment variable. They may not appear in an offline local run.

### The generated pages show `Unknown` for last updated time

That usually means the file has no Git commit history yet, or the current directory is not initialized as a Git repository.

## Recommended Next Milestone

After the basic deployment works, the next good milestone is to improve the generated site experience:

- highlight recent diary updates
- separate PARA areas more clearly
- add tags or topic indexes
- add a short custom landing page in your own voice
