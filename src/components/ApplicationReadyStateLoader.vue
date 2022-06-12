<script setup lang="ts">
import { useUserStore } from "@/state";
import { onMounted } from "vue";
const state = useUserStore();

onMounted(() => {
  state.init();
});
</script>

<template>
  <slot v-if="!state.isInitialized" name="loading"> Loading... </slot>
  <slot v-else></slot>
</template>
