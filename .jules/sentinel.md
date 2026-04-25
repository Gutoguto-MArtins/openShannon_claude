## 2025-05-18 - Avoid Shell Injection in Execa With User Input
**Vulnerability:** Shell command injection vulnerability identified in `src/utils/which.ts`. The implementation used `execa(\`which ${command}\`, { shell: true })` where `command` could potentially be user-controlled data. This allows an attacker to inject arbitrary shell commands.
**Learning:** String interpolation combined with `shell: true` in `execa` is a critical command injection pattern in Node.js applications, as standard shell parsing evaluates injected semicolons or logical operators.
**Prevention:** Avoid `shell: true` when executing commands with variable inputs. Pass command arguments as an array (`execa('which', [command], { reject: false })`) which handles escaping naturally and is safe from shell injection.
