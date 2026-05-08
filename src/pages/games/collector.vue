<template>
  <view class="collector-page">
    <StarField />
    <NavBar :title="targetPlanet ? `收集 ${targetPlanet.name}` : '行星收集家'" showBack />

    <view class="content">
      <!-- 游戏状态 -->
      <view class="game-status">
        <view class="status-item">
          <text class="status-icon">🎯</text>
          <text class="status-value">{{ correctCount }} / 3</text>
          <text class="status-label">目标</text>
        </view>
        <view class="status-item">
          <text class="status-icon">❓</text>
          <text class="status-value">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</text>
          <text class="status-label">题目</text>
        </view>
        <view class="status-item">
          <text class="status-icon">⭐</text>
          <text class="status-value">{{ score }}</text>
          <text class="status-label">得分</text>
        </view>
      </view>

      <!-- 目标行星预览 -->
      <view v-if="targetPlanet" class="target-planet animate-breathe">
        <view class="target-sphere" :style="{ background: `radial-gradient(circle at 35% 35%, ${targetPlanet.color}CC, ${targetPlanet.color})` }">
          <text style="font-size: 56rpx;">{{ targetPlanet.icon }}</text>
        </view>
        <text class="target-name">{{ targetPlanet.name }}</text>
        <text class="target-hint">答对 3 题即可收集！</text>
      </view>

      <!-- 答题区域 -->
      <view v-if="gameState === 'playing'" class="quiz-area animate-slide-up">
        <!-- 题目 -->
        <view class="question-card">
          <text class="question-text">{{ currentQuestion.question }}</text>
          <VoiceButton :text="currentQuestion.question" />
        </view>

        <!-- 选项 -->
        <view class="options-list">
          <view
            v-for="(option, index) in currentQuestion.options"
            :key="index"
            class="option-item"
            :class="{
              'option-selected': selectedAnswer === index,
              'option-correct': showResult && index === currentQuestion.answer,
              'option-wrong': showResult && selectedAnswer === index && index !== currentQuestion.answer
            }"
            @click="selectAnswer(index)"
          >
            <view class="option-letter" :class="{
              'letter-correct': showResult && index === currentQuestion.answer,
              'letter-wrong': showResult && selectedAnswer === index && index !== currentQuestion.answer
            }">
              <text>{{ ['A', 'B', 'C', 'D'][index] }}</text>
            </view>
            <text class="option-text">{{ option }}</text>
            <text v-if="showResult && index === currentQuestion.answer" class="option-result">✅</text>
            <text v-if="showResult && selectedAnswer === index && index !== currentQuestion.answer" class="option-result">❌</text>
          </view>
        </view>

        <!-- 答案解析 -->
        <view v-if="showResult" class="explanation animate-fade-in">
          <text class="explanation-title">💡 答案解析</text>
          <text class="explanation-text">{{ currentQuestion.explanation }}</text>
          <VoiceButton :text="currentQuestion.explanation" />
        </view>

        <!-- 下一题按钮 -->
        <view v-if="showResult" class="next-btn-wrap">
          <ActionButton
            :text="isLastQuestion ? (correctCount >= 3 ? '🎉 查看结果' : '😅 查看结果') : '下一题 →'"
            type="primary"
            block
            round
            @click="nextQuestion"
          />
        </view>
      </view>

      <!-- 结果页 -->
      <view v-if="gameState === 'result'" class="result-area animate-slide-up">
        <view v-if="correctCount >= 3" class="result-success">
          <text class="result-emoji animate-pulse">🎉</text>
          <text class="result-title">恭喜收集成功！</text>
          <view class="result-planet" :style="{ background: `radial-gradient(circle at 35% 35%, ${targetPlanet!.color}CC, ${targetPlanet!.color})` }">
            <text style="font-size: 80rpx;">{{ targetPlanet!.icon }}</text>
          </view>
          <text class="result-planet-name">{{ targetPlanet!.name }} 已加入你的图鉴！</text>
          <text class="result-score">本次得分：{{ score }} 分</text>
        </view>
        <view v-else class="result-fail">
          <text class="result-emoji">💪</text>
          <text class="result-title">再接再厉！</text>
          <text class="result-desc">答对了 {{ correctCount }} 题，还需要 {{ 3 - correctCount }} 题才能收集哦</text>
          <text class="result-score">本次得分：{{ score }} 分</text>
        </view>

        <view class="result-actions">
          <ActionButton
            v-if="correctCount < 3"
            text="🔄 再试一次"
            type="primary"
            block
            round
            @click="restartGame"
          />
          <ActionButton
            text="🏠 返回首页"
            type="secondary"
            block
            round
            @click="goHome"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { QuizQuestion } from '@/types'
import StarField from '@/components/StarField.vue'
import NavBar from '@/components/NavBar.vue'
import VoiceButton from '@/components/VoiceButton.vue'
import ActionButton from '@/components/ActionButton.vue'
import { getPlanetById } from '@/data/planets'
import { getQuestionsByPlanet } from '@/data/questions'
import { shuffle } from '@/utils/common'
import { playCorrectSound, playWrongSound, playCollectSound } from '@/utils/audio'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const targetPlanetId = ref('')
const targetPlanet = computed(() => getPlanetById(targetPlanetId.value))

