<template>
  <el-container>
    <el-aside width="300px">
      <el-menu :default-active="activateIndex" router>
        <el-menu-item index="fix-seq">
          <el-icon><icon-tools /> </el-icon>
          <span>修复postgres序列</span>
        </el-menu-item>
        <el-menu-item index="base64">
          <el-icon><icon-tools /></el-icon>
          <span>base64文件下载</span>
        </el-menu-item>
        <el-menu-item index="sql-process">
          <el-icon><icon-tools /></el-icon>
          <span>阿里云SQL处理</span>
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
  Tools as IconTools,
} from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const activateIndex = ref('')
const route = useRoute()
onMounted(() => {
  activateIndex.value = localStorage.getItem('lastVisited') || route.name
})


</script>


<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-menu {
  height: 100%;
}
</style>