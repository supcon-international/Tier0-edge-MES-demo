import templateRoutes from "./template"

export type RouteConfig = {
  path: string
  component: React.ComponentType<any>
  children?: RouteConfig[]
}

const routeModules: Record<string, RouteConfig[]> = {
  template: templateRoutes,
}

const appType = import.meta.env.VITE_APP_TYPE

export const routes: RouteConfig[] =
  import.meta.env.DEV || appType === "spa"
    ? Object.values(routeModules).flat()
    : routeModules[appType as keyof typeof routeModules] || templateRoutes

