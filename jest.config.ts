import type { Config } from '@jest/types';
// Sync object
const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    verbose: true
};

export default config;
