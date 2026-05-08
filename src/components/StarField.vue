<template>
  <view class="star-field">
    <view
      v-for="star in stars"
      :key="star.id"
      class="star"
      :style="{
        left: star.x + '%',
        top: star.y + '%',
        width: star.size + 'rpx',
        height: star.size + 'rpx',
        animationDelay: star.delay + 's',
        animationDuration: star.duration + 's'
      }"
    ></view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Star {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

const stars = ref<Star[]>([])

onMounted(() => {
  // 生成50颗随机星星
  const list: Star[] = []
  for (let i = 0; i < 50; i++) {
    list.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2
    })
  }
  stars.value = list
})
</script>

<style lang="scss" scoped>
.star-field {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
  background: #FFFFFF;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
  opacity: 0.6;
}
</style>
