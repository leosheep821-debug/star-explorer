<template>
  <view class="rocket-page">
    <StarField />
    <NavBar title="火箭发射挑战" showBack />

    <view class="content">
      <!-- 游戏状态栏 -->
      <view class="game-hud">
        <view class="hud-item">
          <text class="hud-icon">🚀</text>
          <text class="hud-value">{{ score }}</text>
          <text class="hud-label">分</text>
        </view>
        <view class="hud-item">
          <text class="hud-icon">✅</text>
          <text class="hud-value">{{ correctCount }}</text>
          <text class="hud-label">对</text>
        </view>
        <view class="hud-item">
          <text class="hud-icon">🔥</text>
          <text class="hud-value">{{ streak }}</text>
          <text class="hud-label">连击</text>
        </view>
        <!-- 倒计时 -->
        <view class="hud-timer" :class="{ 'timer-warning': countdown <= 5 }">
          <text class="timer-value">{{ countdown }}</text>
          <text class="timer-label">秒</text>
        </view>
      </view>

      <!-- 火箭与轨道 -->
      <view class="rocket-track">
        <!-- 行星里程碑 -->
        <view v-for="milestone in milestones" :key="milestone.score"
          class="milestone"
          :class="{ 'milestone-reached': score >= milestone.score }"
          :style="{ bottom: milestone.position + '%' }">
          <text class="milestone-icon">{{ milestone.icon }}</text>
          <text class="milestone-name">{{ milestone.name }}</text>
        </view>

        <!-- 火箭 -->
        <view class="rocket" :style="{ bottom: rocketPosition + '%' }">
          <text class="rocket-icon" :class="{ 'rocket-shake': shakeRocket }">🚀</text>
          <view v-if="streak >= 3" class="rocket-flame animate-pulse">
            <text>🔥</text>
          </view>
        </view>

        <!-- 地面 -->
        <view class="ground">
          <text>🌍 地球</text>
        </view>
      </view>

      <!-- 答题区域 -->
      <view v-if="gameState === 'playing'" class="quiz-area">
        <view class="question-card">
          <text class="question-text">{{ currentQuestion.question }}</text>
          <VoiceButton :text="currentQuestion.question" />
        </view>

        <view class="options-grid">
          <view
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-btn"
            :class="{
              'opt-correct': showResult && index === currentQuestion.answer,
              'opt-wrong': showResult && selectedAnswer === index && index !== currentQuestion.answer
            }"
            @click="selectAnswer(index)"
          >
            <text class="opt-letter">{{ ['A', 'B', 'C', 'D'][index] }}</text>
            <text class="opt-text">{{ option }}</text>
          </view>
        </view>

        <!-- 答案反馈 -->
        <view v-if="showResult" class="feedback animate-fade-in">
          <text class="feedback-text" :class="isCorrectAnswer ? 'feedback-correct' : 'feedback-wrong'">
            {{ isCorrectAnswer ? '✅ 回答正确！' : '❌ 回答错误' }}
          </text>
          <text class="feedback-explain">{{ currentQuestion.explanation }}</text>
        </view>
      </view>

      <!-- 开始界面 -->
      <view v-if="gameState === 'ready'" class="ready-area">
        <text class="ready-icon animate-breathe">🚀</text>
        <text class="ready-title">火箭发射挑战</text>
        <text class="ready-desc">60秒内尽可能多地答对题目</text>
        <text class="ready-desc">火箭会随着你的分数飞向太空！</text>
        <ActionButton text="🚀 开始挑战" type="gold" block round @click="startGame" />
      </view>

      <!-- 结束界面 -->
      <view v-if="gameState === 'result'" class="result-area animate-slide-up">
        <text class="result-icon">🌟</text>
        <text class="result-title">挑战结束！</text>
        <view class="result-stats">
          <view class="result-stat">
            <text class="rs-value">{{ score }}</text>
            <text class="rs-label">总分</text>
          </view>
          <view class="result-stat">
            <text class="rs-value">{{ correctCount }}</text>
            <text class="rs-label">答对</text>
          </view>
          <view class="result-stat">
            <text class="rs-value">{{ maxStreak }}</text>
            <text class="rs-label">最高连击</text>
          </view>
        </view>
        <text class="result-reach">火箭到达了：{{ reachedPlanet }} 🪐</text>

        <view class="result-actions">
          <ActionButton text="🔄 再来一次" type="primary" block round @click="startGame" />
          <ActionButton text="🏠 返回" type="secondary" block round @click="goBack" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { QuizQuestion } from '@/types'
