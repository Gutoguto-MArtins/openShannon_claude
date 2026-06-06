## 2024-05-24 - Execa shell: true vulnerabilities
**Vulnerability:** Shell Command Injection through `execa` with `shell: true`
**Learning:** `execa` was being used with string concatenation and `shell: true` for things like `git config`, `gh --version`, `which`, leading to potential shell injection vulnerabilities.
**Prevention:** Always use `execa` with `shell: false` and array arguments, even for static or trusted commands. E.g., `execa('git', ['config', '--get', 'user.email'])`.
