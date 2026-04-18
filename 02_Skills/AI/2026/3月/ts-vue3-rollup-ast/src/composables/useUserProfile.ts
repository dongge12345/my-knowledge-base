import { computed, ref } from "vue";

export type Role = "user" | "admin";

export interface UserProfile {
  id: number;
  name: string;
  age: number;
  role: Role;
}

export type UserDraft = Partial<Pick<UserProfile, "name" | "age" | "role">>;

// 组合式函数：把“用户资料编辑”相关状态和方法聚合在一起。
export function useUserProfile() {
  const user = ref<UserProfile>({
    id: 1,
    name: "PaiPai",
    age: 18,
    role: "user"
  });

  const draftName = ref(user.value.name);
  const draftAge = ref(user.value.age);
  const draftRole = ref<Role>(user.value.role);

  function applyDraft() {
    const patch: UserDraft = {
      name: draftName.value || user.value.name,
      age: Math.max(1, draftAge.value || user.value.age),
      role: draftRole.value
    };
    user.value = { ...user.value, ...patch };
  }

  const userLabel = computed(() => {
    const { name, age, role } = user.value;
    return `${name} / ${age} 岁 / ${role}`;
  });

  const roleDesc: Record<Role, string> = {
    user: "普通用户：基础权限",
    admin: "管理员：高级权限"
  };

  return {
    user,
    draftName,
    draftAge,
    draftRole,
    applyDraft,
    userLabel,
    roleDesc
  };
}

