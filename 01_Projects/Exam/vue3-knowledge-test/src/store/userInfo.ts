import { defineStore } from 'pinia'

export interface UserInfo {
    username: string
    password: string
}

export interface UserInfoState {
    userInfo: UserInfo | null
}

export const createEmptyUserInfo = (): UserInfo => ({
    username: '',
    password: ''
})

export const useUserInfoStore = defineStore('userInfo', {
    state: (): UserInfoState => ({
        userInfo: null
    }),
    getters: {
        isLoggedIn: (state) => state.userInfo !== null
    },
    actions: {
        setUserInfo(userInfo: UserInfo) {
            this.userInfo = userInfo
        },
        clearUserInfo() {
            this.userInfo = null
        }
    }
})
