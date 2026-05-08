/**
 * 语音朗读工具 - 使用微信TTS引擎
 */

/** 朗读文本 */
export function speakText(text: string): void {
  // #ifdef MP-WEIXIN
  const innerAudioContext = uni.createInnerAudioContext()
  // 使用微信插件TTS或系统语音
  if (uni.plugin && uni.plugin.textToSpeech) {
    uni.plugin.textToSpeech({
      content: text,
      success: () => {},
      fail: (err: any) => console.error('语音朗读失败', err)
    })
  } else {
    // H5端使用Web Speech API
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'zh-CN'
      utterance.rate = 0.9
      utterance.pitch = 1.1
      window.speechSynthesis.speak(utterance)
    }
  }
  // #endif

  // #ifdef H5
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9
    utterance.pitch = 1.1
    window.speechSynthesis.speak(utterance)
  }
  // #endif
}

/** 停止朗读 */
export function stopSpeak(): void {
  // #ifdef H5
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
  // #endif
}
