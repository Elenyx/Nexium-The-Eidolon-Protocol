import { 
  ContainerBuilder, 
  TextDisplayBuilder
} from 'discord.js';
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

  static createCombatResultComponents(result: any, encounter: any): any[] {
    const isSuccess = result.success;
    const color = isSuccess ? 0x00FF00 : 0xFF6B6B;
    
    return [
      new ContainerBuilder()
        .setAccentColor(color)
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(result.message)
        ),
      
      new TextDisplayBuilder().setContent(
        isSuccess ? 
        '🎉 *Victory! You may encounter more enemies or return to safety.*' :
        '💪 *Keep fighting! Try different weave patterns to find the solution.*'
      )
    ];
  }
}

