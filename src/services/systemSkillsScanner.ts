import { SystemDiscoveredSkill } from '../types';
import { detectDesktopOs, detectMobileOs } from './clientEnvironment';

export type HostPlatform = 'windows' | 'mac' | 'linux';

/** Detect desktop OS; mobile browsers fall back to linux paths for mock skill URLs. */
export function detectHostPlatform(): HostPlatform {
  if (detectMobileOs()) return 'linux';
  return detectDesktopOs();
}

/**
 * Resolve the local home directory used for mock "discovered skill" paths.
 * Prefer VITE_HOME_DIR so Windows (`C:/Users/ahalliday`) and Mac (`/Users/adamhalliday`)
 * can differ without code changes.
 */
export function getHomeDirectory(): string {
  const homeOverride = (import.meta.env.VITE_HOME_DIR as string | undefined)?.trim();
  if (homeOverride) {
    return homeOverride.replace(/\\/g, '/').replace(/\/$/, '');
  }

  const username =
    (import.meta.env.VITE_USERNAME as string | undefined)?.trim() || 'adamhalliday';
  const platform = detectHostPlatform();

  if (platform === 'windows') return `C:/Users/${username}`;
  if (platform === 'mac') return `/Users/${username}`;
  return `/home/${username}`;
}

/** Build a file:// URL for a path under the current machine's home directory. */
export function homeFileUrl(...segments: string[]): string {
  const home = getHomeDirectory();
  const joined = [home, ...segments].join('/').replace(/\/{2,}/g, '/');
  // Windows paths need file:///C:/... ; POSIX needs file:///Users/...
  if (/^[A-Za-z]:\//.test(joined)) {
    return `file:///${joined}`;
  }
  return `file://${joined.startsWith('/') ? joined : `/${joined}`}`;
}

type SkillSeed = Omit<SystemDiscoveredSkill, 'path'> & { relativePath: string };

