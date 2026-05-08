import type { Achievement } from '@/types'

/** 成就徽章配置 - 共22个 */
export const achievements: Achievement[] = [
  // ===== 探索类 =====
  {
    id: 'ach_first_look',
    name: '初见宇宙',
    icon: '🔭',
    description: '第一次查看行星详情',
    condition: 'view_first_planet',
    unlocked: false,
    category: 'explore'
  },
  {
    id: 'ach_all_planets',
    name: '宇宙通览',
    icon: '🌌',
    description: '查看过所有8颗行星的详情',
    condition: 'view_all_planets',
    unlocked: false,
    category: 'explore'
  },
  {
    id: 'ach_voice_play',
    name: '竖起耳朵',
    icon: '👂',
    description: '第一次使用语音朗读功能',
    condition: 'use_voice_first',
    unlocked: false,
    category: 'explore'
  },
  {
    id: 'ach_voice_50',
    name: '聆听达人',
    icon: '🎧',
    description: '累计使用语音朗读50次',
    condition: 'use_voice_50',
    unlocked: false,
    category: 'explore'
  },

  // ===== 收集类 =====
  {
    id: 'ach_first_collect',
    name: '初次收集',
    icon: '⭐',
    description: '收集第一颗行星卡片',
    condition: 'collect_first',
    unlocked: false,
    category: 'collect'
  },
  {
    id: 'ach_collect_3',
    name: '三行星联盟',
    icon: '🌟',
    description: '收集3颗行星卡片',
    condition: 'collect_3',
    unlocked: false,
    category: 'collect'
  },
  {
    id: 'ach_collect_5',
    name: '五星连珠',
    icon: '✨',
    description: '收集5颗行星卡片',
    condition: 'collect_5',
    unlocked: false,
    category: 'collect'
  },
  {
    id: 'ach_collect_all',
    name: '太阳系征服者',
    icon: '👑',
    description: '收集全部8颗行星卡片',
    condition: 'collect_all',
    unlocked: false,
    category: 'collect'
  },
  {
    id: 'ach_inner_planets',
    name: '内行星专家',
    icon: '🪐',
    description: '收集所有内行星（水金地火）',
    condition: 'collect_inner',
    unlocked: false,
    category: 'collect'
  },
  {
    id: 'ach_outer_planets',
    name: '外行星猎手',
    icon: '💫',
    description: '收集所有外行星（木土天海）',
    condition: 'collect_outer',
    unlocked: false,
    category: 'collect'
  },

  // ===== 游戏类 =====
  {
    id: 'ach_first_game',
    name: '游戏新手',
    icon: '🎮',
    description: '完成第一次游戏',
    condition: 'play_first_game',
    unlocked: false,
    category: 'game'
  },
  {
    id: 'ach_perfect',
    name: '完美通关',
    icon: '💯',
    description: '在任意游戏中全部答对',
    condition: 'perfect_game',
    unlocked: false,
    category: 'game'
  },
  {
    id: 'ach_speed_demon',
    name: '速度恶魔',
    icon: '⚡',
    description: '在火箭挑战中30秒内答对5题',
    condition: 'rocket_speed',
    unlocked: false,
    category: 'game'
  },
  {
    id: 'ach_streak_5',
    name: '五连正确',
    icon: '🔥',
    description: '连续答对5道题',
    condition: 'streak_5',
    unlocked: false,
    category: 'game'
  },
  {
    id: 'ach_streak_10',
    name: '十连正确',
    icon: '💪',
    description: '连续答对10道题',
    condition: 'streak_10',
    unlocked: false,
    category: 'game'
  },
  {
    id: 'ach_games_10',
    name: '游戏达人',
    icon: '🏆',
    description: '累计完成10次游戏',
    condition: 'play_10_games',
    unlocked: false,
    category: 'game'
  },
  {
    id: 'ach_games_50',
    name: '游戏大师',
    icon: '🏅',
    description: '累计完成50次游戏',
    condition: 'play_50_games',
    unlocked: false,
    category: 'game'
  },

  // ===== 学习类 =====
  {
    id: 'ach_questions_10',
    name: '知识萌芽',
    icon: '🌱',
    description: '累计答题10道',
    condition: 'answer_10',
    unlocked: false,
    category: 'social'
  },
  {
    id: 'ach_questions_50',
    name: '知识树苗',
    icon: '🌳',
    description: '累计答题50道',
    condition: 'answer_50',
    unlocked: false,
    category: 'social'
  },
  {
    id: 'ach_questions_100',
    name: '知识大树',
    icon: '🌲',
    description: '累计答题100道',
    condition: 'answer_100',
    unlocked: false,
    category: 'social'
  },
  {
    id: 'ach_level_3',
    name: '星际学徒',
    icon: '🚀',
    description: '等级达到3级',
    condition: 'reach_level_3',
    unlocked: false,
    category: 'social'
  },
  {
    id: 'ach_level_5',
    name: '星系冒险王',
    icon: '🌟',
    description: '等级达到5级',
    condition: 'reach_level_5',
    unlocked: false,
    category: 'social'
  }
]

/** 根据分类获取成就 */
export function getAchievementsByCategory(category: string): Achievement[] {
  return achievements.filter(a => a.category === category)
}

/** 获取已解锁成就数量 */
export function getUnlockedCount(unlockedIds: string[]): number {
  return achievements.filter(a => unlockedIds.includes(a.id)).length
}
