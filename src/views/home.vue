<script setup lang="ts">
import SidebarBox from "../components/SidebarBox.vue";
</script>

<template>
   <div class="layout-container">
    <sidebar-box></sidebar-box>

    <div class="content-container">
        <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  contain: layout style paint;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}

.content-container {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background-color: #f0f2f5;
}
</style>