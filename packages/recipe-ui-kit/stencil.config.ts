import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'recipe-ui-kit',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
  ],
};
