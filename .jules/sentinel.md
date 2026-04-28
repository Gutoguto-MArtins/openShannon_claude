## 2026-04-22 - [Remove Vulnerable Shell Execution for File Cleanup]
**Vulnerability:** Command injection and shell execution overhead in `src/utils/imagePaste.ts` due to the use of `execa` with `shell: true` to delete temporary files constructed with `CLAUDE_CODE_TMPDIR`.
**Learning:** Even low-level utilities like cleanup functions can introduce command injection risks when constructing shell commands manually instead of using native file system operations.
**Prevention:** Prefer `getFsImplementation().unlink(path)` over executing shell commands like `rm -f "/path"` using `execa({ shell: true })`.
