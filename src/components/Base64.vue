<template>
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

// 计算属性验证输入是否有效
const isValidInput = computed(() => {
    return filename.value.trim() !== '' && base64Content.value.trim() !== ''
})

const download = () => {
    try {
        // 清除可能存在的Base64前缀（如：data:image/png;base64,）
        const base64Data = base64Content.value.split(',')[1] || base64Content.value

        // Base64解码
        const binaryString = window.atob(base64Data)
        const len = binaryString.length
        const bytes = new Uint8Array(len)

        // 将解码后的数据转为二进制数组
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }

        // 创建Blob对象
        const blob = new Blob([bytes], { type: getMimeType(base64Content.value) })

        // 创建下载链接
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename.value

        // 触发下载
        document.body.appendChild(a)
        a.click()

        // 清理资源
        URL.revokeObjectURL(url)
        document.body.removeChild(a)

        ElMessage.success('文件下载成功！')
    } catch (error) {
        console.error('下载失败:', error)
        ElMessage.error('下载失败：无效的Base64格式或文件名')
    }
}

// 从Base64字符串中获取MIME类型
const getMimeType = (base64: string) => {
    const mimeMatch = base64.match(/^data:(.+?);base64,/)
    return mimeMatch ? mimeMatch[1] : 'application/octet-stream'
}
</script>