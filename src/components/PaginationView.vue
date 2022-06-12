<template>
  <div class="pagination">
    <button
      @click.prevent="emit('page', $props.page! - 1)"
      :disabled="$props.page! <= $props.minPage!"
      class="button is-white"
    >
      Предыдущая
    </button>
    <span>Страница {{ $props.page }}</span>
    <button
      @click.prevent="emit('page', $props.page! + 1)"
      :disabled="$props.page! >= $props.maxPage!"
      class="button is-white"
    >
      Следующая
    </button>
  </div>
</template>

<script lang="ts" setup>
import { watch } from "vue";

defineProps({
  page: { type: Number, default: 1 },
  maxPage: { type: Number, required: true, default: Infinity },
  minPage: { type: Number, required: true, default: 1 },
});

const emit = defineEmits<{
  (event: "page", page: number): void;
}>();
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
