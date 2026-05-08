<template>
  <view class="home-page">
    <!-- 星空背景 -->
    <StarField />

    <!-- 顶部区域 -->
    <view class="header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <!-- 用户信息 -->
      <view class="user-info" @click="goProfile">
        <view class="avatar-wrap">
          <text class="avatar-icon">🚀</text>
        </view>
        <view class="user-detail">
          <text class="nickname">{{ userState.nickname }}</text>
          <view class="level-badge">
            <text class="level-text">{{ levelInfo.title }} Lv.{{ userState.level }}</text>
          </view>
        </view>
        <view class="coin-display">
          <text class="coin-icon">🪙</text>
          <text class="coin-count">{{ userState.coins }}</text>
        </view>
      </view>

      <!-- 经验值进度条 -->
      <view class="exp-bar-wrap">
        <view class="exp-bar">
          <view class="exp-fill" :style="{ width: levelProgress + '%' }"></view>
        </view>
        <text class="exp-text">{{ userState.exp }} / {{ levelInfo.maxExp }} EXP</text>
      </view>
    </view>

    <!-- 欢迎语 -->
    <view class="welcome-section">
      <text class="welcome-title">🌟 欢迎回来，小探险家！</text>
      <text class="welcome-desc">今天想探索哪颗行星呢？</text>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-actions">
      <view class="action-item" @click="goPlanets">
        <view class="action-icon-wrap" style="background: rgba(79, 195, 247, 0.15);">
          <text class="action-icon">🪐</text>
        </view>
        <text class="action-label">行星图鉴</text>
      </view>
      <view class="action-item" @click="goGames">
        <view class="action-icon-wrap" style="background: rgba(255, 215, 0, 0.15);">
          <text class="action-icon">🎮</text>
        </view>
        <text class="action-label">游戏中心</text>
      </view>
      <view class="action-item" @click="goAchievement">
        <view class="action-icon-wrap" style="background: rgba(179, 136, 255, 0.15);">
          <text class="action-icon">🏆</text>
        </view>
        <text class="action-label">成就徽章</text>
      </view>
      <view class="action-item" @click="goReport">
        <view class="action-icon-wrap" style="background: rgba(105, 240, 174, 0.15);">
          <text class="action-icon">📊</text>
        </view>
        <text class="action-label">学习报告</text>
      </view>
    </view>

    <!-- 今日推荐行星 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">🌟 今日推荐</text>
        <text class="section-more" @click="goPlanets">查看全部 →</text>
      </view>
      <view class="planet-recommend" @click="viewPlanet(todayPlanet.id)">
        <view class="recommend-planet-icon animate-breathe" :style="{ background: `radial-gradient(circle at 35% 35%, ${todayPlanet.color}CC, ${todayPlanet.color})` }">
          <text style="font-size: 64rpx;">{{ todayPlanet.icon }}</text>
        </view>
        <view class="recommend-info">
          <text class="recommend-name">{{ todayPlanet.name }}</text>
          <text class="recommend-name-en">{{ todayPlanet.nameEn }}</text>
          <text class="recommend-desc">{{ todayPlanet.description.slice(0, 50) }}...</text>
        </view>
        <view class="recommend-arrow">
          <text>→</text>
        </view>
      </view>
    </view>

    <!-- 学习统计 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">📊 我的学习</text>
      </view>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ userState.collectedPlanets.length }}</text>
          <text class="stat-label">已收集行星</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ userState.totalQuestions }}</text>
          <text class="stat-label">答题总数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ correctRate }}%</text>
          <text class="stat-label">正确率</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ userState.achievements.length }}</text>
          <text class="stat-label">获得徽章</text>
        </view>
      </view>
    </view>

    <!-- 游戏推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">🎮 热门游戏</text>
        <text class="section-more" @click="goGames">更多 →</text>
      </view>
      <view class="game-cards">
        <view class="game-card" @click="goCollector">
          <view class="game-card-bg" style="background: linear-gradient(135deg, rgba(79, 195, 247, 0.2), rgba(33, 150, 243, 0.2));">
            <text class="game-card-icon">🧩</text>
          </view>
          <text class="game-card-name">行星收集家</text>
          <text class="game-card-desc">答题解锁行星卡片</text>
        </view>
        <view class="game-card" @click="goRocket">
          <view class="game-card-bg" style="background: linear-gradient(135deg, rgba(255, 171, 64, 0.2), rgba(255, 109, 0, 0.2));">
            <text class="game-card-icon">🚀</text>
          </view>
          <text class="game-card-name">火箭发射挑战</text>
          <text class="game-card-desc">限时答题冲向太空</text>
        </view>
      </view>
    </view>

    <!-- 底部安全区域 -->
    <view class="safe-area-bottom" style="height: 120rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StarField from '@/components/StarField.vue'
