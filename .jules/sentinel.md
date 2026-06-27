## 2025-02-18 - [Fix Command Injection in which.ts]
**Vulnerability:** The `which()` function used `execa` with `shell: true` alongside string interpolation, allowing potential command injection (e.g., passing `node && echo pwned`).
**Learning:** `shell: true` usage in external utility wrappers inherently poses a command injection risk when user input is not sanitized or when relying on dynamic execution. In Node.js, `where.exe` and `which` commands do not actually require a shell to run.
**Prevention:** Avoid `shell: true`. Use `execa` with a command and argument array (e.g., `execa('which', [command], { shell: false })`) to eliminate shell interpretation and thus injection risk entirely.
