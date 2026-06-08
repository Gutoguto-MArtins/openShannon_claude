## 2024-05-20 - Command Injection in which utility
**Vulnerability:** Command injection vulnerability in `src/utils/which.ts` when resolving command locations.
**Learning:** `execa` combined with `shell: true` and concatenated strings allows for arbitrary command execution when user input is unchecked.
**Prevention:** Use `execa` with array arguments for the executable and parameters, and explicit `shell: false`. Synchronous alternatives like `execSync_DEPRECATED` with raw strings should also be updated to array based arguments such as `execaSync` with `shell: false`.
