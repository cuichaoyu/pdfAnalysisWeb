<template>
  <el-dialog title="文件详情" :close-on-click-modal="false" width="70%" :visible.sync="visible"  custom-class="customDialogStyle">
    <div id="container">
      <!-- 上一页、下一页 -->
      <div class="right-btn" v-if="activeName == 'one'">
        <!-- 输入页码 -->
        <div class="pageNum">
          <input v-model.number="currentPage"
                 type="number"
                 class="inputNumber"
                 @input="inputEvent()"> / {{pageCount}}
        </div>
        <div @click="changePdfPage('first')"
             class="turn">
          首页
        </div>
        <!-- 在按钮不符合条件时禁用 -->
        <div @click="changePdfPage('pre')"
             class="turn-btn"
             :style="currentPage===1?'cursor: not-allowed;':''">
          上一页
        </div>
        <div @click="changePdfPage('next')"
             class="turn-btn"
             :style="currentPage===pageCount?'cursor: not-allowed;':''">
          下一页
        </div>
        <div @click="changePdfPage('last')"
             class="turn">
          尾页
        </div>
      </div>
      <div :class="['filter-container']">
        <el-tabs v-model="activeName" >
          <el-tab-pane label="源文件" name="one">
              <div class="pdfArea">
                <pdf :src="pdf_src"
                     ref="pdf"
                     v-loading="loading" :element-loading-text="remindShow"
                     :page="currentPage"
                     @num-pages="pageCount=$event"
                     @progress="loadedRatio = $event"
                     @page-loaded="currentPage=$event"
                     @loaded="loadPdfHandler"
                     @link-clicked="currentPage = $event"
                     style="display: inline-block;width:100%"
                     id="pdfID"></pdf>
              </div>
          </el-tab-pane>
          <el-tab-pane label="解析文件" name="two" v-if="nowRow.paresed == '1' ">
            <template>
              <div class="app-container">
                <div :class="['filter-container']">
                  <!-- 没有展开状态下的筛选框 -->
                  <el-form ref="filtrateForm" :inline="true" :model="filtrateForm">
                    <el-form-item label="解析情况">
                      <el-select v-model="filtrateForm.type" style="width: 160px" placeholder="请选择">
                        <el-option label="全文" value=""/>
                        <el-option
                            v-for="item in parseTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="reSearch()">查询</el-button>
                    </el-form-item>
                    <el-form-item >
                      <el-button type="primary" class="filter-item"  @click="addOrUpdateShow({},nowRow.id)">添加</el-button>
                      <el-button type="primary" class="filter-item"  @click="sureFileBatch()">批量确认</el-button>
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
                        empty-text="未匹配到关键词"
                    >
                      <el-table-column type="selection" width="55" header-align="center" align="center" />
                      <el-table-column prop="type" header-align="center" align="center" width="80" label="解析范围">
                        <template slot-scope="scope">
                          <el-tag :type="scope.row.type == 0 ? 'info' : scope.row.type == 1 ? '' : 'danger'">
                            {{
                              parseTypeList.find((obj) =>{
                                return  obj.value ==  scope.row.type ;
                              }).label
                            }}
                          </el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column prop="content" header-align="center" align="center" label="文件内容">
                        <template slot-scope="scope">
                              <el-popover placement="right" trigger="click" width="400" v-if="scope.row.type != 0 ">
                                  <img :src="apiurl + '/files/' + scope.row.content" width="100%" />
                                  <img slot="reference" :src="apiurl + '/files/' + scope.row.content"
                                      :alt="scope.row.content"
                                      style="max-height: 70px;max-width: 70px; padding: 5px"
                                  />
                              </el-popover>
                             <template v-else>
                                {{scope.row.content }}
                            </template>
                        </template>
                      </el-table-column>
                      <el-table-column prop="devicesName" header-align="center" align="center" width="150" label="器件名称"/>
                      <el-table-column prop="effectType" header-align="center" align="center" width="150" label="效应名称"/>
                      <el-table-column prop="featureValue" header-align="center" align="center" width="150"label="特征值"/>
                      <el-table-column prop="effectValue" header-align="center" align="center" width="150"label="效应值"/>
                      <el-table-column prop="effectUnit" header-align="center" align="center" width="150"label="效应值单位"/>
                      <el-table-column header-align="center" align="center" width="150" label="操作">
                        <template slot-scope="scope">
                          <el-button type="text" @click="addOrUpdateShow(scope.row)">编辑</el-button>
                          <el-button type="text" @click="deleteHandle(scope.row)">删除</el-button>
                          <el-button type="text" @click="sureFileHandle(scope.row)">确认</el-button>
                        </template>
                      </el-table-column>

                    </el-table>
                  </div>
                </div>
                <pagination v-show="totalCount > 0" :total="totalCount" :page.sync="listQuery.currPage" :limit.sync="listQuery.pageSize"
                            @pagination="getList"/>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <add-or-update-show v-if="addOrUpdateShowVisible" ref="addOrUpdateShow"  @getList="getList"/>
  </el-dialog>
