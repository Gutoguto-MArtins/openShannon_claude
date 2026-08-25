## 2025-02-23 - [Command Injection Mitigation in Exec Utilities]
**Vulnerability:** Found command injection in `src/utils/which.ts` where user input was passed to `execa` with `shell: true` and `execSync_DEPRECATED` using string interpolation (`where.exe ${command}`).
**Learning:** Even internal utilities like `which` can introduce critical vulnerabilities if they rely on shell evaluation for dynamic input. `execSync_DEPRECATED` inherently uses a shell when provided a string.
**Prevention:** Replace all `shell: true` instances executing dynamic input with `shell: false` and array arguments (e.g. `execa('which', [command])`). Use `execaSync` with `shell: false` to securely handle synchronous execution instead of Node's blocking `execSync`.
