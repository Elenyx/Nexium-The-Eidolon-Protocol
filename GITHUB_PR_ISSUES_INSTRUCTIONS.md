# How to open the PR and create issues locally

Run these commands locally where `gh` CLI is installed and you are authenticated.

1. Create a feature branch and push (if not already):

```powershell
cd "D:\Nexium\Nexium Eidolon\Nexium-The-Eidolon-Protocol"
git checkout -b feature/bot-web-sync-plan
git push -u origin feature/bot-web-sync-plan
```

2. Create a PR from your local branch (opens in interactive flow):

```powershell
gh pr create --title "docs(plan): add BOT_WEB_SYNCHRONIZATION_PLAN.md" --body "Adds the BOT_WEB_SYNCHRONIZATION_PLAN.md and outlines the bot↔web synchronization roadmap." --head feature/bot-web-sync-plan --base main
```

3. Create the top-priority issues (examples):

```powershell
gh issue create --title "/synthesize command (bot)" --body "Implement /synthesize command: Grid-based crafting interface, material combination logic, quality tiers. See BOT_WEB_SYNCHRONIZATION_PLAN.md" --label "priority:high"

gh issue create --title "/trade command (bot)" --body "Implement /trade command: Secure P2P trading interface, item and Cred exchange. See BOT_WEB_SYNCHRONIZATION_PLAN.md" --label "priority:high"

gh issue create --title "/skill command (bot)" --body "Implement /skill command: Eidolon skill execution and cooldowns. See BOT_WEB_SYNCHRONIZATION_PLAN.md" --label "priority:medium"

gh issue create --title "/party system (bot)" --body "Implement /party: party formation and dungeon coordination. See BOT_WEB_SYNCHRONIZATION_PLAN.md" --label "priority:medium"

gh issue create --title "Verify market_listings table exists in schema" --body "Confirm market_listings table presence and correctness across schema, seeds, and migrations. See BOT_WEB_SYNCHRONIZATION_PLAN.md" --label "priority:high"
```

4. Optional: Add issues to a project board or create a new project column for "Bot-Web Sync" within the repo's Projects UI.
