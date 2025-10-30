'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
    Download,
    GripVertical,
    Plus,
    RotateCcw,
    Save,
    Settings,
    X
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

export interface GridItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  title?: string;
  isResizable?: boolean;
  isDraggable?: boolean;
  isVisible?: boolean;
}

export interface DashboardGridProps {
  items: GridItem[];
  columns?: number;
  rowHeight?: number;
  margin?: [number, number];
  containerPadding?: [number, number];
  isEditable?: boolean;
  showGridLines?: boolean;
  onItemChange?: (items: GridItem[]) => void;
  onItemAdd?: () => void;
  onItemRemove?: (id: string) => void;
  onItemResize?: (id: string, width: number, height: number) => void;
  onItemMove?: (id: string, x: number, y: number) => void;
  onLayoutSave?: (layout: GridItem[]) => void;
  onLayoutReset?: () => void;
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  items,
  columns = 12,
  rowHeight = 80,
  margin = [10, 10],
  containerPadding = [20, 20],
  isEditable = false,
  showGridLines = false,
  onItemChange,
  onItemAdd,
  onItemRemove,
  onItemResize,
  onItemMove,
  onLayoutSave,
  onLayoutReset,
  className,
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [resizedItem, setResizedItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const visibleItems = useMemo(() =>
    items.filter(item => item.isVisible !== false),
    [items]
  );

  const gridStyle = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${margin[1]}px ${margin[0]}px`,
    padding: `${containerPadding[1]}px ${containerPadding[0]}px`,
  }), [columns, margin, containerPadding]);

  const getItemStyle = useCallback((item: GridItem) => ({
    gridColumn: `${item.x + 1} / span ${item.width}`,
    gridRow: `${item.y + 1} / span ${item.height}`,
    minHeight: item.minHeight ? `${item.minHeight * rowHeight}px` : 'auto',
    maxHeight: item.maxHeight ? `${item.maxHeight * rowHeight}px` : 'auto',
  }), [rowHeight]);

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    if (!isEditable) return;

    const item = items.find(i => i.id === itemId);
    if (!item?.isDraggable) return;

    setDraggedItem(itemId);
    setIsDragging(true);

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    e.dataTransfer.effectAllowed = 'move';
  }, [isEditable, items]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!isEditable || !draggedItem) return;

    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, [isEditable, draggedItem]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (!isEditable || !draggedItem) return;

    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const gridRect = e.currentTarget.parentElement?.getBoundingClientRect();

    if (!gridRect) return;

    const cellWidth = (gridRect.width - containerPadding[0] * 2 - margin[0] * (columns - 1)) / columns;
    const cellHeight = rowHeight + margin[1];

    const x = Math.floor((e.clientX - gridRect.left - containerPadding[0]) / (cellWidth + margin[0]));
    const y = Math.floor((e.clientY - gridRect.top - containerPadding[1]) / (cellHeight + margin[1]));

    const clampedX = Math.max(0, Math.min(x, columns - 1));
    const clampedY = Math.max(0, y);

    if (onItemMove) {
      onItemMove(draggedItem, clampedX, clampedY);
    }

    handleDragEnd();
  }, [isEditable, draggedItem, columns, rowHeight, margin, containerPadding, onItemMove, handleDragEnd]);

  const handleResizeStart = useCallback((e: React.MouseEvent, itemId: string) => {
    if (!isEditable) return;

    e.preventDefault();
    e.stopPropagation();

    setResizedItem(itemId);
    setIsResizing(true);
  }, [isEditable]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizedItem) return;

    const item = items.find(i => i.id === resizedItem);
    if (!item) return;

    // Calculate new dimensions based on mouse position
    // This is a simplified implementation
    const newWidth = Math.max(item.minWidth || 1, item.width + Math.floor(e.movementX / 100));
    const newHeight = Math.max(item.minHeight || 1, item.height + Math.floor(e.movementY / 100));

    if (onItemResize) {
      onItemResize(resizedItem, Math.min(newWidth, item.maxWidth || columns), Math.min(newHeight, item.maxHeight || 20));
    }
  }, [isResizing, resizedItem, items, columns, onItemResize]);

  const handleResizeEnd = useCallback(() => {
    setResizedItem(null);
    setIsResizing(false);
  }, []);

  // Add global mouse event listeners for resizing
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);

      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const renderGridBackground = () => {
    if (!showGridLines) return null;

    const gridCells = [];
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < columns; x++) {
        gridCells.push(
          <div
            key={`grid-${x}-${y}`}
            className="absolute border border-neutral-200 dark:border-neutral-700 opacity-30 pointer-events-none"
            style={{
              left: `${x * (100 / columns)}%`,
              top: `${y * rowHeight}px`,
              width: `${100 / columns}%`,
              height: `${rowHeight}px`,
            }}
          />
        );
      }
    }

    return (
      <div className="absolute inset-0 overflow-hidden">
        {gridCells}
      </div>
    );
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* Grid Controls */}
      {isEditable && (
        <div className="flex items-center justify-between mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
              تخصيص الداشبورد
            </h3>
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              اسحب وأعد تحجيم المكونات
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onItemAdd && (
              <Button
                variant="outline"
                size="sm"
                onClick={onItemAdd}
                icon={Plus}
              >
                إضافة مكون
              </Button>
            )}

            {onLayoutReset && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLayoutReset}
                icon={RotateCcw}
              >
                إعادة تعيين
              </Button>
            )}

            {onLayoutSave && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onLayoutSave(items)}
                icon={Save}
              >
                حفظ
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div
        className={cn(
          'relative min-h-[400px] bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700',
          isEditable && 'bg-neutral-50 dark:bg-neutral-800'
        )}
        style={gridStyle}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {renderGridBackground()}

        {visibleItems.map((item) => {
          const Component = item.component;
          const isBeingDragged = draggedItem === item.id;
          const isBeingResized = resizedItem === item.id;

          return (
            <div
              key={item.id}
              className={cn(
                'relative group transition-all duration-200',
                isEditable && item.isDraggable && 'cursor-move',
                isBeingDragged && 'z-50 opacity-50 scale-105',
                isBeingResized && 'ring-2 ring-primary-500 ring-offset-2'
              )}
              style={getItemStyle(item)}
              draggable={isEditable && item.isDraggable}
              onDragStart={(e) => handleDragStart(e, item.id)}
              onDragEnd={handleDragEnd}
            >
              {/* Widget Header */}
              {isEditable && (
                <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onItemRemove?.(item.id)}
                    icon={X}
                    className="w-6 h-6 p-0 bg-error-500 hover:bg-error-600 text-white"
                    title="حذف المكون"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Settings}
                    className="w-6 h-6 p-0"
                    title="إعدادات المكون"
                  />
                  <div
                    className="w-6 h-6 bg-neutral-200 dark:bg-neutral-600 rounded cursor-move flex items-center justify-center"
                    title="سحب المكون"
                  >
                    <GripVertical className="w-3 h-3 text-neutral-600 dark:text-neutral-300" />
                  </div>
                </div>
              )}

              {/* Resize Handle */}
              {isEditable && item.isResizable && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity"
                  onMouseDown={(e) => handleResizeStart(e, item.id)}
                  title="تغيير الحجم"
                >
                  <div className="absolute bottom-0 right-0 w-0 h-0 border-l-4 border-l-transparent border-b-4 border-b-primary-500 border-r-4 border-r-transparent transform rotate-45" />
                </div>
              )}

              {/* Widget Content */}
              <Card variant="elevated" className="h-full overflow-hidden">
                {item.title && (
                  <div className="flex items-center justify-between p-4 pb-0">
                    <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                      {item.title}
                    </h4>
                  </div>
                )}
                <div className="flex-1 p-4">
                  <Component {...(item.props || {})} />
                </div>
              </Card>
            </div>
          );
        })}

        {/* Empty State */}
        {visibleItems.length === 0 && (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-neutral-400" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                لا توجد مكونات
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                ابدأ بإضافة مكونات إلى داشبوردك
              </p>
              {onItemAdd && (
                <Button onClick={onItemAdd} icon={Plus}>
                  إضافة مكون أول
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Export Options */}
      <div className="flex items-center justify-end mt-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={() => {
            // Export layout as JSON
            const dataStr = JSON.stringify(items, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = 'dashboard-layout.json';

            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
          }}
        >
          تصدير التخطيط
        </Button>
      </div>
    </div>
  );
};

export default DashboardGrid;