</template>
<script>
import api from '@/api/fileManagement'
import pdf from 'vue-pdf'
import AddOrUpdateShow from '@/views/fileManagement/add-or-update-show'
import {parseTypeList} from '@/utils/dictionaries'
export default {
  components:{
    pdf,AddOrUpdateShow
  },
  data() {
    return {
      visible: false,
      remindText: {
        loading: '加载文件中，文件较大请耐心等待...',
        refresh: '若卡住不动，可刷新页面重新加载...'
      },
      remindShow: '加载文件中，文件较大请耐心等待...',
      intervalID: '',
      // ----- vuepdf -----
      // src静态路径: /static/xxx.pdf
      // src服务器路径: 'http://.../xxx.pdf'
      pdf_src: '',
      apiurl: process.env.VUE_APP_BASE_API +  '/api', // 文件请求地址
      // 当前页数
      currentPage: 0,
      // 总页数
      pageCount: 0,
      // 是否加载进度
      loading: true,
      activeName :'one',
      // 筛选框的 form 表单
      filtrateForm: {
        type: '',
      },
      parseTypeList, // 解析范围
      nowRow:'', // 传递过来的row
      tableKey: 0,
      dataListLoading: true, // 表格加载数据时的 loading
      dataListSelections: [],
      tableList: [], // 表格数据
      totalCount: 0, // 总条数
      listQuery: { // 表格当前页 和 当前页的展示数量
        currPage: 1,
        pageSize: 20
      },
      addOrUpdateShowVisible: false ,// 添加或编辑弹框展示隐藏,
    }
  },
  created() {
    // this.prohibit() ;
  },
  mounted () {
    // 监听滚动条事件
    //this.listenerFunction()  ;
  },
  methods: {
    // 监听滚动条事件
    listenerFunction (e) {
      document.getElementById('container').addEventListener('scroll', true)
    },
    // 页面回到顶部
    toTop () {
      document.getElementById('container').scrollTop = 0
    },
    // 输入页码时校验
    inputEvent () {
      if (this.currentPage > this.pageCount) {
        // 1. 大于max
        this.currentPage = this.pageCount
      } else if (this.currentPage < 1) {
        // 2. 小于min
        this.currentPage = 1
      }
    },
    // 切换页数
    changePdfPage (val) {
      if (val === 'pre' && this.currentPage > 1) {
        // 切换后页面回到顶部
        this.currentPage--
        this.toTop()
      } else if (val === 'next' && this.currentPage < this.pageCount) {
        this.currentPage++
        this.toTop()
      } else if (val === 'first') {
        this.currentPage = 1
        this.toTop()
      } else if (val === 'last' && this.currentPage < this.pageCount) {
        this.currentPage = this.pageCount
        this.toTop()
      }
    },

    // pdf加载时
    loadPdfHandler (e) {
      // 加载的时候先加载第一页
      this.currentPage = 1 ;
      this.loading = false ;
    },
    // 禁用鼠标右击、F12 来禁止打印和打开调试工具
    prohibit () {
      // console.log(document)
      document.oncontextmenu = function () {
        return false
      }
      document.onkeydown = function (e) {
        if (e.ctrlKey && (e.keyCode === 65 || e.keyCode === 67 || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 80 || e.keyCode === 83 || e.keyCode === 85 || e.keyCode === 86 || e.keyCode === 117)) {
          return false
        }
        if (e.keyCode === 18 || e.keyCode === 123) {
          return false
        }
      }
    },
    // 获取表格数据
    async getList() {
      this.dataListLoading = true ;
      // 筛选+分页
      const params = Object.assign({
        'type': this.filtrateForm.type,
        'pdf_id': this.nowRow.id,
      }, this.listQuery)
      // 请求
      const { data, code } = await api.getParseFileList(params);
      this.tableList = data.list ;
      this.totalCount = data.totalCount ;
      this.dataListLoading = false
      this.$refs.table.bodyWrapper.scrollTop = 0 // 滚动条 回到顶部

    },
    // 初始化
    init(row) {
      this.visible = true ; // 显示
      this.$nextTick(() => {
        this.activeName = "one" ;
        this.nowRow = row ;
        this.pdf_src = this.apiurl + '/pdfs/' + row.filePath ;
        this.getList();
      })
      },
    // 重置
    reset() {
      this.filtrateForm.confirmed = '0';
    },
    // 确认文件
    sureFileHandle(row){
      this.$confirm('要确认这条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code, message } = await api.sureParseHandle(row.id)
        if (code == 200){
          this.$message({
            message: message,
            type: 'success',
          })
          this.reSearch()// 刷新数据
        }
      })
    },
    // 批量确认文件
    sureFileBatch(){
      if(this.dataListSelections.length == 0){
        this.$message.error('请选择数据!')
        return ;
      }
      let ids = [] ;
      this.dataListSelections.forEach(item => {
        ids.push(item.id);
      })
      this.$confirm('要确认这'+ ids.length +'条数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code, message } = await api.sureParseBatchHandle({ids : ids.join()})
        if (code == 200){
          this.$message({
            message: message,
            type: 'success',
          })
          this.reSearch()// 刷新数据
        }
      })
    },
    //导出文件
    exportFile(){
       this.$message.success('开发中....') ;
      return ;
      let url = process.env.VUE_APP_BASE_API  +  '' ;
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
      this.$confirm('确定要删除该数据吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 提交删除
        const { code, message } = await api.deleteParseHandle(row.id);
        if (code == 200){
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

    // 添加或编辑解析展示
    addOrUpdateShow(row,fileId) {
      this.addOrUpdateShowVisible = true ;
      this.$nextTick(() => {
        this.$refs.addOrUpdateShow.init(Object.assign({}, row),fileId)
      })
    },
    // 查询
    reSearch() {
      this.listQuery.currPage = 1 // 从1开始
      this.getList()
    },






    }

}
</script>

<style scoped>
#container {
  overflow: auto;
  height: 800px;
  font-family: PingFang SC;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  position: relative;
}

