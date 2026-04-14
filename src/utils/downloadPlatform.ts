export type DownloadPlatform = 'ios' | 'android' | 'other'

/**
 * 浏览器端下载分流用 UA 启发式判断（非设备指纹）。
 * - iPadOS「桌面版网站」常为 Mac + 触屏，用 maxTouchPoints 辅助识别。
 */
export function getDownloadPlatform(): DownloadPlatform {
  if (typeof navigator === 'undefined') return 'other'

  const ua = navigator.userAgent || ''

  if (/iPhone|iPod/i.test(ua)) return 'ios'
  if (/iPad/i.test(ua)) return 'ios'
  if (
    /Macintosh|MacIntel/i.test(ua) &&
    typeof navigator.maxTouchPoints === 'number' &&
    navigator.maxTouchPoints > 1
  ) {
    return 'ios'
  }

  if (/Android/i.test(ua)) return 'android'

  return 'other'
}
