import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"
import { cn } from "@/common/utils"
import type { PropsBase } from "react-day-picker"
import * as PopoverPrimitive from "@radix-ui/react-popover"

// 使用Radix UI的Popover组件
const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverContent = PopoverPrimitive.Content
const Portal = PopoverPrimitive.Portal

interface IDateTimePickerProps {
  value?: Date | string | number | null
  onValueChange?: (value?: Date) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  disabledDates?: PropsBase["disabled"],
  portal?: boolean
}

export function DateTimePicker(props: IDateTimePickerProps) {
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
  const [time, setTime] = React.useState<string>("00:00")
  const [displayDate, setDisplayDate] = React.useState<Date | undefined>(undefined)
  const defaultPlaceholder = placeholder || t('dateTimePicker.placeholder')

  // 当外部value变化时更新显示日期
  React.useEffect(() => {
    if (value) {
      const newDate = dayjs(value).toDate();
      setDate(newDate)
      setDisplayDate(newDate)
      setTime(dayjs(newDate).format("HH:mm"))
    } else {
      setDate(undefined)
      setDisplayDate(undefined)
      setTime("00:00")
    }
  }, [value])

  // 处理时间输入变化
  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value)
  }

  // 处理日期选择
  const handleDateSelect = (selectedDate?: Date) => {
    if (selectedDate) {
      // 解析当前时间
      const [hours, minutes] = time.split(":").map(Number)

      // 创建新的日期对象并设置时间
      const newDate = new Date(selectedDate)
      newDate.setHours(hours || 0)
      newDate.setMinutes(minutes || 0)

      setDate(newDate)
    }
  }

  // 确认选择，合并日期和时间
  const handleConfirm = () => {
    if (date) {
      const newDate = new Date(date)
      // 解析时间字符串
      const [hours, minutes] = time.split(":").map(Number)
      newDate.setHours(hours || 0)
      newDate.setMinutes(minutes || 0)

      // 更新显示日期
      setDisplayDate(newDate)

      // 调用外部onValueChange
      onValueChange?.(newDate)
    }
    setOpen(false)
  }

  const renderPopoverContent = () => {
    return (
      <PopoverContent
        className={`w-auto p-4 rounded-md border shadow-lg bg-popover z-999`}
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={handleDateSelect}
          disabled={disabledDates}
          className="mb-4"
        />
        <div className="flex items-center gap-2 px-4">
          <Label htmlFor="time" className="text-sm font-medium">
            {t('dateTimePicker.time')}
          </Label>
          <div className="flex items-center gap-1">
            <Input
              id="time"
              type="time"
              value={time}
              onChange={handleTimeInputChange}
              placeholder={t('dateTimePicker.timePlaceholder')}
              className="w-full h-9 text-center"
              disabled={disabled}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            variant="default"
            onClick={handleConfirm}
            disabled={disabled}
          >
            {t('dateTimePicker.confirm')}
          </Button>
        </div>
      </PopoverContent >
    )
  }

  return (
    <div className={`flex flex-col gap-3 ${ portal ? '' : '[&_[data-radix-popper-content-wrapper]]:!absolute' }`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn("relative w-full justify-between font-normal", className)}
          >
            {displayDate ? dayjs(displayDate).format("YYYY-MM-DD HH:mm") : (
              <span className="text-muted-foreground">{defaultPlaceholder}</span>
            )}
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        {portal ? (
          <Portal>
            {renderPopoverContent()}
          </Portal>
        ) : (
          renderPopoverContent()
        )}
      </Popover>
    </div>
  )
}