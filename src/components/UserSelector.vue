<template>
  <div>
    <div class="is-flex" v-if="props.multi">
      <span class="tag" v-for="user in selected">
        {{ user.firstName }} {{ user.lastName }} {{ user.patronymic }} ({{
          user.id
        }})
      </span>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>ФИО</th>
          <th>Имя пользователя</th>
          <th>Роли</th>
          <th>Создан</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          :key="user.id"
          v-if="state.pagination"
          v-for="user in state.pagination!.items"
        >
          <td>
            {{ user.lastName }} {{ user.firstName }} {{ user.patronymic }}
          </td>
          <td>{{ user.userName }}</td>
          <td>
            <span class="tag" :key="role" v-for="role in user.roles">{{
              role
            }}</span>
          </td>
          <td>
            {{ new Date(user.createdAt).toLocaleDateString() }}
            {{ new Date(user.createdAt).toLocaleTimeString() }}
          </td>
          <td>
            <input
              type="checkbox"
              :checked="
                props.multi
                  ? selected.some((u) => u.id == user.id)
                  : selected.length === 1 && selected[0].id == user.id
              "
              @change="toggleUser(user)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <PaginationView @page="fetchPage($event)" :page="state.page" />
  </div>
</template>

<script setup lang="ts">
import type { Pagination, UserDto } from "@/api";
import api from "@/api";
import { onMounted, reactive, ref, watch } from "vue";
import PaginationView from "@/components/PaginationView.vue";

const props = defineProps<{
  multi?: boolean;
}>();

const selected = ref<UserDto[]>([]);
function toggleUser(user: UserDto) {
  if (!props.multi) {
    if (selected.value.length === 0 || selected.value[0].id !== user.id) {
      selected.value = [user];
    } else {
      selected.value = [];
    }
  } else {
    if (selected.value.some((u) => u.id == user.id)) {
      selected.value = selected.value.filter((v) => v.id != user.id);
    } else {
      selected.value = selected.value.concat([user]);
    }
  }
}

const emit = defineEmits<{
  (event: "selected", selected: UserDto | null): void;
  (event: "multiSelected", selected: UserDto[]): void;
}>();

watch(selected, () => {
  if (props.multi) {
    emit("multiSelected", selected.value);
  } else {
    emit("selected", selected.value.length ? selected.value[0] : null);
  }
});

const state = reactive({
  page: 1,
  pagination: null as Pagination<UserDto> | null,
  loading: true,
  error: null as string | null,
});

async function fetchPage(page: number) {
  const previousPage = state.page;
  state.page = page;

  try {
    const users = await api.getUsers({ page });
    if (page !== state.page) return;
    state.pagination = users;
  } catch (e: any) {
    if (page !== state.page) return;
    state.page = previousPage;
    state.error = e.toString();
  }
}

onMounted(() => fetchPage(state.page));
</script>

<style scoped>
table {
  width: 100%;
}
input[type="checkbox"] {
  transform: scale(2);
}
</style>
