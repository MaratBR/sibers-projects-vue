import { useUserStore } from "@/state";
import Api from "./Api";

export * from "./Api";

const api = new Api({
  accessTokenGetter: () => {
    const { accessToken } = useUserStore();
    return accessToken;
  },
  baseUrl: "https://localhost:7212",
});

export default api;
