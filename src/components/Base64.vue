<template>
    <div style="margin: 10px 0" />
    <el-text style="font-size: 15px;">输出文件名：</el-text>
    <div style="margin: 10px 0" />
    <el-input v-model="filename" placeholder="请输入文件名（包含扩展名）" resize="none" style="max-width: 400px" />
    <div style="margin: 10px 0" />
    <el-text style="font-size: 15px;">请输入base64文本：</el-text>
    <div style="margin: 10px 0" />
    <el-input v-model="base64Content" placeholder="粘贴Base64编码内容" resize="none" style="max-width: 800px" :rows="25"
        type="textarea" />
    <div style="margin: 10px 0" />
    <el-button type="primary" @click="download" :disabled="!isValidInput">下载文件</el-button>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const base64Content = ref('')
const filename = ref('')

const isValidInput = computed(() => {
    return filename.value.trim() !== '' && base64Content.value.trim() !== ''
})

const download = () => {
    try {
        const base64Data = base64Content.value.split(',')[1] || base64Content.value
        const binaryString = window.atob(base64Data)
        const len = binaryString.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: getMimeType(base64Content.value) })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename.value
        document.body.appendChild(a)
        a.click()
        URL.revokeObjectURL(url)
        document.body.removeChild(a)
        ElMessage.success('文件下载成功！')
    } catch (error) {
        console.error('下载失败:', error)
        ElMessage.error('下载失败：无效的Base64格式或文件名')
    }
}

const getMimeType = (base64: string) => {
    const mimeMatch = base64.match(/^data:(.+?);base64,/)
    return mimeMatch ? mimeMatch[1] : 'application/octet-stream'
}
</script>