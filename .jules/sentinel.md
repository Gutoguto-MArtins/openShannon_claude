## 2024-05-24 - Command Injection in Utility Wrappers

**Vulnerability:** Shell command injection via string interpolation into `execa` with `shell: true` and `execSync_DEPRECATED` in the `whichNodeAsync` and `whichNodeSync` functions. An attacker-controlled utility command (like "foo; touch pwned.txt") would execute arbitrary code.
**Learning:** Even internal utility wrappers that resolve command locations (like `which`) are vulnerable if they execute shell commands using string formatting. We must never use `shell: true` with unsanitized arguments.
**Prevention:** Use `execa` or `execaSync` with `shell: false` and pass command-line parameters as an array instead of concatenating them into a single command string.
