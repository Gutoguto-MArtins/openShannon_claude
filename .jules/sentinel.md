
## 2025-06-19 - [Command Injection in Utility Functions]
**Vulnerability:** The internal `which` and `whichSync` utility functions were susceptible to command injection because they concatenated user-provided command strings directly into shell execution contexts (using `execa` with `shell: true` and `execSync_DEPRECATED` which acts like `execSync`).
**Learning:** Even seemingly benign wrapper functions (like `which` meant to just locate paths) can introduce critical command injection if they rely on shell invocation without sanitization. It was mistakenly assumed that command names wouldn't contain shell operators (`;`, `&`, `|`).
**Prevention:** Avoid `shell: true` execution for command wrappers. Use `execa` or `execaSync` with array argument formatting (e.g. `['which', command]`) and `shell: false` so that the runtime treats the arguments strictly as parameters, nullifying any shell operators.
