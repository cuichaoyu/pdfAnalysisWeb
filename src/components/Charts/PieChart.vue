<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>


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
    title: {
      type: String,
      default: ''
    },
    legendData: {
      type: Array,
      default: () => {
        return []
      }
    },
    seriesData: {
      type: Object,
      default: () => {
        return {
          name: '',
          data: []
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
      this.chart = echarts.init(this.$el, 'macarons') // 初始化
      this.setOptions()
    },
    // 配置属性
    setOptions() {
      const { title, legendData, seriesData } = this
      this.chart.setOption({
        title: {
          text: title,
          textStyle: {
            color :'black'
          }
        },
        tooltip: { // 提示框浮层内容格式器
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical', //  horizontal :水平 ， vertical ：垂直
          left: 'left',
          bottom: 0,
          data: legendData,
          // 使用回调函数
          formatter: function (name) {
            // 获取legend显示内容
            let data = seriesData.data;
            let total = 0;
            let tarValue = 0;
            for (let i = 0, l = data.length; i < l; i++) {
              total += data[i].value;
              if (data[i].name == name) {
                tarValue = data[i].value;
              }
            }
            let p = (tarValue / total * 100).toFixed(1);
            tarValue = String(tarValue);
            /**
             * 字符串对齐,避免出现下面这种情况
             * 未激活     47    22.8%
             * 使用中     124    60.2%
             * 暂停中     35    17.0%
             */
            return `${name}        ${tarValue.padEnd(8 - tarValue.length)}         ${p} %`;
          }
        },
        series: [
          {
            name: seriesData.name,
            type: 'pie',
            radius: ['30%', '50%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside' // 展示区域， inside（圆环上），center(饼中心)，outside（外部）
            },
            emphasis: {
              label: {
                show: true,
              }
            },
            labelLine: {
              show: true
            },
            data: seriesData.data,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
