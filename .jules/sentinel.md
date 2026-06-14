## 2024-06-14 - [Command Injection in which.ts]
**Vulnerability:** Command injection was present in `src/utils/which.ts`. The arguments passed to `whichNodeAsync` and `whichNodeSync` were directly interpolated into strings and executed with a shell (`shell: true` and `execSync_DEPRECATED`). A malicious command name (like `node; touch pwned`) would execute the injected payload.
**Learning:** `execa` with `shell: true` or `execSync_DEPRECATED` (which wraps `child_process.execSync`) evaluating dynamic user input directly causes command injection.
**Prevention:** Avoid `shell: true` and interpolation. Refactored both functions to use `execa` and `execaSync` with `shell: false`, passing the executable and arguments separately in an array.
