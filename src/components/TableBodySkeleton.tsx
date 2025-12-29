import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow, TableBody } from "@/components/ui/table";

interface TableBodySkeletonProps {
  rows?: number;
  cols?: number;
  colWidths?: string[] | string;
  wrapInTableBody?: boolean; // 新增参数，控制是否包裹在TableBody中
}

const TableBodySkeleton: React.FC<TableBodySkeletonProps> = ({ 
  rows = 5, 
  cols = 7,
  colWidths = [],
  wrapInTableBody = true // 默认为true，保持向后兼容
}) => {
  // 处理colWidths参数，如果是字符串则转换为数组
  const widths = typeof colWidths === 'string' 
    ? Array(cols).fill(colWidths) 
    : colWidths;

  // 生成表格行内容
  const tableRows = (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton className={`h-4 ${widths[colIndex] || 'w-16'}`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  // 根据wrapInTableBody参数决定是否包裹在TableBody中
  return wrapInTableBody ? <TableBody>{tableRows}</TableBody> : tableRows;
};

export default TableBodySkeleton;