const SKILL_SEEDS: SkillSeed[] = [
  // GOOGLE ANTIGRAVITY PLUGINS & SKILLS
  {
    id: 'sys-anti-1',
    name: 'android-cli-plugin',
    sourceSystem: 'Antigravity',
    relativePath: '.gemini/config/plugins/android-cli-plugin',
    description: 'Android SDK management, project building, ADB device deployment, & Gradle diagnostics.',
    category: 'System Plugin',
    isInstalled: true,
    status: 'Active',
    version: '1.4.0',
  },
  {
    id: 'sys-anti-2',
    name: 'chrome-devtools-plugin',
    sourceSystem: 'Antigravity',
    relativePath: '.gemini/config/plugins/chrome-devtools-plugin',
    description: 'Headless Chrome devtools automation, DOM element inspection, & page performance audit.',
    category: 'Browser',
    isInstalled: true,
    status: 'Active',
    version: '2.1.0',
  },
  {
    id: 'sys-anti-3',
    name: 'data-agent-kit-plugin',
    sourceSystem: 'Antigravity',
    relativePath: '.gemini/config/plugins/data-agent-kit-plugin',
    description: 'Local vector search, SQLite data indexing, & structured JSON dataset extraction.',
    category: 'Database',
    isInstalled: true,
    status: 'Active',
    version: '1.1.2',
  },
  {
    id: 'sys-anti-4',
    name: 'firebase-plugin',
    sourceSystem: 'Antigravity',
    relativePath: '.gemini/config/plugins/firebase',
    description: 'Firebase Firestore DB sync, authentication triggers, & cloud function deployment.',
    category: 'Database',
    isInstalled: true,
    status: 'Active',
    version: '3.0.1',
  },
  {
    id: 'sys-anti-5',
    name: 'google-antigravity-sdk',
    sourceSystem: 'Antigravity',
    relativePath: '.gemini/config/plugins/google-antigravity-sdk',
    description: 'Core Antigravity subagent orchestration, tool routing, & sandbox terminal execution.',
    category: 'System Plugin',
    isInstalled: true,
    status: 'Active',
    version: '4.2.0',
  },
  {
    id: 'sys-anti-6',
    name: 'modern-web-guidance-plugin',
    sourceSystem: 'Antigravity',
    relativePath: '.gemini/config/plugins/modern-web-guidance-plugin',
    description: 'Vite, React, Tailwind, HSL design system rules, & web accessibility standards.',
    category: 'Development',
    isInstalled: true,
    status: 'Active',
    version: '2.0.0',
  },

  // ANTHROPIC CLAUDE SKILLS & PLUGINS
  {
    id: 'sys-claude-1',
    name: 'Claude System Prompt & Artifacts Skill',
    sourceSystem: 'Claude',
    relativePath: '.claude/skills/artifacts-engine',
    description: 'Generates interactive React artifacts, mermaid architectural diagrams, & markdown decks.',
    category: 'Intelligence',
    isInstalled: true,
    status: 'Active',
    version: '3.7.0',
  },
  {
    id: 'sys-claude-2',
    name: 'Claude Code Interpreter Plugin',
    sourceSystem: 'Claude',
    relativePath: '.claude/plugins/code-interpreter',
    description: 'Executes Python pandas scripts, data visualizer charts, & SVG chart rendering.',
    category: 'Development',
    isInstalled: true,
    status: 'Active',
    version: '1.8.0',
  },

  // GOOGLE AI STUDIO & GEMINI SKILLS
  {
    id: 'sys-gemini-1',
    name: 'Gemini Multimodal Reasoning Skill',
    sourceSystem: 'Gemini',
    relativePath: '.gemini/skills/multimodal-reasoning',
    description: 'Analyzes high-res UI screenshots, wireframes, PDF spec documents, & audio notes.',
    category: 'Intelligence',
    isInstalled: true,
    status: 'Active',
    version: '2.5.0',
  },
  {
    id: 'sys-studio-1',
    name: 'Google AI Studio Function Calling',
    sourceSystem: 'Google AI Studio',
    relativePath: '.gemini/plugins/function-calling',
    description: 'Structured JSON schema output validation and REST API function execution.',
    category: 'System Plugin',
    isInstalled: true,
    status: 'Active',
    version: '1.3.0',
  },

  // CURSOR EDITOR SKILLS & PLUGINS
  {
    id: 'sys-cursor-1',
    name: 'Cursor .cursorrules Architecture Engine',
    sourceSystem: 'Cursor',
    relativePath: '.cursor/rules/project-rules',
    description: 'Enforces project linting rules, component file structures, & strict type checking.',
    category: 'Development',
    isInstalled: true,
    status: 'Active',
    version: '0.42.0',
  },

  // CHATGPT & OPENAI PLUGINS
  {
    id: 'sys-gpt-1',
    name: 'ChatGPT Code Interpreter & Data Analysis',
    sourceSystem: 'ChatGPT',
    relativePath: '.openai/plugins/code-interpreter',
    description: 'Jupyter notebook code runner, CSV data transformation, & statistics modeling.',
    category: 'Development',
    isInstalled: true,
    status: 'Active',
    version: '4.0.0',
  },

  // PERPLEXITY DEEP RESEARCH PLUGINS
  {
    id: 'sys-perpx-1',
    name: 'Perplexity Deep Research Engine',
    sourceSystem: 'Perplexity',
    relativePath: '.perplexity/plugins/deep-research',
    description: 'Real-time web search citation engine with academic & industry paper summaries.',
    category: 'Intelligence',
    isInstalled: true,
    status: 'Active',
    version: '2.1.0',
  },
];

/** Build the discovered-skills catalog with paths for the current OS. */
export function getDiscoveredSystemSkills(): SystemDiscoveredSkill[] {
  return SKILL_SEEDS.map(({ relativePath, ...skill }) => ({
    ...skill,
    path: homeFileUrl(...relativePath.split('/')),
  }));
}

/** Snapshot for callers that expect a constant array (recomputed per module load). */
export const DISCOVERED_SYSTEM_SKILLS: SystemDiscoveredSkill[] = getDiscoveredSystemSkills();
