<script setup lang="ts">
import LogInRequired from "../components/LogInRequired.vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <LogInRequired>
    <div class="content">
      <ul>
        <li>
          <RouterLink to="/new">Создать новый проект</RouterLink>
        </li>
      </ul>
    </div>
  </LogInRequired>
</template>
