/**
 * 音效管理工具
 */

let audioContext: UniApp.InnerAudioContext | null = null

function getAudioContext(): UniApp.InnerAudioContext {
  if (!audioContext) {
    audioContext = uni.createInnerAudioContext()
  }
  return audioContext
}

/** 播放正确音效 */
export function playCorrectSound(): void {
  try {
    const audio = getAudioContext()
    audio.src = '/static/audio/correct.mp3'
    audio.play()
  } catch (e) {
    // 静默处理音效播放失败
  }
}

/** 播放错误音效 */
export function playWrongSound(): void {
  try {
    const audio = getAudioContext()
    audio.src = '/static/audio/wrong.mp3'
    audio.play()
  } catch (e) {
    // 静默处理
  }
}

/** 播放升级音效 */
export function playLevelUpSound(): void {
  try {
    const audio = getAudioContext()
    audio.src = '/static/audio/levelup.mp3'
    audio.play()
  } catch (e) {
    // 静默处理
  }
}

/** 播放点击音效 */
export function playClickSound(): void {
  try {
    const audio = getAudioContext()
    audio.src = '/static/audio/click.mp3'
    audio.play()
  } catch (e) {
    // 静默处理
  }
}

/** 播放收集音效 */
export function playCollectSound(): void {
  try {
    const audio = getAudioContext()
    audio.src = '/static/audio/collect.mp3'
    audio.play()
  } catch (e) {
    // 静默处理
  }
}
