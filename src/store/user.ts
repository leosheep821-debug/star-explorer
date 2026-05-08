import { reactive, watch } from 'vue'
import type { UserProfile, GameRecord } from '@/types'

// 默认用户数据
const defaultProfile: UserProfile = {
  nickname: '小探险家',
  avatar: '',
  level: 1,
  exp: 0,
  coins: 0,
  collectedPlanets: [],
  achievements: [],
  totalQuestions: 0,
  correctQuestions: 0,
  playDays: 0,
  lastPlayDate: '',
  gameHistory: []
}

// 从本地存储加载
function loadProfile(): UserProfile {
  try {
    const saved = uni.getStorageSync('user_profile')
    if (saved) {
      return { ...defaultProfile, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('加载用户数据失败', e)
  }
  return { ...defaultProfile }
}

// 创建响应式状态
const state = reactive<UserProfile>(loadProfile())

// 自动保存到本地
watch(
  () => ({ ...state }),
  (newVal) => {
    try {
      uni.setStorageSync('user_profile', JSON.stringify(newVal))
    } catch (e) {
      console.error('保存用户数据失败', e)
    }
  },
  { deep: true }
)

// 等级经验值配置
const levelConfig = [
  { level: 1, title: '太空新手', minExp: 0, maxExp: 100 },
  { level: 2, title: '星际学徒', minExp: 100, maxExp: 300 },
  { level: 3, title: '宇宙探索者', minExp: 300, maxExp: 600 },
  { level: 4, title: '银河旅行家', minExp: 600, maxExp: 1000 },
  { level: 5, title: '星系冒险王', minExp: 1000, maxExp: 1500 },
  { level: 6, title: '星际英雄', minExp: 1500, maxExp: 2500 },
  { level: 7, title: '宇宙大师', minExp: 2500, maxExp: 4000 },
  { level: 8, title: '星际传说', minExp: 4000, maxExp: 99999 }
]

export function useUserStore() {
  /** 增加经验值 */
  function addExp(amount: number) {
    state.exp += amount
    // 检查升级
    const nextLevel = levelConfig.find(l => l.level === state.level + 1)
    if (nextLevel && state.exp >= nextLevel.minExp) {
      state.level = nextLevel.level
      return true // 返回是否升级
    }
    return false
  }

  /** 增加金币 */
  function addCoins(amount: number) {
    state.coins += amount
  }

  /** 记录答题 */
  function recordQuestion(correct: boolean) {
    state.totalQuestions++
    if (correct) {
      state.correctQuestions++
      addExp(10)
      addCoins(5)
    } else {
      addExp(2)
    }
  }

  /** 记录游戏结果 */
  function recordGame(record: GameRecord) {
    state.gameHistory.unshift(record)
    // 只保留最近100条记录
    if (state.gameHistory.length > 100) {
      state.gameHistory = state.gameHistory.slice(0, 100)
    }
    addExp(record.score)
    addCoins(Math.floor(record.score / 2))
  }

  /** 收集行星 */
  function collectPlanet(planetId: string) {
    if (!state.collectedPlanets.includes(planetId)) {
      state.collectedPlanets.push(planetId)
      addExp(50)
      addCoins(20)
      return true
    }
    return false
  }

  /** 解锁成就 */
  function unlockAchievement(achievementId: string) {
    if (!state.achievements.includes(achievementId)) {
      state.achievements.push(achievementId)
      addExp(30)
      addCoins(15)
      return true
    }
    return false
  }

  /** 更新游玩天数 */
  function updatePlayDays() {
    const today = new Date().toISOString().split('T')[0]
    if (state.lastPlayDate !== today) {
      state.playDays++
      state.lastPlayDate = today
    }
  }

  /** 获取当前等级信息 */
  function getLevelInfo() {
    return levelConfig.find(l => l.level === state.level) || levelConfig[0]
  }

  /** 获取升级进度百分比 */
  function getLevelProgress() {
    const info = getLevelInfo()
    const progress = ((state.exp - info.minExp) / (info.maxExp - info.minExp)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  /** 获取正确率 */
  function getCorrectRate() {
    if (state.totalQuestions === 0) return 0
    return Math.round((state.correctQuestions / state.totalQuestions) * 100)
  }

  /** 重置数据 */
  function resetData() {
    Object.assign(state, { ...defaultProfile })
  }

  return {
    state,
    addExp,
    addCoins,
    recordQuestion,
    recordGame,
    collectPlanet,
    unlockAchievement,
    updatePlayDays,
    getLevelInfo,
    getLevelProgress,
    getCorrectRate,
    resetData
  }
}
