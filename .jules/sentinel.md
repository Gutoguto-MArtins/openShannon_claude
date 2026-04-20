## 2024-05-15 - Command Injection in File Path Validation
**Vulnerability:** Command Injection risk in `src/utils/windowsPaths.ts` through unvalidated `path` parameter passed to `execSync_DEPRECATED(\`dir "\${path}"\`)`.
**Learning:** Shell commands should not be used for file system operations, especially when taking untrusted inputs, as they can lead to command injection.
**Prevention:** Use native Node.js filesystem APIs like `fs.existsSync` for checking file existence instead of invoking shell commands.
