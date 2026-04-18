import { ref } from "vue";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

function withId(value: Omit<Todo, "id">, list: Todo[]): Todo {
  return { ...value, id: list.length + 1 };
}

// 组合式函数：把 Todo 相关逻辑收敛，避免分散在 data/methods/computed 多区块。
export function useTodoList() {
  const todos = ref<Todo[]>([
    { id: 1, text: "学习 Composition API 与 TS", done: false }
  ]);
  const todoText = ref("");

  function addTodo() {
    if (!todoText.value) return;
    const item = withId({ text: todoText.value, done: false }, todos.value);
    todos.value = [...todos.value, item];
    todoText.value = "";
  }

  function toggleTodo(id: number) {
    todos.value = todos.value.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
  }

  return { todos, todoText, addTodo, toggleTodo };
}

