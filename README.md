# winjs-plugin-element-plus

适配 WinJS 的 Element Plus 插件。

<p>
  <a href="https://npmjs.com/package/@winner-fed/plugin-element-plus">
   <img src="https://img.shields.io/npm/v/@winner-fed/plugin-element-plus?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/@winner-fed/plugin-element-plus?minimal=true"><img src="https://img.shields.io/npm/dm/@winner-fed/plugin-element-plus.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>


## 功能介绍

`@winner-fed/plugin-element-plus` 是一个专为 WinJS 框架设计的 Element Plus 集成插件，提供了以下核心功能：

- 🚀 **自动导入**：基于 `unplugin-vue-components` 实现 Element Plus 组件的按需自动导入
- 📦 **智能依赖检测**：自动检测项目中的 Element Plus 依赖并获取版本信息
- ⚙️ **配置化管理**：支持通过 WinJS 配置文件进行插件配置
- 🎯 **开箱即用**：无需手动导入组件，直接在模板中使用即可

## 安装

```bash
# 使用 npm
npm install @winner-fed/plugin-element-plus element-plus

# 使用 yarn
yarn add @winner-fed/plugin-element-plus element-plus

# 使用 pnpm
pnpm add @winner-fed/plugin-element-plus element-plus
```

## 基础配置

在 `.winrc.ts` 配置文件中启用插件：

```typescript
import { defineConfig } from 'win';

export default defineConfig({
  plugins: ['@winner-fed/plugin-element-plus'],
  elementPlus: {
    // 插件配置选项（可选）
  }
});
```

## 使用示例

### 基础使用

配置完成后，您可以直接在 Vue 组件中使用 Element Plus 组件，无需手动导入：

```vue
<template>
  <div>
    <el-button type="primary">主要按钮</el-button>
    <el-input v-model="inputValue" placeholder="请输入内容"></el-input>
    <el-message-box>消息提示</el-message-box>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const inputValue = ref('');
</script>
```

### 样式导入

对于某些特殊组件（如 MessageBox），您可能需要手动导入样式：

```vue
<script setup>
// 手动导入样式
import 'element-plus/es/components/message-box/style/css'
import { ElMessageBox } from 'element-plus';

ElMessageBox.confirm('确定要关闭吗？')
  .then(() => {
    // 确认操作
  })
  .catch(() => {
    // 取消操作
  });
</script>
```

### 完整示例

```vue
<template>
  <div class="demo-container">
    <h2>Element Plus 组件示例</h2>
  
    <!-- 按钮组件 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-button>默认按钮</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="primary">主要按钮</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="success">成功按钮</el-button>
      </el-col>
      <el-col :span="6">
        <el-button type="warning">警告按钮</el-button>
      </el-col>
    </el-row>

    <!-- 表单组件 -->
    <el-form :model="form" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格组件 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  username: '',
  email: ''
});

const tableData = ref([
  { name: '张三', email: 'zhangsan@example.com', role: '管理员' },
  { name: '李四', email: 'lisi@example.com', role: '用户' },
  { name: '王五', email: 'wangwu@example.com', role: '用户' }
]);

const submitForm = () => {
  console.log('提交表单:', form.value);
};
</script>

<style scoped>
.demo-container {
  padding: 20px;
}

.el-row {
  margin-bottom: 20px;
}

.el-form {
  margin: 20px 0;
}
</style>
```

## 配置选项

插件支持以下配置选项：

```typescript
interface ElementPlusConfig {
  // 目前插件使用默认配置，未来可能会扩展更多选项
}
```

## 依赖要求

- **Element Plus**: `^2.3.8`
- **Vue**: `^3.0.0`
- **WinJS**: 最新版本

## 工作原理

1. **依赖检测**：插件启动时会自动检测项目中的 Element Plus 依赖
2. **版本获取**：读取 Element Plus 的版本信息并存储到应用数据中
3. **自动导入配置**：使用 `ElementPlusResolver` 配置自动导入规则
4. **按需加载**：只有在模板中使用的组件才会被打包到最终产物中

## 注意事项

1. 确保项目中已正确安装 Element Plus 依赖
2. 某些特殊组件（如 MessageBox）的样式可能需要手动导入
3. 插件会自动处理组件的按需导入，无需手动配置 babel 插件
4. 支持 TypeScript，提供完整的类型支持

## 故障排除

### 常见问题

**Q: 提示找不到 Element Plus 包？**
A: 确保已正确安装 Element Plus：`npm install element-plus`

**Q: 组件样式没有生效？**
A: 某些组件可能需要手动导入样式，参考上面的样式导入示例

**Q: TypeScript 类型报错？**
A: 确保项目中安装了 `@types/element-plus` 或 Element Plus 内置的类型声明

## 许可证

[MIT](./LICENSE).
