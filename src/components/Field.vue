<template>
  <div class="field">
    <label :for="props.for" class="label">{{ props.label }}</label>
    <div class="control">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string;
  for: string;
}>();
</script>
