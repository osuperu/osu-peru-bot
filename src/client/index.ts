import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createI18n } from "vue-i18n";

import App from "./vue/App.vue";
import Home from "./vue/layouts/home-item.vue";
import Error from "./vue/layouts/error-item.vue";

import * as esMessages from "./vue/i18n/es.json";
import * as enMessages from "./vue/i18n/en.json";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// TODO: I can't call the config from server/App so I'll leave it like this for now
const i18n = createI18n({
	locale: "es",
	fallbackLocale: "en",
	messages: {
		es: { ...esMessages },
		en: { ...enMessages },
	},
});

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: "/", component: Home },
		{ path: "/:pathMatch(.*)*", component: Error },
	],
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount("#app");
