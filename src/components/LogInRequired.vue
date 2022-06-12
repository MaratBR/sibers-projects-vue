<script setup lang="ts">
import { useUserStore } from "@/state";
import { RouterLink } from "vue-router";
import Screen from "./Screen.vue";
const state = useUserStore();
</script>

<template>
  <slot v-if="!state.isLoggedIn" name="loading">
    <Screen>
      <p>Необходимо зайти в систему!</p>
      <RouterLink to="/login"> Войти в систему </RouterLink>
    </Screen>
  </slot>
  <slot v-else></slot>
</template>
