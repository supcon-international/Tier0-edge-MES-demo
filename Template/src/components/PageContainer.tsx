import { cn } from "@/common/utils.ts"
import { ArrowLeft } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"

interface PageContainerProps {
  title: string
  description?: string
  rightHeader?: React.ReactNode
  onBack?: boolean
  children: React.ReactNode
}

/**
 * 页面容器：统一顶部标题区与内容区，保持留白与对齐
 */
const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  rightHeader,
  children,
  onBack = false,
}) => {
  const navigate = useNavigate()
  return (
    <div className="page-container w-full h-full flex flex-col">
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
            <label className="text-sm font-normal text-muted-foreground">
              {description}
            </label>
          )}
        </div>
        {rightHeader && <div>{rightHeader}</div>}
      </div>

      <div className="page-container-content flex-1 w-full overflow-auto px-0 pb-4">
        {children}
      </div>
    </div>
  )
}

export default PageContainer

