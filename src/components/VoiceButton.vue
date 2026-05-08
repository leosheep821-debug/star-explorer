<template>
  <view class="voice-btn" :class="{ 'is-speaking': speaking }" @click="toggleSpeak">
    <text class="voice-icon">{{ speaking ? '⏸️' : '🔊' }}</text>
  </view>
</template>

<script setup lang="ts">
import { speakText, stopSpeak } from '@/utils/speech'

const props = defineProps<{
  text: string
}>()

const speaking = ref(false)

function toggleSpeak() {
  if (speaking.value) {
    stopSpeak()
    speaking.value = false
  } else {
    speakText(props.text)
    speaking.value = true
    // 模拟朗读结束（简单处理）
    setTimeout(() => {
      speaking.value = false
    }, Math.max(3000, props.text.length * 300))
  }
}
</script>

<style lang="scss" scoped>
.voice-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: rgba(79, 195, 247, 0.15);
  border: 2rpx solid rgba(79, 195, 247, 0.3);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.9);
  }

  &.is-speaking {
    background: rgba(79, 195, 247, 0.3);
    animation: pulse 1s ease-in-out infinite;
  }
}

.voice-icon {
  font-size: 28rpx;
}
</style>
