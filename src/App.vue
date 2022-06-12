<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import ApplicationReadyStateLoader from "@/components/ApplicationReadyStateLoader.vue";
</script>

<template>
  <ApplicationReadyStateLoader>
    <RouterView />
  </ApplicationReadyStateLoader>
</template>

<style></style>
