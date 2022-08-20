<template>
  <el-form :model="dataForm" :rules="rules" @keyup.enter.native="submit()">
    <!-- //v-model.trim  修饰符 将输入内容前后的空格去掉 -->
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model.trim="dataForm.newPassword" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model.trim="dataForm.confirmPassword" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">确认修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },
  data() {
    var validateConfirmPassword = (rule, value, callback) => {
      if (this.dataForm.newPassword !== value) {
        callback(new Error('确认密码与新密码不一致'))
      } else {
        callback()
      }
    }

    return {
      dataForm: {
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: '开发中...',
        type: 'info',
        duration: 5 * 1000
      })
    }
  }
}
</script>
