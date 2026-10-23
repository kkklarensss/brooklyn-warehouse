# Upload this project to GitHub

The source is prepared locally. A GitHub repository has not been created or uploaded by this session.

## 1. Extract and run

Extract the source ZIP and open the `brooklyn-warehouse` folder in VS Code. Open its terminal and check:

```powershell
node --version
npm --version
git --version
```

Use Node.js 24 LTS, npm 11 or later, and Git. Install them first if a command is unavailable. Then:

```powershell
npm ci
npm run dev
```

Open http://localhost:5173. Stop both development services with Ctrl+C.

## 2. Create the repository

1. Sign in at https://github.com/new.
2. Set the repository name to `brooklyn-warehouse`.
3. Select **Private** unless you intend to publish your project source.
4. Leave the README, `.gitignore`, and license initialization options unchecked; this project already has its own files.
5. Create the repository and copy its HTTPS clone URL.

## 3. Initialize Git for the downloaded ZIP

The ZIP excludes Git metadata. From inside `brooklyn-warehouse`, run:

```powershell
git init -b main
git add .
git commit -m "feat: initialize workspace and customer frontend"
```

If Git asks for your name and email, configure the identity you want recorded in commits, then retry the commit:

```powershell
git config user.name "YOUR NAME"
git config user.email "YOUR GITHUB EMAIL OR NOREPLY ADDRESS"
```

These are repository-local settings. Replace the example values with your own.

## 4. Push

Replace `YOUR-USERNAME` below with your GitHub username, or use the exact URL copied from GitHub:

```powershell
git remote add origin https://github.com/YOUR-USERNAME/brooklyn-warehouse.git
git push -u origin main
```

Use Git's browser sign-in prompt when offered. Do not paste an access token into your source files, chat, or the repository URL. GitHub account passwords cannot be used as Git HTTPS passwords.

Verify that the files appear in the repository and that the **Actions** checks finish successfully.

## 5. Save later work

```powershell
git status
git add .
git commit -m "feat: describe your change"
git push
```

Review `git status` before committing. The included `.gitignore` excludes dependencies, build output, and local `.env` configuration. Do not add real customer data or database exports.
