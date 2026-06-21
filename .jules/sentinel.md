
## 2024-05-18 - [Command Injection via execa shell: true]
**Vulnerability:** Found a Command Injection vulnerability in `src/utils/which.ts`. Both `execa` and `execSync_DEPRECATED` were being called with `shell: true` and concatenating untrusted user input directly into the shell string (`which ${command}`).
**Learning:** `execa` combined with `shell: true` is just as vulnerable to Command Injection as `child_process.exec`. Because `which` dynamically runs a command based on user input, attackers could append `&& touch /tmp/pwned` to execute arbitrary commands.
**Prevention:** When running dynamic commands through Node, always use `shell: false` (the default for `execa`). Separate the command and its arguments into an array (e.g. `execa('which', [command])`) so that shell operators like `&&` or `;` are treated as literal arguments rather than executed. Also, use `execaSync` with `shell: false` as a replacement for synchronous operations rather than Node's native `execSync`.
