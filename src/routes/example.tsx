import type { RouteConfig } from './index';
import ExampleListPage from '../pages/Example/ExampleListPage';

const example: RouteConfig[] = [
  {
    path: '/example/list',
    component: ExampleListPage,
  },
];

export default example;