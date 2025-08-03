import CryptoJS from 'crypto-js'
const SALT = 'YOUR_APP_SALT' // 建议替换为系统级盐值

export const encryptPassword= (password)=> {
  return CryptoJS.SHA256(password + SALT).toString()
}
