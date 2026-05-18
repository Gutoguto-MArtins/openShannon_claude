## 2025-05-18 - [Critical] Command Injection in which() Utility
**Vulnerability:** Command injection in `which()` and `whichSync()` utilities due to usage of `shell: true` and direct string interpolation (`execa(\`which ${command}\`, { shell: true })`).
**Learning:** Utilities resolving system binaries often accept user-provided or environment-derived input (e.g., config strings or process environments). Using shell execution for such simple path resolution tasks creates an unnecessary and critical command injection risk.
**Prevention:** Always use `execa` or native child process methods with array-based argument passing and `shell: false` for direct binary invocations. Refactored static shell commands to `execa('which', [command], { shell: false })`.
