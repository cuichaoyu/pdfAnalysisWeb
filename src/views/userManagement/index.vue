<template>
  <div class="app-container">
    <div :class="['filter-container']">

      <!-- 筛选框需要些双份 一种是没有展开状态下的  只有主要的几个筛选框，另一种是全部的筛选框都展示 也就是展开状态下的 -->
      <!-- 没有展开状态下的筛选框 -->
      <el-form ref="filtrateForm" :inline="true" :model="filtrateForm">
        <el-form-item label="用户名">
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
          <el-table-column type="index"header-align="center" align="center" label="序号" width="50"/>
          <el-table-column prop="id" header-align="center" align="center" label="ID" width="150"/>
          <el-table-column prop="name" header-align="center" align="center" label="用户名" width="150"/>
          <el-table-column prop="remark" header-align="center" align="center" label="备注"/>
          <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间"/>
          <el-table-column header-align="center" align="center" width="250px" label="操作">
            <template slot-scope="scope">
              <el-button type="text" style="color: #409eff" @click="deleteHandle(scope.row)">编辑</el-button>
              <el-button type="text" v-if="scope.row.status == 0" style="color: #67c23a" @click="userEnableOrDisable(scope.row,1)">启用</el-button>
              <el-button type="text" v-if="scope.row.status == 1" style="color: red" @click="userEnableOrDisable(scope.row,0)">禁用</el-button>
              <el-button type="text" style="color: #e6a23c" @click="deleteHandle(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <pagination v-show="totalCount > 0" :total="totalCount" :page.sync="listQuery.currPage" :limit.sync="listQuery.pageSize"
                @pagination="getList"
    />

    <!-- 新增展示-->
    <add-user v-if="addVisible" ref="addShow" @getList="getList"/>
  </div>
</template>

<script>
import api from '@/api/userManagement' // 请求数据
import Pagination from '@/components/Pagination' // secondary package based on el-pagination 分页组件
import AddUser from './add-user' // 新增弹框

export default {
  name: 'userManagement',
  components: { Pagination, AddUser },
  data() {
    return {
      // 筛选框的 form 表单
      filtrateForm: {
        name: ''
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
      addVisible: false // 弹框展示隐藏
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
        'name': this.filtrateForm.name
      }, this.listQuery)
      // 请求
      const { data, code } = await api.getList(params);
      if (code == '200') {
        this.tableList = data.list
        this.totalCount = data.totalCount
        this.dataListLoading = false
        this.$refs.table.bodyWrapper.scrollTop = 0 // 滚动条 回到顶部
      }

    },
    //导出文件
    exportFile(){
      this.$message.success("开发中...")
      return ;
      let url = process.env.VUE_APP_BASE_API  + '' ;
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
    // 启用禁用
    userEnableOrDisable(row,type){
      this.$confirm('确定要' +  type ===1 ? '启用' : '禁用' + '该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { message, code } = await api.userEnableOrDisable(row.id)
        if (code == '200') {
          this.$message.success(message);
          this.reSearch()// 刷新数据
        }
      })
    },
    //删除
    deleteHandle(row){
      this.$confirm('确定要删除该用户吗?', '提示', {
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
        this.$refs.addShow.init()
      })
    },
    // 查询
    reSearch() {
      this.listQuery.currPage = 1 // 从1开始
      this.getList()
    },
    // 重置
    reset() {
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
