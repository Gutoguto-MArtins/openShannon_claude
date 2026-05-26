## 2024-05-26 - Command Injection via exec/execSync_DEPRECATED with Shell

**Vulnerability:** Static shell commands (e.g. `which <command>` or `where.exe <command>`) were being executed using `execa` with `shell: true`, `execSync_DEPRECATED` (which uses a shell), or Node's native `child_process.exec` using string interpolation. This leaves them vulnerable to command injection if `command` or other inputs aren't properly sanitized.
**Learning:** Even internal helper methods like `which` or utility scripts can be vulnerable if they are passed unvalidated input and use a shell interpreter implicitly or explicitly. Shell command injection is a critical vulnerability.
**Prevention:** Always use `execa` or `execaSync` with array arguments (`['arg1', 'arg2']`) and `shell: false`. This avoids shell interpolation altogether. Replace `execSync_DEPRECATED` usage with `execaSync` passing array arguments and `shell: false`. Replace native `child_process.exec` usage with `execa` and `shell: false`.
