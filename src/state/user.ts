import api from "@/api";
import type { LoginData } from "@/api/Api";
import { defineStore } from "pinia";

interface UserStore {
  isInitialized: boolean;
  accessToken: string | null;
  isInitializing: boolean;
  isLoggedIn: boolean;
}

const useUserStore = defineStore("user", {
  state() {
    return {
      isInitialized: false,
      isInitializing: false,
      accessToken: null,
      isLoggedIn: false,
    } as UserStore;
  },
  actions: {
    async login(loginData: LoginData) {
      const response = await api.login(loginData);
      this.accessToken = response.token;
      this.isLoggedIn = true;
    },

    async init() {
      if (this.isInitialized || this.isInitializing) {
        return;
      }
      this.isInitializing = true;

      if (this.accessToken) {
        try {
          await api.whoami();
          this.isLoggedIn = true;
        } catch {
          this.isLoggedIn = false;
        }
      }
      this.isInitialized = true;
    },
  },
  persist: {
    paths: ["accessToken", "isLoggedIn"],
  },
});

export default useUserStore;
