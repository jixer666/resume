/**
 * MD5（RFC 1321）的纯 TS 实现。
 *
 * 上传接口要求 fileMd5 必填，并用它当 OSS 对象名；H5 没有 `uni.getFileInfo`，
 * 小程序端的 `getFileInfo` 也拿不到跨端一致的结果，所以统一用这一份按字节算，
 * 保证各端算出的摘要一致（小程序端选择图片后压缩再读字节，见 utils/chooseImage.ts）。
 */

/** 每轮左移位数（RFC 1321 规定的常量） */
const SHIFT_AMOUNTS = [
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  7,
  12,
  17,
  22,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  5,
  9,
  14,
  20,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  4,
  11,
  16,
  23,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
  6,
  10,
  15,
  21,
]

/** K 表：floor(2^32 × abs(sin(i + 1)))（RFC 1321 规定的常量） */
const SINE_TABLE = new Int32Array([
  0xD76AA478,
  0xE8C7B756,
  0x242070DB,
  0xC1BDCEEE,
  0xF57C0FAF,
  0x4787C62A,
  0xA8304613,
  0xFD469501,
  0x698098D8,
  0x8B44F7AF,
  0xFFFF5BB1,
  0x895CD7BE,
  0x6B901122,
  0xFD987193,
  0xA679438E,
  0x49B40821,
  0xF61E2562,
  0xC040B340,
  0x265E5A51,
  0xE9B6C7AA,
  0xD62F105D,
  0x02441453,
  0xD8A1E681,
  0xE7D3FBC8,
  0x21E1CDE6,
  0xC33707D6,
  0xF4D50D87,
  0x455A14ED,
  0xA9E3E905,
  0xFCEFA3F8,
  0x676F02D9,
  0x8D2A4C8A,
  0xFFFA3942,
  0x8771F681,
  0x6D9D6122,
  0xFDE5380C,
  0xA4BEEA44,
  0x4BDECFA9,
  0xF6BB4B60,
  0xBEBFBC70,
  0x289B7EC6,
  0xEAA127FA,
  0xD4EF3085,
  0x04881D05,
  0xD9D4D039,
  0xE6DB99E5,
  0x1FA27CF8,
  0xC4AC5665,
  0xF4292244,
  0x432AFF97,
  0xAB9423A7,
  0xFC93A039,
  0x655B59C3,
  0x8F0CCC92,
  0xFFEFF47D,
  0x85845DD1,
  0x6FA87E4F,
  0xFE2CE6E0,
  0xA3014314,
  0x4E0811A1,
  0xF7537E82,
  0xBD3AF235,
  0x2AD7D2BB,
  0xEB86D391,
])

/**
 * 计算字节内容的 MD5，返回 32 位小写十六进制字符串。
 * @param buffer 文件内容（`readFileAsArrayBuffer` 的返回值）
 */
export function md5(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const length = bytes.length
  // 补位：先补一个 0x80，再补 0 到 56（mod 64），最后 8 字节是原始比特长度（小端）
  const padded = new Uint8Array((((length + 8) >> 6) + 1) << 6)
  padded.set(bytes)
  padded[length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(padded.length - 8, (length << 3) >>> 0, true)
  view.setUint32(padded.length - 4, Math.floor(length / 0x20000000), true)

  let a0 = 0x67452301
  let b0 = 0xEFCDAB89
  let c0 = 0x98BADCFE
  let d0 = 0x10325476

  const words = new Int32Array(16)
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++)
      words[i] = view.getUint32(offset + i * 4, true) | 0

    let a = a0
    let b = b0
    let c = c0
    let d = d0

    for (let i = 0; i < 64; i++) {
      let f: number
      let g: number
      if (i < 16) {
        f = (b & c) | (~b & d)
        g = i
      }
      else if (i < 32) {
        f = (d & b) | (~d & c)
        g = (5 * i + 1) % 16
      }
      else if (i < 48) {
        f = b ^ c ^ d
        g = (3 * i + 5) % 16
      }
      else {
        f = c ^ (b | ~d)
        g = (7 * i) % 16
      }
      f = (f + a + SINE_TABLE[i] + words[g]) | 0
      a = d
      d = c
      c = b
      b = (b + ((f << SHIFT_AMOUNTS[i]) | (f >>> (32 - SHIFT_AMOUNTS[i])))) | 0
    }

    a0 = (a0 + a) | 0
    b0 = (b0 + b) | 0
    c0 = (c0 + c) | 0
    d0 = (d0 + d) | 0
  }

  return [a0, b0, c0, d0].map(wordToLittleEndianHex).join('')
}

/** 按小端序把 32 位字输出成 8 位十六进制：MD5 的结果按小端排列 */
function wordToLittleEndianHex(word: number): string {
  let hex = ''
  for (let i = 0; i < 4; i++)
    hex += ((word >>> (i * 8)) & 0xFF).toString(16).padStart(2, '0')
  return hex
}
