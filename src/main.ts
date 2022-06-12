import { createApp } from "vue";
import VCalendar from "v-calendar";
import "v-calendar/dist/style.css";

import App from "./App.vue";
import router from "./router";

import "vfonts/Lato.css";
import "@/assets/base.css";
import { pinia } from "./state";

import "bulma/css/bulma.css";

const app = createApp(App);

app.use(VCalendar);
app.use(pinia);
app.use(router);

app.mount("#app");
