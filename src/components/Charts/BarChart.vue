<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 1000

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
    title:{
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
    },
    stack: {
      type: Boolean,
      default: () => {
        return true
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
    },
    xAxisData(val){
      this.$nextTick(() => {
        this.setOptions()
      })
    }
  },
  created() {
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
      const {title, legendData, seriesData, xAxisData, stack } = this

      // 组装数据
      const data = []
      seriesData.forEach((el, index) => {
        data.push({
          name: el.name,
          type: 'bar',
          stack: stack ? 'stack' : index, // stack 值相同的类目会上下堆叠
          barWidth: el.barWidth || '60%',
          data: el.data,
          animationDuration
        })
      })
      this.chart.setOption({
        title: {
          text: title ,
          textStyle: {
            color :'black'
          }
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor:'#7794b4', // 提示框背景色
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        color:['#72DDB3', '#739FFA'],
        grid: {
          top: 50,
          left: '2%',
          right: '2%',
          bottom: '5%',
          containLabel: true
        },
        legend: {
          left: 'right',
          textStyle: {
            color: '#90979c'
          },
          data: legendData,

        },
        xAxis: [{
          type: 'category',
          data: xAxisData,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel:{
            interval : 0 ,
            rotate: xAxisData.length > 10 ? 15 : 0, // 旋转多少度,当类目多的放不下的话,可以旋转调整
          },
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisTick: {
            show: false
          }
        }],
        series: data
      })
    }
  }
}
</script>
