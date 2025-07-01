<template>
  <el-container>
    <el-aside width="200px">
      <el-menu :default-active="activateIndex" router>
        <el-menu-item index="fix-seq">
          <el-icon><icon-menu /></el-icon>
          <span>修复postgres序列</span>
        </el-menu-item>
        <el-menu-item index="table">
          <el-icon>
            <setting />
          </el-icon>
          <span>Table</span>
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
  Setting,
} from '@element-plus/icons-vue'
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const activateIndex = ref('')

const route = useRoute()

onMounted(() => {
  console.log(
    route.path
  )
  activateIndex.value = route.path.slice(1)
})


</script>

<style scoped>
.el-menu-item {
  font-size: 15px;
}
</style>