import StarField from '@/components/StarField.vue'
import NavBar from '@/components/NavBar.vue'
import VoiceButton from '@/components/VoiceButton.vue'
import ActionButton from '@/components/ActionButton.vue'
import { getMixedQuestions } from '@/data/questions'
import { playCorrectSound, playWrongSound } from '@/utils/audio'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const gameState = ref<'ready' | 'playing' | 'result'>('ready')
const questions = ref<QuizQuestion[]>([])
const currentIndex = ref(0)
const selectedAnswer = ref(-1)
const showResult = ref(false)
const isCorrectAnswer = ref(false)
const score = ref(0)
const correctCount = ref(0)
const streak = ref(0)
const maxStreak = ref(0)
const countdown = ref(60)
const shakeRocket = ref(false)
let timer: ReturnType<typeof setInterval> | null = null
const startTime = ref(0)

// 行星里程碑
const milestones = [
  { score: 0, name: '地球', icon: '🌍', position: 0 },
  { score: 40, name: '火星', icon: '🔴', position: 15 },
  { score: 80, name: '木星', icon: '🟤', position: 35 },
  { score: 140, name: '土星', icon: '🪐', position: 55 },
  { score: 200, name: '天王星', icon: '🔵', position: 75 },
  { score: 300, name: '海王星', icon: '🟣', position: 90 },
]

// 火箭位置（基于分数）
const rocketPosition = computed(() => {
  const maxScore = 300
  return Math.min(90, (score.value / maxScore) * 90)
})

// 到达的行星
const reachedPlanet = computed(() => {
  let reached = '地球'
  for (const m of milestones) {
    if (score.value >= m.score) reached = m.name
  }
  return reached
})

const currentQuestion = computed(() => questions.value[currentIndex.value] || { question: '', options: [], answer: 0, explanation: '' } as QuizQuestion)

onMounted(() => {
  // 预加载题目
  questions.value = getMixedQuestions(30)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function startGame() {
  questions.value = getMixedQuestions(30)
  currentIndex.value = 0
  selectedAnswer.value = -1
  showResult.value = false
  score.value = 0
  correctCount.value = 0
  streak.value = 0
  maxStreak.value = 0
  countdown.value = 60
  gameState.value = 'playing'
  startTime.value = Date.now()

  // 启动倒计时
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      endGame()
    }
  }, 1000)
}

function selectAnswer(index: number) {
  if (showResult.value) return
  selectedAnswer.value = index
  showResult.value = true

  const correct = index === currentQuestion.value.answer
  isCorrectAnswer.value = correct
  userStore.recordQuestion(correct)

  if (correct) {
    correctCount.value++
    streak.value++
    if (streak.value > maxStreak.value) maxStreak.value = streak.value
    // 连击加分
    const bonus = streak.value >= 3 ? 5 : 0
    score.value += 20 + bonus
    playCorrectSound()
  } else {
    streak.value = 0
    shakeRocket.value = true
    setTimeout(() => { shakeRocket.value = false }, 500)
    playWrongSound()
  }

  // 自动进入下一题
  setTimeout(() => {
    if (gameState.value !== 'playing') return
    currentIndex.value++
    if (currentIndex.value >= questions.value.length) {
      endGame()
    } else {
      selectedAnswer.value = -1
      showResult.value = false
    }
  }, 1500)
}

function endGame() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  gameState.value = 'result'

  const duration = Math.floor((Date.now() - startTime.value) / 1000)
  userStore.recordGame({
    gameId: `rocket_${Date.now()}`,
    gameType: 'rocket',
    score: score.value,
    correctCount: correctCount.value,
    totalCount: correctCount.value + (questions.value.length - currentIndex.value),
    duration,
    date: new Date().toISOString()
  })
}

