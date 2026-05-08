<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('🚀 星际探险家启动！')
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
/* 全局重置 */
view, text, image, scroll-view {
  box-sizing: border-box;
}

/* 禁止长按弹出菜单 */
view, text {
  -webkit-user-select: none;
  user-select: none;
}

/* 滚动条隐藏 */
::-webkit-scrollbar {
  display: none;
}
</style>
