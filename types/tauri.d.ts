import { Database } from '@tauri-apps/plugin-sql';

declare global {
  interface Window {
    __TAURI__: {
      sql: {
        load: (connectionString: string) => Promise<Database>;
      };
    };
  }
}