# Nexium RPG: The Eidolon Protocol - Discord Bot Integration Framework

## Overview

This framework transforms your existing basic Discord bot into the sophisticated Nexium RPG system using modern Discord Components V2, slash commands, and modular architecture.

## Phase 1: Foundation Upgrade (Weeks 1-2)

### 1.1 Upgrade to Components V2 & Slash Commands

**Update package.json:**

```json
{
  "dependencies": {
    "discord.js": "^14.19.3",
    "dotenv": "^16.6.1",
    "postgresql": "^1.0.2",
    "node-cron": "^3.0.3"
  }
}
```

**New bot structure:**

```
bot/
├── commands/
│   ├── player/          # Player management
│   ├── eidolons/        # Eidolon system
│   ├── combat/          # Combat & weaving
│   ├── economy/         # Trading & crafting
│   ├── social/          # Guilds & syndicates
│   └── admin/           # Admin commands
├── components/          # UI Components
├── events/             # Event handlers
├── systems/            # Game logic
├── database/           # DB operations
├── utils/              # Utilities
└── config/             # Configuration
```

### 1.2 Database Schema Setup

**Core Tables:**

```sql
-- Player profiles
CREATE TABLE players (
    discord_id VARCHAR(20) PRIMARY KEY,
    username VARCHAR(100),
    level INTEGER DEFAULT 1,
    nex_currency INTEGER DEFAULT 0,
    cred_currency INTEGER DEFAULT 0,
    last_active TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Eidolon collection
CREATE TABLE eidolons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    rarity VARCHAR(10), -- SSR, SR, R, C
    element VARCHAR(20),
    role VARCHAR(30),
    base_stats JSONB,
    skills JSONB,
    lore TEXT
);

-- Player Eidolon instances
CREATE TABLE player_eidolons (
    id SERIAL PRIMARY KEY,
    player_id VARCHAR(20),
    eidolon_id INTEGER,
    level INTEGER DEFAULT 1,
    sync_ratio INTEGER DEFAULT 0,
    experience INTEGER DEFAULT 0,
    ascension_level INTEGER DEFAULT 0,
    acquired_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (player_id) REFERENCES players(discord_id),
    FOREIGN KEY (eidolon_id) REFERENCES eidolons(id)
);
```

## Phase 2: Core Systems (Weeks 3-6)

### 2.1 Player Management System

**commands/player/profile.js:**

```javascript
import { 
    SlashCommandBuilder, 
    MessageFlags,
    TextDisplayBuilder,
    ContainerBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle 
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View your Nexium profile'),
    
    async execute(interaction) {
        const player = await getPlayer(interaction.user.id);
        
        const components = [
            new TextDisplayBuilder()
                .setContent(`# ${player.username}'s Profile`),
            
            new ContainerBuilder()
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`**Level:** ${player.level}`),
                    new TextDisplayBuilder().setContent(`**NEX:** ${player.nex_currency}`),
                    new TextDisplayBuilder().setContent(`**CRD:** ${player.cred_currency}`)
                ),
            
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('view-eidolons')
                    .setLabel('View Eidolons')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('👻'),
                
                new ButtonBuilder()
                    .setCustomId('view-inventory')
                    .setLabel('Inventory')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🎒')
            )
        ];

        await interaction.reply({
            components: components,
            flags: MessageFlags.IsComponentsV2
        });
    }
};
```

### 2.2 Eidolon System

**systems/eidolon-manager.js:**

```javascript
export class EidolonManager {
    static rarityWeights = {
        SSR: 0.03,  // 3%
        SR: 0.12,   // 12%
        R: 0.35,    // 35%
        C: 0.50     // 50%
    };

    static async attune(playerId) {
        const player = await getPlayer(playerId);
        
        if (player.tuners < 1) {
            throw new Error('Insufficient Tuners');
        }

        const rarity = this.rollRarity();
        const eidolon = await this.getRandomEidolon(rarity);
        
        await this.addEidolonToPlayer(playerId, eidolon.id);
        await this.deductTuners(playerId, 1);
        
        return eidolon;
    }

