import { SlashCommandBuilder, ChatInputCommandInteraction, MessageFlags } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('pattern-help')
    .setDescription('Learn about pattern matching and logic operators'),

  async execute(interaction: ChatInputCommandInteraction) {
    const helpContent = `
🧠 **Pattern Matching Guide**

**Basic Operators:**
• **AND** - Both conditions must be true
  Example: \`Fire AND Ice\` (requires both elements)

• **OR** - Either condition can be true
  Example: \`Break OR Escape\` (either works)

• **NOT** - Negates the following term
  Example: \`NOT Logic\` (anything except logic)

**Advanced Patterns:**
• **Grouping:** Use parentheses for complex patterns
  Example: \`(Scan AND Analyze) OR Purge\`

**Tips:**
• Patterns are case-insensitive
• Use spaces around operators
• Start simple and build complexity
• Pay attention to the encounter's description

**Common Patterns:**
• Single term: \`Fire\`, \`Logic\`, \`Memory\`
• Negation: \`NOT Fire\`, \`NOT Logic\`
• Combination: \`Fire AND Ice\`, \`Break OR Escape\`
• Complex: \`(Scan AND Analyze) OR Purge\`

Need help with a specific encounter? Use \`/scan\` first!
    `;

    await interaction.reply({
      content: helpContent,
      flags: MessageFlags.Ephemeral
    });
  }
};
