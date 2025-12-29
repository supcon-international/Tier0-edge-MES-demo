import React, { useState, useEffect } from "react";
import { useLocation, NavLink, Outlet } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "../common/utils.ts";
import { menuItems } from "../common/menuItems";
import { Toaster } from "./ui/sonner";
import i18n from "../i18n";
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  // 设置默认展开所有有子菜单的一级菜单
  const defaultExpandedItems = menuItems
    .filter(item => item.children && item.children.length > 0)
    .map(item => item.path || '');
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpandedItems);

  // 监听语言变化并更新状态
  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(i18n.language);
    };

    // 注册监听器
    i18n.on('languageChanged', handleLanguageChange);
    
    // 清理监听器
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const isActivePath = (path: string) => {
    if (path === "/") return location.pathname === "/";
    
    // 精确匹配路径，避免前缀匹配问题
    if (location.pathname === path) return true;
    
    // 对于路径末尾没有斜杠的情况，也匹配带斜杠的路径
    if (location.pathname === `${path}/`) return true;
    
    // 对于路径末尾有斜杠的情况，也匹配不带斜杠的路径
    if (location.pathname === `${path.replace(/\/$/, '')}`) return true;
    
    return false;
  };

  // 切换子菜单展开状态
  const toggleExpanded = (path: string) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  // 递归渲染菜单项
  const renderMenuItem = (item: any, level: number = 0, index: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.path);
    const uniqueKey = item.path ? `${item.path}-${index}` : `menu-${index}`;
    
    if (level === 0) {
      // 一级菜单
      return (
        <SidebarMenuItem key={uniqueKey}>
          {hasChildren ? (
            // 有子菜单的一级菜单 - 使用button而不是NavLink
            <SidebarMenuButton
              onClick={() => toggleExpanded(item.path)}
              className={cn(
                "flex items-center justify-between w-full"
              )}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{t(item.label)}</span>
              </div>
              <ChevronDown 
                size={16} 
                className={cn(
                  "transition-transform duration-200",
                  isExpanded ? "rotate-180" : ""
                )} 
              />
            </SidebarMenuButton>
          ) : (
            // 没有子菜单的一级菜单
            <NavLink to={item.path} end={item.path === "/"}>
              {({ isActive }) => (
                <SidebarMenuButton
                  isActive={isActive || isActivePath(item.path)}
                  className={cn("flex items-center gap-2")}
                >
                  {item.icon}
                  <span>{t(item.label)}</span>
                </SidebarMenuButton>
              )}
            </NavLink>
          )}
          {hasChildren && isExpanded && (
            <SidebarMenuSub>
              {item.children.map((child: any, childIndex: number) => renderMenuItem(child, level + 1, childIndex))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      );
    } else {
      // 二级菜单 - 直接使用SidebarMenuSubButton并添加onClick事件
      return (
        <SidebarMenuSubItem key={uniqueKey}>
          <SidebarMenuSubButton
            isActive={isActivePath(item.path)}
            onClick={() => {
              if (item.path) {
                window.location.hash = item.path;
              }
            }}
          >
            {t(item.label)}
          </SidebarMenuSubButton>
        </SidebarMenuSubItem>
      );
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {/* 侧边栏 - 仅在开发模式下显示 */}
        {(import.meta.env.DEV || import.meta.env.VITE_APP_TYPE === 'spa') && (
          <Sidebar className="z-10">
            <SidebarHeader className="py-4 flex justify-between items-center px-4">
              <h1 className="text-xl font-bold">{t('system.systemName')}</h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Globe size={16} />
                      {currentLanguage === 'zh' ? '中文' : 'English'}
                    </Button>
                  </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => {
                    i18n.changeLanguage('zh');
                    localStorage.setItem('lang', 'zh-cn');
                  }}>
                    中文
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    i18n.changeLanguage('en');
                    localStorage.setItem('lang', 'en-us');
                  }}>
                    English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item, index) => (
                  <React.Fragment key={item.path ? `${item.path}-${index}` : `menu-${index}`}>
                    {renderMenuItem(item, 0, index)}
                  </React.Fragment>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        )}

        {/* 主内容区域 - 添加响应式处理 */}
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-auto transition-all duration-300">
          {children || <Outlet />}
          <Toaster position="top-center" />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;