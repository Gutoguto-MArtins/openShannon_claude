## 2024-05-23 - Command Injection in command resolution (which/where.exe)
**Vulnerability:** `whichNodeAsync` and `whichNodeSync` in `src/utils/which.ts` used `execa` with `shell: true` and string interpolation, enabling critical command injection if arbitrary untrusted strings are used to resolve executable paths.
**Learning:** Shell string wrappers for native Node commands make it easy to inadvertently expose shell evaluation semantics even when simply executing standard system binaries like `which` or `where.exe`.
**Prevention:** Always use `execa` or `execaSync` with array arguments for executable and parameters, and explicitly set `shell: false`. Avoid `child_process.execSync` wrapper functions like `execSync_DEPRECATED` which rely on string execution contexts.
