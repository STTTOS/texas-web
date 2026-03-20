/** 浏览器 SHA-256，输出小写 hex（常见登录传参格式） */
export async function sha256Hex(plain: string): Promise<string> {
  const buf = new TextEncoder().encode(plain)
  const digest = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
