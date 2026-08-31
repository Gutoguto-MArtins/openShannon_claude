## 2025-02-14 - Prevent Command Injection in which Utility
**Vulnerability:** Command injection was possible in `whichNodeAsync` and `whichNodeSync` because the input `command` was concatenated into a string and executed with `shell: true` (or `execSync` which spawns a shell).
**Learning:** Even internal utility functions like `which` that accept command names can become vectors for command injection if used dynamically.
**Prevention:** Use `execa` or `execaSync` with array arguments for the command and `shell: false` to ensure inputs are treated as arguments, not executable shell code.
