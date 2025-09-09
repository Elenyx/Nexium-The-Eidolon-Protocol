# AGENTS.md - Nexium RPG: The Eidolon Protocol

## Project Overview

AI agent definitions for the Nexium RPG Discord bot and web application ecosystem. This file defines specialized agents for game development, Discord bot maintenance, web development, and database management.

---

## Core Development Agents

### discord-bot-specialist

**Role**: Discord Bot Development & Maintenance  
**Scope**: `/bot/` directory and Discord.js integration  

**Responsibilities**:

- Develop and maintain Discord slash commands
- Implement game mechanics and combat systems
- Handle Discord API integrations and rate limiting
- Manage bot deployment and command registration
- Debug Discord-specific issues and interactions

**Technical Focus**:

- Discord.js v14 framework expertise
- TypeScript development with strict typing
- SQLite database integration for game data
- Error handling and user experience optimization
- Real-time game state management

**Key Files**:

- `/bot/src/commands/*.ts` - All slash commands
- `/bot/src/services/*.ts` - Business logic services
- `/bot/src/database/` - Database schema and operations
- `/bot/src/utils/embeds.ts` - Discord message formatting

**Guidelines**:

```typescript
// Always use this command structure
export const data = new SlashCommandBuilder()
  .setName('command')
  .setDescription('Description');

export async function execute(interaction: CommandInteraction) {
  try {
    await interaction.deferReply();
    // Command logic
    await interaction.editReply(response);
  } catch (error) {
    // Proper error handling
  }
}
```

---

### web-frontend-developer

**Role**: React Frontend Development  
**Scope**: `/web/client/` directory and user interface  

**Responsibilities**:

- Build responsive React components using shadcn/ui
- Implement game dashboard and player interfaces
- Handle client-side routing and state management
- Optimize bundle size and performance
- Ensure accessibility and mobile compatibility

**Technical Focus**:

- React 18 with functional components and hooks
- Tailwind CSS for styling (NO custom CSS files)
- TypeScript for type safety
- Vite for development and building
- React Query for server state management

**Key Files**:

- `/web/client/src/components/` - Reusable components
- `/web/client/src/pages/` - Route components
- `/web/client/src/hooks/` - Custom React hooks
- `/web/client/src/lib/` - Client utilities

**Guidelines**:

```typescript
// Component structure standard
interface ComponentProps {
  data: GameData;
  onAction: (id: string) => void;
}

export const GameComponent: React.FC<ComponentProps> = ({ data, onAction }) => {
  return (
    <Card className="w-full max-w-md">
      {/* Use shadcn/ui components exclusively */}
    </Card>
  );
};
```

---

### backend-api-developer  

**Role**: Backend API Development  
**Scope**: `/web/server/` directory and Express.js API  

**Responsibilities**:

- Design and implement RESTful API endpoints
- Handle authentication and authorization
- Integrate with Discord OAuth and game database
- Implement file upload and storage systems
- Optimize API performance and caching

**Technical Focus**:

- Express.js with TypeScript
- Database integration with proper ORM usage
- API security and input validation
- Error handling and logging
- Integration with Discord bot services

**Key Files**:

- `/web/server/index.ts` - Main server entry
- `/web/server/routes.ts` - API route definitions
- `/web/server/db.ts` - Database connections
- `/web/shared/schema.ts` - Shared type definitions

**Guidelines**:

