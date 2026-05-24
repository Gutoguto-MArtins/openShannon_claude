## 2025-02-28 - Command Injection in which.ts
**Vulnerability:** The `which.ts` module constructs shell commands using string interpolation with `execa(which ${command}, { shell: true })` and `execSync(which ${command})`. An attacker can pass a malicious command string like `node && touch pwned` to execute arbitrary commands.
**Learning:** Even simple utility functions like `which` can introduce command injection if they rely on `shell: true` and string concatenation instead of array arguments without a shell.
**Prevention:** Always use array arguments with `shell: false` (or omit `shell` as it defaults to false) for any dynamic command execution, e.g., `execa('which', [command])`.
