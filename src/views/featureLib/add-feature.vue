<template>
  <el-dialog title='新增'  :close-on-click-modal="false" width="600px" :visible.sync="visible" >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" >
          <el-form-item label="特征组合名称" prop="name" label-width="110px">
            <el-input v-model="dataForm.name" maxlength="30" show-word-limit placeholder="特征组合名称" />
          </el-form-item>
          <el-form-item label="效应类型" prop="effectType" label-width="110px">
            <el-select v-model="dataForm.effectType" placeholder="请选择">
              <el-option
                  v-for="item in effectTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="效应关键字" prop="effectKeys" label-width="110px">
            <el-select v-model="dataForm.effectKeys" placeholder="请选择">
              <el-option v-for="item in effectKeysList" :key="item.id" :label="item.content" :value="item.content" />
            </el-select>
          </el-form-item>
          <el-form-item label="特征值" prop="value" label-width="110px">
            <el-input v-model="dataForm.value" maxlength="30" show-word-limit placeholder="特征值" />
          </el-form-item>
          <el-form-item label="效应值单位" prop="effectUnit" label-width="110px">
            <el-select v-model="dataForm.effectUnit" placeholder="请选择">
              <el-option
                  v-for="item in effectUnitList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
              v-for="(keyword, index) in dataForm.keywords"
              :label="'关键字' + (index +1)"
              label-width="110px"
              :key="keyword.key"
              :prop="'keywords.' + index + '.value'"
            >
            <el-input v-model="keyword.value" style="width: 350px" maxlength="30"/>
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
import utilApi from '@/api/utils'
import {effectTypeList,effectUnitList} from '@/utils/dictionaries'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      visible: false,
      effectKeysList: [], // 效应关键字list,
      effectTypeList,
      effectUnitList,
      dataForm: {
        name: '',
        effectType: '',
        effectKeys: '',
        value: '',
        effectUnit: '',
        keywords:[{
          value: '',
          key :''
        }],
      },
      dataRule: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        effectType: [{ required: true, message: '不能为空', trigger: 'blur' }],
        effectKeys: [{ required: true, message: '不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '不能为空', trigger: 'blur' }],
        effectUnit: [{ required: true, message: '不能为空', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getEffectKeysList();
  },
  methods: {
    async getEffectKeysList() {
      const pamData = {
        type: 'effectKeys'
      }
      const { data, code }= await utilApi.getDictionariesList(pamData)
      if (code == '200') {
        this.effectKeysList = data ;
      }
    },
    removeKeyword(item) {
      let index = this.dataForm.keywords.indexOf(item);
      if (index !== -1) {
        this.dataForm.keywords.splice(index, 1)
      }
    },
    init() {
      this.visible = true // 显示
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields() // 清空输入框
      })

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
            name: this.dataForm.name,
            effectType: this.dataForm.effectType,
            effectKeys: this.dataForm.effectKeys,
            value: this.dataForm.value,
            effectUnit: this.dataForm.effectUnit,
          }
          let keys = [];
          this.dataForm.keywords.forEach(key =>{ keys.push(key.value) }) ;
          parameter.featureKeys = keys.join('###') ;

          const { code, message } = await api.sureSave(parameter);
          this.$message.success(message);
          this.visible = false ;
          // 重新加载
          this.$emit('getList')
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
