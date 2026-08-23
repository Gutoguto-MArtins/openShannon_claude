## 2025-02-23 - [Command Injection Mitigation in Auth Helper Scripts]
**Vulnerability:** User-provided config variables for executing external helper scripts (e.g. `apiKeyHelper`, `awsCredentialExport`, `awsAuthRefresh`, `gcpAuthRefresh`) were being passed directly to `execa` with `shell: true` and `child_process.exec` (which defaults to a shell), potentially allowing command injection.
**Learning:** We can secure this by utilizing `tryParseShellCommand` from `src/utils/bash/shellQuote.js` to parse these configurations into an executable string and an array of arguments.
**Prevention:** Avoid `shell: true` when executing user-defined or externally-sourced strings. Parse commands explicitly into arguments and use `shell: false`.
