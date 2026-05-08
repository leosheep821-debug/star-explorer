<template>
  <view v-if="visible" class="modal-overlay" @click.self="handleClose">
    <view class="modal-content animate-slide-up">
      <!-- 标题栏 -->
      <view class="modal-header">
        <text class="modal-title">{{ title }}</text>
        <view class="close-btn" @click="handleClose">
          <text>✕</text>
        </view>
      </view>
      <!-- 内容区域 -->
      <view class="modal-body">
        <slot></slot>
      </view>
      <!-- 底部按钮 -->
      <view v-if="showConfirm" class="modal-footer">
        <ActionButton :text="cancelText" type="secondary" @click="handleCancel" />
        <ActionButton :text="confirmText" type="primary" @click="handleConfirm" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  visible: boolean
  title: string
  showConfirm?: boolean
  confirmText?: string
  cancelText?: string
}>(), {
  showConfirm: false,
  confirmText: '确定',
  cancelText: '取消'
})

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function handleClose() {
  emit('update:visible', false)
}

function handleConfirm() {
  emit('confirm')
  handleClose()
}

function handleCancel() {
  emit('cancel')
  handleClose()
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 40rpx;
}

.modal-content {
  width: 100%;
  max-width: 640rpx;
  background: #1A2240;
  border-radius: $radius-xl;
  border: 2rpx solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 16rpx;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.close-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #A0B4D0;

  &:active {
    background: rgba(255, 255, 255, 0.2);
  }
}

.modal-body {
  padding: 16rpx 32rpx 32rpx;
}

.modal-footer {
  display: flex;
  gap: 20rpx;
  padding: 0 32rpx 32rpx;
}
</style>