/* 右侧功能按钮区 */
.right-btn {
  position: fixed;
  right: 5%;
  bottom: 15%;
  width: 120px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 99;
}

.pdfArea {
  width: 100%;
}

/* ------------------- 输入页码 ------------------- */
.pageNum {
  margin: 10px 0;
  font-size: 18px;
  color: white;
}
/*在谷歌下移除input[number]的上下箭头*/
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
/*在firefox下移除input[number]的上下箭头*/
input[type='number'] {
  -moz-appearance: textfield;
}

.inputNumber {
  border-radius: 8px;
  border: 1px solid #999999;
  height: 35px;
  font-size: 18px;
  width: 60px;
  text-align: center;
}
.inputNumber:focus {
  border: 1px solid #00aeff;
  background-color: rgba(18, 163, 230, 0.096);
  outline: none;
  transition: 0.2s;
}

/* ------------------- 切换页码 ------------------- */
.turn {
  background-color: #888888;
  opacity: 0.7;
  color: #ffffff;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
}

.turn-btn {
  background-color: #000000;
  opacity: 0.6;
  color: #ffffff;
  height: 70px;
  width: 70px;
  border-radius: 50%;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.turn-btn:hover,
.turn:hover {
  transition: 0.3s;
  opacity: 1;
  cursor: pointer;
}

/* ------------------- 进度条 ------------------- */
.progress {
  position: absolute;
  right: 40%;
  top: 50%;
  text-align: center;
}
.progress > span {
  color: #199edb;
  font-size: 14px;
}

</style>


<style>
.customDialogStyle {
  margin-top: 5vh !important  ;
}
/* ------------------- 弹框 ------------------- */
.customDialogStyle .el-dialog__body {
  padding-top: 0px ;

}
</style>

