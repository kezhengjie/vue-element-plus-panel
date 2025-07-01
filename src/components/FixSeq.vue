<template>
  <el-input v-model="inputContent" style="max-width: 1000px" :rows="15" type="textarea" />
  <div style="margin: 20px 0" />
  <el-input v-model="outputContent" style="max-width: 1000px" :rows="15" type="textarea"
    :placeholder="placeHolderContent" />
  <div style="margin: 10px 0" />
  <el-button type="primary" @click="generate">生成</el-button>

</template>

<script setup>
import { ref } from 'vue'

const inputContent = ref(`请先使用以下sql 查询出Postgres序列，然后粘贴到此文本框

SELECT sequencename AS SEQUENCE FROM pg_sequences
`)
const outputContent = ref('')
const placeHolderContent = ref('请输入内容')
const generate = () => {
  outputContent.value = ''
  for (let line of inputContent.value.split('\n')) {
    const sequenceName = line.trim()
    if (sequenceName === '') continue
    if (sequenceName.indexOf("_id_seq") == -1) continue
    const tableName = sequenceName.replace('_id_seq', '')
    outputContent.value += `SELECT setval('${sequenceName}', COALESCE((SELECT MAX(id) FROM ${tableName}), 0) + 1);
`
  }
}
</script>