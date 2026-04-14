## 2025-02-28 - Command Injection Vulnerability in which.ts
**Vulnerability:** The `whichNodeAsync` and `whichNodeSync` functions in `src/utils/which.ts` use string concatenation directly into shell commands (`where.exe ${command}` and `which ${command}`) with `shell: true`.
**Learning:** This is a classic command injection vulnerability. An attacker who controls the `command` variable can execute arbitrary shell commands.
**Prevention:** Instead of string interpolation with `shell: true`, pass arguments as an array to `execa` without `shell: true`. Or, for the specific task of finding executables, consider using robust libraries. Wait, wait, actually, for `where.exe` and `which`, we can just use `execa('where.exe', [command], { reject: false })` which avoids the shell injection!
