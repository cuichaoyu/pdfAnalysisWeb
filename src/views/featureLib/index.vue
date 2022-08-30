<template>
  <div class="app-container">
    <div :class="['filter-container']">

      <!-- 筛选框需要些双份 一种是没有展开状态下的  只有主要的几个筛选框，另一种是全部的筛选框都展示 也就是展开状态下的 -->
      <!-- 没有展开状态下的筛选框 -->
      <el-form ref="filtrateForm" :inline="true" :model="filtrateForm">
        <el-form-item label="效应名称">
          <el-select v-model="filtrateForm.effectType" style="width: 160px" placeholder="请选择">
            <el-option label="全部" value=""/>
            <el-option
                v-for="item in effectTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="特征值">
          <el-select v-model="filtrateForm.value" style="width: 160px" placeholder="请选择">
            <el-option label="全部" value=""/>
            <el-option
                v-for="item in featureValueList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="解析组合名称">
          <el-input
              v-model.trim="filtrateForm.name"
              placeholder=""
              style="width: 200px"
              clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reSearch()">查询</el-button>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="filter-item"  @click="handleCreate()">新增</el-button>
          <el-button type="primary" class="filter-item"  @click="importFile()">导入</el-button>
          <el-button type="primary" class="filter-item"  @click="exportFile()">导出</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div>
      <el-dialog
          title="导入文件"
          :visible.sync="importDialog.dialogVisible"
          width="30%"
          :destroy-on-close='true'
          :show-close="false"
          >
        <el-upload
            ref="pdfUploadRef"
            class="upload-demo"
            :action="uploadActionUrl()"
            accept=".pdf"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
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
          <el-table-column type="index" header-align="center" align="center" label="序列" width="50"/>
          <el-table-column prop="name" header-align="center" align="center" label="特征组合名称" width="400"/>
          <el-table-column prop="effectType" header-align="center" align="center" label="效应名称" width="150"/>
          <el-table-column prop="effectKeys" header-align="center" align="center" label="效应关键字"/>
          <el-table-column prop="value" header-align="center" align="center" label="特征值"/>
          <el-table-column prop="effectUnit" header-align="center" align="center" label="效应值单位"/>
          <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间"/>
          <el-table-column header-align="center" align="center" width="100" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <pagination v-show="totalCount > 0" :total="totalCount" :page.sync="listQuery.currPage" :limit.sync="listQuery.pageSize"
                @pagination="getList"
    />

    <!-- 详情展示-->
    <add-feature v-if="addVisible" ref="addShow" @getList="getList"/>
  </div>
</template>

<script>
import api from '@/api/featureLib' // 请求数据
import Pagination from '@/components/Pagination' // secondary package based on el-pagination 分页组件
import AddFeature from './add-feature' // 新增弹框
import { effectTypeList,featureValueList } from '@/utils/dictionaries'
export default {
  name: 'featureLib',
  components: { Pagination, AddFeature },
  data() {
    return {
      // 筛选框的 form 表单
      filtrateForm: {
        effectType: '',
        name: '',
        value: ''
      },
      featureValueList, // 效应名称
      effectTypeList, //  特征值
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
        dialogVisible:false,
      },
      addVisible: false // 新增弹框展示隐藏
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
        'effectType': this.filtrateForm.effectType,
        'name': this.filtrateForm.name,
        'value': this.filtrateForm.value,
      }, this.listQuery)
      // 请求
      const { code, data } = await api.getList(params) ;
      if (code == '200') {
        this.tableList = data.list
        this.totalCount = data.totalCount
        this.dataListLoading = false
        this.$refs.table.bodyWrapper.scrollTop = 0 // 滚动条 回到顶部
      }

    },
    // 导入文件
    importFile(){
      this.importDialog.dialogVisible = true ;
    },
    // 导入文件URL
    uploadActionUrl(){
      return process.env.VUE_APP_BASE_API + 'api/upload' ;
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      this.$message.success('上传成功') ;
      this.importDialog.dialogVisible = false ;
    },
    // 上传错误
    handleAvatarError(err, file) {
      this.$message.error(file.name + '上传失败')
    },
    //导出文件
    exportFile(){
      this.$message.success('开发中....')
      return;
      let url = process.env.VUE_APP_BASE_API  + `` ;
      const params = {
        effectType: this.filtrateForm.effectType,
        name: this.filtrateForm.name,
        value: this.filtrateForm.value,
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
      this.$confirm('确定要删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 提交删除
        const { code, message } = await api.deleteHandle(row.id)
        if (code == '200') {
          this.$message.success(message);
          this.reSearch()// 刷新数据
        }
      })
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val ;
    },

    // 新增弹框
    handleCreate() {
      this.addVisible = true ;
      this.$nextTick(() => {
        this.$refs.addShow.init() ;
      })
    },
    // 查询
    reSearch() {
      this.listQuery.currPage = 1 // 从1开始
      this.getList()
    },
    // 重置
    reset() {
      this.filtrateForm.effectType = '';
      this.filtrateForm.name = '';
      this.filtrateForm.value = '';
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
