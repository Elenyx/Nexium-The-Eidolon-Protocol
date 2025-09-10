import { 
  ContainerBuilder, 
  TextDisplayBuilder
} from 'discord.js';
import pool from '../database/connection.js';
import { User, UserEidolon, Eidolon } from '../types/index.js';

export class ComponentBuilder {
  static createProfileComponents(user: User): any[] {
    return [
      new TextDisplayBuilder().setContent(`# ${user.title}: ${user.username}`),
      
      new ContainerBuilder()
        .setAccentColor(0x5865F2)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`**Location:** ${user.location}\n**Level:** ${user.level} (${user.experience} XP)\n**Sync Points:** ${user.sync_points}`)
        ),
      
      new ContainerBuilder()
        .setAccentColor(0xFFD700)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`💰 **Economy**\n**${user.nexium}** NEX | **${user.cred}** CRD`)
        ),
      
      new TextDisplayBuilder().setContent('*Use `/eidolon list` to see your collected Eidolons!*')
    ];
  }

  static createEidolonComponents(eidolon: Eidolon, userEidolon?: UserEidolon): any[] {
    const rarityEmoji = {
      'SSR': '✨',
      'SR': '⭐',
      'R': '🔹',
      'UC': '🔸',
      'C': '⚪'
    };

    const rarityColors: Record<string, number> = {
      'SSR': 0xFF6B6B,
      'SR': 0x4ECDC4, 
      'R': 0x45B7D1,
      'UC': 0x96CEB4,
      'C': 0xDDD6FE
    };

    const components = [
      new TextDisplayBuilder().setContent(`# ${rarityEmoji[eidolon.rarity]} ${eidolon.name}`),
      
      new ContainerBuilder()
        .setAccentColor(rarityColors[eidolon.rarity])
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`**${eidolon.rarity} • ${eidolon.element}**\n${eidolon.description}`)
        ),
      
      new ContainerBuilder()
        .setAccentColor(0x36393F)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`⚔️ **Stats:** ATK ${eidolon.base_attack} | DEF ${eidolon.base_defense} | SPD ${eidolon.base_speed}`)
        )
    ];

    if (userEidolon) {
      components.push(
        new ContainerBuilder()
          .setAccentColor(0x00FF00)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(`🔗 **Your Bond:** Level ${userEidolon.level} | Sync ${userEidolon.sync_ratio.toFixed(1)}% | EXP ${userEidolon.experience}`)
          )
      );
    }

    components.push(
      new ContainerBuilder()
        .setAccentColor(0x8A2BE2)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`**${eidolon.skill_name}**\n*${eidolon.skill_description}*`)
        ),
      
      new TextDisplayBuilder().setContent(`*"${eidolon.lore}"*`)
    );

    return components;
  }

  static createEncounterComponents(encounter: any, scanned: boolean = false): any[] {
    const typeEmoji: Record<string, string> = {
      'glitch': '⚡',
      'anomaly': '🌀', 
      'boss': '💀'
    };

    const components = [
      new TextDisplayBuilder().setContent(`# ${typeEmoji[encounter.type] || '⚡'} ${encounter.name}`),
      
      new ContainerBuilder()
        .setAccentColor(0xFF4757)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`**${encounter.type.toUpperCase()} • Level ${encounter.difficulty}**\n📍 ${encounter.location}`)
        )
    ];

    if (scanned) {
      // Normalize any stored escaped newlines ("\\n") into real newlines
      const rawHint = String(encounter.weakness_hint || '');
      const normalized = rawHint.replace(/\\n/g, '\n');

      // Split into paragraphs (double-newline) and create individual TextDisplay blocks
      const paragraphs = normalized.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

      const textDisplays = [
        new TextDisplayBuilder().setContent('🔍 **Weakness Analysis**')
      ];

      for (const p of paragraphs) {
        textDisplays.push(new TextDisplayBuilder().setContent(p));
      }

      components.push(
        new ContainerBuilder()
          .setAccentColor(0x3CB371)
          .addTextDisplayComponents(...textDisplays)
      );
    }

    components.push(
      new TextDisplayBuilder().setContent(scanned ? 
        '*Use `/weave [pattern]` to exploit this weakness!*' : 
        '*Use `/scan` to analyze this enemy\'s weakness!*'
      )
    );

    return components;
  }

  static async createCombatResultComponents(result: any, encounter: any): Promise<any[]> {
    const isSuccess = result.success;
    const color = isSuccess ? 0x00FF00 : 0xFF6B6B;
    const components: any[] = [];

    components.push(
      new ContainerBuilder()
        .setAccentColor(color)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(result.message)
        )
    );

    // Build reward display lines, prefer detailedRewards
    const detailed: any[] = result.detailedRewards ?? [];
    const rewardDisplays: string[] = [];

    if (detailed.length > 0) {
      // Resolve item names for any item rewards
      const itemIds: number[] = [];
      for (const r of detailed) if (r.type === 'item' && r.id) itemIds.push(r.id);

      let nameById: Record<number, string> = {};
      let iconById: Record<number, string> = {};
      if (itemIds.length > 0) {
        try {
          const res = await pool.query('SELECT id, name, icon FROM items WHERE id = ANY($1)', [itemIds]);
          for (const row of res.rows) {
            nameById[row.id] = row.name;
            if (row.icon) iconById[row.id] = row.icon;
          }
        } catch (err) {
          console.error('Failed to resolve item names/icons:', err);
        }
      }

      for (const r of detailed) {
        if (r.type === 'nexium') rewardDisplays.push(`💠 NEX: +${r.amount}`);
        else if (r.type === 'experience') rewardDisplays.push(`⭐ XP: +${r.amount}`);
        else if (r.type === 'item') {
          const name = r.name || nameById[r.id] || `Item ${r.id}`;
          const icon = iconById[r.id] ? `${iconById[r.id]} ` : '';
          const qty = r.quantity ?? 1;
          rewardDisplays.push(`${icon}📦 ${name} x${qty}`);
        } else if (r.type === 'tuner') {
          const awarded = r.awarded ? ' (awarded)' : '';
          const chanceText = r.chance ? ` (${Math.round(r.chance * 100)}% chance)` : '';
          const name = r.name || 'Tuner';
          const icon = r.icon ? `${r.icon} ` : '';
          rewardDisplays.push(`${icon}🎛️ ${name}${awarded}${chanceText}`);
        } else {
          rewardDisplays.push(JSON.stringify(r));
        }
      }
    } else {
      const rewards = result.rewards || {};
      if (rewards.nexium) rewardDisplays.push(`💠 NEX: +${rewards.nexium}`);
      if (rewards.experience) rewardDisplays.push(`⭐ XP: +${rewards.experience}`);
      if (rewards.items && Array.isArray(rewards.items)) {
        for (const it of rewards.items) {
          const id = it.id ?? it.item_id ?? 'unknown';
          const qty = it.quantity ?? it.qty ?? 1;
          rewardDisplays.push(`📦 Item (${id}) x${qty}`);
        }
      }
      if (rewards.tuner_chance && result.success && rewardDisplays.length === 0) {
        rewardDisplays.push(`🎛️ Tuner: chance awarded`);
      }
    }

    if (rewardDisplays.length > 0) {
      components.push(
        new ContainerBuilder()
          .setAccentColor(0xFFD700)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('🏆 Rewards'),
            ...rewardDisplays.map(line => new TextDisplayBuilder().setContent(line))
          )
      );
    } else {
      components.push(
        new ContainerBuilder()
          .setAccentColor(0x999999)
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('⚖️ Rewards'),
            new TextDisplayBuilder().setContent(isSuccess ? 'No additional rewards.' : 'No rewards this attempt.')
          )
      );
    }

    components.push(
      new TextDisplayBuilder().setContent(
        isSuccess ? 
        '🎉 *Victory! You may encounter more enemies or return to safety.*' :
        '💪 *Keep fighting! Try different weave patterns to find the solution.*'
      )
    );

    return components;
  }
}

