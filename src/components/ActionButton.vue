<template>
  <view class="action-btn" :class="[`btn-${type}`, { 'btn-block': block, 'btn-round': round }]" @click="handleClick">
    <text class="btn-text">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'gold'
  block?: boolean
  round?: boolean
}>(), {
  type: 'primary',
  block: false,
  round: false
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  emit('click')
}
</script>

<style lang="scss" scoped>
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 48rpx;
  border-radius: $radius-lg;
  font-size: 32rpx;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;

  &:active {
    transform: scale(0.95);
    opacity: 0.8;
  }

  &.btn-block {
    width: 100%;
  }

  &.btn-round {
    border-radius: $radius-round;
  }

  &.btn-primary {
    background: linear-gradient(135deg, #4FC3F7, #2196F3);
    color: #FFFFFF;
    box-shadow: 0 4rpx 16rpx rgba(33, 150, 243, 0.4);
  }

  &.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #A0B4D0;
    border: 2rpx solid rgba(255, 255, 255, 0.15);
  }

  &.btn-success {
    background: linear-gradient(135deg, #69F0AE, #00C853);
    color: #FFFFFF;
    box-shadow: 0 4rpx 16rpx rgba(0, 200, 83, 0.4);
  }

  &.btn-danger {
    background: linear-gradient(135deg, #FF5252, #D32F2F);
    color: #FFFFFF;
    box-shadow: 0 4rpx 16rpx rgba(211, 47, 47, 0.4);
  }

  &.btn-gold {
    background: linear-gradient(135deg, #FFD700, #FFA000);
    color: #FFFFFF;
    box-shadow: 0 4rpx 16rpx rgba(255, 160, 0, 0.4);
  }
}

.btn-text {
  font-size: inherit;
  font-weight: inherit;
}
</style>
