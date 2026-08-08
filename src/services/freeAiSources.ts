/**
 * Curated free-tier AI gateways (not the full 295-model directory).
 * Source directory: https://www.ayautomate.com/free-models
 * Keep this list short — one row per gateway, steps inline for connect UX.
 */

export interface FreeAiSource {
  id: string;
  name: string;
  /** Short one-liner for the catalog row */
  blurb: string;
  endpoint: string;
  suggestedModel: string;
  requiresKey: boolean;
  freeLimits: string;
  catchNote: string;
  /** Ordered setup steps shown in the connect panel */
  steps: string[];
  keyUrl: string;
  /** Deep link into the public directory for this source */
  guideUrl: string;
}

export const FREE_MODELS_DIRECTORY_URL =
  'https://www.ayautomate.com/free-models';

/** Lean catalog: distinct OpenAI-compatible (or near) free gateways. */
export const FREE_AI_SOURCES: FreeAiSource[] = [
  {
    id: 'google-ai-studio',
    name: 'Google AI Studio',
    blurb: 'Gemini 2.5 Flash — generous free tier, multimodal, no card.',
    endpoint: 'https://generativelanguage.googleapis.com',
    suggestedModel: 'gemini-2.5-flash',
    requiresKey: true,
    freeLimits: 'Generous free tier · no card',
    catchNote: 'Rate limits apply; confirm commercial terms before shipping.',
    steps: [
      'Open Google AI Studio and create a free API key (no credit card).',
      'Paste the key below. Endpoint is already set to Google’s Generative Language API.',
      'Keep model gemini-2.5-flash (or swap to another free Gemini id from the Studio model list).',
      'Save — use as default when you want zero paid inference.',
    ],
    keyUrl: 'https://aistudio.google.com/apikey',
    guideUrl: 'https://www.ayautomate.com/free-models/google-gemini-2-5-flash',
  },
  {
    id: 'groq',
    name: 'Groq',
    blurb: 'Llama 3.3 70B on LPUs — fast free chat + tools.',
    endpoint: 'https://api.groq.com/openai/v1',
    suggestedModel: 'llama-3.3-70b-versatile',
    requiresKey: true,
    freeLimits: '1,000 RPD · 30 RPM',
    catchNote: 'Commercial OK on free tier; still verify current ToS.',
    steps: [
      'Create a free GroqCloud account and generate an API key.',
      'Paste the key. Base URL stays https://api.groq.com/openai/v1 (OpenAI-compatible).',
      'Model defaults to llama-3.3-70b-versatile (also try llama-3.1-8b-instant for higher headroom).',
      'Watch the 30 RPM / 1,000 RPD free caps.',
    ],
    keyUrl: 'https://console.groq.com/keys',
    guideUrl: 'https://www.ayautomate.com/free-models/groq-llama-3-3-70b',
  },
  {
    id: 'openrouter-free',
    name: 'OpenRouter (:free)',
    blurb: 'One key → many models tagged :free.',
    endpoint: 'https://openrouter.ai/api/v1',
    suggestedModel: 'openai/gpt-oss-20b:free',
    requiresKey: true,
    freeLimits: '20 RPM · 50–1000 RPD',
    catchNote: 'Commercial allowed; free pool models rotate — prefer :free ids.',
    steps: [
      'Sign up at OpenRouter and create an API key (no card for free models).',
      'Paste the key. Endpoint: https://openrouter.ai/api/v1.',
      'Pick any model id ending in :free (default openai/gpt-oss-20b:free).',
      'Stay under ~20 RPM; upgrade only if you leave the free pool.',
    ],
    keyUrl: 'https://openrouter.ai/keys',
    guideUrl: 'https://www.ayautomate.com/free-models/openrouter-free',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Inference',
    blurb: 'Rate-limited access to thousands of community models.',
    endpoint: 'https://router.huggingface.co/v1',
    suggestedModel: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
    requiresKey: true,
    freeLimits: 'Rate-limited · large catalog',
    catchNote: 'Commercial OK for many models; check each model license.',
    steps: [
      'Create a Hugging Face account and a fine-grained token with Inference access.',
      'Paste the token as the API key. Endpoint uses the OpenAI-compatible router.',
      'Set model to a chat-capable Hub id (default Meta-Llama-3.1-8B-Instruct).',
      'Expect cold starts and rate limits on the free Inference path.',
    ],
    keyUrl: 'https://huggingface.co/settings/tokens',
    guideUrl: 'https://www.ayautomate.com/free-models/huggingface-inference',
  },
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM',
    blurb: 'Free API to a wide NIM catalog (~40 RPM).',
    endpoint: 'https://integrate.api.nvidia.com/v1',
    suggestedModel: 'meta/llama-3.1-8b-instruct',
    requiresKey: true,
    freeLimits: '~40 RPM free tier',
    catchNote: 'Confirm commercial use per model on build.nvidia.com.',
    steps: [
      'Sign in at build.nvidia.com and generate an NGC / NIM API key.',
      'Paste the key. Base URL: https://integrate.api.nvidia.com/v1.',
      'Choose a free NIM model id from the catalog (default meta/llama-3.1-8b-instruct).',
      'Respect ~40 RPM; swap models without changing the base URL.',
    ],
    keyUrl: 'https://build.nvidia.com/',
    guideUrl: 'https://www.ayautomate.com/free-models/nvidia-nim-90-more-models',
  },
  {
    id: 'github-models',
    name: 'GitHub Models',
    blurb: 'Free playground models via a GitHub token.',
    endpoint: 'https://models.github.ai/inference',
    suggestedModel: 'openai/gpt-4o-mini',
    requiresKey: true,
    freeLimits: 'Rate-limited free tier',
    catchNote: 'Personal access token required; check GitHub Models ToS for commercial.',
    steps: [
      'Enable GitHub Models and create a classic PAT with models access (or use Codespaces token flow).',
      'Paste the token as API key. Endpoint: https://models.github.ai/inference.',
      'Set a published model id from the Models catalog (default openai/gpt-4o-mini).',
      'Use for light workloads — free quotas are shared and rate-limited.',
    ],
    keyUrl: 'https://github.com/marketplace/models',
    guideUrl: 'https://www.ayautomate.com/free-models',
  },
  {
    id: 'cloudflare-workers-ai',
    name: 'Cloudflare Workers AI',
    blurb: 'Account-scoped free neurons/day (shared pool).',
    endpoint: 'https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/v1',
    suggestedModel: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    requiresKey: true,
    freeLimits: '~10K neurons/day (shared)',
    catchNote: 'Replace YOUR_ACCOUNT_ID in the endpoint; commercial terms vary.',
    steps: [
      'In Cloudflare Dashboard → Workers AI, copy Account ID and create an API token with Workers AI permissions.',
      'Replace YOUR_ACCOUNT_ID in the endpoint URL, then paste the token as API key.',
      'Use a @cf/... model id (default llama-3.3-70b instruct fp8).',
      'Stay within the daily neuron budget on the free plan.',
    ],
    keyUrl: 'https://dash.cloudflare.com/',
    guideUrl:
      'https://www.ayautomate.com/free-models/cloudflare-workers-ai-cf-openai-gpt-oss-120b',
  },
  {
    id: 'ollama-cloud',
    name: 'Ollama Cloud',
    blurb: 'Cloud-hosted open models with a free tier (e.g. Kimi K2.6).',
    endpoint: 'https://ollama.com/api',
    suggestedModel: 'kimi-k2:cloud',
    requiresKey: true,
    freeLimits: 'Free tier',
    catchNote: 'Confirm commercial clause on your Ollama Cloud plan.',
    steps: [
      'Create an Ollama account and enable Cloud / API access.',
      'Generate an API key and paste it here.',
      'Pick a cloud model id from your Ollama Cloud catalog (default kimi-k2:cloud).',
      'Prefer local Ollama when offline — this row is for the hosted free tier only.',
    ],
    keyUrl: 'https://ollama.com/',
    guideUrl: 'https://www.ayautomate.com/free-models/ollama-cloud-kimi-k2-6',
  },
];
