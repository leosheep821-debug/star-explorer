<template>
  <view class="planet-card" :class="{ 'is-unlocked': unlocked }" @click="handleClick">
    <!-- 行星图标 -->
    <view class="planet-icon-wrap" :style="{ background: `radial-gradient(circle at 35% 35%, ${lightColor}, ${color})` }">
      <text class="planet-icon">{{ icon }}</text>
      <!-- 光环（土星专用） -->
      <view v-if="id === 'saturn'" class="saturn-ring"></view>
    </view>
    <!-- 行星信息 -->
    <view class="planet-info">
      <text class="planet-name">{{ name }}</text>
      <text class="planet-name-en">{{ nameEn }}</text>
      <view v-if="unlocked" class="collected-badge">
        <text>✅ 已收集</text>
      </view>
    </view>
    <!-- 锁定遮罩 -->
    <view v-if="!unlocked" class="lock-overlay">
      <text class="lock-icon">🔒</text>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  name: string
  nameEn: string
  color: string
  icon: string
  unlocked: boolean
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()

// 计算亮色（用于渐变高光）
const lightColor = computed(() => {
  return props.color + 'CC'
})

function handleClick() {
  emit('click')
}
</script>

<style lang="scss" scoped>
.planet-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 16rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  border: 2rpx solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.12);
  }

  &.is-unlocked {
    border-color: rgba(255, 215, 0, 0.3);
    background: rgba(255, 215, 0, 0.06);
  }
}

.planet-icon-wrap {
  position: relative;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
  box-shadow: 0 0 20rpx rgba(255, 255, 255, 0.1);
}

.planet-icon {
  font-size: 48rpx;
}

.saturn-ring {
  position: absolute;
  width: 140rpx;
  height: 30rpx;
  border: 4rpx solid rgba(240, 214, 138, 0.6);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(65deg);
}

.planet-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.planet-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.planet-name-en {
  font-size: 20rpx;
  color: #6B7DB3;
  margin-top: 4rpx;
}

.collected-badge {
  margin-top: 8rpx;
  padding: 4rpx 12rpx;
  background: rgba(105, 240, 174, 0.15);
  border-radius: $radius-round;
  font-size: 18rpx;
  color: #69F0AE;
}

.lock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lock-icon {
  font-size: 40rpx;
}
</style>
