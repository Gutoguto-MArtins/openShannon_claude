## 2025-02-21 - [Critical] Prevent shell command injection in clipboard fallback

**Vulnerability:** Command injection in image clipboard fetching fallback (`src/utils/imagePaste.ts`), where a dynamic environment path (`$CLAUDE_CODE_TMPDIR`) mapped to `screenshotPath` was directly interpolated via template literals into `shell: true` invocations of `execa`, `osascript`, `xclip`, `wl-paste` and `powershell`. Also `void execa(commands.deleteFile, { shell: true })` interpolated the path directly into a deletion string.

**Learning:** Shell strings generated dynamically from user-controllable environment variables like `TMPDIR` can result in command injection, bypassing typical file/directory security policies if they are invoked inside `.execa` calls with `shell: true`. Even though the local OS controls the TMPDIR, passing it securely inside bash contexts requires a parameterized approach without inline string interpolation.

**Prevention:**
1. Use native NodeJS wrappers like `getFsImplementation().unlink(path)` wherever possible instead of shell commands like `rm -f`.
2. When shelling out is strictly required for OS APIs (e.g. `osascript` or `powershell`), securely pass dynamic values through the `.execa` environment variables object (`env: { ...process.env, SCREENSHOT_PATH: screenshotPath }`) and access the variables on the executing platform using platform-specific getters: `system attribute "SCREENSHOT_PATH"` on OSX, `"$SCREENSHOT_PATH"` on Linux/WSL, and `$env:SCREENSHOT_PATH` on Windows.
