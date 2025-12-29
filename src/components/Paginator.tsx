import React from "react";
import { useTranslation } from "react-i18next";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginatorProps {
  pageNum: number; // 当前页码（从0开始）
  pageSize: number; // 每页条数
  totalCount: number; // 数据总条数
  onPageChange: (pageNum: number) => void; // 页码变化回调
  onPageSizeChange?: (size: number) => void; // 页大小变化回调
}

const Paginator: React.FC<PaginatorProps> = ({
  pageNum,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation();
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const isLastPage = pageNum >= totalPages - 1;
  const isFirstPage = pageNum === 0;
  const startIndex = totalCount === 0 ? 0 : pageNum * pageSize + 1;
  const endIndex = totalCount === 0 ? 0 : Math.min((pageNum + 1) * pageSize, totalCount);

  return (
    <div className="flex justify-end w-full bg-white px-4 py-2">
      <div className="flex items-center gap-8">
        {/* ✅ 左：数据统计 */}
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {t('paginator.itemsCount', { start: startIndex, end: endIndex, total: totalCount })}
        </div>

        {/* ✅ 中：页码控制 */}
        <Pagination>
          <PaginationContent className="flex items-center gap-3">
            <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isFirstPage) onPageChange(pageNum - 1);
                  }}
                  className={`transition ${
                    isFirstPage ? "pointer-events-none opacity-40" : ""
                  }`}
                />
              </PaginationItem>

            <span className="text-sm text-gray-700 font-medium">
              {t('paginator.currentPage', { current: pageNum + 1, total: totalPages })}
            </span>

            <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isLastPage) onPageChange(pageNum + 1);
                  }}
                  className={`transition ${
                    isLastPage
                      ? "pointer-events-none opacity-40"
                      : ""
                  }`}
                />
              </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* ✅ 右：每页条数选择（仅10/20/30） */}
        {onPageSizeChange && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Select
              value={String(pageSize ?? 10)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="w-[110px] h-8">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {t('paginator.perPage', { size })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default Paginator;
