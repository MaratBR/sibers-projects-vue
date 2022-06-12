<template>
  <span v-for="err in errors" class="has-text-danger is-size-7" :key="err.$uid">
    {{ err.$message }}
  </span>
</template>

<script setup lang="ts">
import type { ErrorObject } from "@vuelidate/core";
const { errors } = defineProps<{
  errors: ErrorObject[];
}>();
</script>
