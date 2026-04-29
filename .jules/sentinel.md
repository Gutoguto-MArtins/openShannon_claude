## 2025-02-14 - Fix command injection in authPortable via shell interpolation

**Vulnerability:** Command injection vulnerability in `src/utils/authPortable.ts` where `shell: true` combined with string interpolation of `storageServiceName` in `security delete-generic-password -a $USER -s "${storageServiceName}"` allowed potential attackers to execute arbitrary shell commands.
**Learning:** `execa` with `shell: true` and template literal variables creates injection risks even when parameters like `storageServiceName` might appear internally derived, as they can unexpectedly resolve to malicious payloads depending on the environment.
**Prevention:** Avoid `shell: true` entirely. Convert shell variables like `$USER` to `process.env.USER || ''` inside Node.js, and pass arguments cleanly as an array string `['delete-generic-password', '-a', process.env.USER || '', '-s', storageServiceName]` to prevent shell interpretation.
