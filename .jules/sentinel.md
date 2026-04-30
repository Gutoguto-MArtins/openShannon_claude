## 2024-05-24 - [Command Injection Fixed]
**Vulnerability:** Found `which.ts` performing shell interpolation of arguments with `shell: true`, leaving it open to command injection if a malicious command string was passed.
**Learning:** `execa` should always be passed an array of arguments with `shell: false` to ensure inputs are safely evaluated by the underlying operating system and not parsed as shell commands.
**Prevention:** Always rely on `execa(binary, [args], { shell: false })` instead of string concatenation like `execa(\`binary ${args}\`, { shell: true })`.
