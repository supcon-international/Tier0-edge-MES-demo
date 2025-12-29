import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { getUnitList, deleteUnit } from "@/api/modules/unit";
import type { UnitItem, UnitListParams } from "@/types/unit";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/PageContainer";
import Paginator from "@/components/Paginator";
import TableBodySkeleton from "@/components/TableBodySkeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { UnitCreateDialog } from "./components/UnitCreateDialog";

const UnitListPage: React.FC = () => {
  const { t } = useTranslation();
  const [unitList, setUnitList] = useState<UnitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<UnitListParams>({
    current: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [itemToDelete, setItemToDelete] = useState<UnitItem | null>(null);
  
  // 表单对话框状态
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [currentUnitCode, setCurrentUnitCode] = useState<string | undefined>(undefined);

  // 获取单位列表
  const fetchUnitList = async (params?: UnitListParams) => {
    try {
      setLoading(true);
      const requestParams = params || searchParams;
      const response = await getUnitList(requestParams);
      if (response.code === 200) {
        setUnitList(response.data.records);
        setTotal(response.data.total);
      } else {
        toast.error(t(response.message || "unitPage.getListFailed"));
      }
    } catch (error: any) {
      console.error("获取单位列表失败:", error);
      toast.error(t(error.message) || t("unitPage.getListFailed"));
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      setSearchParams(prev => ({ ...prev, current: 1 }));
      await fetchUnitList({ ...searchParams, current: 1 });
    } finally {
      setSearchLoading(false);
    }
  };

  // 处理清空搜索条件
  const handleClearSearch = () => {
    const newParams: UnitListParams = {
      current: 1,
      pageSize: searchParams.pageSize || 10,
      unit_code: undefined,
      unit_name: undefined,
    };
    setSearchParams(newParams);
    fetchUnitList(newParams);
  };

  // 处理页码变化
  const handlePageChange = (pageNum: number) => {
    setSearchParams(prev => ({ ...prev, current: pageNum + 1 })); // +1 因为Paginator的pageNum从0开始
  };

  // 处理每页条数变化
  const handlePageSizeChange = (pageSize: number) => {
    setSearchParams(prev => ({ ...prev, pageSize, current: 1 }));
  };

  // 处理新增
  const handleAdd = () => {
    setCurrentUnitCode(undefined);
    setFormDialogOpen(true);
  };

  // 处理编辑
  const handleEdit = (item: UnitItem) => {
    if (item.unit_code) {
      setCurrentUnitCode(item.unit_code);
      setFormDialogOpen(true);
    }
  };

  // 打开删除确认对话框
  const openDeleteConfirm = (item: UnitItem) => {
    setItemToDelete(item);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!itemToDelete?.unit_code) return;
    
    try {
      const response = await deleteUnit(itemToDelete.unit_code);
      if (response.code === 200) {
        toast.success(t("unitPage.deleteSuccess"));
        fetchUnitList();
      } else {
        toast.error(t(response.message || "unitPage.deleteFailed"));
      }
    } catch (error: any) {
      console.error("删除单位失败:", error);
      toast.error(t(error.message) || t("unitPage.deleteFailed"));
    } finally {
      setItemToDelete(null);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchUnitList();
  }, [searchParams.current, searchParams.pageSize]);

  return (
    <PageContainer 
      title={t("unitPage.title")}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("unitPage.searchConditions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
              <div>
                <Input
                  placeholder={t("unitPage.unitCode")}
                  value={searchParams.unit_code || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, unit_code: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  placeholder={t("unitPage.unitName")}
                  value={searchParams.unit_name || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, unit_name: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} disabled={searchLoading}>
                  {searchLoading ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-1 h-4 w-4" />
                  )}
                  {t("unitPage.search")}
                </Button>
                <Button variant="outline" onClick={handleClearSearch} disabled={searchLoading}>
                  {t("unitPage.clear")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("unitPage.list")}</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="mr-1 h-4 w-4" />
              {t("unitPage.add")}
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("unitPage.unitCode")}</TableHead>
                  <TableHead>{t("unitPage.unitName")}</TableHead>
                  <TableHead>{t("unitPage.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              {loading ? (
                <TableBodySkeleton 
                  rows={5} 
                  cols={3} 
                  colWidths={["w-24", "w-24", "w-28"]}
                />
              ) : (
                <TableBody>
                  {unitList.length > 0 ? (
                    unitList.map((item) => (
                      <TableRow key={item.unit_code}>
                        <TableCell>{item.unit_code}</TableCell>
                        <TableCell>{item.unit_name}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <ConfirmDialog
                            title={t("unitPage.deleteConfirm")}
                            description={t("unitPage.deleteConfirmMessage", { name: item.unit_name })}
                            onConfirm={confirmDelete}
                          >
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => openDeleteConfirm(item)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </ConfirmDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        {t("unitPage.noData")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
                
            {/* 分页组件 */}
            <Paginator
              totalCount={total}
              pageNum={searchParams.current ? searchParams.current - 1 : 0}
              pageSize={searchParams.pageSize || 10}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* 表单对话框 */}
      <UnitCreateDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={fetchUnitList}
        unitCode={currentUnitCode}
      />
    </PageContainer>
  );
};

export default UnitListPage;