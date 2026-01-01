/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableRouteItem from "./SortableRouteItem";

export default function SelectedRouteList({
  order,
  items,
  onReorder,
  onRemove,
}: {
  order: TrackType;
  items: Letter[];
  onReorder: (next: Letter[]) => void;
  onRemove: (id: string) => void;
}) {
  const ids = useMemo(() => items.map((x) => x.id), [items]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((x) => x.id === active.id);
    const newIndex = items.findIndex((x) => x.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-text">선택된 경로</div>

      {items.length === 0 ? (
        <div className="text-sm text-text-4 border border-outline rounded-xl p-4">
          아직 추가된 경로가 없어요. <br />
          위에서 공개 편지를 선택해 추가해보세요.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {items.map((item, index) => (
                <SortableRouteItem
                  key={item.id}
                  item={item}
                  index={index}
                  showIndex={order === "SEQUENTIAL"}
                  onRemove={() => onRemove(item.id)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
