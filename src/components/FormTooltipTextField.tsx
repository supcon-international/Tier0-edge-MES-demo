import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { cn } from "@/common/utils.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormTooltipTextFieldProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  tooltipText?: string;
  showError?: boolean;
  disabled?: boolean; // 新增
}

export const FormTooltipTextField: React.FC<FormTooltipTextFieldProps> = ({
  label,
  placeholder = "",
  required = false,
  value,
  onChange,
  tooltipText = "",
  showError = false,
  disabled = false, // 新增
}) => {
  const [touched, setTouched] = useState(false);
  const isError = required && (touched || showError) && value.trim() === "";

  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
        {tooltipText && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
              </TooltipTrigger>
              <TooltipContent side="top" className="text-sm max-w-xs">
                {tooltipText}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <Input
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        disabled={disabled} // ✅ 支持禁用
        className={cn(
          "w-full rounded-md border px-3 py-2 transition-colors",
          isError
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-gray-300 focus-visible:ring-ring/50",
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        )}
      />

      {isError && (
        <span className="text-xs text-red-500 text-left">此字段不能为空</span>
      )}
    </div>
  );
};
