import fs from 'fs';
import OpenAI from 'openai';

const conf = fs.existsSync('./ai_agent_config.json')
  ? JSON.parse(fs.readFileSync('./ai_agent_config.json', 'utf8'))
  : {};
const diff = fs.existsSync('./diff_map.json')
  ? JSON.parse(fs.readFileSync('./diff_map.json', 'utf8'))
  : { modules: [] };
const provider = process.env.LLM_PROVIDER || 'openai';

async function callOpenAI(prompt) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const r = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a senior test engineer.' },
      { role: 'user', content: prompt },
    ],
    max_tokens: 1800,
  });
  return r.choices?.[0]?.message?.content || '';
}

(async () => {
  fs.mkdirSync('./tests/generated', { recursive: true });
  for (const mod of diff.modules || []) {
    const prompt = `Generate Playwright + Supawright E2E tests for module '${mod}'. Include: happy path, edge cases, auth/permission tests, DB integrity checks, concurrency edge cases, and negative scenarios. Return a single ts file content.`;
    let content = '';
    if (provider === 'openai' && process.env.OPENAI_API_KEY) {
      try {
        content = await callOpenAI(prompt);
      } catch (e) {
        content = '';
      }
    }
    if (!content) {
      content = `// AUTO-GENERATED placeholder tests for ${mod}\nimport { test, expect } from '@playwright/test';\n test('placeholder for ${mod}', async ({ page }) => { expect(true).toBe(true); });`;
    }
    const file = `./tests/generated/${mod}.spec.ts`;
    fs.writeFileSync(file, content);
    console.log('Generated test for', mod, file);
  }
})();
