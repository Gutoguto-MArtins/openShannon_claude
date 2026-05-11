## 2023-10-27 - Command Injection via path checking
**Vulnerability:** Found `execSync_DEPRECATED(\`dir "\${path}"\`)` in `src/utils/windowsPaths.ts`. This passes the user environment variable `CLAUDE_CODE_GIT_BASH_PATH` directly into the shell via string interpolation, allowing trivial command injection.
**Learning:** Checking for file existence via shell commands (`dir`) is both unsafe and incredibly slow. Node's `fs.existsSync()` is the proper API.
**Prevention:** Always use native APIs for file system interactions (e.g. `fs.existsSync`, `fs.promises.stat`) rather than shelling out to system binaries (`dir`, `ls`, `rm`).
