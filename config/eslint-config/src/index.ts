import type { Awaitable, FlatConfigItem, OptionsConfig, UserConfigItem } from '@antfu/eslint-config';
import antfu, { GLOB_JSX, GLOB_TSX } from '@antfu/eslint-config';

const mchammerConfigs: UserConfigItem = [
  {
    name: 'mchammer:allow-console-log',
    files: ['other/**/*.ts', '**/*.server.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    name: 'mchammer:react-version',
    files: [GLOB_JSX, GLOB_TSX],
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

export function mchammer(options?: OptionsConfig & FlatConfigItem, ...userConfigs: Awaitable<UserConfigItem | UserConfigItem[]>[]) {
  const configs = [...mchammerConfigs, ...userConfigs];
  return antfu({
    overrides: {
      react: {
        'react/prop-types': 'off',
      },
    },
    // react: true,
    stylistic: {
      semi: true,
    },
    ...options,
  }, configs);
}
