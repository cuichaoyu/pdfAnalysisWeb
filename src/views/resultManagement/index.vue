<template>
  <div class="app-container">
    <div :class="['filter-container']">

      <!-- 筛选框需要些双份 一种是没有展开状态下的  只有主要的几个筛选框，另一种是全部的筛选框都展示 也就是展开状态下的 -->
      <!-- 没有展开状态下的筛选框 -->
      <el-form ref="filtrateForm" :inline="true" :model="filtrateForm">
        <el-form-item label="器件目录">
          <el-select v-model="filtrateForm.type" style="width: 160px" placeholder="请选择" @change="typeChangeEvent()">
            <el-option label="信号处理类器件" value=""/>
            <el-option label="非易失类存储器" value="0"/>
            <el-option label="易失类存储器" value="1"/>
            <el-option label="混合电路" value="2"/>
            <el-option label="线性器件" value="3"/>
            <el-option label="逻辑类器件" value="4"/>
            <el-option label="电源组件" value="5"/>
            <el-option label="光电器件" value="6"/>
            <el-option label="晶体管" value="7"/>
            <el-option label="其他" value="8"/>
          </el-select>
        </el-form-item>
        <el-form-item label="器件名称">
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
          <el-button type="primary" class="filter-item"  @click="uploadBatchHandle()">批量上传</el-button>
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
          <el-table-column prop="id" header-align="center" align="center" label="序列" width="50"/>
          <el-table-column prop="name" header-align="center" align="center" label="器件名称" width="500"/>
          <el-table-column prop="type" header-align="center" align="center" label="型号" width="150"/>
          <el-table-column prop="address" header-align="center" align="center" label="制造商"/>
          <el-table-column prop="address" header-align="center" align="center" label="更新时间"/>
          <el-table-column prop="address" header-align="center" align="center" label="总剂量效应">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.address" @click="fileListShow(scope.row)">文件列表</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="address" header-align="center" align="center" label="单粒子效应"/>
          <el-table-column prop="address" header-align="center" align="center" label="位移损伤"/>
          <el-table-column header-align="center" align="center" width="200" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="uploadHandle(scope.row)">上传</el-button>
              <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
    </div>

    <pagination v-show="totalPage > 0" :total="totalPage" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"
    />

    <!-- 详情展示-->
    <file-list-show v-if="fileShowVisible" ref="fileShow"/>
  </div>
</template>

<script>
import api from '@/api/resultManagement' // 请求数据
import Pagination from '@/components/Pagination' // secondary package based on el-pagination 分页组件
import fileListShow from './file-list-show' // 详情弹框

export default {
  name: 'resultManagement',
  components: { Pagination, fileListShow },
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
      fileShowVisible: false // 详情 弹框展示隐藏
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取表格数据
    async getList() {
      this.dataListLoading = true
      // 筛选+分页
      const params = Object.assign({
        'type': this.filtrateForm.type,
        'status': this.filtrateForm.name
      }, this.listQuery)
      // 请求
      const { data, status } = await api.getStoreList(params).catch(e => {
      })
      if (String(status).substr(0, 2) == 20) {
        this.tableList = data.items
        this.totalPage = data.count
      }
      this.dataListLoading = false
      this.$refs.table.bodyWrapper.scrollTop = 0 // 滚动条 回到顶部

    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    //上传
    uploadHandle(row){

    },
    // 批量操作
    uploadBatchHandle() {
      let ids = [] ;
      this.dataListSelections.forEach(item => {
        ids.push(item.id);
      })
      this.$prompt('请输入暂停天数', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\d+$/,
        inputErrorMessage: '天数格式不正确'
      }).then(async({ value }) => {
        let params = {
          value: value,
          store_id: this.filtrateForm.store_id ,
          ids: ids.join()
        }
        /* const { data, status } = await api.pauseBatchHandle(params)
        if (String(status).substr(0, 2) == 20) {
          this.$message.success(data.message)
        } */
        this.getList();
      }).catch(() => {})
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
    // 文件列表展示
    fileListShow(row) {
      this.fileShowVisible = true
      this.$nextTick(() => {
        this.$refs.fileShow.init(Object.assign({}, row))
      })
    },
    // 查询
    reSearch() {
      this.listQuery.page = 1 // 从1开始
      this.getList()
    },
    // 重置
    reset() {
      this.listQuery.page = 1 // 从1开始
      this.getList()
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
