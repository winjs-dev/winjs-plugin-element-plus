import { dirname } from 'node:path';
import { deepmerge, resolve } from '@winner-fed/utils';
import type { IApi } from '@winner-fed/winjs';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

function resolveProjectDep(opts: {
  pkg: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  cwd: string;
  dep: string;
}) {
  if (
    opts.pkg.dependencies?.[opts.dep] ||
    opts.pkg.devDependencies?.[opts.dep]
  ) {
    return dirname(
      resolve.sync(`${opts.dep}/package.json`, {
        basedir: opts.cwd,
      }),
    );
  }
}

export default (api: IApi) => {
  let pkgPath: string = '';
  try {
    pkgPath =
      resolveProjectDep({
        pkg: api.pkg,
        cwd: api.cwd,
        dep: 'element-plus',
      }) || dirname(require.resolve('element-plus/package.json'));
  } catch (_) {}

  function checkPkgPath() {
    if (!pkgPath) {
      throw new Error(
        `Can't find element-plus package. Please install element-plus first.`,
      );
    }
  }

  api.describe({
    key: 'elementPlus',
    config: {
      schema({ zod }) {
        return zod
          .object({
            importStyle: zod
              .union([zod.boolean(), zod.literal('css'), zod.literal('sass')])
              .describe(
                '样式导入方式。true 或 "css" 导入编译后的 CSS 文件，"sass" 导入 Sass 源文件以支持主题定制，false 不自动导入样式。推荐使用 "sass" 以获得更好的主题定制能力。',
              )
              .default(true)
              .optional(),
            version: zod
              .string()
              .describe(
                '手动指定 Element Plus 版本，用于覆盖自动检测的版本。格式如 "2.4.1"、"2.3.8" 等。通常无需配置，插件会自动从 package.json 检测版本。',
              )
              .optional(),
            prefix: zod
              .string()
              .describe(
                '组件名称前缀。默认为 "El"，对应 "ElButton"、"ElInput" 等组件名。如需自定义可修改此配置，但需确保与实际使用的组件名一致。',
              )
              .default('El')
              .optional(),
            exclude: zod
              .array(zod.string())
              .describe(
                '排除自动导入的组件列表。数组元素为组件名称（不含前缀），如 ["Button", "Input"]。被排除的组件需要手动导入。适用于需要自定义导入逻辑的场景。',
              )
              .optional(),
            noStylesComponents: zod
              .array(zod.string())
              .describe(
                '无需导入样式的组件列表。这些组件不会自动导入对应的样式文件，适用于一些功能性组件（如 ElMessage、ElNotification 等），它们的样式通常已全局引入。',
              )
              .default([
                'ElMessage',
                'ElNotification',
                'ElMessageBox',
                'ElLoading',
              ])
              .optional(),
            directives: zod
              .boolean()
              .describe(
                '是否启用 Element Plus 指令的自动导入。设为 true 时会自动导入 v-loading、v-infinite-scroll 等指令。默认启用以提供完整的 Element Plus 功能。',
              )
              .default(true)
              .optional(),
          })
          .describe(
            'Element Plus 自动导入插件配置。集成 unplugin-vue-components 的 ElementPlusResolver，提供 Element Plus 组件、样式和指令的按需自动导入功能，支持主题定制和性能优化，适用于 Vue 3 项目。',
          )
          .optional()
          .default({});
      },
    },
    enableBy: api.EnableBy.config,
  });

  checkPkgPath();
  const detectedVersion = require(`${pkgPath}/package.json`).version;

  api.modifyAppData((memo) => {
    // 使用用户配置的版本，如果没有配置则使用检测到的版本
    const finalVersion = api.userConfig.elementPlus?.version || detectedVersion;
    memo.elementPlus = {
      pkgPath,
      version: finalVersion,
      detectedVersion,
    };
    return memo;
  });

  // 获取用户配置，如果没有配置则使用默认值
  const userConfig = api.userConfig.elementPlus || {};
  const resolverConfig = {
    // 样式导入方式：默认为 true
    importStyle:
      userConfig.importStyle !== undefined ? userConfig.importStyle : true,
    // 组件前缀：默认为 'El'
    prefix: userConfig.prefix || 'El',
    // 排除的组件列表
    ...(userConfig.exclude && { exclude: userConfig.exclude }),
    // 无需导入样式的组件
    noStylesComponents: userConfig.noStylesComponents || [
      'ElMessage',
      'ElNotification',
      'ElMessageBox',
      'ElLoading',
    ],
    // 是否启用指令
    directives: userConfig.directives !== false,
  };

  const unComponents = {
    resolvers: [ElementPlusResolver(resolverConfig)],
  };

  api.userConfig.autoImport = deepmerge(
    {
      unComponents,
    },
    api.userConfig.autoImport || {},
  );
};
