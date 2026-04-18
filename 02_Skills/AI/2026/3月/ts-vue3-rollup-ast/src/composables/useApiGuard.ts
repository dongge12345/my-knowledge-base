import { computed, ref } from "vue";

function isApiUser(x: unknown): x is { name: string; age: number } {
  if (!x || typeof x !== "object") return false;
  const value = x as { name?: unknown; age?: unknown };
  return typeof value.name === "string" && typeof value.age === "number";
}

// 组合式函数：把“接口数据校验 + 展示文案”封装成可复用模块。
export function useApiGuard() {
  const mockResponse = ref<unknown>({ name: "Tom", age: 20 });

  const apiMessage = computed(() => {
    if (!isApiUser(mockResponse.value)) return "接口数据结构不合法";
    return `接口校验通过：${mockResponse.value.name} / ${mockResponse.value.age} 岁`;
  });

  return { mockResponse, apiMessage };
}

