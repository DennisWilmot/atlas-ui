import type { StorybookConfig } from '@storybook/react-vite';
import type { PluginOption, UserConfig } from 'vite';

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
    build: withoutLibraryBuildSettings(config.build),
    plugins: withoutDeclarationPlugin(config.plugins),
  }),
};
export default config;
