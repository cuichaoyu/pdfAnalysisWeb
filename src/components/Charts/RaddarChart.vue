<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>

import echarts from 'echarts/lib/echarts'
import 'echarts/theme/macarons.js'
import resize from './mixins/resize'

const animationDuration = 3000

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
    legendLeft: {
      type: String,
      default: 'center'
    },
    legendBottom: {
      type: String,
      default: '10px'
    },
    redirIndicator: {
      type: Array,
      default: () => {
        return [
          { name: '销售', max: 10000 },
          { name: '管理', max: 20000 },
          { name: '信息技术', max: 20000 },
          { name: '用户支持', max: 20000 },
          { name: '开发', max: 20000 },
          { name: '促销', max: 20000 }
        ]
      }
    },
    legendData: {
      type: Array,
      default: () => {
        return ['预算', '支出', '实际']
      }
    },
    seriesData: {
      type: Array,
      default: () => {
        return [
          {
            value: [5000, 7000, 12000, 11000, 15000, 14000],
            name: '预算'
          },
          {
            value: [4000, 9000, 15000, 15000, 13000, 11000],
            name: '支出'
          },
          {
            value: [5500, 11000, 12000, 15000, 12000, 12000],
            name: '实际'
          }
        ]
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
    seriesData(val) {
      this.$nextTick(() => {
        this.setOptions()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
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
      const { legendLeft, legendBottom, redirIndicator, legendData, seriesData } = this
      this.chart.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        radar: {
          radius: '66%',
          center: ['50%', '42%'],
          splitNumber: 8,
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          indicator: redirIndicator
        },
        legend: {
          left: legendLeft,
          bottom: legendBottom,
          data: legendData
        },
        series: [{
          type: 'radar',
          symbolSize: 0,
          areaStyle: {
            normal: {
              shadowBlur: 13,
              shadowColor: 'rgba(0,0,0,.2)',
              shadowOffsetX: 0,
              shadowOffsetY: 10,
              opacity: 1
            }
          },
          data: seriesData,
          animationDuration: animationDuration
        }]
      })
    }
  }
}
</script>
