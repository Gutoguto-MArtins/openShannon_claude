## 2025-07-04 - [Fix Command Injection in which utility]
**Vulnerability:** The `which` and `whichSync` utilities in `src/utils/which.ts` were vulnerable to command injection because they passed user-controlled executable names to `execa` and `execSync_DEPRECATED` with `shell: true` and string concatenation.
**Learning:** Utilities resolving system commands dynamically via `which` or `where.exe` must never use shell execution. Attackers can provide payload strings like `node; touch pwned` that compromise the machine during resolution.
**Prevention:** Always use `shell: false` and pass the command and arguments as an array to `execa` or `execaSync` (e.g., `execa('which', [command], { shell: false })`) to prevent injection.
