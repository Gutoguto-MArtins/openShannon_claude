## 2025-05-29 - Command Injection in `which` Utility
**Vulnerability:** Command injection in `which` and `whichSync` utility functions (located in `src/utils/which.ts`).
**Learning:** Hardcoding `shell: true` and using template string interpolation (e.g., ``execa(`which ${command}`, { shell: true })``) inside shell commands exposes the application to command injection if the user has control over the command.
**Prevention:** Avoid `shell: true` whenever possible when processing user-provided command strings. Instead, use an argument array with `{ shell: false }` to execute processes without invoking an intermediary shell that interprets shell metacharacters like `;`, `&&`, etc.
