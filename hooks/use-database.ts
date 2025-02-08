import { useState, useEffect } from 'react';
import Database from '@tauri-apps/plugin-sql';

type DatabaseInstance = Awaited<ReturnType<typeof Database.load>>;

export const useDatabase = () => {
    const [db, setDb] = useState<DatabaseInstance | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.__TAURI__) {
            Database.load('sqlite:test.db')
                .then((database) => {
                    setDb(database);
                })
                .catch((error) => {
                    console.error('Failed to load database:', error);
                });
        }
    }, []);

    return db;
};