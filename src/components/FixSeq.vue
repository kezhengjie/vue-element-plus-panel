<template>
  <el-input v-model="inputContent" resize="none" style="max-width: 1000px" :rows="15" type="textarea" />
  <div style="margin: 20px 0" />
  <el-input ref="outputTextarea" v-model="outputContent" resize="none" style="max-width: 1000px" :rows="15"
    type="textarea" :placeholder="placeHolderContent" />
  <div style="margin: 10px 0" />
  <el-button type="primary" @click="generate">生成</el-button>

</template>

<script setup>
import { ref, nextTick } from 'vue'

const inputContent = ref(`请先使用以下sql 查询出Postgres序列，然后粘贴到此文本框

SELECT sequencename AS SEQUENCE FROM pg_sequences
`)
const outputContent = ref('')
const placeHolderContent = ref('请输入内容')
const outputTextarea = ref(null)  // 创建 ref 引用

const generate = () => {
  outputContent.value = ''
  for (let line of inputContent.value.split('\n')) {
    const sequenceName = line.trim()
    if (sequenceName === '') continue
    if (sequenceName.indexOf("_id_seq") == -1) continue
    const tableName = sequenceName.substring(0, sequenceName.indexOf("_id_seq"))
    outputContent.value += `SELECT setval('${sequenceName}', COALESCE((SELECT MAX(id) FROM ${tableName}), 0) + 1);
`
  }

  // 在 DOM 更新后选中文本
  nextTick(() => {
    if (outputTextarea.value) {
      // 获取原生 textarea 元素
      const textarea = outputTextarea.value.$el.querySelector('textarea')
      if (textarea) {
        textarea.select()  // 选中文本
      }
    }
  })
}
</script>