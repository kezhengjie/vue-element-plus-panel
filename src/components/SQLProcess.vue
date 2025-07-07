<template>
  <div v-for="(item, index) in switchList" :key="index">
    <el-switch @change="saveSwitchState" v-model="item.value"></el-switch><el-text style="margin-left:10px;">{{
      item.name }}</el-text>
  </div>

  <el-upload accept=".sql" style="margin-top: 20px;" :on-exceed="handleExceed" v-model:file-list="fileList"
    action="javascript:void(0);" :auto-upload="false" :on-change="onUploadChange" ref="uploadRef" :limit="1">
    <template #trigger>
      <el-button type="primary">选择SQL文件</el-button>
    </template>
    <el-button :disabled="isFileUploaded()" @click="process" style="margin-left: 10px;position: fixed;"
      type="success">开始处理</el-button>
  </el-upload>

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, genFileId } from 'element-plus'
import type { UploadRawFile, UploadProps, UploadInstance, UploadUserFile } from 'element-plus'

const fileList = ref<UploadUserFile[]>([]) // 用于存储上传的文件列表
const uploadRef = ref<UploadInstance>()
const isFileUploaded = () => {
  return fileList.value.length === 0
}

const onUploadChange = (file: UploadRawFile): boolean => {
  const fileType = file.name.split('.').pop()?.toLowerCase()
  if (fileType !== 'sql') {
    uploadRef.value!.clearFiles()
    ElMessage.error('请上传SQL文件！')
    return false
  }
  return true
}

const handleToDate = (content: string): string => {
  content = content.replaceAll("to_date(", '')
  content = content.replaceAll(",'yyyy-mm-dd hh24:mi:ss')", '')
  return content
}

const handleWrongFrom = (content: string): string => {
  return content.replaceAll(`"""from"""`, "from")
}

const keepOnlyInsert = (content: string): string => {
  let firstInsertIndex = content.indexOf('INSERT INTO')
  if (firstInsertIndex >= 0) {
    return content.substring(firstInsertIndex)
  } else {
    return content
  }
}

const handlePgCustomWord = (content: string): string => {
  let begin = content.indexOf('pg_ts_custom_word')
  if (begin === -1) {
    return content
  }
  begin = content.substring(0, begin).lastIndexOf('CREATE')
  let end = content.substring(begin).indexOf(';')
  return content.substring(0, begin) + content.substring(begin + end + 1)
}

type Switch = {
  name: string
  value: boolean
  handler: (content: string) => string
}

const switchList = ref<Switch[]>([
  { name: "处理to_date", value: true, handler: handleToDate },
  { name: `处理"""from"""`, value: true, handler: handleWrongFrom },
  { name: `去除pg_ts_custom_word`, value: false, handler: handlePgCustomWord },
  { name: `只保留插入语句`, value: false, handler: keepOnlyInsert },
])

const saveSwitchState = () => {
  const arr = []
  for (const item of switchList.value) {
    arr.push(item.value)
  }
  localStorage.setItem('SQLProcessSwitchState', JSON.stringify(arr))
}

const loadSwitchState = () => {
  const state = localStorage.getItem('SQLProcessSwitchState')
  if (state) {
    const arr = JSON.parse(state)
    for (let i = 0; i < switchList.value.length; i++) {
      switchList.value[i].value = arr[i] || false
    }
  }
}

loadSwitchState()

const process = async () => {
  let content = await fileList.value[0]?.raw.text()
  for (const item of switchList.value) {
    if (item.value && item.handler) {
      content = item.handler(content)
    }
  }
  downloadFile(content, fileList.value[0].name || 'processed.sql')
}

const downloadFile = (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName.split('.').slice(0, -1).join('.') + '-processed.' + fileName.split('.').pop()
  document.body.appendChild(link)
  link.click()
  ElMessage.success('文件下载成功！')
  document.body.removeChild(link)
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}
</script>