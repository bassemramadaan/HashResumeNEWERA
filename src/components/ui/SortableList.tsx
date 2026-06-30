import React, { createContext, useContext, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemContextType {
  attributes: Record<string, any>;
  listeners: Record<string, any>;
}

const SortableItemContext = createContext<SortableItemContextType>({
  attributes: {},
  listeners: {},
});

export function useSortableItemContext() {
  return useContext(SortableItemContext);
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  const contextValue = useMemo(() => ({ attributes, listeners }), [attributes, listeners]);

  return (
    <SortableItemContext.Provider value={contextValue}>
      <div ref={setNodeRef} style={style} className="relative">
        {children}
      </div>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners } = useSortableItemContext();
  return (
    <div
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg bg-slate-50 hover:bg-[#FF4D2D]/10 text-slate-500 hover:text-[#FF4D2D] hover:scale-105 active:scale-95 border border-slate-200/60 hover:border-[#FF4D2D]/15 transition-all shadow-3xs flex items-center justify-center shrink-0 mr-2 ml-2 touch-none"
      title="Drag to reorder"
    >
      <GripVertical size={16} style={{ strokeWidth: 2.2 }} />
    </div>
  );
}



interface SortableListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function SortableList<T>({ items, onReorder, renderItem, keyExtractor }: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => keyExtractor(item) === active.id);
      const newIndex = items.findIndex((item) => keyExtractor(item) === over.id);

      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  const itemIds = useMemo(() => items.map(keyExtractor), [items, keyExtractor]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {items.map((item) => (
            <SortableItem key={keyExtractor(item)} id={keyExtractor(item)}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
