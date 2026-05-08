<template>
  <view class="detail-page">
    <StarField />
    <NavBar :title="planet?.name || '行星详情'" showBack />

    <view v-if="planet" class="content">
      <!-- 行星大图标 -->
      <view class="planet-hero">
        <view class="planet-sphere animate-float"
          :style="{ background: `radial-gradient(circle at 35% 35%, ${planet.color}CC, ${planet.color}88, ${planet.color})` }">
          <text class="planet-emoji">{{ planet.icon }}</text>
          <!-- 土星光环 -->
          <view v-if="planet.id === 'saturn'" class="detail-saturn-ring"></view>
        </view>
        <view class="planet-hero-info">
          <text class="hero-name">{{ planet.name }}</text>
          <text class="hero-name-en">{{ planet.nameEn }}</text>
          <view class="hero-order">
            <text>距太阳第 {{ planet.order }} 近</text>
          </view>
        </view>
      </view>

      <!-- 语音朗读按钮 -->
      <view class="voice-section">
        <VoiceButton :text="planet.description" />
        <text class="voice-hint">点击收听行星介绍</text>
      </view>

      <!-- 简介 -->
      <view class="info-card animate-slide-up">
        <view class="card-header">
          <text class="card-title">📖 行星简介</text>
        </view>
        <text class="card-text">{{ planet.description }}</text>
      </view>

      <!-- 基本数据 -->
      <view class="info-card animate-slide-up" style="animation-delay: 0.1s;">
        <view class="card-header">
          <text class="card-title">📏 基本数据</text>
        </view>
        <view class="data-grid">
          <view class="data-item">
            <text class="data-label">直径</text>
            <text class="data-value">{{ planet.diameter }}</text>
          </view>
          <view class="data-item">
            <text class="data-label">距太阳</text>
            <text class="data-value">{{ planet.distanceFromSun }}</text>
          </view>
          <view class="data-item">
            <text class="data-label">公转周期</text>
            <text class="data-value">{{ planet.orbitalPeriod }}</text>
          </view>
          <view class="data-item">
            <text class="data-label">卫星数量</text>
            <text class="data-value">{{ planet.moons }} 颗</text>
          </view>
          <view class="data-item">
            <text class="data-label">温度</text>
            <text class="data-value">{{ planet.temperature }}</text>
          </view>
        </view>
      </view>

      <!-- 趣味知识 -->
      <view class="info-card animate-slide-up" style="animation-delay: 0.2s;">
        <view class="card-header">
          <text class="card-title">✨ 趣味知识</text>
        </view>
        <view class="facts-list">
          <view v-for="(fact, index) in planet.facts" :key="index" class="fact-item">
            <view class="fact-header" @click="toggleFact(index)">
              <text class="fact-title">{{ fact.title }}</text>
              <text class="fact-arrow">{{ expandedFact === index ? '▼' : '▶' }}</text>
            </view>
            <view v-if="expandedFact === index" class="fact-content animate-fade-in">
              <text class="fact-text">{{ fact.content }}</text>
              <VoiceButton :text="fact.content" />
            </view>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-section">
        <ActionButton
          v-if="!isCollected"
          text="🧩 答题收集这颗行星"
          type="gold"
          block
          round
          @click="goCollect"
        />
        <view v-else class="collected-tip">
          <text>✅ 已收集！</text>
        </view>
      </view>
    </view>

    <view class="safe-area-bottom" style="height: 120rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StarField from '@/components/StarField.vue'
import NavBar from '@/components/NavBar.vue'
import VoiceButton from '@/components/VoiceButton.vue'
import ActionButton from '@/components/ActionButton.vue'
import { getPlanetById } from '@/data/planets'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const { state: userState } = userStore

const planetId = ref('')
const planet = computed(() => getPlanetById(planetId.value))
const isCollected = computed(() => userState.collectedPlanets.includes(planetId.value))
const expandedFact = ref(0)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.$page?.options || currentPage.options || {}
  planetId.value = options.id || 'earth'
})

function toggleFact(index: number) {
  expandedFact.value = expandedFact.value === index ? -1 : index
}

function goCollect() {
  uni.navigateTo({ url: `/pages/games/collector?planetId=${planetId.value}` })
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  position: relative;
  padding: 0 32rpx;
}

.content {
  position: relative;
  z-index: 1;
}

.planet-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.planet-sphere {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 0 60rpx rgba(255, 255, 255, 0.15);
}

.planet-emoji {
  font-size: 96rpx;
}

.detail-saturn-ring {
  position: absolute;
  width: 300rpx;
  height: 60rpx;
  border: 6rpx solid rgba(240, 214, 138, 0.5);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(65deg);
}

.planet-hero-info {
  text-align: center;
  margin-top: 24rpx;
}

.hero-name {
  font-size: 48rpx;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
}

.hero-name-en {
  font-size: 28rpx;
  color: #6B7DB3;
  display: block;
  margin-top: 4rpx;
}

.hero-order {
  margin-top: 8rpx;
  padding: 4rpx 20rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: $radius-round;
  display: inline-flex;

  text {
    font-size: 22rpx;
    color: #A0B4D0;
  }
}

.voice-section {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin: 16rpx 0 32rpx;
}

.voice-hint {
  font-size: 24rpx;
  color: #6B7DB3;
}

.info-card {
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  padding: 28rpx;
  margin-bottom: 24rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.08);
}

.card-header {
  margin-bottom: 16rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.card-text {
  font-size: 28rpx;
  color: #A0B4D0;
  line-height: 1.8;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.data-item {
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.04);
  border-radius: $radius-md;
}

.data-label {
  font-size: 22rpx;
  color: #6B7DB3;
  display: block;
  margin-bottom: 4rpx;
}

.data-value {
  font-size: 26rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.facts-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.fact-item {
  background: rgba(255, 255, 255, 0.04);
  border-radius: $radius-md;
  overflow: hidden;
}

.fact-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
}

.fact-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
}

.fact-arrow {
  font-size: 20rpx;
  color: #6B7DB3;
}

.fact-content {
  padding: 0 20rpx 20rpx;
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.fact-text {
  flex: 1;
  font-size: 26rpx;
  color: #A0B4D0;
  line-height: 1.7;
}

.action-section {
  margin: 32rpx 0;
}

.collected-tip {
  text-align: center;
  padding: 24rpx;
  background: rgba(105, 240, 174, 0.1);
  border-radius: $radius-round;
  border: 2rpx solid rgba(105, 240, 174, 0.2);

  text {
    font-size: 32rpx;
    font-weight: 600;
    color: #69F0AE;
  }
}
</style>
