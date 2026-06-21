import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import type { PluginOption, UserConfig } from 'vite';

const storybookDir = dirname(fileURLToPath(import.meta.url));

function withoutDeclarationPlugin(plugins: PluginOption[] = []): PluginOption[] {
  return plugins.flatMap((plugin) => {
    if (!plugin) return [];
    if (Array.isArray(plugin)) return withoutDeclarationPlugin(plugin);
    if (typeof plugin === 'object' && 'name' in plugin && plugin.name === 'unplugin-dts') return [];
    return [plugin];
  });
}

function withoutLibraryBuildSettings(build: UserConfig['build']): UserConfig['build'] {
  if (!build) return build;

  const nextBuild: UserConfig['build'] = { ...build };
  delete nextBuild.lib;

  if (nextBuild.rollupOptions) {
    nextBuild.rollupOptions = { ...nextBuild.rollupOptions };
    delete nextBuild.rollupOptions.external;
  }

  return nextBuild;
}

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../examples/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp"
  ],
  "framework": "@storybook/react-vite",
  viteFinal: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        'atlas-ui/primitives': resolve(storybookDir, '../src/primitives.ts'),
        'atlas-ui/patterns': resolve(storybookDir, '../src/patterns.ts'),
        'atlas-ui/types': resolve(storybookDir, '../src/types.ts'),
        'atlas-ui/headless': resolve(storybookDir, '../src/headless.ts'),
      },
    },
    build: withoutLibraryBuildSettings(config.build),
    plugins: withoutDeclarationPlugin(config.plugins),
  }),
};
export default config;
