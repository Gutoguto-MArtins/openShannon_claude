## 2025-02-28 - Command Injection in windowsPaths.ts via dir command

**Vulnerability:** The `checkPathExists` function in `src/utils/windowsPaths.ts` uses `execSync_DEPRECATED('dir "' + path + '"')`. If a malicious environment variable (e.g. `CLAUDE_CODE_GIT_BASH_PATH`) contains unescaped quotes and shell metacharacters like `&` or `|`, it will lead to command injection.
**Learning:** Shell evaluation (e.g. `shell: true` implicitly used by `execSync`) combined with simple string concatenation for system paths is dangerous because paths can contain characters that the shell interprets as command separators.
**Prevention:** Avoid invoking the shell just to check if a file exists. Use native file system operations like `fs.existsSync` instead, which are completely immune to command injection.

## 2025-02-28 - Command Injection in windowsPaths.ts via where.exe command

**Vulnerability:** The `findExecutable` function in `src/utils/windowsPaths.ts` uses `execSync_DEPRECATED("where.exe " + executable)`. If a malicious executable name contains shell metacharacters like `&` or `|`, it could lead to command injection.
**Learning:** Shell evaluation combined with string interpolation for command execution is unsafe, even for apparently safe inputs like executable names.
**Prevention:** Use array arguments with secure process execution libraries like `execaSync` (with `shell: false` default) to pass variables safely to commands.
