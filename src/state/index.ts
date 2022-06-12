import { createPinia } from "pinia";
import useUserStore from "./user";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

export { useUserStore, pinia };
