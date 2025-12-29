import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { getExampleList, deleteExample } from "@/api/modules/example";
import type { ExampleItem, ExampleListParams } from "@/types/example";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/components/PageContainer";
import Paginator from "@/components/Paginator";
import TableBodySkeleton from "@/components/TableBodySkeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ExampleCreateDialog } from "./components/ExampleCreateDialog";

const ExampleListPage: React.FC = () => {
  const { t } = useTranslation();
  const [exampleList, setExampleList] = useState<ExampleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<ExampleListParams>({
    current: 1,
    pageSize: 10,
  });
  const [total, setTotal] = useState(0);
  const [itemToDelete, setItemToDelete] = useState<ExampleItem | null>(null);
  
  // 表单对话框状态
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [currentExampleId, setCurrentExampleId] = useState<string | undefined>(undefined);

  // 获取示例列表
  const fetchExampleList = async (params?: ExampleListParams) => {
    try {
      setLoading(true);
      const requestParams = params || searchParams;
      const response = await getExampleList(requestParams);
      if (response.code === 200) {
        setExampleList(response.data.records);
        setTotal(response.data.total);
      } else {
        toast.error(t(response.message || "examplePage.getListFailed"));
      }
    } catch (error: any) {
      console.error("获取示例列表失败:", error);
      toast.error(t(error.message) || t("examplePage.getListFailed"));
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      setSearchParams(prev => ({ ...prev, current: 1 }));
      await fetchExampleList({ ...searchParams, current: 1 });
    } finally {
      setSearchLoading(false);
    }
  };

  // 处理清空搜索条件
  const handleClearSearch = () => {
    const newParams: ExampleListParams = {
      current: 1,
      pageSize: searchParams.pageSize || 10,
      code: undefined,
      name: undefined,
      status: undefined,
    };
    setSearchParams(newParams);
    fetchExampleList(newParams);
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
    setCurrentExampleId(undefined);
    setFormDialogOpen(true);
  };

  // 处理编辑
  const handleEdit = (item: ExampleItem) => {
    if (item.id) {
      setCurrentExampleId(item.id);
      setFormDialogOpen(true);
    }
  };

  // 打开删除确认对话框
  const openDeleteConfirm = (item: ExampleItem) => {
    setItemToDelete(item);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;
    
    try {
      const response = await deleteExample(itemToDelete.id);
      if (response.code === 200) {
        toast.success(t("examplePage.deleteSuccess"));
        fetchExampleList();
      } else {
        toast.error(t(response.message || "examplePage.deleteFailed"));
      }
    } catch (error: any) {
      console.error("删除示例失败:", error);
      toast.error(t(error.message) || t("examplePage.deleteFailed"));
    } finally {
      setItemToDelete(null);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchExampleList();
  }, [searchParams.current, searchParams.pageSize]);

  return (
    <PageContainer 
      title={t("examplePage.title")}
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("examplePage.searchConditions")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
              <div>
                <Input
                  placeholder={t("examplePage.code")}
                  value={searchParams.code || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>
              <div>
                <Input
                  placeholder={t("examplePage.name")}
                  value={searchParams.name || ''}
                  onChange={(e) => setSearchParams(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} disabled={searchLoading}>
                  {searchLoading ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-1 h-4 w-4" />
                  )}
                  {t("examplePage.search")}
                </Button>
                <Button variant="outline" onClick={handleClearSearch} disabled={searchLoading}>
                  {t("examplePage.clear")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("examplePage.list")}</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="mr-1 h-4 w-4" />
              {t("examplePage.add")}
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("examplePage.code")}</TableHead>
                  <TableHead>{t("examplePage.name")}</TableHead>
                  <TableHead>{t("examplePage.description")}</TableHead>
                  <TableHead>{t("examplePage.status")}</TableHead>
                  <TableHead>{t("examplePage.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              {loading ? (
                <TableBodySkeleton 
                  rows={5} 
                  cols={5} 
                  colWidths={["w-24", "w-24", "w-36", "w-16", "w-28"]}
                />
              ) : (
                <TableBody>
                  {exampleList.length > 0 ? (
                    exampleList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.status === 1 ? t("examplePage.active") : t("examplePage.inactive")}</TableCell>
                        <TableCell className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <ConfirmDialog
                            title={t("examplePage.deleteConfirm")}
                            description={t("examplePage.deleteConfirmMessage", { name: item.name })}
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
                      <TableCell colSpan={5} className="text-center py-8">
                        {t("examplePage.noData")}
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
      <ExampleCreateDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={fetchExampleList}
        exampleId={currentExampleId}
      />
    </PageContainer>
  );
};

export default ExampleListPage;