<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" width="600px" :visible.sync="visible" custom-class="customDialogStyle">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" >
          <el-form-item label="特征组合名称" prop="name" label-width="110px">
            <el-input v-model="dataForm.name" maxlength="20" show-word-limit placeholder="特征组合名称" />
          </el-form-item>
          <el-form-item label="效应类型" prop="admin_sid" label-width="110px">
            <el-select v-model="dataForm.admin_sid" placeholder="请选择">
              <el-option
                v-for="(item, index) in mdManagerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="效应关键字" prop="status" label-width="110px">
            <el-select v-model="dataForm.status" placeholder="请选择">
              <el-option v-for="(v,k) in storeStatusEnum" :key="k" :label="v" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="特征值" prop="name" label-width="110px">
            <el-input v-model="dataForm.name" maxlength="20" show-word-limit placeholder="特征值" />
          </el-form-item>
          <el-form-item label="效应值单位" prop="name" label-width="110px">
            <el-input v-model="dataForm.name" maxlength="20" show-word-limit placeholder="效应值单位" />
          </el-form-item>
          <el-form-item
              v-for="(keyword, index) in dataForm.keywords"
              :label="'关键字' + (index +1)"
              label-width="110px"
              :key="keyword.key"
              :prop="'keywords.' + index + '.value'"
            >
            <el-input v-model="keyword.value" style="width: 350px"/>
            <el-button icon="el-icon-minus" type="danger" circle style="margin-left: 10px"
                       @click.prevent="removeKeyword(keyword)"  v-if="index != 0 "
           />
            <el-button icon="el-icon-plus" type="success" circle style="margin-left: 10px"
                       @click="addKeyword" v-if="index == dataForm.keywords.length - 1"/>
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
import api from '@/api/featureLib'
import { getToken } from '@/utils/auth'
import { pictureDomain, storeStatusEnum } from '@/utils/enum' // 请求数据
export default {
  data() {
    return {
      visible: false,
      mdManagerList: [], // 门店管理员list
      dataForm: {
        id: '',
        name: '', // 门店名称
        cover_imgs: '', // 门店照片地址
        address: '', // 位置
        longitude: '', // 经度
        latitude: '', // 纬度
        admin_sid: '', // 管理员
        info: '', // 简介
        note:'' , // 注意事项
        status: '1', // 经营状态
        uploadFileName:'',
        keywords:[{
          value: ''
        }],
      },
      storeStatusEnum , // 门店状态
      dataRule: {
        cover_imgs: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '不能为空', trigger: 'blur' }],
        longitude: [{ required: true, message: '不能为空', trigger: 'blur' }],
        latitude: [{ required: true, message: '不能为空', trigger: 'blur' }],
        admin_sid: [{ required: false, message: '', trigger: 'blur' }],
        note: [{ required: false, message: '', trigger: 'blur' }],
        status: [{ required: true, message: '不能为空', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getMdManagerList();
  },
  methods: {
    // 获取门店管理员list
    async getMdManagerList() {
      const pamData = {
        status: '1'
      }
      const { data, status }= await api_coach.getCoachList(pamData)
      if (String(status).substr(0,2) == 20) {
        this.mdManagerList = data.items ;
      }
    },
    // 编辑时填充值
    async init(row) {
      this.visible = true // 显示
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields() // 清空输入框
      })

    },
    removeKeyword(item) {
      if (this.dataForm.keywords.length === 1) {
        this.$message.warning('最后一个了,再删就没有了');
        return;
      }
      let index = this.dataForm.keywords.indexOf(item);
      if (index !== -1) {
        this.dataForm.keywords.splice(index, 1)
      }

    },
    addKeyword() {
      this.dataForm.keywords.push({
        value: '',
        key: Date.now()
      });
    },
    // 提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const parameter = {
            id: this.dataForm.id || '0', // 传0 代表新增
            name: this.dataForm.name,
          }
          const { data, status } = await api.sureSave(parameter);
          if (String(status).substr(0,2) == 20) {
            this.$message({
              message: data.message,
              type: 'success',
              duration: 2000,
              onClose: () => {
                this.visible = false ;
                // 重新加载
                this.$emit('getList')
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.mod-menu {
    .menu-list__input,
    .icon-list__input {
        > .el-input__inner {
            cursor: pointer;
        }
    }
    &__icon-popover {
        width: 458px;
        overflow: hidden;
    }
    &__icon-inner {
        width: 478px;
        max-height: 258px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    &__icon-list {
        width: 458px;
        padding: 0;
        margin: -8px 0 0 -8px;
        > .el-button {
            padding: 8px;
            margin: 8px 0 0 8px;
            > span {
                display: inline-block;
                vertical-align: middle;
                width: 18px;
                height: 18px;
                font-size: 18px;
            }
        }
    }
    .icon-list__tips {
        font-size: 18px;
        text-align: center;
        color: #e6a23c;
        cursor: pointer;
    }
}
</style>
<!-- 照片上传及显示样式 -->
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
<style>
.customDialogStyle{
  margin-top: 5vh !important;
}
</style>
