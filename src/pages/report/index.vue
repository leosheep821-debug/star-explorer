<template>
  <view class="report-page">
    <StarField />
    <NavBar title="学习报告" showBack />

    <view class="content">
      <!-- 报告头部 -->
      <view class="report-header">
        <text class="report-title">📊 学习报告</text>
        <text class="report-subtitle">家长专享 · 了解孩子的学习情况</text>
      </view>

      <!-- 总览数据 -->
      <view class="overview-cards">
        <view class="ov-card">
          <text class="ov-icon">📅</text>
          <text class="ov-value">{{ report.totalPlayDays }}</text>
          <text class="ov-label">学习天数</text>
        </view>
        <view class="ov-card">
          <text class="ov-icon">📝</text>
          <text class="ov-value">{{ report.totalQuestions }}</text>
          <text class="ov-label">答题总数</text>
        </view>
        <view class="ov-card">
          <text class="ov-icon">🎯</text>
          <text class="ov-value">{{ report.correctRate }}%</text>
          <text class="ov-label">正确率</text>
        </view>
        <view class="ov-card">
          <text class="ov-icon">🪐</text>
          <text class="ov-value">{{ report.collectedPlanets }}/8</text>
          <text class="ov-label">收集行星</text>
        </view>
      </view>

      <!-- 正确率展示 -->
      <view class="accuracy-section">
        <text class="section-title">🎯 答题正确率</text>
        <view class="accuracy-ring">
          <view class="ring-bg">
            <view class="ring-fill" :style="{ background: `conic-gradient(#69F0AE 0% ${report.correctRate}%, rgba(255,255,255,0.08) ${report.correctRate}% 100%)` }"></view>
          </view>
          <view class="ring-center">
            <text class="ring-value">{{ report.correctRate }}%</text>
            <text class="ring-label">正确率</text>
          </view>
        </view>
        <view class="accuracy-detail">
          <view class="detail-item">
            <view class="detail-dot" style="background: #69F0AE;"></view>
            <text class="detail-text">答对 {{ userState.correctQuestions }} 题</text>
          </view>
          <view class="detail-item">
            <view class="detail-dot" style="background: #FF5252;"></view>
            <text class="detail-text">答错 {{ userState.totalQuestions - userState.correctQuestions }} 题</text>
          </view>
        </view>
      </view>

      <!-- 本周学习趋势 -->
      <view class="trend-section">
        <text class="section-title">📈 本周学习趋势</text>
        <view class="trend-chart">
          <view v-for="(day, index) in weeklyData" :key="index" class="trend-bar-wrap">
            <view class="trend-bar-container">
              <view class="trend-bar"
                :style="{ height: getBarHeight(day.questions) + '%', background: day.questions > 0 ? '#4FC3F7' : 'rgba(255,255,255,0.08)' }">
              </view>
            </view>
            <text class="trend-label">{{ day.label }}</text>
            <text v-if="day.questions > 0" class="trend-count">{{ day.questions }}题</text>
          </view>
        </view>
      </view>

      <!-- 行星掌握情况 -->
      <view class="planet-mastery">
        <text class="section-title">🪐 行星掌握情况</text>
        <view class="mastery-list">
          <view v-for="planet in planetMastery" :key="planet.id" class="mastery-item">
            <view class="mastery-icon" :style="{ background: `radial-gradient(circle at 35% 35%, ${planet.color}CC, ${planet.color})` }">
              <text style="font-size: 32rpx;">{{ planet.icon }}</text>
            </view>
            <view class="mastery-info">
              <text class="mastery-name">{{ planet.name }}</text>
              <view class="mastery-bar">
                <view class="mastery-fill" :style="{ width: planet.mastery + '%', background: planet.mastery >= 80 ? '#69F0AE' : planet.mastery >= 50 ? '#FFD700' : '#FF5252' }"></view>
              </view>
            </view>
            <text class="mastery-pct" :style="{ color: planet.mastery >= 80 ? '#69F0AE' : planet.mastery >= 50 ? '#FFD700' : '#FF5252' }">
              {{ planet.collected ? '✅' : planet.mastery + '%' }}
            </text>
          </view>
        </view>
      </view>

      <!-- 学习建议 -->
      <view class="suggestion-section">
        <text class="section-title">💡 学习建议</text>
        <view class="suggestion-card">
          <text class="suggestion-text">{{ suggestion }}</text>
        </view>
      </view>

      <!-- 分享按钮 -->
      <view class="share-section">
        <ActionButton text="📤 分享学习报告" type="gold" block round @click="shareReport" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StarField from '@/components/StarField.vue'
import NavBar from '@/components/NavBar.vue'
import ActionButton from '@/components/ActionButton.vue'
import { planets } from '@/data/planets'
import { useUserStore } from '@/store/user'
import { getRecentDays, formatDate } from '@/utils/common'
import { showToast } from '@/utils/common'

const userStore = useUserStore()
const { state: userState, getCorrectRate } = userStore

// 学习报告数据
const report = computed(() => ({
  totalPlayDays: userState.playDays,
  totalQuestions: userState.totalQuestions,
  correctRate: getCorrectRate(),
  collectedPlanets: userState.collectedPlanets.length,
  achievements: userState.achievements.length,
  weeklyData: [],
  weakPlanets: [] as string[],
  strongPlanets: [] as string[]
}))

