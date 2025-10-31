import { create } from 'zustand';

interface ComponentItem {
  id: string;
  name: string;
  type: string;
}

interface EditorState {
  components: ComponentItem[];
  selectedId: string | null;
  addComponent: (component: ComponentItem) => void;
  removeComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  reorderComponents: (startIndex: number, endIndex: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  components: [
    { id: '1', name: 'Component A', type: 'card' },
    { id: '2', name: 'Component B', type: 'button' },
    { id: '3', name: 'Component C', type: 'input' },
  ],
  selectedId: null,
  addComponent: (component) =>
    set((state) => ({
      components: [...state.components, component],
    })),
  removeComponent: (id) =>
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    })),
  selectComponent: (id) =>
    set(() => ({
      selectedId: id,
    })),
  reorderComponents: (startIndex, endIndex) =>
    set((state) => {
      const newComponents = Array.from(state.components);
      const [removed] = newComponents.splice(startIndex, 1);
      if (removed) {
        newComponents.splice(endIndex, 0, removed);
      }
      return { components: newComponents };
    }),
}));

