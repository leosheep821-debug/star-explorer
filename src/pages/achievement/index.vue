<template>
  <view class="achievement-page">
    <StarField />
    <NavBar title="成就徽章" showBack />

    <view class="content">
      <!-- 成就概览 -->
      <view class="achievement-overview">
        <view class="overview-circle">
          <text class="overview-count">{{ unlockedCount }}</text>
          <text class="overview-total">/ {{ totalAchievements }}</text>
        </view>
        <text class="overview-title">已解锁徽章</text>
        <text class="overview-desc">继续探索宇宙，收集更多徽章吧！</text>
      </view>

      <!-- 分类筛选 -->
      <view class="category-tabs">
        <view
          v-for="cat in categories"
          :key="cat.value"
          class="tab-item"
          :class="{ 'tab-active': activeCategory === cat.value }"
          @click="activeCategory = cat.value"
        >
          <text>{{ cat.icon }} {{ cat.label }}</text>
        </view>
      </view>

      <!-- 成就列表 -->
      <view class="achievement-list">
        <view
          v-for="ach in filteredAchievements"
          :key="ach.id"
          class="achievement-card"
          :class="{ 'is-unlocked': isUnlocked(ach.id) }"
        >
          <view class="ach-icon-wrap" :class="{ 'ach-locked': !isUnlocked(ach.id) }">
            <text class="ach-icon">{{ isUnlocked(ach.id) ? ach.icon : '🔒' }}</text>
          </view>
          <view class="ach-info">
            <text class="ach-name">{{ ach.name }}</text>
            <text class="ach-desc">{{ ach.description }}</text>
          </view>
          <view v-if="isUnlocked(ach.id)" class="ach-check">
            <text>✅</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StarField from '@/components/StarField.vue'
import NavBar from '@/components/NavBar.vue'
import { achievements } from '@/data/achievements'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const { state: userState } = userStore

const activeCategory = ref('all')

const categories = [
  { value: 'all', label: '全部', icon: '🌟' },
  { value: 'explore', label: '探索', icon: '🔭' },
  { value: 'collect', label: '收集', icon: '⭐' },
  { value: 'game', label: '游戏', icon: '🎮' },
  { value: 'social', label: '学习', icon: '📚' }
]

const totalAchievements = achievements.length
const unlockedCount = computed(() => userState.achievements.length)

const filteredAchievements = computed(() => {
  if (activeCategory.value === 'all') return achievements
  return achievements.filter(a => a.category === activeCategory.value)
})

function isUnlocked(id: string) {
  return userState.achievements.includes(id)
}
</script>

<style lang="scss" scoped>
.achievement-page {
  min-height: 100vh;
  position: relative;
  padding: 0 32rpx;
}

.content {
  position: relative;
  z-index: 1;
}

.achievement-overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.overview-circle {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.1);
  border: 4rpx solid rgba(255, 215, 0, 0.3);
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.overview-count {
  font-size: 56rpx;
  font-weight: 700;
  color: #FFD700;
}

.overview-total {
  font-size: 24rpx;
  color: #6B7DB3;
}

.overview-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFFFFF;
  margin-top: 16rpx;
}

.overview-desc {
  font-size: 24rpx;
  color: #A0B4D0;
  margin-top: 4rpx;
}

.category-tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 24rpx;
  overflow-x: auto;
  padding-bottom: 8rpx;
}

.tab-item {
  padding: 12rpx 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-round;
  font-size: 24rpx;
  color: #A0B4D0;
  white-space: nowrap;
  flex-shrink: 0;

  &.tab-active {
    background: rgba(255, 215, 0, 0.15);
    color: #FFD700;
  }
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding-bottom: 120rpx;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  background: rgba(255, 255, 255, 0.04);
  border-radius: $radius-lg;
  border: 1rpx solid rgba(255, 255, 255, 0.06);
  opacity: 0.5;

  &.is-unlocked {
    opacity: 1;
    background: rgba(255, 215, 0, 0.04);
    border-color: rgba(255, 215, 0, 0.15);
  }
}

.ach-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.ach-locked {
    background: rgba(255, 255, 255, 0.04);
  }
}

.ach-icon {
  font-size: 36rpx;
}

.ach-info {
  flex: 1;
}

.ach-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
  display: block;
}

.ach-desc {
  font-size: 22rpx;
  color: #A0B4D0;
  margin-top: 4rpx;
  display: block;
}

.ach-check {
  font-size: 32rpx;
}
</style>
