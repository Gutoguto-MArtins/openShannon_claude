## 2024-04-23 - Command injection in which utility
**Vulnerability:** Command injection in `which` and `whichSync` utilities when executing `execa(\`which \${command}\`, { shell: true })` and `execSync_DEPRECATED`.
**Learning:** Checking for command existence by evaluating input directly within a shell context is risky if the input command name is controllable and unescaped. Using `shell: true` with dynamic arguments leads to shell execution of metacharacters (e.g. `node; touch file`).
**Prevention:** Always pass arguments as an array to `execa` or `execaSync` when executing processes dynamically, and never enable `shell: true` unless strictly necessary and with fully sanitized inputs.
