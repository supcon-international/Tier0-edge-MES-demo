import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import PageContainer from "@/components/PageContainer"
import StatusBadge from "@/components/StatusBadge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatDateTime } from "@/common/utils"
import type { TemplateItem, TemplateStatus } from "@/types/template"

const MOCK_DATA: TemplateItem[] = [
  {
    id: "TMP-001",
    name: "生产任务模板",
    status: "inProgress",
    owner: "Jessie",
    updatedAt: "2024-05-11T10:00:00Z",
    priority: "P1",
  },
  {
    id: "TMP-002",
    name: "BOM 校验模板",
    status: "draft",
    owner: "Alex",
    updatedAt: "2024-04-02T08:00:00Z",
    priority: "P2",
  },
  {
    id: "TMP-003",
    name: "质检流程模板",
    status: "completed",
    owner: "Lee",
    updatedAt: "2024-02-19T13:30:00Z",
    priority: "P1",
  },
  {
    id: "TMP-004",
    name: "入库检验模板",
    status: "blocked",
    owner: "Mila",
    updatedAt: "2024-03-08T12:00:00Z",
    priority: "P3",
  },
]

const statusOptions: { value: TemplateStatus; labelKey: string }[] = [
  { value: "draft", labelKey: "template.badge.draft" },
  { value: "inProgress", labelKey: "template.badge.inProgress" },
  { value: "completed", labelKey: "template.badge.completed" },
  { value: "blocked", labelKey: "template.badge.blocked" },
]

const TemplateListPage: React.FC = () => {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState<TemplateStatus | "">("")
  const [owner, setOwner] = useState("")

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      const hitKeyword =
        !keyword ||
        item.name.toLowerCase().includes(keyword.toLowerCase()) ||
        item.owner.toLowerCase().includes(keyword.toLowerCase())
      const hitStatus = !status || item.status === status
      const hitOwner =
        !owner || item.owner.toLowerCase().includes(owner.toLowerCase())
      return hitKeyword && hitStatus && hitOwner
    })
  }, [keyword, status, owner])

  const handleSearch = () => {
    toast.success(t("template.toast.search"))
  }

  const handleReset = () => {
    setKeyword("")
    setStatus("")
    setOwner("")
    toast.success(t("template.toast.reset"))
  }

  return (
    <PageContainer
      title={t("template.pageTitle")}
      description={t("template.pageDescription")}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("template.search.title")}</CardTitle>
            <CardDescription>
              {t("template.search.description") ||
                "使用高对比度按钮与规范栅格，保持表单留白。"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="keyword">{t("template.search.keyword")}</Label>
                <Input
                  id="keyword"
                  placeholder={t("template.search.keyword")}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("template.search.status")}</Label>
                <Select
                  value={status || "all"}
                  onValueChange={(value) =>
                    setStatus(value === "all" ? "" : (value as TemplateStatus))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("template.search.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("actions.clear")}</SelectItem>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner">{t("template.search.owner")}</Label>
                <Input
                  id="owner"
                  placeholder={t("template.search.owner")}
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button className="bg-black text-white" onClick={handleSearch}>
                  {t("actions.search")}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  {t("actions.reset")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b pb-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>{t("template.table.title")}</CardTitle>
                <CardDescription>
                  {t("template.pageDescription")}
                </CardDescription>
              </div>
              <Button className="bg-black text-white" size="sm">
                {t("actions.create")}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="text-sm text-muted-foreground">
                    <th className="px-6 py-3 font-semibold">
                      {t("template.table.columns.name")}
                    </th>
                    <th className="px-6 py-3 font-semibold">
                      {t("template.table.columns.status")}
                    </th>
                    <th className="px-6 py-3 font-semibold">
                      {t("template.table.columns.priority")}
                    </th>
                    <th className="px-6 py-3 font-semibold">
                      {t("template.table.columns.owner")}
                    </th>
                    <th className="px-6 py-3 font-semibold">
                      {t("template.table.columns.updatedAt")}
                    </th>
                    <th className="px-6 py-3 font-semibold">
                      {t("template.table.actions.view")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td
                        className="px-6 py-6 text-sm text-muted-foreground"
                        colSpan={6}
                      >
                        {t("template.table.empty")}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.id} className="text-sm">
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">
                            {item.name}
                          </div>
                          <div className="text-muted-foreground">
                            {item.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-6 py-4">{item.priority}</td>
                        <td className="px-6 py-4">{item.owner}</td>
                        <td className="px-6 py-4">
                          {formatDateTime(item.updatedAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <Button variant="link" size="sm" className="px-0">
                              {t("template.table.actions.view")}
                            </Button>
                            <Button variant="outline" size="sm">
                              {t("template.table.actions.edit")}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default TemplateListPage

