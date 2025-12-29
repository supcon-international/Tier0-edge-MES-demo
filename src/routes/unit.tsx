import type { RouteConfig } from './index';
import UnitListPage from '../pages/Unit/UnitListPage';

const unit: RouteConfig[] = [
  {
    path: '/unit/list',
    component: UnitListPage,
  },
];

export default unit;