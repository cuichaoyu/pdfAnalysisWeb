<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" width="600px" :visible.sync="visible"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px">
      <el-form-item label="用户名" prop="name" >
        <el-input v-model="dataForm.name" maxlength="20" show-word-limit placeholder="用户名"/>
      </el-form-item>
      <el-form-item label="账号" prop="account" >
        <el-input v-model="dataForm.account" maxlength="20" show-word-limit placeholder="账号"/>
      </el-form-item>
      <el-form-item label="密码" prop="pwd" >
        <el-input v-model="dataForm.pwd" maxlength="20" show-word-limit placeholder="密码"/>
      </el-form-item>
      <el-form-item label="备注" prop="remark" >
        <el-input
            v-model="dataForm.remark"
            type="textarea"
            placeholder="备注"
            rows="4"
            show-word-limit
            maxlength="100"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">
        取消
      </el-button>
      <el-button type="primary" @click="dataFormSubmit">
        确认
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '@/api/userManagement'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id:'',
        account: '', //账户
        pwd: '', // 密码
        name: '', // 用户名
        remark: '', // 备注
      },
      dataRule: {
        account: [{ required: true, message: '不能为空', trigger: 'blur' }],
        pwd: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
      }
    }
  },
  created() {

  },
  methods: {
    // 编辑时填充值
    async init() {
      this.visible = true // 显示
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields() // 清空输入框
      })

    },
    // 提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const parameter = Object.values(Object.assign({}, this.dataForm))
          const { code, message } = await api.sureSave(parameter)
          if (code == '200') {
            this.$message.success(message)
            this.visible = false ;
            // 重新加载
            this.$emit('getList')
          }
        }
      })
    }
  }
}
</script>

<style>
.customDialogStyle {
  margin-top: 5vh !important;
}
</style>
