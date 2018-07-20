const locale = {
  await: { // 首页
    next_time_text: 'Next Time',
    next_bonus_text: 'Next Bonus',
    come_soon: 'Coming soon',
    living: 'LIVING',
    login_text: 'Log in',
    set_reminder_btn: 'Set Reminder',
    cancel_reminder_btn: 'Cancel Reminder',
    reminder_phone: 'Phone Number',
    remider_tip: 'Remind me everyday',
    userinfo_blance_text: 'Balance',
    userinfo_rank_text: 'Weekly Rank',
    extra_lives_text: 'EXTRA LIVES:',
    get_more_text: 'Get More',
    referral_code_btn: 'Apply Referral Code',
    invite_btn: 'Invite & Earn Cash',
    play_card_title: 'HOW TO PLAY', // 玩法规则
    play_card_step1: 'Sign up, answer questions at <span class="special">10PM</span>everyday',
    play_card_step2: 'Answer all 12 questions right, win up to <span class="special">₹1,000,000!</span>',
    play_card_step3: 'Use<span class="special"> EXTRA LIFE </span>when answering incorrectly. Invite new user to get it!',
    play_card_step4: 'Answer it,quiz it,win up to <span class="special">₹1,000,000!</span>',
    ses_question_btn: 'Set Questions',
    teamBattle: 'Team Battle',
    referral_code_pop: { // 输入邀请码弹框及相关case
      title: 'APPLY REFERRAL CODE',
      description: 'Enter a friend\'s Referral Code to get an extra life.',
      instructions: 'Referral Code',
      case1: 'You can not enter your own Referral Code.',
      case2: 'Invalid referral code, please check it now.',
      case3: 'You\'ve already applied a referral code. You can apply only once.',
      case4: 'This referral code expired.',
      case5: 'Sorry, you missed the last chance of using this referral code. You can share or invite friends to get more!',
      case6: 'This referral code has already been applied',
      case7: 'Fail to submit, please try again later.',
      cancel: 'Cancel',
      ok: 'OK'
    },
    remider_pop: { // 订阅和取消提醒弹框及相关case
      case1: 'Please enter right phone number',
      case2: 'Your phone number already set  reminder.',
      case3: 'Fail to submit, please try again later.',
      case4: 'Congrats. You already set your reminder.',
      cancel_case1: 'Are you sure to cancel quiz reminder?',
      cancel_case2: 'Cancel Reminder is Failed',
      cancel_case3: 'Cancel Reminder Successful'
    },
    set_question_pop: 'Please login to set questions and you can get questions and hints in advance, and chances to win extra prize!' // 出图弹框
  },
  balance: { // 余额页面
    your_blance: 'Your Balance',
    total_revenus: 'Total Revenus',
    history: 'History',
    hint: 'You can cash out with the minimum balance of ₹150.After Approved,the cash will be transferred in 7 days.',
    cash_out_btn: 'Cash Out'
  },
  balanceDetail: { // 余额详情
    title: 'Cash Out',
    withdraw_cash_text: 'Withdraw Cash',
    name: 'Name',
    p_number: 'Permanent Account Number',
    paytm: 'Paytm Account',
    noitce: 'Notice: The above information will be submitted to Paytm for cash out. Currently, only Indian rupee are available to withdraw cash in this game.',
    cash_out_btn: 'Cash Out',
    balance_pop: { // 提现弹框及case
      no_money: 'Sorry you need a minimum balance of {currencyType} {withdraw} to cash out. Win more games to get it!',
      no_name: 'Please enter the right name',
      no_p_number: 'Please enter a right PAN ID',
      no_ptm: 'Please enter a valid Paytm account!',
      text: 'Your Paytm account is <p><b>{myPay}</b></p>Do you want to cash out now?',
      submit_success: 'Success! You’ll receive your balance after reviewing.',
      submit_faild1: 'Records about your account doesn\'t exist.',
      submit_faild2: 'Your account balance is not enough.',
      submit_faild3: 'Loading error, please check your internet now.',
      ok: 'Ok'
    }
  },
  balanceRecord: { // 提现记录
    withdrawal_title: 'Withdrawal History',
    cash_title: 'Cash History',
    item_withdrawal_title: 'Cash out',
    item_cash_title1: 'Win Cash',
    item_cash_title2: 'Withdraw Cash',
    delete: 'Delete All',
    no_withdrawal: 'No Withdrawal History',
    no_cash: 'No Cash History',
    faild_hint: 'Sorry,your apply for cash out was failed. Please check and submit again.',
    cash_status: { // 提现记录状态
      withdrawing: 'Withdrawing',
      approved: 'Approved',
      failed: 'Failed',
      success: 'Success'
    },
    delete_pop: { // 删除记录弹框
      delete_withdwawal: 'Are you sure you want to delete all the withdrawal history?',
      delete_cash: 'Are you sure you want to delete all the cash history?',
      delete_faild: 'You failed to delete the Withdrawal History.'
    }
  },
  blank: { // 空白页面
    text1: 'Sorry!',
    text2: 'Currently, we don\'t provide any game service in EU, and it is only available in India.'
  },
  contact: { // 联系我们
    title: 'Contact Us',
    describe: 'If you have any question, or you want to delete your account permanently. Feel free to contact us by the following methods:',
    email: 'gomillionaire@apusapps.com',
    fb: 'Facebook',
    twitter: 'Twitter',
    ins: 'Instagram'
  },
  invite: { // 邀请助力
    rule_bnt: 'Rules',
    invite_btn: 'Invite & Earn Cash',
    steps_title: 'How To Earn',
    rank_text1: 'Invite {number} freshmen',
    rank_text2: 'Earn',
    rank_text3: 'Get Reward',
    rank_text4: 'Not play yet',
    rank_text5: ' Played on {time}',
    rank_text6: ' Invited on {time}',
    rank_hint: '- You will get cash after the friends invited first playing \'Go!Millionaire\'-',
    rule: [ // 规则说明
      '1. You can invite friends through Facebook, WhatsApp，twitter etc.;',
      '2. The one you invite should play \'Go! Millionaire\', then only you can receive the rewards रु10',
      '3. You can do cashout with Paytm account when your balance reaches Rs. 150;',
      '4. You have to submit your PAN ID when you withdraw;',
      '5. The cash will be transferred in 7 days;',
      '6. You can not get cash/live from the friend who already registered before.'
    ],
    steps: [
      'Invite your friends to play',
      'Ask your friends to do sign up and play',
      'You can earn Rs.10, when your friends has played this game'
    ],
    rank_text: [
      'Weekly Rank', 'Total Rank', 'My Invite'
    ],
    no_list_title: 'No Friends invited',
    no_list_text: '. Invite friends to earn cash right now!'
  },
  login: { // 登录页面
    title: 'Sign Up',
    tel_tip: 'Enter Your Phone Number',
    code_tip: 'Enter your Verification Code',
    send_btn: 'send',
    login_btn: 'Sign Up',
    notice: 'Notice: The mobile number will only be used to receive the SMS verification code from Tencent Cloud.',
    login_pop: { // 登录弹框及case
      text1: 'Please enter a right phone number.',
      text2: 'Wrong verification code, please try again.',
      text3: 'Fail to verify the code, please try again.',
      text4: 'Sending the code too often. Please verify later.',
      text5: 'Fail to send, please try again.',
      text6: 'Sorry',
      text6_1: 'Oops, don\'t be upset. Your balance already reset to zero since you didn\'t cash out within the first 24 hours after you won. Please login after you win immediately for the next time.',
      text7: 'You\'ve logged in this account on other device. Please check and try another one.',
      text8: 'You have disconnected. Please check your internet connection and try again.',
      btn1: 'OK',
      btn2: 'Try again'
    }
  },
  main: {
    count_down: 'Starting in {time}',
    send_btn: 'Send',
    viewing: 'Viewing',
    anwser_out_text: 'Out',
    anwser_incorrect_text: 'Incorrect',
    watching: 'eliminated'
  },
  anwser_rank: { // 答题排行榜
    week_tap: 'Weekly Rank',
    total_tap: 'All Time Rank',
    not_on_list: 'Not on the list'
  },
  rule: { // 游戏说明页
    title: 'How to play',
    ruleList: [
      {
        title: `Join our live Quiz Game on time`,
        describe: `Please don't be late as you'll lose the cash prize. A push notification will be sent to remind you.`
      },
      {
        title: `Answer each question in 10s`,
        describe: `There're 12 questions. Choose the answer in 10 seconds for each.`
      },
      {
        title: `Answer them all right to WIN Cash`,
        describe: `People who will give all answer right, the cash prize will split among all the winners.`
      },
      {
        title: `One who answer wrong will be out`,
        describe: `If you choose the wrong answer, or time is out, that means you are out from the game`
      },
      {
        title: `No winners? Get next prize bigger`,
        describe: `The prize rolls over to the next day if no one get all questions right.`
      },
      {
        title: `Cashout through Paytm`,
        describe: `You can cash out from your Paytm account if you win.`
      },
      {
        title: `Invite friends and  win real cash together`,
        describe: ``
      }
    ],
    fb_describe: 'Wanna get more tips how to win? Like us on Facebook page!'
  },
  setQuestion: { // 出题页面
    title: 'Set Questions Myself',
    share_btn: 'Follow Us',
    name: 'YOUR NAME',
    tel: 'YOUR PHONE NUMBER',
    question: 'Tap to set your question now',
    option_a: 'Option A',
    option_b: 'Option B',
    option_c: 'Option C',
    correct_text: 'Correct answer',
    submit_btn: 'Submit',
    question_rule: { // 出题规则
      title1: 'We Required QUIZ MASTER !',
      title2: 'Set it, Question it, Win it!!',
      notice_title: 'Notice',
      instruction: [
        '1. Set your questions with proper grammar and spelling, and submit them,  to be our QUIZ MASTER.',
        '2. Once your questions are selected, you\'ll get the chances to answer your own question in \'Go! Millionaire\' Game to win.',
        '3. Your name will be featured below your questions, which means your name and question will be seen by millions of APUS Users.',
        '4. We\'ll announce each QUIZ MASTER on @APUSBrowser Facebook page everyday.'
      ],
      notice: {
        title: 'Note:',
        text1: 'English questions only.',
        text2: 'Submit as many as questions as you can to become our "Golden QUIZ master"',
        text3: 'MASTER" every week, awards await you.'
      },
      agree_btn: 'OK, I agree'
    },
    question_pop: { // 出题弹框及case
      submit_faild_title: 'Failed to Submit',
      no_name: 'Please enter your name.',
      no_tel: 'Please enter your phone number',
      wrong_tel: 'Please enter right phone number',
      no_question: 'Please complete the question',
      no_answer: 'Please complete the answer',
      submit_faild: 'Your Internet is unstable, please try again.',
      ok: 'Ok'
    }
  },
  setQuestionResult: { // 出题结果页
    title: 'Set Questions Myself',
    text1: 'Your question has been submitted.',
    text2: 'Thank you! Knowledge is power. We\'ll review all submissions and announce the selected questions and  QUIZ MASTER on APUS Browser Facebook page everyday.',
    text3: 'You will acquire:',
    text4: '1.Get Hint everyday for quiz',
    text5: '2. More interesting contests to win prize',
    text6: '3. Chance to join Quiz Master Group',
    share_btn: 'Follow Us',
    submit_btn: 'Submit another'
  },
  userCenter: { // 个人中心
    like_us: 'Like Us',
    title: 'User Profile',
    save: 'Save ',
    edit: 'Edit',
    name: 'Nickname',
    tel: 'Phone Number',
    code: 'Referral Code',
    cash_history: 'Cash History',
    contact: 'Contact Us',
    logout_btn: 'Log Out',
    logout_pop: {
      text1: 'Are you sure you want to log out?',
      text2: 'You failed to logout, please try again.'
    },
    edit_pop: { // 编辑个人中心弹框
      save_success: 'User Profile Saved successfully',
      save_faild: 'User profile not saved',
      upload_success: 'Profile Picture Uploaded successfully',
      upload_faild: 'Profile Picture Upload Failed ',
      picture_large: 'The picture uploading is too large',
      picture_format_error: 'The format of picture is incorrect',
      ok: 'Ok'
    }
  },
  shareDetail: { // 分享详情页
    title: 'Extra Lives',
    describe1: 'You can use EXTRA LIVES when you answer incorrectly after logging in. It will be applied automatically. Two extra lives could be used per game except the last question.',
    describe2: 'You can get it through INVITING a new user. Every time he/she signs up with your Referral Code and play our game, both of you get one.',
    text: 'My Referral Code:',
    share_btn: 'Invite'
  },
  receiveCard: { // 分享社交app弹框
    share_title: 'I\'m playing \'Go! Millionaire\', my referral code is {code}，join us and win up to Rs.1,000,000 at 10PM every day!',
    share_descripe: 'Download Go!Millonaire Browser and use my referral code {code}, let keep winning cash every day!',
    share_pop: {
      text1: 'My Referral Code:',
      text2: 'Inviting friends to get it now!'
    },
    invite_pop: {
      text1: 'Invite  friends to earn cash quickly',
      text2: 'Each invitation can earn up to ₹10000'
    },
    balance_share_title: 'I withdrew cash RS 150.89 in Go!Millionaire now, my referral code is {code}, join us and win up to Rs.1,000,000 at 10PM every day!',
    reward_share_title: 'I won cash RS 150.89 in Go!Millionaire now, my referral code is {code}, join us and win up to Rs.1,000,000 at 10PM every day!'
  },
  reviveGuide: { // 复活卡说明页
    title: 'Referral Code Available Now!',
    text1: 'Keep playing when answer incorrectly',
    text2: 'Get more chances to WIN',
    text3: 'Win cash to be the next MILLIONAIRE!',
    btn: 'Get Extra Life Now'
  },
  winnersResult: { // 答题结果页
    result_tip: 'Prize rolls over to next game',
    no_winner: 'No winners!',
    title1: 'Winners!',
    title2: 'You Won!',
    hint: 'Congrats! {winnerAmount} winners in this game!'
  },
  policyBomb: { // 隐私协议弹框
    agreement: 'User Agreement',
    policy: 'Privacy Policy',
    describe1: 'In order to improve game experience and protect user data, please read the',
    describe2: 'and',
    describe3: 'carefully before you start game!',
    symbol: '&'
  },
  NewAnnouncement: '<span class="iconfont icon-laba horn"></span>Hey, Crorepati! Do you want to open a TREASURE BOX? Join us at 10PM everyday, you\'ll be the lucky one!',
  stringWords: [ // 默认串词
    'Welcome to \'Go Millionaire\' game! Answer all question right and you can win upto ₹1,000,000 every day!',
    'You just need to tap on the right answer , If you answer any  wrong question, you can use extra life. Now get ready to play!'],
  newbieTask: {
    start_page: {
      desp: 'Hey, welcome to \'Go! Millionaire\'. Here is an <span class="important">EXTRA LIFE</span> for you, finish the task to get it now.',
      btn: 'Start the task'
    },
    result_page: {
      title: 'Congrats!',
      text1: 'Your task done. Here\'s the EXTRA LIFE.',
      btn: 'Get More EXTRA LIVES'
    },
    question: [
      {ji: '0', js: 1, jc: 'Diwali is known as "Festival of ____".', jo: ['Colors', 'Water', 'Lights'], ja: '27634ff8002b12e75d98e07ccd005d18', jd: ['Diwali, or Dipawali, also known as the festival of lights, is India\'s biggest and most important celebration of the year.'], restTime: 10, si: 2500},
      {ji: '1', js: 2, jc: 'There is no ____ color in Indian national flag?', jo: ['Red', 'White', 'Green'], ja: 'ee38e4d5dd68c4e440825018d549cb47', jd: ['The National Flag of India is a horizontal rectangular tricolour of saffron, white and green', ' with the Ashoka Chakra, a 24-spoke wheel, in navy blue at its centre. There is no red on it.'], restTime: 10, si: 2500},
      {ji: '2', js: 3, jc: 'What is the national flower of India?', jo: ['Lotus', 'Rose', 'Jasmine'], ja: '040a7f2f238655e0b4e7d943ad3a21ec', jd: ['Lotus is the National Flower of India. It is a sacred flower and has been an auspicious symbol of Indian culture.'], restTime: 10, si: 2500}
    ]
  },
  bounsTip: [
    {
      title: 'Opps !',
      desp: 'It\'s empty! Try it tomorrow!',
      btnText: 'Invite & Earn Cash'
    },
    {
      title: 'Congrats !',
      desp: 'You got {currencyType}{money}! Keep Going!',
      btnText: 'Invite & Earn Cash'
    },
    {
      title: 'Congrats !',
      desp: 'You got an EXTRA LIFE.',
      btnText: 'Get More'
    },
    {
      title: 'Wow ! ',
      desp: 'A TREASURE BOX received! ',
      btnText: 'OPEN'
    },
    {
      title: 'Sorry ! ',
      desp: 'Failed to open it',
      btnText: ''
    }
  ],
  // 全局提示
  tip: {
    userReviveCard: { // 使用复活卡
      title: 'You have an  Extra Life!', // 主题
      desp: 'Using Extra Life in 5', // 描述
      btn: 'Not now' // 按钮文案
    },
    firstQuestionWrong: { // 首题答错
      title: 'Unwilling to ELIMINATE?', // 主题
      desp: 'Tell us the reason you failed on this question.Let\'s make this game better!', // 描述
      btn: 'JOIN NOW' // 按钮文案
    },
    otherquestionwrong: { // 非首题答错
      title: 'Oops! You failed on the 1 question.', // 主题
      desp: 'There are(is) only {index} question(s) between you and a MILLION. Invite a new user to get a extra life', // 描述
      btn: 'Invite Now' // 按钮文案
    },
    failtosubmit: { // 提交答案失败
      title: 'Failed to Submit', // 主题
      desp: 'Oops, you have already failed on the {index} question.', // 描述
      btn: 'OK' // 按钮文案
    },
    timeoutToSubmit: { // 提交答案超时
      title: 'Game over', // 主题
      desp: 'Sorry , but you are already eliminated from the game . Please check your internet connection.', // 描述
      btn: 'OK' // 按钮文案
    },
    failToUseReviveCard: { // 复活卡使用失败
      title: 'Extra Lives Use Failed', // 主题
      desp: 'Your internet connection is disconnected or request to your server timeout. Please check your internet connection.', // 描述
      btn: 'OK' // 按钮文案
    },
    eliminated: { // 点击选项已经被淘汰
      title: 'You have been removed from the game', // 主题
      desp: 'You can no longer play for the cash prize. But you can watch and chat.', // 描述
      btn: 'OK' // 按钮文案
    },
    lateJoin: { // 进入时已经被淘汰
      title: 'You are late to join', // 主题
      desp: 'The game already started, you can now only view the game. Please come earlier for the next time to play and win.', // 描述
      btn: 'OK' // 按钮文案
    },
    networkNotice: {
      title: 'Please check your internet connection.',
      desp: 'Otherwise your phone may hang or delay during the game if your internet is unstable.',
      btn: 'OK'
    },
    versionUpdate: {
      title: 'New Version Available',
      desp: 'Quit and then open, or you can clear browser cache to upgrade. Experience the latest feature to win cash now!',
      btn: 'OK'
    },
    reviveSuccess: {
      title: 'You get revived.',
      desp: 'Note: Extra Lives could be used twice per game, except on the last question.'
    },
    anwserWrong: {
      title: 'Are You  Losing Bonus?',
      desp: 'Invite friends to join and play, earn cash  now!',
      btn: 'Invite & Earn Cash'
    },
    downBrowser: {
      title: 'Open \'Go!Millionaire\' APP to Win Cash.',
      desc: 'Play Quiz and Win Up To ₹1,000,000!',
      btn: 'Open Now'
    },
    failTipModal: {
      title: 'ARE YOU LOSING BONUS?',
      desc: 'Invite friends to join and play earn cash up to ₹10000!',
      button: 'Invite & Earn Cash'
    },
    wonShareModal: {
      title: 'Congrats! You Won!',
      desc: 'You just won cash ₹{money}, invite friends to join and earn more money!',
      btn: 'Invite & Earn Cash'
    },
    balanceShareModal: {
      title: 'Withdraw Cash Successfully',
      desc: 'You\'ll get cash after reviewed, invite friends to earn more money!',
      btn: 'Invite & Earn Cash'
    }
  }
}
export default locale
