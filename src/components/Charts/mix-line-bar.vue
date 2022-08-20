<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// import echarts from 'echarts' //全部引入
// const echarts = require('echarts/lib/echarts')
// require('echarts/theme/macarons') // echarts 主题
// require('echarts/theme/infographic') // echarts 主题

// echarts  按需引入
import echarts from 'echarts/lib/echarts'
import 'echarts/theme/macarons.js'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },

    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    legendData: {
      type: Array,
      default: () => {
        return []
      }
    },
    xAxisData: {
      type: Array,
      default: () => {
        return []
      }
    },
    seriesData: {
      type: Object,
      default: () => {
        return {
          linData: {
            name: '',
            data: []
          },
          barData: {
            name: '',
            data: []
          }
        }
      }
    }

  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    // seriesData 是数据 监听数据变化的时候 触发setOptions  修改数据
    seriesData: {
      handler(options) {
        this.$nextTick(() => {
          this.setOptions()
        })
      },
      deep: true
    }
    // "xAxisData": function (options) {
    //     // this.setOptions()
    //     console.log(">>>>>>>", this.xAxisData)
    //     setTimeout(() => {
    //         this.setOptions()
    //     }, 3000)

    // },
    // xAxisData: {
    //     handler (options) {
    //         this.$nextTick(() => {
    //             this.setOptions()
    //         })
    //     },
    //     deep: true
    // },
  },
  mounted() {
    this.initChart()
  },
  // beforeDestroy () {
  //     if (!this.chart) {
  //         return
  //     }
  //     this.chart.dispose()
  //     this.chart = null
  // },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    },
    setOptions() {
      const { legendData, xAxisData, seriesData } = this

      this.chart.setOption({
        // backgroundColor: '#344b58',
        title: {
          // text: '---',
          x: '20',
          top: '20',
          textStyle: {
            // color: '#fff',
            fontSize: '22'
          },
          subtextStyle: {
            // color: '#90979c',
            fontSize: '16'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          borderWidth: 0,
          // top: 150,
          // bottom: 95,
          textStyle: {
            color: '#fff'
          }
        },
        legend: {
          // x: '5%',
          top: '5%',
          left: 'right',
          textStyle: {
            color: '#90979c'
          },
          data: legendData
        },
        // calculable: true,
        xAxis: [{
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitArea: {
            show: false
          },
          axisLabel: {
            interval: 0

          },
          data: xAxisData
        }],
        yAxis: [{
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#90979c'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0
          },
          splitArea: {
            show: false
          }
        }
        ],
        // dataZoom: [{ //缩放的开关
        //     show: true,
        //     height: 30,
        //     xAxisIndex: [
        //         0
        //     ],
        //     bottom: 30,
        //     start: 10,
        //     end: 80,
        //     handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        //     handleSize: '110%',
        //     handleStyle: {
        //         color: '#d3dee5'

        //     },
        //     textStyle: {
        //         color: '#fff'
        //     },
        //     borderColor: '#90979c'

        // }, {
        //     type: 'inside',
        //     show: true,
        //     height: 15,
        //     start: 1,
        //     end: 35
        // }],
        series: [{
          name: seriesData.barData.name,
          type: 'bar',
          // stack: 'total',
          barMaxWidth: 35,
          barGap: '10%',
          itemStyle: {
            // color: 'rgba(255,144,128,1)',
            label: {
              show: true,
              textStyle: {
                color: '#fff'
              },
              position: 'insideTop',
              formatter(p) {
                return p.value > 0 ? p.value : ''
              }
            }
          },
          data: seriesData.barData.data
        },

        // {
        //     name: 'male',
        //     type: 'bar',
        //     stack: 'total',
        //     itemStyle: {
        //             // color: 'rgba(0,191,183,1)',
        //             barBorderRadius: 0,
        //             label: {
        //                 show: true,
        //                 position: 'top',
        //                 formatter (p) {
        //                     return p.value > 0 ? p.value : ''
        //                 }
        //             }
        //     },
        //     data: [
        //         327,
        //         1776,
        //         507,
        //         1200,
        //         800,
        //         482,
        //         204,
        //         1390,
        //         1001,
        //         951,
        //         381,
        //         220
        //     ]
        // }
        {
          name: seriesData.linData.name,
          type: 'line',
          // stack: 'total',  //数据堆叠 如果 series 中  有两个数据  都设置  stack: 'total' 那这两个就不会堆叠
          symbolSize: 10,
          symbol: 'circle',
          itemStyle: {
            // color: 'rgba(252,230,48,1)',
            barBorderRadius: 0,
            label: {
              show: true,
              position: 'top',
              formatter(p) {
                return p.value > 0 ? p.value : ''
              }
            }
          },
          data: seriesData.linData.data
        }
        ]
      })
    }
  }
}
</script>
