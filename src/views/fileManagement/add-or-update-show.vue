<template>
  <el-dialog :title= "!dataForm.id ? '新增' : '修改'"  :close-on-click-modal="false" width="600px" :visible.sync="visible"
             append-to-body custom-class="customDialogStyle" :show-close="false" :destroy-on-close="true">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" >
          <el-form-item label="解析范围" prop="type">
            <el-select v-model="dataForm.type" placeholder="请选择">
              <el-option
                  v-for="item in parseTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文件内容" prop="content" >
            <el-input
                v-show="dataForm.type == 0"
                v-model="dataForm.content"
                type="textarea"
                placeholder="备注"
                rows="4"
                show-word-limit
                maxlength="1000"
            />
            <el-upload
                v-show="dataForm.type != 0"
                class="avatar-uploader"
                :action="uploadActionUrl()"
                accept="image/*"
                :show-file-list="true"
                :on-success="handleAvatarSuccess"
                :on-change="handleChange"
                :on-error="handleAvatarError">
              <img v-if="dataForm.photoUrl" :src="dataForm.photoUrl" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon" style="line-height:150px" />
            </el-upload>
          </el-form-item>
      <el-form-item label="效应名称" prop="effectType">
        <el-select v-model="dataForm.effectType" placeholder="请选择">
          <el-option
              v-for="item in effectTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
          <el-form-item label="特征值" prop="featureValue">
            <el-select v-model="dataForm.featureValue" placeholder="请选择">
              <el-option
                  v-for="item in featureValueList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="效应值" prop="effectValue">
            <el-input v-model="dataForm.effectValue" maxlength="30" show-word-limit placeholder="效应值" />
          </el-form-item>
      <el-form-item label="效应单位" prop="effectUnit">
        <el-select v-model="dataForm.effectUnit" placeholder="请选择">
          <el-option
              v-for="item in effectUnitList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="器件名称" prop="devicesName">
        <el-select v-model="dataForm.devicesName" placeholder="请选择">
          <el-option
              v-for="item in devicesNameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="器件目录" prop="devicesFolder" >
        <el-select v-model="dataForm.devicesFolder" placeholder="请选择">
          <el-option v-for="item in devicesFolderList" :key="item.id" :label="item.content" :value="item.content" />
        </el-select>
      </el-form-item>
      <el-form-item label="型号" prop="devicesType" >
        <el-input v-model="dataForm.devicesType" maxlength="30" show-word-limit placeholder="型号" />
      </el-form-item>
      <el-form-item label="制造商" prop="devicesMes" >
        <el-input v-model="dataForm.devicesMes" maxlength="30" show-word-limit placeholder="制造商" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">
        取消
      </el-button>
      <el-button type="primary" @click="dataFormSubmit" :disabled="sureAddVisible">
        确认
      </el-button>
    </span>
  </el-dialog>
</template>
<script>
import api from '@/api/fileManagement'
import utilApi from '@/api/utils'
import {parseTypeList , devicesNameList,featureValueList,effectUnitList,effectTypeList} from '@/utils/dictionaries'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      visible: false,
      devicesFolderList:[] ,// 器件目录list
      parseTypeList, // 解析范围
      devicesNameList, // 器件名称
      featureValueList, // 特征值
      effectUnitList, // 效应单位
      effectTypeList, // 效应名称
      apiurl: process.env.VUE_APP_BASE_API +  '/api', // 文件请求地址
      dataForm: {
        id :'',
        pdfId: '', // 文件ID
        type: parseTypeList[0].value,
        content: '',
        devicesName: '',
        devicesFolder:'',
        devicesMes :"",
        devicesType :"",
        effectType: '',
        featureValue: '',
        effectValue: '',
        effectUnit: '',
        photoUrl :'' ,// 编辑时的图片地址
      },
      sureAddVisible :false , // 确认添加按钮状态,上传时不让点确认
      dataFromCopy:Object.assign({}, this.dataForm),
      dataRule: {
        type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '不能为空', trigger: 'blur' }],
        devicesName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        devicesFolder: [{ required: true, message: '不能为空', trigger: 'blur' }],
        devicesMes: [{ required: true, message: '不能为空', trigger: 'blur' }],
        devicesType: [{ required: true, message: '不能为空', trigger: 'blur' }],
        effectType: [{ required: true, message: '不能为空', trigger: 'blur' }],
        featureValue: [{ required: true, message: '不能为空', trigger: 'blur' }],
        effectValue: [{ required: true, message: '不能为空', trigger: 'blur' }],
        effectUnit: [{ required: true, message: '不能为空', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.dataFromCopy = Object.assign({}, this.dataForm) ;
    this.getdictionaryList();
  },
  methods: {
    // 初始化值
    init(row,fileId) {
      this.visible = true // 显示
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields() ;// 清空输入框
        this.sureAddVisible = false ;
        this.dataForm = Object.assign({}, this.dataFromCopy) ;
        this.dataForm.pdfId = fileId ;  // 绑定文件
        if (Object.keys(row).length != 0){
          this.dataForm = row ;
          // devicesName :devicesNameList.find((obj) =>{return  obj.label ==  row.devicesName}).value ,
          if (row.type != 0) {// 如果是图片或表格,则回显url
            this.dataForm.photoUrl = this.apiurl + '/files/' + row.content ;
          }
        }
      })

    },
    // 获取器件目录字典
    async getdictionaryList() {
      const pamData = {
        type: 'pdf-sync-type'
      }
      const { data, code }= await utilApi.getDictionariesList(pamData)
      if (code == '200') {
        this.devicesFolderList = data ;
      }
    },
    // 导入文件URL
    uploadActionUrl(){
      return this.apiurl + '/upload' ;
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.$message.success('上传成功') ;
      this.$nextTick(() => {
       this.sureAddVisible = false ;
      })
      let {data} = res ;
      this.dataForm.content = data.filePath ;
      this.dataForm.photoUrl = this.apiurl + '/files/' + data.filePath ;
    },
    // 上传错误
    handleAvatarError(err, file) {
      this.$message.error('上传失败') ;
    },
    // 上传过程中 禁止点确认
    handleChange(file, fileList) {
      this.sureAddVisible = true ;
    },
    // 提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          let data ;
          if (this.dataForm.id){
              data = await api.updateByIDHandle(this.dataForm);
          }else{
              data = await api.addParseFile(this.dataForm);
          }
          if (data.code == 200){
            this.$message({
              message: data.message,
              type: 'success',
            })
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
