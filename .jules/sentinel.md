## 2026-59-21 - Command Injection in Path Resolution
**Vulnerability:** The `whichNodeAsync` and `whichNodeSync` functions were executing shell commands directly with `shell: true` (using `execa`) and `execSync_DEPRECATED`. If user-controlled input was passed into the `which` resolution, it could be executed as a command injection.
**Learning:** Utilities that execute shell commands to find file paths or execute other basic tasks shouldn't rely on `shell: true` and template strings, even if they're internal.
**Prevention:** Always use `execa` with `shell: false` and pass arguments as an array instead of string concatenation. Use native Node `child_process.execFileSync` for synchronous executions instead of wrapper string executions.
