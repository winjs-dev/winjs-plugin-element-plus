import { dirname } from 'node:path';
import { deepmerge, resolve } from '@winner-fed/utils';
import type { IApi } from '@winner-fed/winjs';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

function resolveProjectDep(opts: { pkg: any; cwd: string; dep: string }) {
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
  let pkgPath: string;
  try {
    pkgPath =
      resolveProjectDep({
        pkg: api.pkg,
        cwd: api.cwd,
        dep: 'element-plus',
      }) || dirname(require.resolve('element-plus/package.json'));
  } catch (e) {}

  function checkPkgPath() {
    if (!pkgPath) {
      throw new Error(
        `Can't find element-plus package. Please install antd first.`,
      );
    }
  }

  api.modifyAppData((memo) => {
    checkPkgPath();
    const version = require(`${pkgPath}/package.json`).version;
    memo.elementPlus = {
      pkgPath,
      version,
    };
    return memo;
  });

  api.describe({
    key: 'elementPlus',
    config: {
      schema({ zod }) {
        return zod.object({});
      },
    },
    enableBy: api.EnableBy.config,
  });

  const unComponents = {
    resolvers: [ElementPlusResolver()],
  };

  api.userConfig.autoImport = deepmerge(
    {
      unComponents,
    },
    api.userConfig.autoImport || {},
  );
};
