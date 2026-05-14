## 2024-05-14 - Prevent Command Injection in Static Shell Commands
**Vulnerability:** Shell-based command injection in `which` / `where.exe` static utility functions that interpolated user/variable-provided commands into a shell directly.
**Learning:** When refactoring static shell commands (e.g. `which/where.exe <cmd>`) to prevent command injection, use `execa` or `execaSync` with `shell: false` by passing the command and arguments as an array.
**Prevention:** Avoid `shell: true` and any deprecated wrappers (e.g., `execSync_DEPRECATED`) that execute in a shell, preferring robust implementations like `execa` or `execaSync` with `shell: false`.
