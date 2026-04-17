## 2025-04-17 - Command Injection in Exec Wrapper Calls
**Vulnerability:** Command strings in `src/utils/which.ts` were interpolated directly into shell execution using `execa` with `shell: true` or `execSync_DEPRECATED`. This exposed the application to command injection if an attacker could control the `command` variable.
**Learning:** Legacy wrappers and native child_process APIs can be dangerous when used with shell interpolation. Specifically, avoiding `shell: true` and utilizing modern wrappers passing arguments as arrays is required.
**Prevention:** Always use `execa` or `execaSync` with array arguments instead of string interpolation, ensuring `shell: false` (which is the default).
