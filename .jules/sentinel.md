## 2026-04-18 - Fix Command Injection in Path Checking
**Vulnerability:** A command injection vulnerability existed in `src/utils/windowsPaths.ts` within the `checkPathExists` function. Unsanitized paths were passed directly to a shell command (`dir "${path}"`) via `execSync_DEPRECATED`.
**Learning:** Shell commands should not be used for basic file system operations where native APIs are available and safer. Using native APIs like `fs.existsSync` eliminates the risk of command injection entirely.
**Prevention:** Use native Node.js APIs (e.g., `fs.existsSync`, `fs.promises`) instead of spawning shells for file system checks.
