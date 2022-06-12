<script setup lang="ts">
import { useUserStore } from "@/state";
import { ref } from "vue";
import Screen from "@/components/Screen.vue";
import { computed } from "@vue/reactivity";
import axios from "axios";
import { useRouter } from "vue-router";

const isLogginIn = ref(false);
const store = useUserStore();
const userName = ref("");
const password = ref("");
const isInvalidCreds = ref(false);
const router = useRouter();

function onSubmit() {
  if (userName.value.length && password.value.length) {
    login();
  }
}

async function login() {
  isLogginIn.value = true;
  isInvalidCreds.value = false;
  try {
    await store.login({ login: userName.value, password: password.value });
    router.push({ name: "home" });
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status == 401) {
      isInvalidCreds.value = true;
    }
  } finally {
    isLogginIn.value = false;
  }
}

const canSubmit = computed(
  () => !!(userName.value.length && password.value.length)
);
</script>

<template>
  <Screen>
    <div class="container">
      <form @submit.prevent="onSubmit" class="form">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" for="login">Логин</label>
          </div>
          <div class="field-body">
            <input v-model="userName" type="text" id="login" class="input" />
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label" for="password">Пароль</label>
          </div>
          <div class="field-body">
            <input
              v-model="password"
              type="password"
              id="password"
              class="input"
            />
          </div>
        </div>

        <button :class="['button is-primary', { 'is-loading': isLogginIn }]">
          Войти
        </button>
      </form>
    </div>
  </Screen>
</template>

<style scoped>
.invalid-password {
  font-size: 0.9em;
  color: red;
  text-align: center;
  padding: 0.5em 0;
}
.container {
  display: flex;
  align-items: center;
}
</style>
