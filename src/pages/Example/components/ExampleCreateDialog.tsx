import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Loader2 } from "lucide-react";
import { getExampleDetail, createExample, updateExample } from "@/api/modules/example";
import type { ExampleItem } from "@/types/example";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface ExampleCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    exampleId?: string;
}

export function ExampleCreateDialog({
    open,
    onOpenChange,
    onSuccess,
    exampleId
}: ExampleCreateDialogProps) {
    const { t } = useTranslation();
    const isEdit = !!exampleId;
    
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // 表单验证错误状态
    const [formErrors, setFormErrors] = useState<Record<string, string>>({
        code: "",
        name: "",
    });
    
    const [formData, setFormData] = useState<ExampleItem>({
        status: 1,
    });

    // 获取示例详情（编辑模式）
    const fetchExampleDetail = async () => {
        if (!exampleId) return;
        
        try {
            setLoading(true);
            const response = await getExampleDetail(exampleId);
            if (response.success) {
                setFormData(response.data);
            } else {
                toast.error(t(response.message || "examplePage.getDetailFailed"));
                onOpenChange(false);
            }
        } catch (error: any) {
            console.error("获取示例详情失败:", error);
            toast.error(t(error.message) || t("examplePage.getDetailFailed"));
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    // 表单验证
    const validateForm = () => {
        let isValid = true;
        const errors: Record<string, string> = {
            code: "",
            name: "",
        };

        if (!formData.code?.trim()) {
            errors.code = t("examplePage.codeRequired") || "";
            isValid = false;
        }

        if (!formData.name?.trim()) {
            errors.name = t("examplePage.nameRequired") || "";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // 处理表单字段变化
    const handleInputChange = (field: keyof ExampleItem, value?: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // 清除该字段的错误信息
        if (formErrors[field as string]) {
            setFormErrors(prev => ({ ...prev, [field as string]: "" }));
        }
    };

    // 保存示例数据
    const handleSave = async () => {
        // 表单验证
        if (!validateForm()) {
            toast.error(t("examplePage.formValidationFailed"));
            return;
        }

        try {
            setSaving(true);
            let response;

            if (isEdit) {
                // 更新操作
                if (!exampleId) return;
                response = await updateExample({
                    ...formData,
                    id: exampleId,
                });
            } else {
                // 创建操作
                response = await createExample(formData);
            }

            if (response.success) {
                toast.success(t(isEdit ? "examplePage.updateSuccess" : "examplePage.createSuccess"));
                onSuccess?.();
                onOpenChange(false);
            } else {
                toast.error(t(response.message || (isEdit ? "examplePage.updateFailed" : "examplePage.createFailed")));
            }
        } catch (error: any) {
            console.error(isEdit ? "更新示例失败:" : "创建示例失败:", error);
            toast.error(t(error.message) || t(isEdit ? "examplePage.updateFailed" : "examplePage.createFailed"));
        } finally {
            setSaving(false);
        }
    };

    // 重置表单
    const resetForm = () => {
        setFormData({
            status: 1,
        });
        setFormErrors({
            code: "",
            name: "",
        });
    };

    // 编辑模式下获取详情
    useEffect(() => {
        if (open) {
            if (isEdit) {
                fetchExampleDetail();
            } else {
                resetForm();
            }
        }
    }, [open, isEdit]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t(isEdit ? "examplePage.editTitle" : "examplePage.addTitle")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 代码 */}
                        <div className="space-y-2">
                            <Label htmlFor="code">{t("examplePage.code")}</Label>
                            <Input
                                id="code"
                                value={formData.code || ''}
                                onChange={(e) => handleInputChange('code', e.target.value)}
                                disabled={loading || saving}
                                placeholder={t("examplePage.pleaseEnter")}
                            />
                            {formErrors.code && (
                                <p className="text-sm text-red-500 mt-1">{formErrors.code}</p>
                            )}
                        </div>

                        {/* 名称 */}
                        <div className="space-y-2">
                            <Label htmlFor="name">{t("examplePage.name")}</Label>
                            <Input
                                id="name"
                                value={formData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                disabled={loading || saving}
                                placeholder={t("examplePage.pleaseEnter")}
                            />
                            {formErrors.name && (
                                <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                            )}
                        </div>

                        {/* 状态 */}
                        <div className="space-y-2">
                            <Label htmlFor="status">{t("examplePage.status")}</Label>
                            <Select
                                value={formData.status?.toString() || "1"}
                                onValueChange={(value) => handleInputChange('status', parseInt(value))}
                                disabled={loading || saving}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder={t("examplePage.status")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">{t("examplePage.active")}</SelectItem>
                                    <SelectItem value="0">{t("examplePage.inactive")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* 描述 */}
                    <div className="space-y-2">
                        <Label htmlFor="description">{t("examplePage.description")}</Label>
                        <Textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            disabled={loading || saving}
                            rows={4}
                            placeholder={t("examplePage.pleaseEnter")}
                        />
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex gap-4 justify-end">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                            {t("examplePage.cancel")}
                        </Button>
                        <Button onClick={handleSave} disabled={loading || saving}>
                            {saving ? (
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-1 h-4 w-4" />
                            )}
                            {t("examplePage.save")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}