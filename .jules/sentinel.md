## 2026-04-22 - [Remove Vulnerable Shell Execution for File Cleanup]
**Vulnerability:** Command injection and shell execution overhead in `src/utils/imagePaste.ts` due to the use of `execa` with `shell: true` to delete temporary files constructed with `CLAUDE_CODE_TMPDIR`.
**Learning:** Even low-level utilities like cleanup functions can introduce command injection risks when constructing shell commands manually instead of using native file system operations.
**Prevention:** Prefer `getFsImplementation().unlink(path)` over executing shell commands like `rm -f "/path"` using `execa({ shell: true })`.

## 2026-04-22 - [Replace Dangerous Shell Commands in Config Execution]
**Vulnerability:** Arbitrary shell command injection in `src/utils/auth.ts` where `execa({ shell: true })` was used to execute commands fetched from settings (e.g., `apiKeyHelper`, `awsCredentialExport`).
**Learning:** Using `shell: true` alongside configuration strings creates a critical vulnerability. Even strings from configuration should be parsed safely.
**Prevention:** Use `shell-quote`'s `parse` function to split the config string into an argument array and execute it safely with `execa(command, args)` without the `shell: true` flag.

## 2026-04-28 - [Minimize Usage of shell: true]
**Vulnerability:** Constructing shell pipelines and sequences using string concatenation and passing them to `execa` with `shell: true` exposes the system to command injection risks. Even when user input is supposedly missing, any environment variable or configuration (like `CLAUDE_CODE_TMPDIR` or `awsAuthRefresh`) interpolated into the string becomes an injection vector.
**Learning:** Functions like `buildLinuxClipboardCheckCommand` return a pipeline (`xclip ... | grep ... || wl-paste ... | grep ...`). If any dynamic data like paths were included in these commands (e.g. `saveImage` or previously `deleteFile`), `shell: true` becomes dangerous.
**Prevention:** Where possible, avoid `shell: true` entirely. If complex pipelines are strictly required for clipboard fetching (like `xclip` piped to `grep`), ensure no user-controlled paths or variables are interpolated into that pipeline without being strictly validated or quoted via `shell-quote`'s `quote` method.

## 2026-04-28 - [Remove Shell: true From Execa Calls]
**Vulnerability:** Invoking `execa` with `shell: true` alongside string concatenation or dynamic strings allows an attacker to break out of the command and execute arbitrary code. Many utility files, such as `src/utils/which.ts`, `src/utils/user.ts`, `src/utils/authPortable.ts`, and installation commands were passing interpolated command strings directly into `execa` running in shell mode.
**Learning:** Any use of `execa` with `shell: true` and concatenated variables is a shell command injection waiting to happen. The proper Node.js usage of `execa` avoids the shell completely by passing the command and its arguments as an array (`execa('git', ['config', '--get', 'user.email'])`).
**Prevention:**
1. Use `execa(command, [args])` without `shell: true`.
2. For cross-platform scripts that rely on OS-specific shell builtins, ensure arguments are properly separated, or explicitly specify the shell without interpolating variables into the shell string.
3. The project convention is to never use `shell: true` for command executions.
