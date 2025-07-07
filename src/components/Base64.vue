<template>
    <el-row>
        <el-col :span="24"><el-text>输入文件名：</el-text></el-col>
    </el-row>

    <el-row>
        <el-col :span="24">
            <el-input @focus="onSourceFileNameFocus" @input="onSourceFileNameInput" ref="sourceFileNameRef"
                v-model="sourceFileName" placeholder="请输入文件名" style="max-width: 400px;"></el-input>
        </el-col>
    </el-row>

    <div v-for="(item, index) in codeList" :key="index">
        <el-col :span="24"><el-text style=""> {{ item.name }} :</el-text></el-col>
        <el-col style="max-width: 900px;" class="code-area" :span="24"><el-text> {{ item.code }} </el-text></el-col>
        <el-col> <el-button :disabled="!(sourceFileName.length > 0)" @click="copyCommand" type="success">复制命令</el-button> </el-col>
    </div>

    <el-row style="margin-top:20px">
        <el-col :span="24">
            <el-text style="font-size: 15px;">输出文件名：</el-text>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <el-input v-model="outputFileName" placeholder="" resize="none" style="max-width: 400px" />
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <el-text style="font-size: 15px;">请输入base64文本：</el-text>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <el-input v-model="base64Content" placeholder="粘贴Base64编码内容" resize="none" style="max-width: 800px"
                :rows="20" type="textarea" />
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <el-button type="primary" @click="download" :disabled="!isValidInput">下载文件</el-button>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const base64Content = ref('')
const sourceFileName = ref(localStorage.getItem('Base64.sourceFileName') || 'file')
const sourceFileNameRef = ref(null)
const outputFileName = ref(localStorage.getItem('Base64.outputFileName') || '')
const codeTemplateList = [
    // { name: '将文件转为base64编码', code: 'base64 -w0 {}' },
    { name: '压缩文件后转为base64编码', code: 'tar -cvzf {}.tar.gz {};base64 -w0 {}.tar.gz' }
]


const onSourceFileNameFocus = () => {
    if (sourceFileNameRef.value) {
        sourceFileNameRef.value.$el.querySelector('input').select()
    }
}

const onSourceFileNameInput = () => {
    localStorage.setItem('Base64.sourceFileName', sourceFileName.value)
    if (sourceFileName.value.trim() != "")
        outputFileName.value = sourceFileName.value + '.tar.gz'
    else
        outputFileName.value = ''
    localStorage.setItem('Base64.outputFileName', outputFileName.value)
}

const codeList = computed(() => {
    return codeTemplateList.map(item => {
        return {
            ...item,
            code: sourceFileName.value ? item.code.replaceAll('{}', sourceFileName.value) : item.code
        }
    })
})

const isValidInput = computed(() => {
    return outputFileName.value.trim() !== '' && base64Content.value.trim() !== ''
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
        a.download = outputFileName.value
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

const copyCommand = () => {
    const command = codeList.value.map(item => item.code).join('\n')
    if (navigator.clipboard) {
        navigator.clipboard.writeText(command)
            .then(() => {
                ElMessage.success('命令已复制到剪贴板！')
            })
            .catch(err => {
                console.error('复制失败:', err)
                ElMessage.error('复制命令失败，请手动复制')
            })
    } else {
        const textarea = document.createElement('textarea')
        textarea.value = command
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        try {
            document.execCommand('copy')
            ElMessage.success('命令已复制到剪贴板！')
        } catch (err) {
            console.error('复制失败:', err)
            ElMessage.error('复制命令失败，请手动复制')
        } finally {
            document.body.removeChild(textarea)
        }
    }
}

const getMimeType = (base64: string) => {
    const mimeMatch = base64.match(/^data:(.+?);base64,/)
    return mimeMatch ? mimeMatch[1] : 'application/octet-stream'
}
</script>

<style scoped>
.el-row {
    margin-bottom: 10px;
}

.code-area {
    font-family: Source Code Pro;
    background-color: #f5f5f5;
    padding: 10px;
    max-width: 500px;
    margin-left: 5px;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>