import { planets } from '@/data/planets'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const { state: userState, getLevelInfo, getLevelProgress, getCorrectRate, updatePlayDays } = userStore

const statusBarHeight = ref(20)
const levelInfo = computed(() => getLevelInfo())
const levelProgress = computed(() => getLevelProgress())
const correctRate = computed(() => getCorrectRate())

// 今日推荐行星（根据日期轮换）
const todayPlanet = computed(() => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return planets[dayOfYear % planets.length]
})

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 20
  updatePlayDays()
})

function goProfile() {
  uni.switchTab({ url: '/pages/profile/index' })
}
function goPlanets() {
  uni.switchTab({ url: '/pages/planets/index' })
}
function goGames() {
  uni.switchTab({ url: '/pages/games/index' })
}
function goAchievement() {
  uni.navigateTo({ url: '/pages/achievement/index' })
}
function goReport() {
  uni.navigateTo({ url: '/pages/report/index' })
}
function viewPlanet(id: string) {
  uni.navigateTo({ url: `/pages/planets/detail?id=${id}` })
}
function goCollector() {
  uni.navigateTo({ url: '/pages/games/collector' })
}
function goRocket() {
  uni.navigateTo({ url: '/pages/games/rocket' })
}
</script>

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  position: relative;
  padding: 0 32rpx;
}

.header {
  padding: 20rpx 0 24rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar-wrap {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4FC3F7, #2196F3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 44rpx;
}

.user-detail {
  flex: 1;
}

.nickname {
  font-size: 34rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.level-badge {
  margin-top: 4rpx;
  padding: 2rpx 16rpx;
  background: rgba(255, 215, 0, 0.15);
  border-radius: $radius-round;
  display: inline-flex;
}

.level-text {
  font-size: 20rpx;
  color: #FFD700;
}

.coin-display {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 8rpx 20rpx;
  background: rgba(255, 215, 0, 0.1);
  border-radius: $radius-round;
  border: 1rpx solid rgba(255, 215, 0, 0.2);
}

.coin-icon {
  font-size: 28rpx;
}

.coin-count {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFD700;
}

.exp-bar-wrap {
  margin-top: 16rpx;
}

.exp-bar {
  height: 12rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: $radius-round;
  overflow: hidden;
}

.exp-fill {
  height: 100%;
  background: linear-gradient(90deg, #4FC3F7, #FFD700);
  border-radius: $radius-round;
  transition: width 0.5s ease;
}

.exp-text {
  font-size: 20rpx;
  color: #6B7DB3;
  margin-top: 4rpx;
}

.welcome-section {
  margin: 32rpx 0;
}

.welcome-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
}

.welcome-desc {
  font-size: 28rpx;
  color: #A0B4D0;
  margin-top: 8rpx;
  display: block;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.action-icon-wrap {
  width: 100rpx;
  height: 100rpx;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.9);
  }
}

.action-icon {
  font-size: 44rpx;
}

.action-label {
  font-size: 22rpx;
  color: #A0B4D0;
}

.section {
  margin-bottom: 40rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.section-more {
  font-size: 24rpx;
  color: #4FC3F7;
}

.planet-recommend {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  border: 2rpx solid rgba(255, 255, 255, 0.08);

  &:active {
    background: rgba(255, 255, 255, 0.1);
  }
}

.recommend-planet-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recommend-info {
  flex: 1;
}

.recommend-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
}

.recommend-name-en {
  font-size: 22rpx;
  color: #6B7DB3;
  display: block;
  margin-top: 4rpx;
}

.recommend-desc {
  font-size: 24rpx;
  color: #A0B4D0;
  margin-top: 8rpx;
  display: block;
}

.recommend-arrow {
  font-size: 36rpx;
  color: #6B7DB3;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
}

.stat-value {
  font-size: 44rpx;
  font-weight: 700;
  color: #FFD700;
}

.stat-label {
  font-size: 22rpx;
  color: #A0B4D0;
  margin-top: 8rpx;
}

.game-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.game-card {
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  border: 2rpx solid rgba(255, 255, 255, 0.08);

  &:active {
    transform: scale(0.97);
  }
}

.game-card-bg {
  width: 80rpx;
  height: 80rpx;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.game-card-icon {
  font-size: 40rpx;
}

.game-card-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
  display: block;
}

.game-card-desc {
  font-size: 20rpx;
  color: #A0B4D0;
  margin-top: 4rpx;
  display: block;
}
</style>
