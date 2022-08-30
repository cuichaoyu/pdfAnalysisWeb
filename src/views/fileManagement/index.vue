<template>
  <div class="app-container">
    <div :class="['filter-container']">

      <!-- 筛选框需要些双份 一种是没有展开状态下的  只有主要的几个筛选框，另一种是全部的筛选框都展示 也就是展开状态下的 -->
      <!-- 没有展开状态下的筛选框 -->
      <el-form ref="filtrateForm" :inline="true" :model="filtrateForm">
        <el-form-item label="解析情况">
          <el-select v-model="filtrateForm.paresed" style="width: 160px" placeholder="请选择" @change="typeChangeEvent()">
            <el-option label="未解析" value="0"/>
            <el-option label="已解析" value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称">
          <el-input
              v-model.trim="filtrateForm.fileName"
              placeholder=""
              style="width: 300px"
              clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reSearch()">查询</el-button>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
        <el-form-item v-show="filtrateForm.paresed == '0'">
          <el-button type="primary" class="filter-item"  @click="syncFileHandel()">同步文件</el-button>
          <el-button type="primary" class="filter-item"  @click="importFile()">导入文件</el-button>
          <el-button type="primary" class="filter-item"  @click="parseFileBatch()">批量解析文件</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="filter-item"  @click="exportFile()">导出</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div :class="['table']">
      <div class="table-container">
        <el-table
            ref="table"
            :key="tableKey"
            v-loading="dataListLoading"
            row-key="menuId"
            height="100%"
            :data="tableList"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @selection-change="selectionChangeHandle"
        >
          <el-table-column type="selection" width="55" header-align="center" align="center" />
          <el-table-column type="index" header-align="center" align="center" label="序列" width="50"/>
          <el-table-column prop="fileName" header-align="center" align="center" label="文件名称" />
          <el-table-column prop="fileSize" header-align="center" align="center" label="文件大小" width="150"/>
          <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间"width="300"/>
          <el-table-column header-align="center" align="center"  label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" v-show="scope.row.paresed == '0'" @click="parseHandle(scope.row)">解析</el-button>
              <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
              <el-button type="text" @click="xqShow(scope.row)">文件详情</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <pagination v-show="totalCount > 0" :total="totalCount" :page.sync="listQuery.currPage" :limit.sync="listQuery.pageSize"
                @pagination="getList"
    />
    <!------------------------- 导入文件------------------>
    <div>
      <el-dialog
          title="导入文件"
          :visible.sync="importDialog.dialogVisible"
          width="30%"
      >
        <el-form ref="importDialog_dataForm" :model="importDialog.dataForm" :rules="dataRule" label-width="80px" >
          <el-form-item label="上传" prop="pdfFile">
            <el-upload
                ref="pdfUploadRef"
                class="upload-demo"
                v-model="importDialog.dataForm.pdfFile"
                :action="uploadActionUrl()"
                accept=".pdf"
                :on-success="handleAvatarSuccess"
                :on-change="handleChange"
                :on-error="handleAvatarError">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
            </el-upload>
          </el-form-item>
        </el-form>
          <span slot="footer" class="dialog-footer">
              <el-button @click="importDialog.dialogVisible = false">
                取消
              </el-button>
              <el-button type="primary" @click="dataFormSubmit"  :disabled="importDialog.sureAddVisible">
                确认
              </el-button>
        </span>
      </el-dialog>
    </div>


    <!------------------------- 批量解析文件------------------>
    <div>
      <el-dialog
          title="解析情况"
          :visible.sync="parseBatchDialog.dialogVisible"
          width="20%"
          center
          :show-close =false
          :destroy-on-close="true">
        <el-form  ref="parseRef">
          <el-form-item v-for="(item,index) in parseBatchDialog.selectionParseList">
            <el-checkbox  v-model="item.checked" :label="item.fileName.padEnd(50,'\xa0') + (item.finisned || '解析中') ">
            </el-checkbox>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
              <el-button type="primary" v-if="!parseBatchDialog.finishVisible" @click="breakoffHandle()">
                中断解析
              </el-button>
              <el-button type="primary" v-else  @click="parseFinish()">
                解析完成
              </el-button>
        </span>

      </el-dialog>
    </div>


    <!-- 详情展示-->
    <xq-show v-if="xqShowVisible" ref="xqShow"/>
  </div>
