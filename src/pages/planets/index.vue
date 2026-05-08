<template>
  <view class="planets-page">
    <StarField />
    <NavBar title="行星图鉴" />

    <!-- 收集进度 -->
    <view class="collect-progress">
      <text class="progress-text">已收集 {{ collectedCount }} / 8 颗行星</text>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: (collectedCount / 8 * 100) + '%' }"></view>
      </view>
    </view>

    <!-- 太阳系轨道展示 -->
    <view class="solar-system">
      <view class="sun animate-pulse">
        <text class="sun-icon">☀️</text>
      </view>
      <view class="orbit" v-for="planet in planets" :key="planet.id"
        :class="{ 'orbit-active': selectedPlanet === planet.id }"
        :style="{ width: (planet.order * 80 + 120) + 'rpx', height: (planet.order * 80 + 120) + 'rpx' }"
        @click="selectPlanet(planet.id)">
        <view class="planet-dot"
          :style="{
            background: planet.color,
            top: '50%',
            left: '0',
            transform: 'translate(-50%, -50%)'
          }">
          <text class="dot-name">{{ planet.name }}</text>
        </view>
      </view>
    </view>

    <!-- 行星网格 -->
    <view class="planets-grid">
      <PlanetCard
        v-for="planet in planets"
        :key="planet.id"
        :id="planet.id"
        :name="planet.name"
        :nameEn="planet.nameEn"
        :color="planet.color"
        :icon="planet.icon"
        :unlocked="isUnlocked(planet.id)"
        @click="viewPlanet(planet.id)"
      />
    </view>

    <view class="safe-area-bottom" style="height: 120rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StarField from '@/components/StarField.vue'
import NavBar from '@/components/NavBar.vue'
import PlanetCard from '@/components/PlanetCard.vue'
import { planets } from '@/data/planets'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const { state: userState } = userStore

const selectedPlanet = ref('')

const collectedCount = computed(() => userState.collectedPlanets.length)

function isUnlocked(id: string) {
  return userState.collectedPlanets.includes(id)
}

function selectPlanet(id: string) {
  selectedPlanet.value = id
  viewPlanet(id)
}

function viewPlanet(id: string) {
  uni.navigateTo({ url: `/pages/planets/detail?id=${id}` })
}
</script>

<style lang="scss" scoped>
.planets-page {
  min-height: 100vh;
  position: relative;
  padding: 0 32rpx;
}

.collect-progress {
  margin: 20rpx 0 32rpx;
}

.progress-text {
  font-size: 24rpx;
  color: #A0B4D0;
  display: block;
  margin-bottom: 8rpx;
}

.progress-bar {
  height: 12rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: $radius-round;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4FC3F7, #69F0AE);
  border-radius: $radius-round;
  transition: width 0.5s ease;
}

.solar-system {
  position: relative;
  width: 100%;
  height: 500rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.sun {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: radial-gradient(circle, #FFD700, #FF8C00);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 0 40rpx rgba(255, 215, 0, 0.5);
}

.sun-icon {
  font-size: 40rpx;
}

.orbit {
  position: absolute;
  border: 1rpx solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;

  &.orbit-active {
    border-color: rgba(79, 195, 247, 0.3);
  }
}

.planet-dot {
  position: absolute;
  width: 32rpx;
  height: 32rpx;
  border-radius: 50%;
  box-shadow: 0 0 8rpx rgba(255, 255, 255, 0.3);
}

.dot-name {
  position: absolute;
  top: -28rpx;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18rpx;
  color: #A0B4D0;
  white-space: nowrap;
}

.planets-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}
</style>
