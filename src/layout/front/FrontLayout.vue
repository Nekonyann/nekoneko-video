<style lang="scss" scoped>
.content {
  margin-top: 50px;
  height: 100%;
}
</style>

<template>
  <n-layout class="app">
    <!-- 内容区域 -->
    <n-layout-header bordered>
      <!-- 顶部导航 -->
      <!-- <HeaderLayout></HeaderLayout> -->
    </n-layout-header>
    <n-layout-content content-style="padding: 5px;">
      <router-view class="content"></router-view>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts"></script>
