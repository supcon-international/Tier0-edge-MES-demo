import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Globe } from "lucide-react"
import { Button } from "./ui/button"
import { Toaster } from "sonner"

interface TemplateLayoutProps {
  children: React.ReactNode
}

const TemplateLayout: React.FC<TemplateLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation()

  const current = useMemo(
    () => (i18n.language?.startsWith("zh") ? "zh" : "en"),
    [i18n.language]
  )

  const switchLang = (lang: "zh" | "en") => {
    i18n.changeLanguage(lang)
    localStorage.setItem("lang", lang === "zh" ? "zh-cn" : "en-us")
  }

  return (
    <div className="min-h-screen bg-muted text-foreground">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex flex-col gap-1">
            <span className="text-xl font-semibold">{t("app.title")}</span>
            <span className="text-sm text-muted-foreground">
              React · Vite · TypeScript · Tailwind CSS 4 · shadcn/ui
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Button
              variant={current === "zh" ? "default" : "outline"}
              size="sm"
              onClick={() => switchLang("zh")}
            >
              中文
            </Button>
            <Button
              variant={current === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => switchLang("en")}
            >
              English
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        {children}
      </main>
      <Toaster position="top-center" />
    </div>
  )
}

export default TemplateLayout

