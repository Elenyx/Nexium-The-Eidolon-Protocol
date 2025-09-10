import pool from '../database/connection.js';
import { Encounter, CombatResult } from '../types/index.js';

export class CombatService {
  static async getRandomEncounter(difficulty?: number): Promise<Encounter> {
    let query = 'SELECT * FROM encounters';
    const params: any[] = [];
    
    if (difficulty) {
      query += ' WHERE difficulty <= $1';
      params.push(difficulty);
    }
    
    query += ' ORDER BY RANDOM() LIMIT 1';
    
    const result = await pool.query(query, params);
    return result.rows[0];
  }

  static async scanEnemy(userId: string, encounterId: number): Promise<string> {
    const encounter = await this.getEncounterById(encounterId);
    
    // Log the scan action
    await pool.query(
      'INSERT INTO combat_logs (user_id, encounter_id, action_type, success) VALUES ($1, $2, $3, $4)',
      [userId, encounterId, 'scan', true]
    );
    
    return encounter.weakness_hint;
  }

  static async weavePattern(userId: string, encounterId: number, pattern: string): Promise<CombatResult> {
    const encounter = await this.getEncounterById(encounterId);
    
    // Parse and evaluate the pattern
    const success = this.evaluatePattern(pattern.toUpperCase(), encounter.weakness_pattern.toUpperCase());
    
    let damage = 0;
    let message = '';
    let rewards = {};
    
    if (success) {
      damage = Math.floor(Math.random() * 200) + 150; // 150-350 damage
      message = `🎯 **Critical Hit!** You successfully exploited the weakness!\n**${damage} damage dealt!**`;
      rewards = encounter.rewards;
      
      // Award experience and currency
      const user = await pool.query('SELECT level FROM users WHERE id = $1', [userId]);
      const baseReward = rewards as any;
      
      if (baseReward.nexium) {
        await pool.query('UPDATE users SET nexium = nexium + $1 WHERE id = $2', [baseReward.nexium, userId]);
      }
      
      if (baseReward.experience) {
        await pool.query('UPDATE users SET experience = experience + $1 WHERE id = $2', [baseReward.experience, userId]);
      }
      
      // Check for item rewards
      if (baseReward.tuner_chance && Math.random() < baseReward.tuner_chance) {
        await pool.query(
          'INSERT INTO user_items (user_id, item_id, quantity) VALUES ($1, 1, 1)', // Basic Tuner
          [userId]
        );
        message += '\n🎁 **Bonus:** You found a Basic Tuner!';
      }
      
    } else {
      damage = Math.floor(Math.random() * 50) + 10; // 10-60 damage
      message = `❌ **Pattern Failed!** The weave was ineffective.\n**${damage} damage dealt.**\n\n💡 *Try using the /scan command first to understand the enemy's weakness!*`;
    }
    
    // Log the weave action
    await pool.query(
      'INSERT INTO combat_logs (user_id, encounter_id, action_type, action_data, success, damage_dealt, rewards) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [userId, encounterId, 'weave', JSON.stringify({ pattern }), success, damage, JSON.stringify(rewards)]
    );
    
  const baseReward = rewards as any;

  // Build detailed rewards with item names
  const detailedRewards: any[] = [];
    try {
      if (baseReward.nexium) detailedRewards.push({ type: 'nexium', amount: baseReward.nexium });
      if (baseReward.experience) detailedRewards.push({ type: 'experience', amount: baseReward.experience });

      if (baseReward.items && Array.isArray(baseReward.items)) {
        const ids = baseReward.items.map((it: any) => it.id);
        const res = await pool.query('SELECT id, name FROM items WHERE id = ANY($1)', [ids]);
        const nameById: Record<number, string> = {};
        for (const r of res.rows) nameById[r.id] = r.name;
        for (const it of baseReward.items) {
          detailedRewards.push({
            type: 'item',
            id: it.id,
            name: nameById[it.id] || `Item ${it.id}`,
            quantity: it.quantity || 1
          });
        }
      }

      if (baseReward.tuner_chance) {
        // Determine if tuner was awarded (we may have already inserted it above)
        const awarded = success && Math.random() < baseReward.tuner_chance;
        // Try resolve Basic Tuner name
        const res2 = await pool.query('SELECT id, name FROM items WHERE id = $1', [1]);
        const tunerName = res2.rows[0] ? res2.rows[0].name : 'Basic Tuner';
        detailedRewards.push({ type: 'tuner', name: tunerName, chance: baseReward.tuner_chance, awarded: awarded });
      }
    } catch (err) {
      // If name resolution fails, fall back to raw rewards
      console.error('Error resolving reward names:', err);
    }

    return { success, damage, message, rewards: baseReward, detailedRewards };
  }

  private static async getEncounterById(id: number): Promise<Encounter> {
    const query = 'SELECT * FROM encounters WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Public wrapper to fetch an encounter by id (keeps internal name private)
  static async fetchEncounterById(id: number): Promise<Encounter> {
    return this.getEncounterById(id);
  }

  private static evaluatePattern(userPattern: string, correctPattern: string): boolean {
    // Simple pattern matching - in a full implementation, this would be a proper logic parser
    const normalizedUser = userPattern.replace(/\s+/g, ' ').trim();
    const normalizedCorrect = correctPattern.replace(/\s+/g, ' ').trim();
    
    // Direct match
    if (normalizedUser === normalizedCorrect) return true;
    
    // Handle some basic logic patterns
    if (correctPattern.includes('AND')) {
      const parts = correctPattern.split(' AND ');
      return parts.every(part => normalizedUser.includes(part.trim()));
    }
    
    if (correctPattern.includes('OR')) {
      const parts = correctPattern.split(' OR ');
      return parts.some(part => normalizedUser.includes(part.trim()));
    }
    
    if (correctPattern.includes('NOT')) {
      const negatedTerm = correctPattern.replace('NOT ', '').trim();
      return normalizedUser.includes('NOT') && normalizedUser.includes(negatedTerm);
    }
    
    // Partial match for complex patterns
    return normalizedUser === normalizedCorrect || 
           (normalizedUser.length > 3 && normalizedCorrect.includes(normalizedUser));
  }
}

