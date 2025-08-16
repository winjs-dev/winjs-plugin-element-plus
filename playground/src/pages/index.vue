<script setup>
// 需手动引入样式
import 'element-plus/es/components/message-box/style/css'
import { ElMessageBox } from 'element-plus';

ElMessageBox.confirm('Are you sure to close this dialog?')
  .then(() => {

  })
  .catch(() => {
    // catch error
  })

const aa = ref(1)
</script>
<template>
  <div>
    <h2>Hi! Welcome to Winjs ❤️ Vue!</h2>
    <p>
      <img src="@/assets/img/logo.png" width="200" height="200" alt="logo" />
    </p>
    <p><el-button type="primary">我是 element-plus 的 Button</el-button></p>
    <p>{{aa}}</p>
    <p>To get started, edit <code>pages/index.vue</code> and save to reload.</p>
  </div>
</template>
