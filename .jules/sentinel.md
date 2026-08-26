## 2025-02-28 - Refactoring which utility to prevent command injection
**Vulnerability:** Command injection vulnerability in the fallback shell execution of `which` / `where.exe` commands in `src/utils/which.ts`.
**Learning:** Even simple utilities like checking for a binary can be abused if dynamic command values are interpolated into an execution string using `shell: true`.
**Prevention:** Always use `execa` and `execaSync` with arguments passed as an array and explicitly set `shell: false` instead of interpolating the variables into the shell command string.
