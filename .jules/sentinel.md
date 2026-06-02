
## 2024-05-18 - [Command Injection via OS Utility Commands]
**Vulnerability:** Command injection in utilities interacting with OS shell-like commands (`which`, `where.exe`, and `dir`), where unescaped user input was interpolated into the command string passed to `execa` with `shell: true` and `execSync_DEPRECATED`.
**Learning:** Even simple utility wrapper functions can introduce CRITICAL shell injection vulnerabilities if they interpolate string arguments directly rather than passing them securely as arrays via child process methods that don't invoke a shell.
**Prevention:** Avoid executing arbitrary inputs as shell commands entirely. Instead, use native node functionalities (e.g. `fs.existsSync` instead of `dir`) or pass arguments as an array alongside `shell: false` to `execa` or `spawn` to prevent the shell from interpreting operators like `;`, `&&`, or pipes.
