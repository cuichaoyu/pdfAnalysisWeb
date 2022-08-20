<template>
  <div style="height:100%;width:100% "></div>
</template>

<script>
// import echarts from 'echarts'
// 按需引入 需要引入主题
import echarts from 'echarts/lib/echarts'
import 'echarts/theme/macarons.js'
import resize from './mixins/resize'
import dateUtil from '@/utils/date'


export default {
  mixins: [resize],
  props: {
    title: {
      type: String,
      default: ''
    },
    subtext: {
      type: String,
      default: ''
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
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      chart: null,
      color: []

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
    },
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
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions()
    },
    setOptions() {
      const { title,subtext, legendData, xAxisData } = this
      let data = [{
        name: '',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        data: [],
        animationDuration: 1500
      }, {
        name: '',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        data: [],
        animationDuration: 1500
      }, {
        name: '',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        data: [],
        animationDuration: 1500
      }]

      this.seriesData.forEach((el, index) => {
        data[index].name = el.name
        data[index].data = el.data
      })

      data = data.slice(0, this.seriesData.length)
      this.chart.setOption({
        title: [{
          text: title,
          textStyle: {
            color :'#000000'
          }
        },
          {
          text: subtext,
          right: 70,
          textStyle:{
            color:'#000000',
            fontSize:'14',
          }
        }],
        color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622'],
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
          left: 'center',
          // right: '4%',
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
          type: 'category',
          boundaryGap: false,
          offset:5,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          data: xAxisData
        }],
        yAxis: [{
          type: 'value',
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
              color: '#e2e7e7'  // Y轴网格线颜色
            }
          }
        }],
        series: data
      })
    }
  }
}
</script>
