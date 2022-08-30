<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->

    <h3> 欢迎回来!</h3>
    <span>{{ now }}</span>
  </div>
</template>

<script>

import util from '@/utils/utils'
export default {
  name: 'DashboardAdmin',
  components: {
  },
  data() {
    return {
      now:'',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 )
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  mounted() {
    this.now = util.formatChinaDate() ;
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  height: 100%;
  // padding: 15px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .lay-centre {
    height: calc(50% - 69px);
    margin-top: 10px;
    margin-bottom: 15px;
  }
  .lay-buttom {
    height: calc(50% - 69px);
  }

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    height: 100%;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}



.back_div {
  height : 30px ;
  background-color: #f0f2f5;
}
.back_div1 {
  height : 20px ;
  background-color: #f0f2f5;
}
</style>
