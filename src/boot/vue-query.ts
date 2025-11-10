import { boot } from 'quasar/wrappers';
import { VueQueryPlugin } from '@tanstack/vue-query';

export default boot(({ app }) => {
  VueQueryPlugin.install(app, {
    // default options
    queryClientConfig: {
      defaultOptions: {
        queries: {},
      },
    },
  });
});
