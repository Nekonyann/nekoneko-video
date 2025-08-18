<style scoped>
:global(.n-message-container) {
  z-index: 10010;
}
:global(.n-message-container--top) {
  top: 60px !important;
}
</style>

<template>
  <n-config-provider>
    <n-loading-bar-provider>
      <n-notification-provider>
        <n-message-provider placement="top">
          <n-dialog-provider>
            <application></application>
          </n-dialog-provider>
        </n-message-provider>
      </n-notification-provider>
    </n-loading-bar-provider>
    <router-view></router-view>
  </n-config-provider>
</template>

<script setup lang="ts">
import Application from '@/components/Application/Application.vue'
</script>
