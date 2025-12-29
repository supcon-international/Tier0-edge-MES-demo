import {
  FileText,
  Scale,
} from "lucide-react";

// 定义菜单项接口
export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

// 路由菜单项配置
export const menuItems: MenuItem[] = [
  { 
    label: "system.menu.example", 
    icon: <FileText size={18} />, 
    path: "/example/list"
  },
  { 
    label: "system.menu.unit", 
    icon: <Scale size={18} />, 
    path: "/unit/list"
  },
];