```typescript
// API endpoint structure
app.get('/api/players/:id', async (req, res) => {
  try {
    const playerId = validatePlayerId(req.params.id);
    const player = await playerService.getPlayer(playerId);
    res.json({ success: true, data: player });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

---

### database-architect

**Role**: Database Design & Optimization  
**Scope**: Database schema, queries, and data integrity  

**Responsibilities**:

- Design efficient SQLite database schemas
- Create and manage database migrations
- Optimize query performance and indexing
- Ensure data integrity and foreign key constraints
- Implement JSON column usage for complex data

**Technical Focus**:

- SQLite 3.46+ with modern features
- JSON column operations and generated columns
- Database normalization and optimization
- Migration strategy and version control
- Performance monitoring and indexing

**Key Files**:

- `/bot/src/database/schema.sql` - Database schema
- `/bot/src/database/migrations/` - Migration files
- `/bot/src/database/connection.ts` - Connection management
- `/bot/src/services/*Service.ts` - Data access layers

**Guidelines**:

```sql
-- Modern SQLite schema patterns
CREATE TABLE game_entities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_data JSON NOT NULL,
    level GENERATED ALWAYS AS (json_extract(entity_data, '$.level')) VIRTUAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_level CHECK (level > 0 AND level <= 100)
) STRICT;

CREATE INDEX idx_entities_level ON game_entities(level);
```

---

## Specialized Game Agents

### game-mechanics-designer

**Role**: RPG System Implementation  
**Scope**: Game logic, balance, and mechanics  

**Responsibilities**:

- Implement Eidolon Protocol game mechanics
- Design combat calculations and formulas
- Balance game systems (stats, items, progression)
- Create random generation algorithms
- Implement player progression systems

**Technical Focus**:

- Mathematical game balance algorithms
- Random number generation with seeds
- State machine implementations
- Game economy and resource management
- Statistical analysis for game balance

**Key Domains**:

- Combat system (`combatService.ts`)
- Eidolon management (`eidolonService.ts`)
- Player progression and stats
- Item generation and rarity systems
- Market and trading mechanics

**Guidelines**:

```typescript
// Game calculation patterns
class CombatCalculator {
  static calculateDamage(attacker: Character, defender: Character): number {
    const baseDamage = attacker.stats.attack;
    const defense = defender.stats.defense;
    const randomFactor = Math.random() * 0.2 + 0.9; // 90-110%
    
    return Math.floor((baseDamage - defense * 0.5) * randomFactor);
  }
}
```

---

### eidolon-system-expert

**Role**: Eidolon Protocol Specialist  
**Scope**: Core Eidolon mechanics and interactions  

**Responsibilities**:

- Implement Eidolon summoning and binding
- Design Eidolon evolution and attunement
- Create Eidolon-specific abilities and traits
- Balance Eidolon power levels and rarity
- Integrate Eidolons with combat system

**Reference Material**:

- `/bot/attached_assets/Nexium RPG_ The Eidolon Protocol_1757332106323.pdf`

**Key Commands**:

- `/bot/src/commands/eidolon.ts` - Main Eidolon management
- `/bot/src/commands/attune.ts` - Attunement mechanics
- `/bot/src/services/eidolonService.ts` - Core logic

---

### user-experience-designer

**Role**: Player Experience & Interface Design  
**Scope**: User interactions and experience flow  

**Responsibilities**:

- Design intuitive Discord bot interactions
- Create clear and helpful embed messages
- Optimize command response times
- Implement helpful error messages and guides
- Design onboarding flow for new players

**Technical Focus**:

- Discord embed design and formatting
- Command parameter validation and hints
- Error message clarity and helpfulness
- Tutorial and help system implementation
- Player feedback collection

**Key Files**:

- `/bot/src/utils/embeds.ts` - Message formatting
- All command files for interaction design
- `/web/client/src/components/` - UI components

---

## Integration & DevOps Agents

### deployment-specialist

**Role**: Build, Deploy & Infrastructure  
**Scope**: CI/CD, build processes, and deployment  

**Responsibilities**:

- Maintain build scripts and compilation process
- Handle Discord bot deployment and registration
- Manage web application deployment pipeline
- Monitor application health and performance
- Handle environment configuration and secrets

**Technical Focus**:

- TypeScript compilation and bundling
- Discord command deployment automation
- Web application build optimization
- Environment variable management
- Monitoring and logging setup

**Key Files**:

- `/bot/build.js` - Bot build script
- `/web/vite.config.ts` - Web build configuration
- `/bot/deploy-commands.ts` - Command registration
- Package.json scripts in both projects

**Guidelines**:

```bash
# Standard deployment sequence
cd bot && npm run build && npm run deploy
cd ../web && npm run build
# Deploy to hosting platform
```

---

### testing-specialist

**Role**: Quality Assurance & Testing  
**Scope**: Testing strategy and implementation  

**Responsibilities**:

- Develop comprehensive test suites
- Create integration tests for Discord commands
- Implement database testing strategies
- Design performance benchmarking
- Create automated testing workflows

**Technical Focus**:

- Unit testing for game logic
- Integration testing for Discord commands
- Database transaction testing
- Performance testing and profiling
- User acceptance testing scenarios

**Key Files**:

- `/bot/test.ts` and `/bot/test.js` - Test suites
- `/bot/run-tests.js` - Test runner
- Test scenarios for all commands

---

### security-auditor

**Role**: Security & Data Protection  
**Scope**: Security analysis and vulnerability prevention  

**Responsibilities**:

- Audit code for security vulnerabilities
- Implement input validation and sanitization
- Review database access patterns
- Ensure Discord API security best practices
- Monitor for potential abuse patterns

**Technical Focus**:

- SQL injection prevention
- Input validation and sanitization
- Rate limiting and abuse prevention
- Secure credential management
- Discord permissions and scope validation

**Security Checklist**:

```typescript
// Input validation pattern
function validateUserInput(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new ValidationError('Invalid input type');
  }
  
  const sanitized = input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000);
    
  if (!sanitized) {
    throw new ValidationError('Input cannot be empty');
  }
  
  return sanitized;
}
```

---

## Agent Collaboration Guidelines

### Cross-Agent Communication

- **Shared Types**: Use `/web/shared/schema.ts` and `/bot/src/types/index.ts`
- **Database Schema**: Coordinate changes through `database-architect`
- **API Contracts**: Validate with both `backend-api-developer` and `web-frontend-developer`
- **Game Balance**: Consult `game-mechanics-designer` for any stat modifications

### Code Review Process

1. **Primary Agent**: Implements the core functionality
2. **Security Agent**: Reviews for vulnerabilities
3. **Testing Agent**: Validates functionality and edge cases
4. **UX Agent**: Ensures user experience quality

### Conflict Resolution

- **Database Changes**: `database-architect` has final authority
- **Game Mechanics**: `game-mechanics-designer` leads decisions
- **Discord Integration**: `discord-bot-specialist` leads decisions
- **Web UI**: `web-frontend-developer` and `user-experience-designer` collaborate

---

## Development Workflows

### New Feature Development

1. **Planning**: Relevant agents collaborate on design
2. **Implementation**: Primary agent implements with guidance
3. **Integration**: Cross-agent testing and validation
4. **Deployment**: `deployment-specialist` handles release

### Bug Resolution

1. **Identification**: Any agent can identify issues
2. **Assignment**: Route to appropriate specialist agent
3. **Fix**: Implement solution with security review
4. **Testing**: Validate fix doesn't break existing functionality

### Performance Optimization

1. **Monitoring**: Continuous performance tracking
2. **Analysis**: Identify bottlenecks and optimization opportunities
3. **Implementation**: Coordinate changes across affected systems
4. **Validation**: Measure improvement and ensure stability

---

## Agent Guidelines & Best Practices

### Communication Standards

- **Clear Documentation**: Always document complex decisions
- **Change Notifications**: Notify affected agents of breaking changes
- **Code Comments**: Explain non-obvious logic and game mechanics
- **Error Handling**: Provide helpful error messages for users

### Quality Standards

- **Type Safety**: Maintain strict TypeScript typing
- **Performance**: Consider impact on bot response times
- **Scalability**: Design for growing player base
- **Maintainability**: Write clean, well-structured code

### Testing Requirements

- **Unit Tests**: Test individual functions and calculations
- **Integration Tests**: Test Discord command flows
- **Database Tests**: Validate data integrity and transactions
- **Performance Tests**: Ensure acceptable response times

### Security Practices

- **Input Validation**: Always validate and sanitize user input
- **Least Privilege**: Use minimal permissions for Discord bot
- **Secure Storage**: Protect sensitive data and credentials
- **Regular Audits**: Periodically review code for vulnerabilities

### Continuous Improvement

- **Feedback Loop**: Collect player feedback for improvements
- **Post-Mortems**: Analyze major issues for future prevention
- **Learning & Development**: Stay updated with best practices and new technologies

### Innovation Encouragement

- **Experimentation**: Encourage trying new approaches and technologies
- **Prototyping**: Build small prototypes for new features
- **Collaboration**: Foster a culture of knowledge sharing among agents

### Documentation Maintenance

- **Living Document**: Keep AGENTS.md updated with changes
- **Version Control**: Track changes and updates to agent roles and responsibilities
- **Accessibility**: Ensure documentation is clear and accessible to all agents

---

## End of AGENTS.md
