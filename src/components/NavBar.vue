<template>
  <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="nav-content">
      <view v-if="showBack" class="nav-back" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <text class="nav-title">{{ title }}</text>
      <view class="nav-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
  <!-- 占位 -->
  <view :style="{ height: (statusBarHeight + 44) + 'px' }"></view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  showBack?: boolean
}>(), {
  showBack: false
})

// 获取状态栏高度
const statusBarHeight = ref(20)

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 20
})

function goBack() {
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(11, 16, 38, 0.9);
  backdrop-filter: blur(10px);
}

.nav-content {
  display: flex;
  align-items: center;
  height: 88rpx;
  padding: 0 24rpx;
}

.nav-back {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12rpx;
}

.back-icon {
  font-size: 40rpx;
  color: #FFFFFF;
}

.nav-title {
  flex: 1;
  font-size: 34rpx;
  font-weight: 700;
  color: #FFFFFF;
  text-align: center;
}

.nav-right {
  width: 64rpx;
}
</style>