function goBack() {
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.rocket-page {
  min-height: 100vh;
  position: relative;
  padding: 0 32rpx;
}

.content {
  position: relative;
  z-index: 1;
}

.game-hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  margin-bottom: 16rpx;
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.hud-icon {
  font-size: 28rpx;
}

.hud-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFD700;
}

.hud-label {
  font-size: 20rpx;
  color: #6B7DB3;
}

.hud-timer {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 8rpx 20rpx;
  background: rgba(79, 195, 247, 0.15);
  border-radius: $radius-round;

  &.timer-warning {
    background: rgba(255, 82, 82, 0.2);
    animation: pulse 0.5s ease-in-out infinite;
  }
}

.timer-value {
  font-size: 36rpx;
  font-weight: 700;
  color: #4FC3F7;

  .timer-warning & {
    color: #FF5252;
  }
}

.timer-label {
  font-size: 20rpx;
  color: #A0B4D0;
}

.rocket-track {
  position: relative;
  height: 400rpx;
  margin: 16rpx 0;
  border-left: 4rpx dashed rgba(255, 255, 255, 0.1);
  margin-left: 60rpx;
}

.milestone {
  position: absolute;
  left: -80rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  opacity: 0.3;
  transition: all 0.5s ease;

  &.milestone-reached {
    opacity: 1;
  }
}

.milestone-icon {
  font-size: 28rpx;
}

.milestone-name {
  font-size: 18rpx;
  color: #A0B4D0;
  white-space: nowrap;
}

.rocket {
  position: absolute;
  left: -40rpx;
  transition: bottom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rocket-icon {
  font-size: 48rpx;
  transition: transform 0.3s ease;

  &.rocket-shake {
    animation: shake 0.5s ease-in-out;
  }
}

.rocket-flame {
  font-size: 24rpx;
}

.ground {
  position: absolute;
  bottom: -10rpx;
  left: -80rpx;

  text {
    font-size: 22rpx;
    color: #6B7DB3;
  }
}

.quiz-area {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.question-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
}

.question-text {
  flex: 1;
  font-size: 28rpx;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.5;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 16rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-md;
  border: 2rpx solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  &.opt-correct {
    border-color: rgba(105, 240, 174, 0.5);
    background: rgba(105, 240, 174, 0.1);
  }

  &.opt-wrong {
    border-color: rgba(255, 82, 82, 0.5);
    background: rgba(255, 82, 82, 0.1);
  }
}

.opt-letter {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 600;
  color: #A0B4D0;
  flex-shrink: 0;
}

.opt-text {
  font-size: 24rpx;
  color: #FFFFFF;
}

.feedback {
  padding: 20rpx;
  border-radius: $radius-md;
  text-align: center;
}

.feedback-text {
  font-size: 30rpx;
  font-weight: 700;
  display: block;
  margin-bottom: 8rpx;

  &.feedback-correct {
    color: #69F0AE;
  }

  &.feedback-wrong {
    color: #FF5252;
  }
}

.feedback-explain {
  font-size: 24rpx;
  color: #A0B4D0;
}

.ready-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
  gap: 16rpx;
}

.ready-icon {
  font-size: 120rpx;
}

.ready-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.ready-desc {
  font-size: 28rpx;
  color: #A0B4D0;
  text-align: center;
}

.result-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  gap: 16rpx;
}

.result-icon {
  font-size: 80rpx;
}

.result-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.result-stats {
  display: flex;
  gap: 40rpx;
  margin: 24rpx 0;
}

.result-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rs-value {
  font-size: 48rpx;
  font-weight: 700;
  color: #FFD700;
}

.rs-label {
  font-size: 22rpx;
  color: #A0B4D0;
}

.result-reach {
  font-size: 30rpx;
  font-weight: 600;
  color: #4FC3F7;
  margin: 16rpx 0;
}

.result-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 24rpx;
}
</style>
