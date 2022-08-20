<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view :key="key" />
            </keep-alive>
        </transition>
    </section>
</template>

<script>
export default {
    name: 'AppMain',
    computed: {
        cachedViews () {
            return this.$store.state.tagsView.cachedViews
        },
        key () {
            return this.$route.path
        }
    }
}
</script>

<style lang="scss" scoped>
.app-main {
    /* 50= navbar  50  */
    // min-height: calc(100vh - 50px);
    height: calc(100vh - 84px);
    width: 100%;
    position: relative;
    // overflow: hidden;
    padding: 15px;
    // background: #f0f2f5;
    background: #f5f5f5;
}

.fixed-header + .app-main {
    padding-top: 65px;
    height: 100vh;
}

.hasTagsView {
    .app-main {
        /*不固定表头的情况 相对定位需要减去头部 距离 84 = navbar + tags-view = 50 + 34 */
        min-height: calc(100vh - 84px);
    }

    // 固定表头的情况需要减去 表头  和距离表头的距离  84 + 15
    .fixed-header + .app-main {
        /*padding-top: 99px;*/
    }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}
</style>
