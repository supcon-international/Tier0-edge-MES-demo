import { cn } from "@/common/utils"
import { useTranslation } from "react-i18next"
import type { TemplateStatus } from "@/types/template"

const STATUS_MAP: Record<
  TemplateStatus,
  { className: string; labelKey: string }
> = {
  draft: {
    className: "bg-gray-100 text-gray-800 border border-gray-200",
    labelKey: "template.badge.draft",
  },
  inProgress: {
    className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    labelKey: "template.badge.inProgress",
  },
  completed: {
    className: "bg-green-100 text-green-800 border border-green-200",
    labelKey: "template.badge.completed",
  },
  blocked: {
    className: "bg-red-100 text-red-800 border border-red-200",
    labelKey: "template.badge.blocked",
  },
}

interface StatusBadgeProps {
  status: TemplateStatus
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation()
  const meta = STATUS_MAP[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        meta.className
      )}
    >
      {t(meta.labelKey)}
    </span>
  )
}

export default StatusBadge

