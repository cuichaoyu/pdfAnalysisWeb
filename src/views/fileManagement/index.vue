<template>
  <div class="app-container">
    <div :class="['filter-container']">

      <!-- 筛选框需要些双份 一种是没有展开状态下的  只有主要的几个筛选框，另一种是全部的筛选框都展示 也就是展开状态下的 -->
      <!-- 没有展开状态下的筛选框 -->
      <el-form ref="filtrateForm" :inline="true" :model="filtrateForm">
        <el-form-item label="解析情况">
          <el-select v-model="filtrateForm.type" style="width: 160px" placeholder="请选择" @change="typeChangeEvent()">
            <el-option label="未解析" value=""/>
            <el-option label="已解析" value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称">
          <el-input
              v-model.trim="filtrateForm.name"
              placeholder=""
              style="width: 300px"
              clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reSearch()">查询</el-button>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
        <el-form-item v-show="filtrateForm.type == ''">
          <el-button type="primary" class="filter-item"  @click="syncFile()">同步文件</el-button>
          <el-button type="primary" class="filter-item"  @click="importFile()">导入文件</el-button>
          <el-button type="primary" class="filter-item"  @click="parseFileBatch()">批量解析文件</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="filter-item"  @click="exportFile()">导出</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div>
      <el-dialog
          title="导入文件"
          :visible.sync="importDialog.dialogVisible"
          width="30%"
          >
        <el-upload
            class="upload-demo"
            :action="uploadActionUrl()"
            accept=".pdf"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            multiple
            :limit="10"
            :file-list="importDialog.fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传PDF文件</div>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="importDialog.dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
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
          <el-table-column prop="id" header-align="center" align="center" label="序列" width="50"/>
          <el-table-column prop="name" header-align="center" align="center" label="文件名称" width="500"/>
          <el-table-column prop="type" header-align="center" align="center" label="文件大小" width="150"/>
          <el-table-column prop="address" header-align="center" align="center" label="更新时间"/>
          <el-table-column header-align="center" align="center" width="200" label="操作">
            <template slot-scope="scope">
              <el-button type="text" v-show="filtrateForm.type == ''" @click="parseHandle(scope.row)">解析</el-button>
              <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
              <el-button type="text" @click="xqShow(scope.row)">文件详情</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <pagination v-show="totalPage > 0" :total="totalPage" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"
    />

    <!-- 详情展示-->
    <xq-show v-if="xqShowVisible" ref="xqShow"/>
  </div>
</template>

<script>
import api from '@/api/fileManagement' // 请求数据
import Pagination from '@/components/Pagination' // secondary package based on el-pagination 分页组件
import xqShow from './xq-show' // 详情弹框

export default {
  name: 'fileManagement',
  components: { Pagination, xqShow },
  data() {
    return {
      // 筛选框的 form 表单
      filtrateForm: {
        type: '',
        name: ''
      },
      tableKey: 0,
      dataListLoading: true, // 表格加载数据时的 loading
      dataListSelections: [],
      tableList: [], // 表格数据
      totalPage: 0, // 总条数
      listQuery: { // 表格当前页 和 当前页的展示数量
        page: 1,
        limit: 20
      },
      importDialog :{
        dialogVisible:false,
        fileList:[],
      },
      xqShowVisible: false // 详情 弹框展示隐藏
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
        'type': this.filtrateForm.type,
        'name': this.filtrateForm.name
      }, this.listQuery)
      // 请求
      const { data, status } = await api.getList(params).catch(e => {
      })
      if (status == '200') {
        this.tableList = data.items
        this.totalPage = data.count
      }
      this.dataListLoading = false
      this.$refs.table.bodyWrapper.scrollTop = 0 // 滚动条 回到顶部

    },
    // 解析情况切换
    typeChangeEvent(){
      this.reSearch();
    },
    // 同步文件
    syncFile(){

    },
    // 导入文件
    importFile(){
      this.importDialog.fileList.length = 0 ;
      this.importDialog.dialogVisible = true ;
    },
    // 导入文件URL
    uploadActionUrl(){
      return process.env.VUE_APP_BASE_API + 'api/admin/upload' ;
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.$message.success(file.name + '上传成功')
    },
    // 上传错误
    handleAvatarError(err, file) {
      this.$message.error(file.name + '上传失败')
    },
    //解析文件
    parseHandle(row){

    },
    // 批量解析文件
    parseFileBatch(){
      let ids = [] ;
      this.dataListSelections.forEach(item => {
        ids.push(item.id);
      })
    },
    //导出文件
    exportFile(){
      let url = process.env.VUE_APP_BASE_API  + `api/admin/export/business?` ;
      const params = {
        type: this.filtrateForm.type,
        name: this.filtrateForm.name,
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
        const { data, status } = await api.deleteFileHandle(row.id)
        if (status == '200') {
          this.$message({
            message: data.message,
            type: 'success',
            duration: 2000,
            onClose: () => {
              this.reSearch()// 刷新数据
            }
          })
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
      this.listQuery.page = 1 // 从1开始
      this.getList()
    },
    // 重置
    reset() {
      this.filtrateForm.type = '';
      this.filtrateForm.name = '';
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
