<template>
  <el-dialog title="详情" :close-on-click-modal="false" width="70%" :visible.sync="visible" custom-class="customDialogStyle">
      <el-form ref="filtrateForm" :inline="true" :model="filtrateForm">
        <el-form-item label="文件名称">
          <el-select v-model="filtrateForm.id"  style="width:160px;" placeholder="文件名称">
            <el-option label="全部" value="" />
            <el-option
                v-for="(item, index) in fileList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="reSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
          ref="table"
          :key="tableKey"
          v-loading="dataListLoading"
          height="650"
          :data="tableList"
          border
          fit
          :span-method="objectSpanMethod"
          highlight-current-row
          style="width: 100%;"
      >
        <el-table-column prop="store_name" header-align="center" align="center" label="文件名称" />
        <el-table-column prop="operate" header-align="center" align="center" label="解析范围"/>
        <el-table-column prop="store_name" header-align="center" align="center" label="文件内容"/>
        <el-table-column prop="operate" header-align="center" align="center" label="效应名称" />
        <el-table-column prop="value" header-align="center" align="center" label="特征值" width="100"/>
        <el-table-column prop="remark" header-align="center" align="center" label="效应值" />
        <el-table-column prop="info" header-align="center" align="center" label="效应值单位" width="300" />
      </el-table>

      <pagination v-show="totalPage > 0" :total="totalPage" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="init" />
  </el-dialog>
</template>
<script>
import api from '@/api/resultManagement'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      visible: false,
      filtrateForm:{
        id : '',
      },
      fileList:[
        {
          id : 1,
          name :"文件1",
        },
        {
          id : 2,
          name :"文件2",
        }
      ],
      tableKey: 0,
      rowspan:[],//返回的是相对应的行合并行数
      dataListLoading: true, // 表格加载数据时的 loading
      tableList: [], // 表格数据
      totalPage: 0, // 总条数
      listQuery: { // 表格当前页 和 当前页的展示数量
        page: 1,
        limit: 20
      },

    }
  },
  created() {
  },
  methods: {
    // 初始化
    async init(row) {
      this.visible = true;
      this.dataListLoading = true;
      // 筛选+分页
      const params = Object.assign({
        'status': this.filtrateForm.id,
      }, this.listQuery);
      const { data, status } = await api.getVipCardOperatesList(params).catch(e => {
      })
      if (String(status).substr(0, 2) == 20) {
        this.tableList = data.items;
        this.totalPage = data.count;
      }
      this.dataListLoading = false;
      this.$refs.table.bodyWrapper.scrollTop = 0; // 滚动条 回到顶部

      this.getSpanArr();
    },
    // 查询
    reSearch() {

    },

    //单元格合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }){
      if ( columnIndex === 0||columnIndex === 1 || columnIndex === 2|| columnIndex === 3) {
        const _row = this.rowspan[rowIndex];//合并几行
        const _col = _row > 0 ? 1 : 0;//该列显示还是不显示
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    getSpanArr() {
      for (let i = 0; i < this.tableList.length; i++) {
        if (i === 0) {
          this.rowspan.push(1);if( i === 0) //第一行，直接先给数组push进一个1，表示自己先占一行
          this.tableList[i].group =i;//group是合并单元格后的序号
          this.pos = 0 //this.pos是数组元素的位置（此时是从数组元素的第一个开始，所以this.pos为0）
        } else {
          // 判断当前元素与上一个元素是否相同
          if ((this.tableList[i].store_name === this.tableList[i - 1].store_name
              && this.tableList[i].operate === this.tableList[i - 1].operate
              && this.tableList[i].store_name === this.tableList[i - 1].store_name
              && this.tableList[i].operate === this.tableList[i - 1].operate
             )

          ) {//相同
            this.rowspan[this.pos] += 1;//如果第二行与第一行相等的话，this.pos就+1，当有n行第一行相同，this.pos就为n，表示向下合并n行
            this.rowspan.push(0);//第二行自己就this.spanArr.push(0)，表示第二行“消失”，因为第一行和第二行合并了
            this.tableList[i].group = this.tableList[i-1].group;//序号等于上一行的序号
          } else {//不相同
            this.rowspan.push(1);//不相同，独占一行
            this.pos = i;  //this.pos = i意思就是把指针拿到i这行来，表示设置数组this.spanArr[this.pos ]的元素值，然后定义从此行开始向下合并几行
            this.tableList[i].group = this.tableList[i-1].group+1;//序号加1
          }
        }
      }
    },


  }
}
</script>
<style>
.customDialogStyle{
  margin-top: 5vh !important;
}
</style>
