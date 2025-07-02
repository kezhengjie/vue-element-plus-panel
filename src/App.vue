<template>
  <el-container>
    <el-aside width="200px">
      <el-menu :default-active="activateIndex" router>
        <el-menu-item index="fix-seq">
          <el-icon><icon-menu /></el-icon>
          <span>修复postgres序列</span>
        </el-menu-item>
        <el-menu-item index="base64">
          <el-icon><icon-promotion /></el-icon>
          <span>base64文件下载</span>
        </el-menu-item>
        <el-menu-item index="sql-process">
          <el-icon><icon-promotion /></el-icon>
          <span>SQL处理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
import {
  Menu as IconMenu,
  Tools as IconTools,
  Promotion as IconPromotion,
  Setting,
} from '@element-plus/icons-vue'
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const activateIndex = ref('')
const route = useRoute()
onMounted(() => {
  activateIndex.value = localStorage.getItem('lastVisited') || route.name
})


</script>

<style scoped>
.el-menu-item {
  font-size: 15px;
}
</style>