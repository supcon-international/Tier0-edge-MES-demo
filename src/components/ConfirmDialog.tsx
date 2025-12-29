import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

/** 通用确认弹框 Props */
interface ConfirmDialogProps {
  /** 弹框标题 */
  title: string;
  /** 描述文字，可选 */
  description?: string;
  /** 确认回调函数 */
  onConfirm: () => void;
  /** 确认按钮文字，默认值："确认" */
  confirmText?: string;
  /** 取消按钮文字，默认值："取消" */
  cancelText?: string;
  /** 触发按钮（或任意触发元素） */
  children: React.ReactNode;
}

/**
 * ✅ 通用确认弹框组件（修复无描述时的警告）
 * 使用 Shadcn/UI 的 AlertDialog 封装
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  onConfirm,
  confirmText,
  cancelText,
  children,
}) => {
  const { t } = useTranslation();
  
  // Use provided text or fall back to translations
  const finalConfirmText = confirmText || t("confirmDialog.confirm");
  const finalCancelText = cancelText || t("confirmDialog.cancel");
  return (
    <AlertDialog>
      {/* 触发按钮 */}
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      {/* 弹窗内容 */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          {/* ✅ 无论是否有 description 都渲染，避免警告 */}
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : (
            <AlertDialogDescription className="sr-only">
              Confirmation dialog
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{finalCancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {finalConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
