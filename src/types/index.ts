/** 行星数据类型 */
export interface Planet {
  id: string
  name: string
  nameEn: string
  order: number
  color: string
  icon: string
  description: string
  facts: PlanetFact[]
  diameter: string
  distanceFromSun: string
  orbitalPeriod: string
  moons: number
  temperature: string
  unlocked: boolean
}

/** 行星趣味知识 */
export interface PlanetFact {
  title: string
  content: string
}

/** 问答题类型 */
export interface QuizQuestion {
  id: string
  planetId: string
  question: string
  options: string[]
  answer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

/** 成就徽章类型 */
export interface Achievement {
  id: string
  name: string
  icon: string
  description: string
  condition: string
  unlocked: boolean
  unlockedAt?: string
  category: 'explore' | 'game' | 'collect' | 'social'
}

/** 用户等级配置 */
export interface LevelConfig {
  level: number
  title: string
  minExp: number
  maxExp: number
  icon: string
}

/** 用户信息 */
export interface UserProfile {
  nickname: string
  avatar: string
  level: number
  exp: number
  coins: number
  collectedPlanets: string[]
  achievements: string[]
  totalQuestions: number
  correctQuestions: number
  playDays: number
  lastPlayDate: string
  gameHistory: GameRecord[]
}

/** 游戏记录 */
export interface GameRecord {
  gameId: string
  gameType: 'collector' | 'rocket' | 'constellation' | 'rescue' | 'arena'
  score: number
  correctCount: number
  totalCount: number
  duration: number
  date: string
}

/** 学习报告数据 */
export interface StudyReport {
  totalPlayDays: number
  totalQuestions: number
  correctRate: number
  collectedPlanets: number
  achievements: number
  weeklyData: DailyRecord[]
  weakPlanets: string[]
  strongPlanets: string[]
}

/** 每日学习记录 */
export interface DailyRecord {
  date: string
  questions: number
  correct: number
  duration: number
}
