<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) { // element 包含的图表 使用 i 标签 加 class名
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else { // 其他的使用 svg 图表  使用组件展示
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }else{ // 图标占位
      vnodes.push(<span slot='title'> &nbsp;&nbsp;&nbsp;&nbsp; </span>)
    }

    if (title) {
      vnodes.push(<span class="itemCls" slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
    color: currentColor;
    width: 1em;
    height: 1em;
}
.itemCls {
  font-size: 16px;
}
</style>
