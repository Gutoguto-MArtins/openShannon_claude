## 2026-04-22 - [Remove Vulnerable Shell Execution for File Cleanup]
**Vulnerability:** Command injection and shell execution overhead in `src/utils/imagePaste.ts` due to the use of `execa` with `shell: true` to delete temporary files constructed with `CLAUDE_CODE_TMPDIR`.
**Learning:** Even low-level utilities like cleanup functions can introduce command injection risks when constructing shell commands manually instead of using native file system operations.
**Prevention:** Prefer `getFsImplementation().unlink(path)` over executing shell commands like `rm -f "/path"` using `execa({ shell: true })`.

## 2026-04-22 - [Replace Dangerous Shell Commands in Config Execution]
**Vulnerability:** Arbitrary shell command injection in `src/utils/auth.ts` where `execa({ shell: true })` was used to execute commands fetched from settings (e.g., `apiKeyHelper`, `awsCredentialExport`).
**Learning:** Using `shell: true` alongside configuration strings creates a critical vulnerability. Even strings from configuration should be parsed safely.
**Prevention:** Use `shell-quote`'s `parse` function to split the config string into an argument array and execute it safely with `execa(command, args)` without the `shell: true` flag.
