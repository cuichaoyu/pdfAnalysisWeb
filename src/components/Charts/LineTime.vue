<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
// import echarts from 'echarts'
// 按需引入 需要引入主题
const echarts = require('echarts/lib/echarts')
require('echarts/theme/macarons') // echarts 主题
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
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
    title: {
      type: String,
      default: ''
    },
    legendLeft: {
      type: String,
      default: 'right'
    },
    legendBottom: {
      type: String,
      default: '10px'
    },
    legendData: {
      type: Array,
      default: () => {
        return ['CMCC', 'CTCC', 'CUCC']
      }
    },
    seriesData: {
      type: Array,
      default: () => {
        return [{
          name: '-- --',
          data: [[1522306819000, 120], [1522306919000, 110], [1522307019000, 125], [1522307119000, 145], [1522307120000, 122], [1522307230000, 165], [1522302230000, 122], [1522307430000, 220]]
        }]
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
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id), 'macarons')
      this.setOptions()
    },
    setOptions() {
      const { title, legendLeft, legendBottom, legendData, xAxisData } = this

      let data = [{
        name: '--',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(90, 177, 239, 0.7)'
            }, {
              offset: 0.8,
              color: 'rgba(90, 177, 239, 0)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: 'rgb(90, 177, 239)',
            borderColor: 'rgba(90, 177, 239,0.27)',
            borderWidth: 12

          }
        },
        data: []
      }, {
        name: '--',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(0, 136, 212, 0.3)'
            }, {
              offset: 0.8,
              color: 'rgba(0, 136, 212, 0)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: 'rgb(0,136,212)',
            borderColor: 'rgba(0,136,212,0.2)',
            borderWidth: 12

          }
        },
        data: []
      }, {
        name: '--',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(219, 50, 51, 0.3)'
            }, {
              offset: 0.8,
              color: 'rgba(219, 50, 51, 0)'
            }], false),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: 'rgb(219,50,51)',
            borderColor: 'rgba(219,50,51,0.2)',
            borderWidth: 12
          }
        },
        data: []
      }]

      this.seriesData.forEach((el, index) => {
        data[index].name = el.name
        data[index].data = el.data
      })

      data = data.slice(0, this.seriesData.length)

      this.chart.setOption({
        // backgroundColor: '#394056',
        title: {
          top: 20,
          text: title
          // textStyle: {
          //     fontWeight: 'normal',
          //     fontSize: 16
          //     // color: '#F1F1F3'
          // },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          left: legendLeft,
          // right: '4%',
          bottom: legendBottom,
          data: legendData
          // textStyle: {
          // fontSize: 12
          // color: '#F1F1F3'
          // }
        },
        grid: {
          // top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'time',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: xAxisData
        }],
        yAxis: [{
          type: 'value',
          name: '(%)',
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: data
      })
    }
  }
}
</script>
