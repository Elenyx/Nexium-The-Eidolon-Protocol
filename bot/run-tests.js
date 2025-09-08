#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const dist = path.join(cwd, 'dist');

console.log('Running simple import smoke tests against', dist);

(async () => {
  const commandsDir = path.join(dist, 'commands');
  const servicesDir = path.join(dist, 'services');

  const targets = [];
  if (fs.existsSync(commandsDir)) {
    for (const f of fs.readdirSync(commandsDir).filter(s => s.endsWith('.js'))) {
      targets.push({ type: 'command', file: f, fullPath: path.join(commandsDir, f) });
    }
  }
  if (fs.existsSync(servicesDir)) {
    for (const f of fs.readdirSync(servicesDir).filter(s => s.endsWith('.js'))) {
      targets.push({ type: 'service', file: f, fullPath: path.join(servicesDir, f) });
    }
  }

  if (targets.length === 0) {
    console.error('No compiled files found in dist/. Run the build first.');
    process.exit(2);
  }

  let failed = 0;
  for (const t of targets) {
    const rel = './' + path.relative(cwd, t.fullPath).replace(/\\/g, '/');
    try {
      const mod = await import(rel);
      if (t.type === 'command') {
        const cmd = mod.default;
        if (!cmd || !cmd.data || !cmd.execute) {
          throw new Error('expected default export with data and execute');
        }
      } else {
        // service: expect at least one named export
        const keys = Object.keys(mod).filter(k => k !== 'default');
        if (keys.length === 0) throw new Error('no named exports found');
      }
      console.log(`PASS ${t.type} ${t.file}`);
    } catch (err) {
      failed++;
      console.error(`FAIL ${t.type} ${t.file}: ${err && err.message ? err.message : err}`);
    }
  }

  if (failed > 0) {
    console.error(`${failed} targets failed import checks`);
    process.exit(1);
  }
  console.log('All import smoke tests passed');
  process.exit(0);
})();
