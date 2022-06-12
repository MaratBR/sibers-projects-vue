<template>
  <div class="container is-fullhd">
    <form action="#" @submit.prevent="onSubmit" v-show="projectCreationStage == 0">
      <template v-if="stage == 0">
        <div class="section">
          <h1 class="title">Новый проект</h1>
          <h2 class="subtitle">
            Вы можете создать новый проект с помощью этой формы
          </h2>
        </div>
        <Field for="name" label="Имя">
          <input id="name" class="input" v-model="formData.name" type="text" />
          <ErrorsView :errors="$v0.name.$errors" />
        </Field>
        <Field for="description" label="Описание">
          <textarea
            id="description"
            class="textarea"
            v-model="formData.description"
          />
          <ErrorsView :errors="$v0.description.$errors" />
        </Field>
      </template>
      <template v-else-if="stage == 1">
        <Field for="clientCompany" label="Компания-клиент">
          <input
            class="input"
            id="clientCompany"
            v-model="formData.clientCompany"
            type="text"
          />
          <ErrorsView :errors="$v1.clientCompany.$errors" />
        </Field>

        <Field for="contractorCompany" label="Компания-исполнитель">
          <input
            class="input"
            id="contractorCompany"
            v-model="formData.contractorCompany"
            type="text"
          />
          <ErrorsView :errors="$v1.contractorCompany.$errors" />
        </Field>

        <Field for="endsAt" label="Период выполнения проекта">
          <RangePicker id="endsAt" v-model="formData.dateRange" />
          <ErrorsView :errors="$v1.dateRange.$errors" />
        </Field>
      </template>
      <template v-else-if="stage == 2">
        <h2 class="subtitle">Выберите менеджера проекта</h2>
        <ErrorsView :errors="$v2.projectManagerId.$errors" />
        <UserSelector @selected="formData.projectManager = $event" />
      </template>
      <template v-else-if="stage == 3">
        <h2 class="subtitle">Выберите сотрудников</h2>
        <ErrorsView :errors="$v2.projectManagerId.$errors" />
        <UserSelector multi @multi-selected="formData.assignees = $event" />
      </template>
      <template v-else>
        <div class="content">
          <h2 class="subtitle">Все ли верно?</h2>
        <p>
          <b>Имя проекта:</b> {{formData.name}}
        </p>
        <p>
          <b>Описание:</b> {{formData.description}}
        </p>
        <p>
          <b>Компания-клиент:</b> {{formData.clientCompany}}
        </p>
        <p>
          <b>Компания-исполнитель:</b> {{formData.contractorCompany}}
        </p>
        <p>
          <b>Менеджер проекта:</b>
          {{ formData.projectManager?.lastName }}
          {{ formData.projectManager?.firstName }}
          {{ formData.projectManager?.patronymic }}
        </p>
        <p>Проект предполагается выполнить в перод {{formData.dateRange.start?.toLocaleDateString()}} - {{formData.dateRange.end?.toLocaleDateString()}}</p>
        <p>
          <b>Сотрудники:</b>
          <ul class="ul">
            <li class="li" v-for="assignee in formData.assignees">
              {{assignee.lastName}} {{assignee.firstName}} {{assignee.patronymic}} <br>
              <small>{{assignee.id}}</small>
            </li>
          </ul>
        </p>
        </div>
      </template>

      <div class="is-flex is-justify-content-end">
        <button v-if="stage < 4" class="button is-primary" @click.prevent="nextStage">
          Далее
        </button>
        <button v-else class="button is-primary" type="submit">
          Создать проект
        </button>
      </div>
    </form>
    <div class="content" v-if="projectCreationStage !== 0">
      <p v-if="projectCreationStage >= 1">Создаем проект...</p>
      <p v-if="projectCreationStage >= 2">Назначаем сотрудников {{usersAssigned}}/{{formData.assignees.length}}</p>
      <p v-if="projectCreationStage >= 3"><b>Готово!</b></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, type Ref } from "vue";
import Screen from "@/components/Screen.vue";
import type { ProjectDto, UserDto } from "@/api";
import RangePicker from "@/components/RangePicker.vue";
import Field from "@/components/Field.vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import ErrorsView from "../components/ErrorsView.vue";
import UserSelector from "../components/UserSelector.vue";
import api from "@/api";

async function onSubmit() {
  projectCreationStage.value = 1;
  const {name, description, projectManager, clientCompany, contractorCompany, dateRange, priority, assignees} = formData;
  let project: ProjectDto 

  try {
    project = await api.createProject({
      name,
      description,
      priority,
      projectManagerId: projectManager!.id,
      contractorCompany,
      clientCompany,
      startsAt: dateRange.start!.toISOString(),
      endsAt: dateRange.start!.toISOString()
    })
  } catch (e) {
    error.value = e;
    return;
  }

  projectCreationStage.value += 1;

  try {
    for (let user of assignees) {
      await api.assignUser(user.id, project.id)
      usersAssigned.value += 1;
    }
  } catch (e) {
    error.value = e;
    return;
  }
  projectCreationStage.value += 1;
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}
const projectCreationStage = ref(0);
const usersAssigned = ref(0);
const error = ref<any>(undefined);
const formData = reactive({
  name: "",
  description: "",
  contractorCompany: "",
  clientCompany: "",
  dateRange: <DateRange>{
    start: null,
    end: null,
  },
  priority: 0,
  assignees: [] as UserDto[],
  projectManager: null as UserDto | null,
});

const rangeRequired = helpers.withMessage(
  "Период выполнения проект должеть быть указан",
  ({ start, end }: DateRange) => !!(start && end)
);

const $v0 = useVuelidate(
  {
    name: { required },
    description: { required },
  },
  computed(() => ({ name: formData.name, description: formData.description }))
);

const $v1 = useVuelidate(
  {
    contractorCompany: { required },
    clientCompany: { required },
    priority: { required },
    dateRange: { rangeRequired },
  },
  computed(() => ({
    contractorCompany: formData.contractorCompany,
    clientCompany: formData.clientCompany,
    priority: formData.priority,
    dateRange: formData.dateRange,
  }))
);

const $v2 = useVuelidate(
  {
    projectManagerId: { required },
  },
  computed(() => ({ projectManagerId: formData.projectManager?.id }))
);

const validation = {
  0: $v0,
  1: $v1,
  2: $v2,
  3: null,
  4: null
};
const stage = ref<0 | 1 | 2 | 3 | 4>(0);

function nextStage() {
  const validator = validation[stage.value];
  if (validator !== null) {
    validator.value.$validate().then((valid) => {
      if (valid) stage.value += 1;
    });
  } else {
    stage.value += 1;
  }
}

function prevStage() {
  if (stage.value === 0) return;
  stage.value -= 1;
}
</script>

<style scoped>
.name {
  font-size: 2em;
  color: red;
}
.container {
  padding: 10rem 0;
}
</style>
