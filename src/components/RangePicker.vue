<template>
  <v-date-picker is-range v-model="value">
    <template v-slot="{ inputValue, togglePopover }">
      <div class="field">
        <p class="control has-icons-left">
          <input
            :value="stringifyRange(inputValue)"
            class="input"
            @focus="togglePopover"
            @keypress.prevent
          />
          <span class="icon is-white is-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path
                d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"
              ></path>
            </svg>
          </span>
        </p>
      </div>
    </template>
  </v-date-picker>
</template>

<script setup lang="ts">
import { computed } from "vue";

function stringifyRange({ start, end }: any) {
  return (
    (start ? new Date(start).toLocaleDateString() : "...") +
    " - " +
    (end ? new Date(end).toLocaleDateString() : "...")
  );
}

const props = defineProps<{
  value?: {
    start: Date | string | number;
    end: Date | string | number;
  };
}>();

const emit = defineEmits<{
  (event: "input", value: string): void;
}>();

const value = computed({
  get: () =>
    props.value
      ? new Date(props.value.start).toLocaleDateString() +
        " - " +
        new Date(props.value.end).toLocaleDateString()
      : "",
  set: (v) => emit("input", v),
});
</script>

<style scoped>
svg {
  height: 24px;
  width: 24px;
}
</style>
