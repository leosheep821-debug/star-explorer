/**
 * 通用工具函数
 */

/** 格式化日期 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${month}-${day}`
}

/** 格式化时间（秒转分秒） */
export function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

/** 随机打乱数组 */
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/** 延迟执行 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 显示成功提示 */
export function showSuccess(title: string): void {
  uni.showToast({ title, icon: 'success', duration: 1500 })
}

/** 显示错误提示 */
export function showError(title: string): void {
  uni.showToast({ title, icon: 'error', duration: 1500 })
}

/** 显示普通提示 */
export function showToast(title: string): void {
  uni.showToast({ title, icon: 'none', duration: 1500 })
}

/** 获取最近N天的日期列表 */
export function getRecentDays(n: number): string[] {
  const days: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

/** 数字动画（从0增长到目标值） */
export function animateNumber(
  from: number,
  to: number,
  duration: number,
  callback: (value: number) => void
): void {
  const startTime = Date.now()
  const step = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    // 缓动函数
    const eased = 1 - Math.pow(1 - progress, 3)
    callback(Math.round(from + (to - from) * eased))
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }
  step()
}
