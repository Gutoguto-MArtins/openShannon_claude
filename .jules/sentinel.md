## 2024-05-22 - [Fix] Command Injection in which utility via shell execution
**Vulnerability:** The internal `which` and `whichSync` utility functions constructed dynamic shell commands (e.g. `` `which ${command}` ``) and executed them via `execa` and `execSync_DEPRECATED` with `shell: true`. This pattern allowed command injection if user input ever reached the utility.
**Learning:** Utilities that execute simple bash commands (like `which` or `where.exe`) can easily become attack vectors if `shell: true` is used instead of safe argument arrays.
**Prevention:** Avoid `shell: true` entirely when parsing user-controllable input; use array-based argument passing (`execa('which', [command])`) for safe system calls.
