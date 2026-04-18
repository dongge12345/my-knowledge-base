/**
 * TS 练习题：任务分配核心模块（纯 TS）
 *
 * 题目要求（你可以先自己实现，再对照下方参考答案）：
 * 1) 定义 Role / TaskStatus / Member / Task
 * 2) 定义 NewTaskInput / TaskPatch（必须用 Omit、Partial、Pick）
 * 3) 实现 createTask / addTask / updateTask / removeTask
 * 4) 实现 getTaskStats（一次遍历统计）
 * 5) 实现 buildRoleLabelMap（必须用 Record）
 * 6) 实现 isTaskArray（unknown + 类型守卫）
 * 7) 实现 parseApiTasks（合法返回，非法抛错）
 */

// =========================
// 一、题目数据模型
// =========================

export type Role = "dev" | "qa" | "pm";
export type TaskStatus = "todo" | "doing" | "done";

export interface Member {
  id: number;
  name: string;
  role: Role;
}

export interface Task {
  id: number;
  title: string;
  points: number;
  assigneeId: number;
  status: TaskStatus;
}

// Omit：创建任务时不允许外部传 id（id 由系统生成）
export type NewTaskInput = Omit<Task, "id">;
// Partial + Pick：更新任务时只允许改 title/points/status，且都可选
export type TaskPatch = Partial<Pick<Task, "title" | "points" | "status">>;

// =========================
// 二、示例种子数据
// =========================

export const seedMembers: Member[] = [
  { id: 1, name: "Alice", role: "dev" },
  { id: 2, name: "Bob", role: "qa" },
  { id: 3, name: "Cindy", role: "pm" }
];

export const seedTasks: Task[] = [
  { id: 1, title: "搭建 Vite 项目", points: 3, assigneeId: 1, status: "done" },
  { id: 2, title: "编写测试用例", points: 5, assigneeId: 2, status: "doing" },
  { id: 3, title: "整理需求文档", points: 2, assigneeId: 3, status: "todo" }
];

// =========================
// 三、参考答案（已注释）
// =========================

export function createTask(input: NewTaskInput, list: Task[]): Task {
  // 从现有列表里找最大 id，空数组时默认从 0 开始
  const maxId = list.reduce((max, item) => Math.max(max, item.id), 0);

  // 返回新对象，不修改 input，也不修改 list
  return {
    ...input,
    id: maxId + 1
  };
}

export function addTask(input: NewTaskInput, list: Task[]): Task[] {
  // 不可变更新：返回新数组，原数组不变
  return [...list, createTask(input, list)];
}

export function updateTask(id: number, patch: TaskPatch, list: Task[]): Task[] {
  // 不可变更新：map 生成新数组，仅替换匹配 id 的项
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function removeTask(id: number, list: Task[]): Task[] {
  // 不可变删除：filter 返回不含目标 id 的新数组
  return list.filter((item) => item.id !== id);
}

export function getTaskStats(list: Task[]): {
  total: number;
  todo: number;
  doing: number;
  done: number;
  totalPoints: number;
} {
  // 统计结构：pre[cur.status] 依赖 TaskStatus 联合类型
  const stats = { total: 0, todo: 0, doing: 0, done: 0, totalPoints: 0 };

  // 一次 reduce 完成全部统计
  return list.reduce((pre, cur) => {
    pre.total += 1;
    pre.totalPoints += cur.points;
    pre[cur.status] += 1;
    return pre;
  }, stats);
}

export function buildRoleLabelMap(): Record<Role, string> {
  // Record<Role, string> 会强制你把 dev/qa/pm 都写全
  return {
    dev: "开发",
    qa: "测试",
    pm: "产品"
  };
}

export function isTaskArray(x: unknown): x is Task[] {
  // 先判断是否数组
  if (!Array.isArray(x)) return false;

  // 逐项校验结构和字段类型
  return x.every((item) => {
    if (!item || typeof item !== "object") return false;
    const obj = item as Record<string, unknown>;

    const validStatus =
      obj.status === "todo" || obj.status === "doing" || obj.status === "done";

    return (
      typeof obj.id === "number" &&
      Number.isFinite(obj.id) &&
      typeof obj.title === "string" &&
      obj.title.trim().length > 0 &&
      typeof obj.points === "number" &&
      Number.isFinite(obj.points) &&
      typeof obj.assigneeId === "number" &&
      Number.isFinite(obj.assigneeId) &&
      validStatus
    );
  });
}

export function parseApiTasks(payload: unknown): Task[] {
  // 先走类型守卫，合法则返回原值
  if (isTaskArray(payload)) return payload;

  // 非法时抛错，交给上层处理
  throw new Error("Invalid task payload");
}

