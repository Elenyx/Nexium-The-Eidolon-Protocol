# PowerShell Command Separator Guidance for Git Operations

## Problem
When running multiple commands in a single line in PowerShell (such as in VS Code's integrated terminal on Windows), the `&&` operator is **not** a valid statement separator. Attempting to use it will result in an error like:

```
The token '&&' is not a valid statement separator in this version.
```

## Solution
Use PowerShell-compatible command separators, such as the semicolon `;`, to chain commands. For example, to add, commit, and push all changes to GitHub in one line, use:

```powershell
git add .; git commit -m "Your commit message"; git push
```

This will work in PowerShell and avoid the error above.

## Summary
- **Do NOT use `&&` in PowerShell.**
- **Use `;` to separate commands.**
- This applies to all multi-step git operations and any other chained commands in PowerShell environments.

---

*This instruction should be included in all relevant onboarding, troubleshooting, and automation documentation for Windows/PowerShell users.*
