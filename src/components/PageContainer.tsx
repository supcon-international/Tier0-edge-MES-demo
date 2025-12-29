import { cn } from "@/common/utils.ts";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface PageContainerProps {
  /** 页面大标题 */
  title: string;
  /** 页面描述 */
  description?: string;
  /** 右侧自定义渲染组件 */
  rightHeader?: React.ReactNode;
  /** 是否添加返回按钮 */
  onBack?: boolean;
  /** 页面内容区域 */
  children: React.ReactNode;
}

/**
 * 页面容器组件
 * 提供标准的页面布局结构，从上到下包含header和content
 * header左侧为标题和描述，右侧可自定义组件
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  rightHeader,
  children,
  onBack = false,
}) => {
  const navigate = useNavigate();
  return (
    <div className="page-container w-full h-full flex flex-col">
      {/* 顶部标题区域 */}
      <div className="page-container-header flex justify-between items-center px-6 py-4 w-full">
        <div>
          <div
            className={cn(
              "flex items-center space-x-2",
              onBack && "cursor-pointer"
            )}
            onClick={onBack ? () => navigate(-1) : undefined}
          >
            {onBack && <ArrowLeft className="h-5 w-5" />}
            <h1 className="text-left text-2xl font-semibold">{title}</h1>
          </div>
          {description && (
            <label className="text-sm font-normal">{description}</label>
          )}
        </div>
        {rightHeader && <div>{rightHeader}</div>}
      </div>

      {/* 内容区域 */}
      <div className="page-container-content flex-1 w-full overflow-auto px-6 pb-4">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