    static rollRarity() {
        const roll = Math.random();
        let cumulative = 0;
        
        for (const [rarity, weight] of Object.entries(this.rarityWeights)) {
            cumulative += weight;
            if (roll <= cumulative) return rarity;
        }
        return 'C';
    }
}
```

**commands/eidolons/attune.js:**

```javascript
import { 
    SlashCommandBuilder, 
    MessageFlags,
    TextDisplayBuilder,
    ContainerBuilder,
    EmbedBuilder
} from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('attune')
        .setDescription('Attune to a new Eidolon using a Tuner'),
    
    async execute(interaction) {
        try {
            const eidolon = await EidolonManager.attune(interaction.user.id);
            
            const rarityColors = {
                SSR: 0xFF6B35, // Gold
                SR: 0x9B59B6,  // Purple
                R: 0x3498DB,   // Blue
                C: 0x95A5A6    // Gray
            };

            const components = [
                new TextDisplayBuilder()
                    .setContent(`✨ **ATTUNEMENT SUCCESSFUL** ✨`),
                
                new ContainerBuilder()
                    .addComponents([
                        new EmbedBuilder()
                            .setTitle(`${eidolon.name}`)
                            .setDescription(eidolon.lore)
                            .addFields([
                                { name: 'Rarity', value: eidolon.rarity, inline: true },
                                { name: 'Element', value: eidolon.element, inline: true },
                                { name: 'Role', value: eidolon.role, inline: true }
                            ])
                            .setColor(rarityColors[eidolon.rarity])
                    ])
            ];

            await interaction.reply({
                components: components,
                flags: MessageFlags.IsComponentsV2
            });
        } catch (error) {
            await interaction.reply({
                content: `❌ ${error.message}`,
                ephemeral: true
            });
        }
    }
};
```

### 2.3 Puzzle Combat System

**systems/combat-engine.js:**

```javascript
export class CombatEngine {
    static enemies = {
        'data-glitch': {
            name: 'Data Glitch',
            health: 100,
            weakness: 'NOT Logic',
            riddle: 'It fears the logic it cannot compute.',
            rewards: { nex: 50, exp: 25, tuners: 1 }
        },
        'memory-fragment': {
            name: 'Memory Fragment',
            health: 150,
            weakness: 'Water AND Ice',
            riddle: 'Frozen memories melt under dual elements.',
            rewards: { nex: 75, exp: 40, tuners: 0 }
        }
    };

    static async scan(playerId, enemyType) {
        const enemy = this.enemies[enemyType];
        if (!enemy) throw new Error('Enemy not found');

        // Send riddle privately
        return {
            riddle: enemy.riddle,
            enemy: enemy
        };
    }

    static async weave(playerId, enemyType, sequence) {
        const enemy = this.enemies[enemyType];
        const combat = await getCombatSession(playerId, enemyType);
        
        if (!combat) throw new Error('No active combat session');

        const isCorrect = this.validateWeave(sequence, enemy.weakness);
        const damage = isCorrect ? this.calculateDamage(sequence, enemy) : 0;
        
        combat.enemy_health -= damage;
        
        if (combat.enemy_health <= 0) {
            await this.completeCombat(playerId, enemy);
            return { victory: true, damage, rewards: enemy.rewards };
        }

        await updateCombatSession(combat);
        return { victory: false, damage };
    }

