/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOME_DIR?: string;
  readonly VITE_USERNAME?: string;
  readonly VITE_PLATFORM?: 'windows' | 'mac' | 'linux';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
