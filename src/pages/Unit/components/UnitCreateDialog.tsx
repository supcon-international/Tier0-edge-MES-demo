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
import { Save, Loader2 } from "lucide-react";
import { getUnitDetail, createUnit, updateUnit } from "@/api/modules/unit";
import type { UnitItem } from "@/types/unit";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface UnitCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    unitCode?: string;
}

export function UnitCreateDialog({
    open,
    onOpenChange,
    onSuccess,
    unitCode
}: UnitCreateDialogProps) {
    const { t } = useTranslation();
    const isEdit = !!unitCode;
    
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // 表单验证错误状态
    const [formErrors, setFormErrors] = useState<Record<string, string>>({
        unit_code: "",
        unit_name: "",
    });
    
    const [formData, setFormData] = useState<UnitItem>({
    });

    // 获取单位详情（编辑模式）
    const fetchUnitDetail = async () => {
        if (!unitCode) return;
        
        try {
            setLoading(true);
            const response = await getUnitDetail(unitCode);
            if (response.code === 200) {
                setFormData(response.data);
            } else {
                toast.error(t(response.message || "unitPage.getDetailFailed"));
                onOpenChange(false);
            }
        } catch (error: any) {
            console.error("获取单位详情失败:", error);
            toast.error(t(error.message) || t("unitPage.getDetailFailed"));
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    };

    // 表单验证
    const validateForm = () => {
        let isValid = true;
        const errors: Record<string, string> = {
            unit_code: "",
            unit_name: "",
        };

        if (!formData.unit_code?.trim()) {
            errors.unit_code = t("unitPage.unitCodeRequired") || "";
            isValid = false;
        }

        if (!formData.unit_name?.trim()) {
            errors.unit_name = t("unitPage.unitNameRequired") || "";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // 处理表单字段变化
    const handleInputChange = (field: keyof UnitItem, value?: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // 清除该字段的错误信息
        if (formErrors[field as string]) {
            setFormErrors(prev => ({ ...prev, [field as string]: "" }));
        }
    };

    // 保存单位数据
    const handleSave = async () => {
        // 表单验证
        if (!validateForm()) {
            toast.error(t("unitPage.formValidationFailed"));
            return;
        }

        try {
            setSaving(true);
            let response;

            if (isEdit) {
                // 更新操作
                if (!unitCode) return;
                response = await updateUnit(formData);
            } else {
                // 创建操作
                response = await createUnit(formData);
            }

            if (response.code === 200) {
                toast.success(t(isEdit ? "unitPage.updateSuccess" : "unitPage.createSuccess"));
                onSuccess?.();
                onOpenChange(false);
            } else {
                toast.error(t(response.message || (isEdit ? "unitPage.updateFailed" : "unitPage.createFailed")));
            }
        } catch (error: any) {
            console.error(isEdit ? "更新单位失败:" : "创建单位失败:", error);
            toast.error(t(error.message) || t(isEdit ? "unitPage.updateFailed" : "unitPage.createFailed"));
        } finally {
            setSaving(false);
        }
    };

    // 重置表单
    const resetForm = () => {
        setFormData({
        });
        setFormErrors({
            unit_code: "",
            unit_name: "",
        });
    };

    // 编辑模式下获取详情
    useEffect(() => {
        if (open) {
            if (isEdit) {
                fetchUnitDetail();
            } else {
                resetForm();
            }
        }
    }, [open, isEdit]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t(isEdit ? "unitPage.editTitle" : "unitPage.addTitle")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 单位编码 */}
                        <div className="space-y-2">
                            <Label htmlFor="unit_code">{t("unitPage.unitCode")}</Label>
                            <Input
                                id="unit_code"
                                value={formData.unit_code || ''}
                                onChange={(e) => handleInputChange('unit_code', e.target.value)}
                                disabled={loading || saving || isEdit}
                                placeholder={t("unitPage.pleaseEnter")}
                            />
                            {formErrors.unit_code && (
                                <p className="text-sm text-red-500 mt-1">{formErrors.unit_code}</p>
                            )}
                        </div>

                        {/* 单位名称 */}
                        <div className="space-y-2">
                            <Label htmlFor="unit_name">{t("unitPage.unitName")}</Label>
                            <Input
                                id="unit_name"
                                value={formData.unit_name || ''}
                                onChange={(e) => handleInputChange('unit_name', e.target.value)}
                                disabled={loading || saving}
                                placeholder={t("unitPage.pleaseEnter")}
                            />
                            {formErrors.unit_name && (
                                <p className="text-sm text-red-500 mt-1">{formErrors.unit_name}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading || saving}>
                            {t("common.cancel")}
                        </Button>
                        <Button onClick={handleSave} disabled={loading || saving}>
                            {saving ? (
                                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-1 h-4 w-4" />
                            )}
                            {t("common.save")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}