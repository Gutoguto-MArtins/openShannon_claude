## 2024-05-24 - Command Injection via which

**Vulnerability:** Command injection vulnerability in `src/utils/which.ts`. The functions `whichNodeAsync` and `whichNodeSync` accepted a user-provided string `command` and passed it directly to `execa` or `execSync_DEPRECATED` with string interpolation and `shell: true` (or an equivalent shell execution). If a malicious string such as `node && echo pwned` was passed, it would result in arbitrary command execution.

**Learning:** Shell command injection occurs when untrusted input is interpolated directly into a command string that is executed via a shell. Using `shell: true` makes standard shell operators available, allowing injection.

**Prevention:** Always use array-based arguments (e.g. `['command', 'args']`) along with `shell: false` when executing external programs using `execa` or `execaSync`. This forces the runtime to bypass the shell parser completely and treat the inputs strictly as arguments to the executable.
