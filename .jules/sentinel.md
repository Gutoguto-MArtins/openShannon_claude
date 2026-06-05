## 2024-05-18 - [Command Injection via `which`]
**Vulnerability:** Command injection vulnerability existed in `src/utils/which.ts` due to executing `which ${command}` and `where.exe ${command}` using `execa` with `shell: true` and `execSync` which invokes the shell.
**Learning:** Hardcoding a command wrapper like `which` followed by unsanitized user input in a shell environment allows arbitrary code execution (e.g., `which "node; touch pwned"` executes the second command). `execSync` natively spawns a shell in child_process.
**Prevention:** Avoid `shell: true` with `execa` and use `shell: false` passing the executable and arguments as an array instead. Also avoid `execSync_DEPRECATED` entirely and prefer `execaSync` with `shell: false`.
