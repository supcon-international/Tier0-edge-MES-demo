import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"
import { cn } from "@/common/utils"
import type { PropsBase } from "react-day-picker"
import * as PopoverPrimitive from "@radix-ui/react-popover"

interface IDatePickerProps {
  value?: Date | string | number | null
  onValueChange?: (value?: Date) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  disabledDates?: PropsBase["disabled"]
  portal?: boolean
}

export function DatePicker(props: IDatePickerProps) {
  const {
    value,
    onValueChange,
    placeholder,
    className,
    disabled,
    disabledDates,
    portal = true
  } = props;  
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const defaultPlaceholder = placeholder || t('datePicker.placeholder')

    // 当外部value变化时更新显示日期
  React.useEffect(() => {
    setDate(value ? new Date(value) : undefined);
  }, [value])

  // 将PopoverPrimitive.Content的内容抽象成渲染函数
  const renderPopoverContent = () => {
    return (
      <PopoverPrimitive.Content
        className="w-auto overflow-hidden p-0 rounded-md border shadow-lg bg-popover z-999"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date)
            onValueChange?.(date);
            setOpen(false)
          }}
          disabled={disabledDates}
        />
      </PopoverPrimitive.Content>
    )
  }

  return (
    <div className={`flex flex-col gap-3 ${ portal ? '' : '[&_[data-radix-popper-content-wrapper]]:!absolute' }`}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            variant="outline"
            id="date"
            disabled={disabled}
            className={cn("w-full justify-between font-normal", className)}
          >
            {date ? dayjs(date).format("YYYY-MM-DD") : (
              <span className="text-muted-foreground">{defaultPlaceholder}</span>
            )}
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverPrimitive.Trigger>
        {portal ? (
          <PopoverPrimitive.Portal>
            {renderPopoverContent()}
          </PopoverPrimitive.Portal>
        ) : (
          renderPopoverContent()
        )}
      </PopoverPrimitive.Root>
    </div>
  )
}