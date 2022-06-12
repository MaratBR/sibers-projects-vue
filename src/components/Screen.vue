<template>
  <div class="screen">
    <slot></slot>
  </div>
</template>

<style>
.screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
