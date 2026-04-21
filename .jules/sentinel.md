## 2025-04-21 - Command Injection in Path Checking

**Vulnerability:** Found `execSync_DEPRECATED('dir "' + path + '"')` and `execSync_DEPRECATED('where.exe ' + executable)` in `src/utils/windowsPaths.ts`. Both commands passed unsanitized arguments directly to a shell executor, allowing for severe command injection if an attacker could control `path` or `executable`.

**Learning:** Shell evaluation methods (`exec`, `execSync_DEPRECATED` with string commands) are dangerous when handling variable input, especially for routine path/file checks where a native Node API exists. Even with simple checks, parameters can be concatenated with malicious operators (e.g., `&` or `|`).

**Prevention:**
1. Always prefer native Node modules like `fs.existsSync`, `fs.promises`, or `path` operations over running shell commands to check for existence or manipulate files.
2. If an external executable like `where.exe` must be run, always use an execution wrapper that does not evaluate a shell string (e.g., `execa` or `execaSync` with arguments passed as an array: `execaSync('cmd', [arg])`).
