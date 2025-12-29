import { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Check } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

// 定义选项的接口
export interface MultiSelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

// 定义组件的 props 接口
export interface MultiSelectProps<T = string> {
  id?: string;
  options: MultiSelectOption<T>[];
  value: T[];
  onChange: (selected: T[]) => void;
  placeholder?: string;
  maxSelect?: number;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "destructive";
  valueKey?: keyof MultiSelectOption<T>;
  labelKey?: keyof MultiSelectOption<T>;
  showSelectedCount?: boolean;
}

/**
 * 通用的多选组件
 * 支持搜索、自定义按钮样式、最大选择数量限制等功能
 */
export function MultiSelect<T = string>({
  id,
  options,
  value,
  onChange,
  placeholder,
  maxSelect = Infinity,
  searchable = true,
  disabled = false,
  className = "",
  buttonVariant = "outline",
  valueKey = "value",
  labelKey = "label",
  showSelectedCount = true,
}: MultiSelectProps<T>) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // 如果没有提供placeholder，使用默认的国际化文本
  const defaultPlaceholder = placeholder || t('multiSelect.placeholder');

  // 根据搜索条件过滤选项
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    
    return options.filter(option => 
      String(option[labelKey]).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, labelKey]);

  // 检查选项是否被选中
  const isSelected = (option: MultiSelectOption<T>): boolean => {
    return value.includes(option[valueKey] as unknown as T);
  };

  // 检查选项是否可选择
  const isOptionSelectable = (option: MultiSelectOption<T>): boolean => {
    if (disabled || option.disabled) return false;
    if (isSelected(option)) return true; // 已选中的选项始终可以取消选择
    return value.length < maxSelect;
  };

  // 切换选项的选中状态
  const toggleOption = (option: MultiSelectOption<T>) => {
    if (!isOptionSelectable(option)) return;
    
    const optionValue = option[valueKey] as unknown as T;
    const newSelected = isSelected(option)
      ? value.filter(val => val !== optionValue)
      : [...value, optionValue];
      
    onChange(newSelected);
  };

  // 移除不再使用的getButtonText函数

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={(state) => !disabled && setOpen(state)}>
        <PopoverTrigger asChild>
          <div 
            id={id}
            className={`flex justify-between items-center px-3 py-2 border rounded-md ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' : 'cursor-pointer transition-colors ' + (buttonVariant === 'outline' ? 'border-gray-300 hover:border-primary' : buttonVariant === 'default' ? 'bg-primary text-white hover:bg-primary/90' : buttonVariant === 'secondary' ? 'bg-gray-100 hover:bg-gray-200' : buttonVariant === 'ghost' ? 'hover:bg-gray-100' : '')}`}
          >
            <div className="flex flex-wrap gap-1 justify-start items-center">
              {value.length > 0 ? (
                value.map((val) => {
                  const option = options.find(opt => opt[valueKey] === val);
                  return (
                    <span 
                      key={String(val)}
                      className="inline-flex items-center px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      {option ? String(option[labelKey]) : String(val)}
                      {!disabled && (
                        <button
                          type="button"
                          className="ml-1 w-3 h-3 flex items-center justify-center rounded-full hover:bg-primary/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(value.filter(v => v !== val));
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </span>
                  );
                })
              ) : (
                <span className="text-gray-500 text-sm">{defaultPlaceholder}</span>
              )}
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 text-muted-foreground h-4 w-4 transition-transform duration-200">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            {searchable && (
              <CommandInput 
                placeholder={t('multiSelect.searchPlaceholder')} 
                value={searchQuery as string}
                onValueChange={setSearchQuery}
              />
            )}
            <CommandEmpty>
              {searchQuery ? t('multiSelect.noResults') : t('multiSelect.noOptions')}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isOptionDisabled = disabled || option.disabled || 
                  (!isSelected(option) && value.length >= maxSelect);
                  
                return (
                  <CommandItem
                    key={String(option[valueKey])}
                    onSelect={() => toggleOption(option)}
                    disabled={isOptionDisabled}
                    className={isOptionDisabled ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <div className={`border rounded w-4 h-4 flex items-center justify-center ${
                        isSelected(option) 
                          ? "bg-primary border-primary" 
                          : isOptionDisabled 
                            ? "border-gray-300" 
                            : ""
                      }`}>
                        {isSelected(option) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span>{String(option[labelKey])}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}