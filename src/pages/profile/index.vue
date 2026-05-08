<template>
  <view class="profile-page">
    <StarField />

    <view class="content" :style="{ paddingTop: statusBarHeight + 'px' }">
      <!-- 用户头像区 -->
      <view class="profile-header">
        <view class="avatar-large">
          <text class="avatar-emoji">🚀</text>
        </view>
        <text class="profile-name">{{ userState.nickname }}</text>
        <view class="level-info">
          <text class="level-title">{{ levelInfo.title }}</text>
          <text class="level-num">Lv.{{ userState.level }}</text>
        </view>
      </view>

      <!-- 经验值 -->
      <view class="exp-section">
        <view class="exp-header">
          <text class="exp-label">经验值</text>
          <text class="exp-num">{{ userState.exp }} / {{ levelInfo.maxExp }}</text>
        </view>
        <view class="exp-bar">
          <view class="exp-fill" :style="{ width: levelProgress + '%' }"></view>
        </view>
      </view>

      <!-- 数据统计 -->
      <view class="stats-section">
        <view class="stat-card">
          <text class="stat-icon">🪙</text>
          <text class="stat-val">{{ userState.coins }}</text>
          <text class="stat-name">金币</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">🪐</text>
          <text class="stat-val">{{ userState.collectedPlanets.length }}/8</text>
          <text class="stat-name">行星</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">📝</text>
          <text class="stat-val">{{ userState.totalQuestions }}</text>
          <text class="stat-name">答题</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">🎯</text>
          <text class="stat-val">{{ correctRate }}%</text>
          <text class="stat-name">正确率</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">🏆</text>
          <text class="stat-val">{{ userState.achievements.length }}</text>
          <text class="stat-name">徽章</text>
        </view>
        <view class="stat-card">
          <text class="stat-icon">📅</text>
          <text class="stat-val">{{ userState.playDays }}</text>
          <text class="stat-name">天数</text>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-section">
        <view class="menu-item" @click="goAchievement">
          <text class="menu-icon">🏆</text>
          <text class="menu-text">成就徽章</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goReport">
          <text class="menu-icon">📊</text>
          <text class="menu-text">学习报告</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goPlanets">
          <text class="menu-icon">🪐</text>
          <text class="menu-text">行星图鉴</text>
          <text class="menu-arrow">→</text>
        </view>
      </view>

      <!-- 重置按钮 -->
      <view class="reset-section">
        <ActionButton text="🔄 重置学习数据" type="danger" block round @click="showResetModal = true" />
      </view>
    </view>

    <!-- 重置确认弹窗 -->
    <AppModal v-model:visible="showResetModal" title="⚠️ 确认重置" :show-confirm="true" @confirm="resetData">
      <text class="reset-warning">重置后所有学习数据将被清除，包括等级、金币、已收集的行星和成就。此操作不可撤销！</text>
    </AppModal>

    <view class="safe-area-bottom" style="height: 120rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StarField from '@/components/StarField.vue'
import ActionButton from '@/components/ActionButton.vue'
import AppModal from '@/components/AppModal.vue'
import { useUserStore } from '@/store/user'
import { showToast } from '@/utils/common'

const userStore = useUserStore()
const { state: userState, getLevelInfo, getLevelProgress, getCorrectRate, resetData: doReset } = userStore

const statusBarHeight = ref(20)
const showResetModal = ref(false)

const levelInfo = computed(() => getLevelInfo())
const levelProgress = computed(() => getLevelProgress())
const correctRate = computed(() => getCorrectRate())

onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 20
})

function goAchievement() {
  uni.navigateTo({ url: '/pages/achievement/index' })
}

function goReport() {
  uni.navigateTo({ url: '/pages/report/index' })
}

function goPlanets() {
  uni.switchTab({ url: '/pages/planets/index' })
}

function resetData() {
  doReset()
  showToast('数据已重置')
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  position: relative;
  padding: 0 32rpx;
}

.content {
  position: relative;
  z-index: 1;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0 24rpx;
}

.avatar-large {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4FC3F7, #2196F3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40rpx rgba(79, 195, 247, 0.3);
}

.avatar-emoji {
  font-size: 64rpx;
}

.profile-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
  margin-top: 16rpx;
}

.level-info {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 8rpx;
  padding: 6rpx 24rpx;
  background: rgba(255, 215, 0, 0.1);
  border-radius: $radius-round;
}

.level-title {
  font-size: 24rpx;
  color: #FFD700;
}

.level-num {
  font-size: 24rpx;
  font-weight: 700;
  color: #FFD700;
}

.exp-section {
  margin: 24rpx 0;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.exp-label {
  font-size: 24rpx;
  color: #A0B4D0;
}

.exp-num {
  font-size: 24rpx;
  color: #FFD700;
}

.exp-bar {
  height: 16rpx;
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

.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx 12rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
}

.stat-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.stat-val {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFD700;
}

.stat-name {
  font-size: 20rpx;
  color: #A0B4D0;
  margin-top: 4rpx;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  overflow: hidden;
  margin-bottom: 32rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 24rpx;
  background: rgba(255, 255, 255, 0.04);

  &:active {
    background: rgba(255, 255, 255, 0.08);
  }
}

.menu-icon {
  font-size: 36rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #FFFFFF;
}

.menu-arrow {
  font-size: 28rpx;
  color: #6B7DB3;
}

.reset-section {
  margin-bottom: 40rpx;
}

.reset-warning {
  font-size: 28rpx;
  color: #FF5252;
  line-height: 1.7;
}
</style>
