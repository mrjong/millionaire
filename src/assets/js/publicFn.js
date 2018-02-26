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
  timeCountDown (timestap, intervalTime, cb) {
    const cbs = cb || Object
    let m, s, h
    // 传入开始时间戳
    if (+timestap > 1000000000000) {
      const data = new Date(timestap)
      h = data.getHours()
      m = data.getMinutes()
      s = data.getSeconds()
    }
    if (+timestap <= 10) { // 10秒之内倒计时，可直接传入需要倒计时的秒数
      h = 0
      m = 0
      s = timestap
    } else {
      // 传入时间差时间戳(按毫秒计算)
      const timeSecond = parseInt(timestap / 1000) // s
      s = timeSecond % 60
      m = parseInt(timeSecond / 60 % 60)
      h = parseInt(timeSecond / 60 / 60 % 24)
    }
    cbs({
      h: h,
      m: m,
      s: s
    })
    let timer
    timer && clearInterval(timer)
    timer = setInterval(() => {
      s--
      if (s < 0) {
        m--
        s = 59
      }
      if (m < 0) {
        h--
        m = 59
      }
      if (+m === 0 && +s === 0 && +h === 0) clearInterval(timer)
      cbs({
        h: h,
        m: m,
        s: s
      })
    }, intervalTime)
  }
}
