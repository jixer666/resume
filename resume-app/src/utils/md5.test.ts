import { describe, expect, it } from 'vitest'
import { md5 } from './md5'

/** 按 UTF-8 编码成 ArrayBuffer：上传接口读文件字节后就是这么算的 */
function bufferOf(text: string): ArrayBuffer {
  return new TextEncoder().encode(text).buffer as ArrayBuffer
}

/**
 * 后端把 fileMd5 当 OSS 对象名，各端必须算出同一个摘要，
 * 所以这里锁住 RFC 1321 的标准向量，以及补位边界（55 / 56 / 64 / 65 / 128 字节）
 * 与二进制字节的摘要 —— 后几组期望值由 OpenSSL 生成，覆盖「需要多补一块」的情形。
 */
describe('md5', () => {
  it('空输入输出 RFC 1321 的标准摘要', () => {
    expect(md5(bufferOf(''))).toBe('d41d8cd98f00b204e9800998ecf8427e')
  })

  it('短输入输出 RFC 1321 的标准摘要', () => {
    expect(md5(bufferOf('abc'))).toBe('900150983cd24fb0d6963f7d28e17f72')
    expect(md5(bufferOf('message digest'))).toBe('f96b697d7cb7938d525a2f31aaf161d0')
  })

  it('含大小写与数字的长输入输出 RFC 1321 的标准摘要', () => {
    expect(md5(bufferOf('abcdefghijklmnopqrstuvwxyz'))).toBe('c3fcd3d76192e4007dfb496cca67e13b')
    expect(md5(bufferOf('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'))).toBe('d174ab98d277d9f5a5611c2c9f419d9f')
  })

  it('跨 64 字节分组的 80 字节输入输出 RFC 1321 的标准摘要', () => {
    expect(md5(bufferOf('1234567890'.repeat(8)))).toBe('57edf4a22be3c955ac49da2e2107b67a')
  })

  it('55 / 56 字节（补位刚好跨块）输出与 OpenSSL 一致的摘要', () => {
    expect(md5(bufferOf('a'.repeat(55)))).toBe('ef1772b6dff9a122358552954ad0df65')
    expect(md5(bufferOf('a'.repeat(56)))).toBe('3b0c8ac703f828b04c6c197006d17218')
  })

  it('64 / 65 / 128 字节（整块与跨块）输出与 OpenSSL 一致的摘要', () => {
    expect(md5(bufferOf('a'.repeat(64)))).toBe('014842d480b571495a4a0363793f7367')
    expect(md5(bufferOf('a'.repeat(65)))).toBe('c743a45e0d2e6a95cb859adae0248435')
    expect(md5(bufferOf('a'.repeat(128)))).toBe('e510683b3f5ffe4093d021808bc6ff70')
  })

  it('二进制字节（0x00-0xFF）输出与 OpenSSL 一致的摘要', () => {
    const bytes = new Uint8Array(Array.from({ length: 256 }, (_, index) => index))
    expect(md5(bytes.buffer as ArrayBuffer)).toBe('e2c865db4162bed963bfaa9ef6ac18f0')
  })
})
