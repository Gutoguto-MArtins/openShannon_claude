## 2025-02-27 - [Fix Command Injection in which.ts]
**Vulnerability:** Command injection vulnerability in `src/utils/which.ts`. The code was using string interpolation (e.g. ``which ${command}``) combined with shell execution (e.g. `execa` with `shell: true` and `execSync_DEPRECATED`) to find executables. This allows malicious input to execute arbitrary shell commands.
**Learning:** Found string interpolation in shell commands, which bypasses argument escaping and is dangerous when user input is involved.
**Prevention:** Avoid string interpolation with shell commands. Always use array arguments with `shell: false` (e.g., `execa('which', [command], { shell: false })`) to ensure proper escaping and safe execution of binaries without invoking a shell.
