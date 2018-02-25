export default {
  mixArray (myArr) {
    let aArr = myArr
    const num = myArr.length
    for (var i = 0; i < num; i++) {
      var iRand = parseInt(num * Math.random())
      var temp = aArr[i]
      aArr[i] = aArr[iRand]
      aArr[iRand] = temp
    }
    return aArr
  },
  timeCountDown (timestap, cb) {
    const cbs = cb || Object
    let m, s
    // 传入开始时间戳
    if (+timestap > 1000000000000) {
      const data = new Date(timestap)
      m = data.getMinutes()
      s = data.getSeconds()
    } else {
      // 传入时间差时间戳(按毫秒计算)
      m = parseInt(timestap / 1000 / 60)
      s = parseInt(timestap / 1000) % 60
    }
    let timer
    cbs(this.initTimeFormat(m, s))
    if (timer) {
      clearInterval(timer)
    } else {
      timer = setInterval(() => {
        s--
        if (s < 0) {
          m--
          s = 59
        }
        if (+m === 0 && +s === 0) clearInterval(timer)
        cbs(this.initTimeFormat(m, s))
      }, 1000)
    }
  },
  initTimeFormat (m, s) {
    if (m < 10 && s >= 10) return `0${m}:${s}`
    if (s < 10 && m >= 10) return `${m}:0${s}`
    if (m < 10 && s < 10) return `0${m}:0${s}`
    if (m >= 10 && s >= 10) return `${m}:${s}`
  }
}
