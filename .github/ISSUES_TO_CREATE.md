This file contains suggested `gh` commands and issue bodies to create the top-priority issues for the BOT-WEB synchronization plan.

Note: The `gh` CLI is not installed in this environment. Run these commands locally where `gh` is available and authenticated.

1) /synthesize (priority: high)

gh issue create --title "/synthesize command (bot)" --body "Implement /synthesize command:\n- Grid-based crafting interface\n- Material combination logic\n- Quality tiers (Unstable → Stable → Optimized → Flawless)\n\nSee BOT_WEB_SYNCHRONIZATION_PLAN.md" --label "priority:high"

2) /trade (priority: high)

gh issue create --title "/trade command (bot)" --body "Implement /trade command:\n- Secure P2P trading interface\n- Item and Cred exchange\n- Bot-mediated verification\n\nSee BOT_WEB_SYNCHRONIZATION_PLAN.md" --label "priority:high"

3) /skill (priority: medium)

gh issue create --title "/skill command (bot)" --body "Implement /skill command:\n- Eidolon skill execution\n- Integration with combat system\n- Cooldown management\n\nSee BOT_WEB_SYNCHRONIZATION_PLAN.md" --label "priority:medium"

4) /party (priority: medium)

gh issue create --title "/party system (bot)" --body "Implement /party system:\n- Party formation and management\n- Dungeon coordination\n- Member synchronization\n\nSee BOT_WEB_SYNCHRONIZATION_PLAN.md" --label "priority:medium"

5) Verify market_listings table (priority: high)

gh issue create --title "Verify market_listings table exists in schema" --body "Confirm market_listings table presence and correctness across schema, seeds, and migrations. Update schema files if discrepancies are found.\n\nSee BOT_WEB_SYNCHRONIZATION_PLAN.md" --label "priority:high"

You can create these in batch with a shell script locally. Ensure `gh` is authenticated (run `gh auth login`) before running.