    static validateWeave(sequence, weakness) {
        // Parse logical expressions like "NOT Logic", "Water AND Ice"
        const normalized = sequence.toUpperCase().trim();
        const expected = weakness.toUpperCase().trim();
        
        return this.evaluateLogicalExpression(normalized, expected);
    }
}
```

**commands/combat/scan.js:**

```javascript
export default {
    data: new SlashCommandBuilder()
        .setName('scan')
        .setDescription('Scan an enemy to reveal its weakness')
        .addStringOption(option =>
            option.setName('enemy')
                .setDescription('The enemy to scan')
                .setRequired(true)
                .addChoices(
                    { name: 'Data Glitch', value: 'data-glitch' },
                    { name: 'Memory Fragment', value: 'memory-fragment' }
                )),
    
    async execute(interaction) {
        try {
            const enemyType = interaction.options.getString('enemy');
            const scanResult = await CombatEngine.scan(interaction.user.id, enemyType);
            
            // Send riddle privately
            await interaction.user.send(`🔍 **Scan Results:**\n*"${scanResult.riddle}"*`);
            
            await interaction.reply({
                content: `You scan the ${scanResult.enemy.name}... Check your DMs for the analysis.`,
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({
                content: `❌ ${error.message}`,
                ephemeral: true
            });
        }
    }
};
```

## Phase 3: Advanced Features (Weeks 7-10)

### 3.1 Synthesis Crafting with Interactive Grid

**systems/synthesis-engine.js:**

```javascript
export class SynthesisEngine {
    static recipes = {
        'iron-blade': {
            name: 'Iron Blade',
            components: ['iron-ore', 'binding-agent'],
            grid: [
                ['iron-ore', null, null],
                [null, 'binding-agent', null],
                [null, null, null]
            ],
            qualityThresholds: {
                unstable: 0.3,
                stable: 0.6,
                optimized: 0.8,
                flawless: 0.95
            }
        }
    };

    static async startSynthesis(playerId, recipe) {
        const session = {
            playerId,
            recipe,
            grid: Array(3).fill().map(() => Array(3).fill(null)),
            components: await getPlayerComponents(playerId, recipe.components),
            stability: 0.5
        };

        await saveSynthesisSession(session);
        return session;
    }

    static calculateStability(grid, recipe) {
        // Complex stability calculation based on component placement
        let stability = 0.5;
        // Implementation details...
        return Math.max(0, Math.min(1, stability));
    }
}
```

### 3.2 Nexus Vaults (Dungeons) with Party System

**systems/dungeon-manager.js:**

```javascript
export class DungeonManager {
    static vaults = {
        'glitched-cathedral': {
            name: 'The Glitched Cathedral',
            maxPartySize: 4,
            stages: 3,
            mechanics: {
                stage1: { type: 'puzzle', requirement: 'synchronized-weave' },
                stage2: { type: 'environmental', requirement: 'cooperation' },
                stage3: { type: 'boss', requirement: 'coordinated-skills' }
            }
        }
    };

    static async createParty(leaderId, vaultType) {
        const party = {
            id: generatePartyId(),
            leaderId,
            members: [leaderId],
            vault: vaultType,
            stage: 1,
            status: 'forming'
        };

        await saveParty(party);
        return party;
    }
}
```

### 3.3 Guild System (Syndicates) with Ward Control

**systems/syndicate-manager.js:**

```javascript
export class SyndicateManager {
    static async claimWard(syndicateId, wardId) {
        const syndicate = await getSyndicate(syndicateId);
        const ward = await getWard(wardId);
        
        if (ward.controlledBy && ward.controlledBy !== syndicateId) {
            // Challenge system - must beat leaderboard time
            const currentRecord = await getWardRecord(wardId);
            throw new ChallengeRequired(currentRecord);
        }

        const cost = this.calculateWardCost(ward);
        if (syndicate.resources < cost) {
            throw new Error('Insufficient syndicate resources');
        }

        await this.transferWardControl(wardId, syndicateId);
        return { success: true, weeklyBonus: ward.bonus };
    }
}
```

## Phase 4: Live Service Features (Weeks 11-12)

### 4.1 Nexium Storms (Dynamic Events)

**events/nexium-storm.js:**

```javascript
export class NexiumStorm {
    static async trigger(guildId) {
        const storm = {
            id: generateStormId(),
            guildId,
            type: this.getRandomStormType(),
            startTime: Date.now(),
            duration: 3600000, // 1 hour
            progress: 0,
            participants: []
        };

        await this.transformChannels(guildId, storm.type);
        await this.spawnStormEnemies(guildId, storm.type);
        await this.notifyGuild(guildId, storm);
        
        return storm;
    }

    static async transformChannels(guildId, stormType) {
        const guild = await client.guilds.fetch(guildId);
        const channels = guild.channels.cache;
        
        const themes = {
            'data-corruption': '🌩️-corrupted-',
            'spectral-surge': '👻-haunted-',
            'temporal-rift': '⏰-fractured-'
        };

        for (const channel of channels.values()) {
            if (channel.type === 0) { // Text channel
                const newName = themes[stormType] + channel.name.replace(/[🌩️👻⏰]-\w+-/g, '');
                await channel.setName(newName);
            }
        }
    }
}
```

### 4.2 Components V2 Enhanced UI Examples

**Advanced Battle Interface:**

```javascript
const battleInterface = [
    new TextDisplayBuilder()
        .setContent(`⚔️ **COMBAT ENGAGED** ⚔️`),
    
    new ContainerBuilder()
        .setLayout(ContainerLayout.Horizontal)
        .addComponents([
            new ImageDisplayBuilder()
                .setSource(enemy.imageUrl)
                .setAltText(enemy.name),
            
            new ContainerBuilder()
                .setLayout(ContainerLayout.Vertical)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`**${enemy.name}**`)
                        .setSize(TextDisplaySize.Large),
                    new TextDisplayBuilder()
                        .setContent(`HP: ${enemy.health}/${enemy.maxHealth}`)
                )
        ]),
    
    new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Medium),
    
    new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`scan-${enemy.id}`)
            .setLabel('Scan Enemy')
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('🔍'),
        
        new ButtonBuilder()
            .setCustomId(`weave-${enemy.id}`)
            .setLabel('Weave Pattern')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('✨')
    )
];
```

## Implementation Checklist

### Week 1-2: Foundation

- [ ] Upgrade to discord.js 14.19.3+
- [ ] Set up PostgreSQL database
- [ ] Create slash command structure
- [ ] Implement Components V2 flag system
- [ ] Basic player registration

### Week 3-4: Core Systems

- [ ] Eidolon collection system
- [ ] Basic combat with scan/weave
- [ ] Player profile with Components V2 UI
- [ ] Currency system (NEX/CRD)

### Week 5-6: Combat & Progression

- [ ] Advanced puzzle combat
- [ ] Eidolon leveling and sync ratios
- [ ] Basic crafting system
- [ ] Player marketplace

### Week 7-8: Social Features

- [ ] Guild/Syndicate system
- [ ] Party formation for dungeons
- [ ] Ward control mechanics
- [ ] Leaderboards

### Week 9-10: Dungeons & Advanced Crafting

- [ ] Nexus Vaults implementation
- [ ] Synthesis crafting minigame
- [ ] Advanced UI components
- [ ] Trading system

### Week 11-12: Live Service

- [ ] Nexium Storms event system
- [ ] Dynamic channel transformation
- [ ] Server-wide cooperation mechanics
- [ ] Admin tools and monitoring

## Key Architecture Patterns

1. **Event-Driven Architecture**: Use Discord.js events for real-time interactions
2. **Modular Systems**: Each game feature as independent module
3. **Database-First**: All game state persisted in PostgreSQL
4. **Components V2 UI**: Rich, interactive interfaces
5. **Async/Await**: Modern JavaScript patterns throughout
6. **Error Handling**: Comprehensive error management
7. **Scalable Design**: Ready for multiple Discord servers

## Testing Strategy

1. **Unit Tests**: Each system module
2. **Integration Tests**: Database operations
3. **Discord Tests**: Bot commands and interactions
4. **Load Tests**: Multiple concurrent users
5. **Event Tests**: Storm and dungeon mechanics

This framework provides a complete roadmap for transforming your basic Discord bot into the sophisticated Nexium RPG system described in your proposal, leveraging modern Discord Components V2 for rich user experiences.
