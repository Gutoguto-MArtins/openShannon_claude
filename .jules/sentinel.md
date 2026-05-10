## 2025-02-14 - [Command Injection in `which`]
**Vulnerability:** Found `execa` with `shell: true` and `execSync` with unsanitized command interpolation in `src/utils/which.ts`.
**Learning:** Utilities that execute commands based on input variables are susceptible to command injection if a shell is spawned.
**Prevention:** Always use `execa` or `child_process` execution functions with array arguments and `shell: false`.
