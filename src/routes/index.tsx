import example from './example.tsx'
import unit from './unit.tsx'

// 定义路由类型
export type RouteConfig = {
  path: string;
  component: React.ComponentType<any>;
  children?: RouteConfig[];
};

// 路由模块映射
const routeModules: Record<string, RouteConfig[]> = {
  example,
  unit,
};

// 获取当前应用类型
const appType = import.meta.env.VITE_APP_TYPE;

// 开发模式或未设置应用类型时返回所有路由，生产模式只返回对应模块的路由
export const routes: RouteConfig[] = 
  import.meta.env.DEV || appType === "spa"
    ? Object.values(routeModules).reduce(
        (acc, routes) => acc.concat(routes),
        []
      )
    : routeModules[appType as keyof typeof routeModules] || [];


