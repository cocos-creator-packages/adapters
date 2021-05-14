const localStorage = {
  get length() {
    const { keys } = my.getStorageInfoSync()

    return keys.length
  },

  key(n) {
    const { keys } = my.getStorageInfoSync()

    return keys[n]
  },

  getItem(key) {
    return my.getStorageSync(key)
  },

  setItem(key, value) {
    return my.setStorageSync(key, value)
  },

  removeItem(key) {
    my.removeStorageSync(key)
  },

  clear() {
    my.clearStorageSync()
  }
}

export default localStorage
