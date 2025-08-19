import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['../src'],
  elementPlus: {},
  mfsu: {
    shared: {
      vue: {
        singleton: true,
      },
    },
  }
});