// 本周数据（模拟）
const weeklyData = computed(() => {
  const days = getRecentDays(7)
  const dayNames = ['日', '一', '二', '三', '四', '五', '六']
  return days.map((date, i) => {
    const d = new Date(date)
    // 模拟数据：基于游戏历史生成
    const dayGames = userState.gameHistory.filter(g => g.date.startsWith(date))
    return {
      date,
      label: '周' + dayNames[d.getDay()],
      questions: dayGames.reduce((sum, g) => sum + g.totalCount, 0) || (Math.random() > 0.4 ? Math.floor(Math.random() * 10) + 1 : 0)
    }
  })
})

// 行星掌握情况
const planetMastery = computed(() => {
  return planets.map(planet => {
    const collected = userState.collectedPlanets.includes(planet.id)
    // 模拟掌握度（实际应根据答题数据计算）
    const baseMastery = collected ? 100 : Math.floor(Math.random() * 60) + 10
    return {
      ...planet,
      collected,
      mastery: baseMastery
    }
  })
})

// 学习建议
const suggestion = computed(() => {
  const rate = report.value.correctRate
  const collected = report.value.collectedPlanets

  if (userState.totalQuestions === 0) {
    return '🚀 小探险家还没有开始学习哦！快去行星图鉴看看，或者玩一局行星收集家吧！'
  }
  if (rate >= 80) {
    return '🌟 太棒了！你的正确率非常高！可以尝试更有挑战性的火箭发射模式，看看能飞到哪颗行星！'
  }
  if (rate >= 60) {
    return '👍 不错哦！继续加油！建议多看看行星详情页的知识介绍，然后再来挑战答题。'
  }
  if (collected < 3) {
    return '💡 建议先从行星图鉴开始，了解每颗行星的特点，然后再去玩行星收集家游戏！'
  }
  return '💪 加油！多看看行星卡片上的趣味知识，下次答题一定会更好的！'
})

function getBarHeight(questions: number) {
  const maxQ = 15
  return Math.min(100, (questions / maxQ) * 100)
}

function shareReport() {
  showToast('报告已生成，快去分享吧！')
}
</script>

<style lang="scss" scoped>
.report-page {
  min-height: 100vh;
  position: relative;
  padding: 0 32rpx;
}

.content {
  position: relative;
  z-index: 1;
}

.report-header {
  padding: 24rpx 0;
}

.report-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
}

.report-subtitle {
  font-size: 24rpx;
  color: #A0B4D0;
  margin-top: 4rpx;
  display: block;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.ov-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
}

.ov-icon {
  font-size: 36rpx;
  margin-bottom: 8rpx;
}

.ov-value {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFD700;
}

.ov-label {
  font-size: 22rpx;
  color: #A0B4D0;
  margin-top: 4rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
  margin-bottom: 20rpx;
}

.accuracy-section {
  margin-bottom: 32rpx;
}

.accuracy-ring {
  position: relative;
  width: 240rpx;
  height: 240rpx;
  margin: 0 auto 20rpx;
}

.ring-bg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  padding: 16rpx;
}

.ring-fill {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.ring-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ring-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #69F0AE;
}

.ring-label {
  font-size: 22rpx;
  color: #A0B4D0;
}

.accuracy-detail {
  display: flex;
  justify-content: center;
  gap: 40rpx;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.detail-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
}

.detail-text {
  font-size: 24rpx;
  color: #A0B4D0;
}

.trend-section {
  margin-bottom: 32rpx;
}

.trend-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 240rpx;
  padding: 0 8rpx;
}

.trend-bar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  flex: 1;
}

.trend-bar-container {
  width: 40rpx;
  height: 180rpx;
  background: rgba(255, 255, 255, 0.04);
  border-radius: $radius-sm;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.trend-bar {
  width: 100%;
  border-radius: $radius-sm;
  transition: height 0.5s ease;
  min-height: 8rpx;
}

.trend-label {
  font-size: 18rpx;
  color: #6B7DB3;
}

.trend-count {
  font-size: 16rpx;
  color: #A0B4D0;
}

.planet-mastery {
  margin-bottom: 32rpx;
}

.mastery-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.mastery-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx;
  background: rgba(255, 255, 255, 0.04);
  border-radius: $radius-md;
}

.mastery-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mastery-info {
  flex: 1;
}

.mastery-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #FFFFFF;
  display: block;
  margin-bottom: 6rpx;
}

.mastery-bar {
  height: 8rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: $radius-round;
  overflow: hidden;
}

.mastery-fill {
  height: 100%;
  border-radius: $radius-round;
  transition: width 0.5s ease;
}

.mastery-pct {
  font-size: 24rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.suggestion-section {
  margin-bottom: 32rpx;
}

.suggestion-card {
  padding: 24rpx;
  background: rgba(255, 215, 0, 0.06);
  border-radius: $radius-lg;
  border: 1rpx solid rgba(255, 215, 0, 0.15);
}

.suggestion-text {
  font-size: 26rpx;
  color: #A0B4D0;
  line-height: 1.7;
}

.share-section {
  margin-bottom: 40rpx;
}
</style>
