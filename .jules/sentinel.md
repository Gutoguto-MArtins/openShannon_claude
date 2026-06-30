## 2025-02-23 - Command Injection in which utility via shell execution
**Vulnerability:** The `whichNodeAsync` and `whichNodeSync` utilities constructed shell commands by concatenating unsanitized user input into strings (`where.exe ${command}`) and evaluating them via `shell: true` or `execSync_DEPRECATED`. This allowed arbitrary command injection by providing paths like `malicious; echo pwned`.
**Learning:** Utilities that just lookup binary paths must not invoke a shell context. String interpolation in shell commands is dangerous, especially in low-level utilities exposed system-wide.
**Prevention:** Always pass the executable and user input arguments as elements of an array to `execa` or `execaSync` along with the `{ shell: false }` option instead of building single-string commands.