</template>

<script>
import api from '@/api/fileManagement' // 请求数据
import Pagination from '@/components/Pagination' // secondary package based on el-pagination 分页组件
import xqShow from './xq-show'

export default {
  name: 'fileManagement',
  components: { Pagination, xqShow },
  data() {
    return {
      // 筛选框的 form 表单
      filtrateForm: {
        paresed: '1',
        fileName: ''
      },
      tableKey: 0,
      dataListLoading: true, // 表格加载数据时的 loading
      dataListSelections: [],
      tableList: [], // 表格数据
      totalCount: 0, // 总条数
      listQuery: { // 表格当前页 和 当前页的展示数量
        currPage: 1,
        pageSize: 20
      },
      importDialog :{
        dialogVisible:false, // 弹框开关
        sureAddVisible :false, // 确认按钮开关
        dataForm :{
          pdfFile:'' , // 校验是否存在文件
          fileName :"",
          filePath :"",
          fileSize :"",
        }
      },
      parseBatchDialog :{
        dialogVisible:false, // 弹框开关,
        selectionParseList :[], // 要解析的文件集
        breakoffVisible : false, //是否中断解析
        finishVisible : false, //是否解析完成
      },
      xqShowVisible: false ,// 详情 弹框展示隐藏,
      dataRule: {
        pdfFile: [{ required: true, message: '请上传文件', trigger: 'change' }],
      }
    }
  },
  created() {
    this.getList() ;
  },
  methods: {
    // 获取表格数据
    async getList() {
      this.dataListLoading = true
      // 筛选+分页
      const params = Object.assign({
        'paresed': this.filtrateForm.paresed,
        'fileName': this.filtrateForm.fileName
      }, this.listQuery)
      // 请求
      const { data, code } = await api.getList(params)
      if(code == 200){
        this.tableList = data.list ;
        this.totalCount = data.totalCount ;
        this.dataListLoading = false
        this.$refs.table.bodyWrapper.scrollTop = 0 // 滚动条 回到顶部
      }

    },
    // 解析情况切换
    typeChangeEvent(){
      this.reSearch();
    },
    // 同步文件
    syncFileHandel(){
      this.$confirm('确定要同步吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 提交删除
        const { code, message } = await api.syncFile();
        if(code == 200){
          this.$message({
            message: message,
            type: 'success',
          })
          this.reSearch()// 刷新数据
        }
      })
    },
    // 导入文件
    importFile(){
      this.importDialog.dialogVisible = true ;
      this.$nextTick(() => {
        this.$refs.importDialog_dataForm.resetFields();
      })
    },
    // 导入文件URL
    uploadActionUrl(){
      return process.env.VUE_APP_BASE_API + '/api/upload' ;
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      // 上传成功后，手动验证一次表单
      this.$nextTick(() => {
        this.importDialog.dataForm.pdfFile = file ;
        this.importDialog.sureAddVisible = false ;
      })
      this.$message.success('上传成功') ;
      let {data} = res ;
      this.importDialog.dataForm.fileName = file.name ;
      this.importDialog.dataForm.filePath = data.filePath ;
      this.importDialog.dataForm.fileSize = data.fileSize ;
    },
    // 上传错误
    handleAvatarError(err, file) {
      this.$message.error('上传失败') ;
    },
    // 选择文件后给表单验证的prop字段赋值， 并且清除该字段的校验
    handleChange(file, fileList) {
      this.importDialog.sureAddVisible = true ;
      this.$refs.importDialog_dataForm.clearValidate('pdfFile');
    },
    // 提交
    dataFormSubmit() {
      this.$refs['importDialog_dataForm'].validate(async (valid) => {
        if (valid) {
          delete this.importDialog.dataForm.pdfFile ;
          const { code, message } = await api.sureImportFile(this.importDialog.dataForm);
          if (code == 200){
            // 清空表单和文件
            this.$refs.importDialog_dataForm.resetFields();
            this.$refs.pdfUploadRef.clearFiles();
            // 关闭弹框
            this.importDialog.dialogVisible = false ;
            this.$message({
              message: message,
              type: 'success',
            })
            this.reSearch()// 刷新数据

          }
        }
      })
    },
    //解析文件
    async parseHandle(row){
      const { code, message } = await api.parseHandle(row.id);
      if (code == 200){
        this.$message({
          message: message,
          type: 'success',
        })
        this.reSearch()// 刷新数据
      }
    },
    // 批量解析文件
    async parseFileBatch(){
      if(this.dataListSelections.length == 0){
        this.$message.error('请先选择文件!')
        return ;
      }
      if(this.dataListSelections.length > 10){
        this.$message.error('最多选择10个文件!')
        return ;
      }
      this.parseBatchDialog.dialogVisible = true ;
      this.$nextTick(async() => {
        this.$refs.parseRef.resetFields();
        this.parseBatchDialog.selectionParseList = Object.values(Object.assign({}, this.dataListSelections))
        this.parseBatchDialog.selectionParseList.forEach(item =>{
              item.checked = false ;
              item.finisned = '解析中';
        });
        for (let item of this.parseBatchDialog.selectionParseList) {
          if (this.parseBatchDialog.breakoffVisible){ // 如果中断,则跳出
            break ;
          }
          const { code, message } = await api.parseHandle(item.id);
          if (code == 200){
            item.checked = true ;
            item.finisned = '已完成' ;
          }else{
            item.finisned = '解析失败' ;
          }
        }
        if (!this.parseBatchDialog.breakoffVisible){ // 如果没中断,则显示解析完成
          this.parseBatchDialog.finishVisible = true ;
        }
      })

    },
    // 中断解析
    breakoffHandle(){
      this.parseBatchDialog.breakoffVisible = true ;
      this.parseBatchDialog.dialogVisible = false ;

    },
    // 解析完成
    parseFinish(){
      this.parseBatchDialog.finishVisible = false;
      this.parseBatchDialog.dialogVisible = false ;
      this.parseBatchDialog.selectionParseList = [] ;
      this.reSearch() ;
    },
    //导出文件
    exportFile(){
      this.$message.success('开发中....') ;
      return ;
      let url = process.env.VUE_APP_BASE_API  + '' ;
      const params = {
        paresed: this.filtrateForm.paresed,
        fileName: this.filtrateForm.fileName,
      };
      for (const paramsKey in params) {
        url += `&${paramsKey}=${params[paramsKey]}`
      }
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    //删除文件
    deleteHandle(row){
      this.$confirm('确定要删除该文件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 提交删除
        const { code, message } = await api.deleteFileHandle(row.id);
        if(code == 200){
          this.$message({
            message: message,
            type: 'success',
          })
          this.reSearch()// 刷新数据
        }
      })
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val ;
    },

    // 文件详情展示
    xqShow(row) {
      this.xqShowVisible = true
      this.$nextTick(() => {
        this.$refs.xqShow.init(Object.assign({}, row))
      })
    },
    // 查询
    reSearch() {
      this.listQuery.currPage = 1 // 从1开始
      this.getList()
    },
    // 重置
    reset() {
      this.filtrateForm.paresed = '1';
      this.filtrateForm.fileName = '';
    }

  }
}
</script>
<style lang="scss" scoped>
//表格布局的注释：
//$rowLength 这个变量表示了 筛选的搜索框会有多少行，由于在不同宽度显示器下 所占行数会不一定 ，所以下面使用媒体查询 做兼容
//最小兼容至 1366
@import '~@/styles/layout-table.scss';

$rowLength: 2;
@media all and (min-width: 1659px) {
  $rowLength: 2;
  @include calculation($rowLength: $rowLength);
}

@media all and (max-width: 1659px) {
  $rowLength: 3;
  @include calculation($rowLength: $rowLength);
}
</style>
