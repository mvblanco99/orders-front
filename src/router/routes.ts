import type { RouteRecordRaw } from 'vue-router';
import StartRouter from 'src/modules/start/router';
import AuthRouter from 'src/modules/auth/router';

const routes: RouteRecordRaw[] = [AuthRouter, ...StartRouter];

export default routes;