const gameState = ref<'playing' | 'result'>('playing')
const questions = ref<QuizQuestion[]>([])
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(-1)
const showResult = ref(false)
const correctCount = ref(0)
const score = ref(0)
const startTime = ref(Date.now())

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || { question: '', options: [], answer: 0, explanation: '' } as QuizQuestion)
const isLastQuestion = computed(() => currentQuestionIndex.value >= questions.value.length - 1)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.$page?.options || currentPage.options || {}
  targetPlanetId.value = options.planetId || 'mercury'
  initGame()
})

function initGame() {
  const qs = getQuestionsByPlanet(targetPlanetId.value)
  questions.value = shuffle(qs).slice(0, 5)
  currentQuestionIndex.value = 0
  selectedAnswer.value = -1
  showResult.value = false
  correctCount.value = 0
  score.value = 0
  gameState.value = 'playing'
  startTime.value = Date.now()
}

function selectAnswer(index: number) {
  if (showResult.value) return
  selectedAnswer.value = index
  showResult.value = true

  const isCorrect = index === currentQuestion.value.answer
  userStore.recordQuestion(isCorrect)

  if (isCorrect) {
    correctCount.value++
    score.value += 20
    playCorrectSound()
  } else {
    playWrongSound()
  }
}

function nextQuestion() {
  if (isLastQuestion.value) {
    finishGame()
    return
  }
  currentQuestionIndex.value++
  selectedAnswer.value = -1
  showResult.value = false
}

function finishGame() {
  gameState.value = 'result'
  const duration = Math.floor((Date.now() - startTime.value) / 1000)

  // 记录游戏结果
  userStore.recordGame({
    gameId: `collector_${Date.now()}`,
    gameType: 'collector',
    score: score.value,
    correctCount: correctCount.value,
    totalCount: questions.value.length,
    duration,
    date: new Date().toISOString()
  })

  // 如果答对3题以上，收集行星
  if (correctCount.value >= 3 && targetPlanet.value) {
    const isNew = userStore.collectPlanet(targetPlanetId.value)
    if (isNew) {
      playCollectSound()
    }
  }
}

function restartGame() {
  initGame()
}

function goHome() {
  uni.navigateBack({ delta: 1 })
}
</script>

<style lang="scss" scoped>
.collector-page {
  min-height: 100vh;
  position: relative;
  padding: 0 32rpx;
}

.content {
  position: relative;
  z-index: 1;
}

.game-status {
  display: flex;
  justify-content: space-around;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  margin-bottom: 24rpx;
}

.status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.status-icon {
  font-size: 32rpx;
}

.status-value {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFD700;
}

.status-label {
  font-size: 20rpx;
  color: #6B7DB3;
}

.target-planet {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32rpx;
}

.target-sphere {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 40rpx rgba(255, 255, 255, 0.15);
}

.target-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #FFFFFF;
  margin-top: 16rpx;
}

.target-hint {
  font-size: 22rpx;
  color: #A0B4D0;
  margin-top: 4rpx;
}

.quiz-area {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.question-card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 28rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  border: 2rpx solid rgba(79, 195, 247, 0.2);
}

.question-text {
  flex: 1;
  font-size: 30rpx;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.6;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.06);
  border-radius: $radius-lg;
  border: 2rpx solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
  }

  &.option-selected {
    border-color: rgba(79, 195, 247, 0.5);
    background: rgba(79, 195, 247, 0.1);
  }

  &.option-correct {
    border-color: rgba(105, 240, 174, 0.5);
    background: rgba(105, 240, 174, 0.1);
  }

  &.option-wrong {
    border-color: rgba(255, 82, 82, 0.5);
    background: rgba(255, 82, 82, 0.1);
  }
}

.option-letter {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  color: #A0B4D0;
  flex-shrink: 0;

  &.letter-correct {
    background: rgba(105, 240, 174, 0.3);
    color: #69F0AE;
  }

  &.letter-wrong {
    background: rgba(255, 82, 82, 0.3);
    color: #FF5252;
  }
}

.option-text {
  flex: 1;
  font-size: 28rpx;
  color: #FFFFFF;
}

.option-result {
  font-size: 32rpx;
}

.explanation {
  padding: 24rpx;
  background: rgba(255, 215, 0, 0.06);
  border-radius: $radius-lg;
  border: 1rpx solid rgba(255, 215, 0, 0.15);
}

.explanation-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #FFD700;
  display: block;
  margin-bottom: 8rpx;
}

.explanation-text {
  font-size: 26rpx;
  color: #A0B4D0;
  line-height: 1.7;
}

.next-btn-wrap {
  margin-top: 16rpx;
}

.result-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
}

.result-success, .result-fail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
}

.result-emoji {
  font-size: 80rpx;
}

.result-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #FFFFFF;
}

.result-planet {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 60rpx rgba(255, 215, 0, 0.3);
  margin: 16rpx 0;
}

.result-planet-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #69F0AE;
}

.result-desc {
  font-size: 28rpx;
  color: #A0B4D0;
  text-align: center;
}

.result-score {
  font-size: 28rpx;
  color: #FFD700;
  margin-top: 8rpx;
}

.result-actions {
  width: 100%;
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
</style>
