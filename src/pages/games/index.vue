<template>
  <view class="games-page">
    <StarField />
    <NavBar title="游戏中心" />

    <view class="content">
      <!-- 游戏列表 -->
      <view class="game-list">
        <!-- 行星收集家 -->
        <view class="game-entry" @click="goGame('/pages/games/collector')">
          <view class="game-icon-wrap" style="background: linear-gradient(135deg, #4FC3F7, #2196F3);">
            <text class="game-icon">🧩</text>
          </view>
          <view class="game-info">
            <text class="game-name">行星收集家</text>
            <text class="game-desc">回答问题，解锁行星卡片！每答对3题就能收集一颗新行星。</text>
            <view class="game-difficulty">
              <text class="diff-tag easy">简单</text>
            </view>
          </view>
          <text class="game-arrow">→</text>
        </view>

        <!-- 火箭发射挑战 -->
        <view class="game-entry" @click="goGame('/pages/games/rocket')">
          <view class="game-icon-wrap" style="background: linear-gradient(135deg, #FFAB40, #FF6D00);">
            <text class="game-icon">🚀</text>
          </view>
          <view class="game-info">
            <text class="game-name">火箭发射挑战</text>
            <text class="game-desc">限时答题，答对越多火箭飞得越高！看看你能飞到哪颗行星。</text>
            <view class="game-difficulty">
              <text class="diff-tag medium">中等</text>
            </view>
          </view>
          <text class="game-arrow">→</text>
        </view>

        <!-- 星座连连看（预告） -->
        <view class="game-entry game-locked">
          <view class="game-icon-wrap" style="background: linear-gradient(135deg, #B388FF, #7C4DFF);">
            <text class="game-icon">⭐</text>
          </view>
          <view class="game-info">
            <text class="game-name">星座连连看</text>
            <text class="game-desc">连接相同的星座图案，考验你的记忆力和眼力！</text>
            <view class="game-difficulty">
              <text class="diff-tag hard">困难</text>
            </view>
          </view>
          <view class="lock-badge">
            <text>🔒 即将开放</text>
          </view>
        </view>

        <!-- 太空救援任务（预告） -->
        <view class="game-entry game-locked">
          <view class="game-icon-wrap" style="background: linear-gradient(135deg, #FF80AB, #F50057);">
            <text class="game-icon">🛸</text>
          </view>
          <view class="game-info">
            <text class="game-name">太空救援任务</text>
            <text class="game-desc">驾驶飞船穿越小行星带，完成救援任务！</text>
            <view class="game-difficulty">
              <text class="diff-tag hard">困难</text>
            </view>
          </view>
          <view class="lock-badge">
            <text>🔒 即将开放</text>
          </view>
        </view>

        <!-- 宇宙知识擂台（预告） -->
        <view class="game-entry game-locked">
          <view class="game-icon-wrap" style="background: linear-gradient(135deg, #69F0AE, #00C853);">
            <text class="game-icon">⚔️</text>
          </view>
          <view class="game-info">
            <text class="game-name">宇宙知识擂台</text>
            <text class="game-desc">和其他小探险家PK宇宙知识，争夺擂主宝座！</text>
            <view class="game-difficulty">
              <text class="diff-tag hard">困难</text>
            </view>
          </view>
          <view class="lock-badge">
            <text>🔒 即将开放</text>
          </view>
        </view>
      </view>
    </view>

    <view class="safe-area-bottom" style="height: 120rpx;"></view>
  </view>
</template>

<script setup lang="ts">
import StarField from '@/components/StarField.vue'
import NavBar from '@/components/NavBar.vue'

function goGame(url: string) {
  uni.navigateTo({ url })
}
</script>

<style lang="scss" scoped>
.games-page {
  min-height: 100vh;
  position: relative;
  padding: 0 32rpx;
}

.content {
  position: relative;
  z-index: 1;
}

.game-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 20rpx;
}

.game-entry {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  border: 2rpx solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    background: rgba(255, 255, 255, 0.1);
  }

  &.game-locked {
    opacity: 0.5;
  }
}

.game-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.game-icon {
  font-size: 44rpx;
}

.game-info {
  flex: 1;
}

.game-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFFFFF;
  display: block;
}

.game-desc {
  font-size: 22rpx;
  color: #A0B4D0;
  margin-top: 6rpx;
  display: block;
  line-height: 1.5;
}

.game-difficulty {
  margin-top: 8rpx;
  display: flex;
  gap: 8rpx;
}

.diff-tag {
  font-size: 18rpx;
  padding: 2rpx 12rpx;
  border-radius: $radius-round;

  &.easy {
    background: rgba(105, 240, 174, 0.15);
    color: #69F0AE;
  }

  &.medium {
    background: rgba(255, 171, 64, 0.15);
    color: #FFAB40;
  }

  &.hard {
    background: rgba(255, 82, 82, 0.15);
    color: #FF5252;
  }
}

.game-arrow {
  font-size: 36rpx;
  color: #6B7DB3;
}

.lock-badge {
  padding: 8rpx 16rpx;
  background: rgba(255, 255, 255, 0.08);
  border-radius: $radius-round;

  text {
    font-size: 20rpx;
    color: #6B7DB3;
  }
}
</style>
