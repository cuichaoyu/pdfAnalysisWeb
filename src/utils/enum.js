// 图片域名
export const pictureDomain = 'http://rebirths.yuanfangyun.com/'
// 字典状态
export const dictionaryType = {
  '0': '禁用',
  '1': '启用'
}

// 门店类型
export const storeTypeEnum = {
  '1': '自营',
  '2': '承包',
  '3': '加盟'
}
// 门店状态
export const storeStatusEnum = {
  '0': '关闭',
  '1': '正常营业',
  '2': '暂停'
}

// 在职状态
export const jobStatusEnum = {
  '0': '禁用',
  '1': '在职',
  '2': '离职'
}
// 教练星级
export const levelEnum = {
  '1': '一星',
  '2': '二星',
  '3': '三星'
}
// 教练用户组
export const groupIdEnum = {
  '1': '管理员',
  '2': '运营',
  '3': '店长',
  '4': '教练',
}

// 课程类别
export const courseItemsEnum = {
  '1': '团课',
  '2': '私教',
  '3': '训练营'
}

// 课程类型
export const courseTypeEnum = {
  '1': '有氧',
  '2': '塑形',
  '3': '综合',
}

// 客户来源
export const customerSourceEnum = {
  null: '无',
  'mini': '小程序',
  'meituan': '美团',
  'friend_share': '朋友推荐',
  'self_come': '自主到店'
}

// 消费等级
export const consumeLevelEnum = {
  '0': '游客',
  '1': '福利用户',
  '2': '体验用户',
  '3': '团课VIP用户',
  '4': '私教用户'
}

export const sexEnum = {
  '0': '未知',
  '1': '男',
  '2': '女'
}

// 会员卡状态
export const vipCardStatusEnum = {
  '0': '未激活',
  '1': '使用中',
  '2': '已暂停',
  '3': '已到期',
  '4': '已退卡'
}

// 来源渠道
export const getChannelEnum = {
  '1': '购买',
  '2': '体验 ',
  '3': '门店赠送 ',
  '4': '公司赠送 '
}
// 审核状态
export const shenheEnum = {
  '0': '未审核',
  '1': '审核通过 ',
  '2': '审核未通过 ',
}
// 动作
export const actionEnum = {
  'enable':'启用',
  'pause': '暂停',
  'transfer': '转卡',
  'force_enable': '强制开启',
  'force_pause': '强制暂停',
  'force_open': '强制激活',
  'give': '赠送',
  'add_fdays': '增加暂停天数',
  'add_value': '增加可用额度',
  'add_valid': '延长有效期',
  'open': '激活',
  'stop': '停卡',
  'restore': '恢复',
  'return_card': '退卡',
  'audit': '清算',
}


// 会员卡类型
export const vipCardTypeEnum = {
  '1': '时长卡',
  '2': '次数卡',
  '3': '储值卡'
}

// 收入类型
export const incomeTypeEnum = {
  '1': '收款',
  '2': '退款'
}
// 收支方式
export const shouZhiModeEnum = {
  '1': '进',
  '2': '出'
}

//收支类型
export const shouzhiTypeEnum = {
  'time_card': '时长卡',
  'once_card': '次数卡',
  'fund_card': '储值卡',
  'buy_card': '购卡',
  'buy_course': '购课',
  'audit': '清算',
  'return_card': '退卡',
  'return_course': '退课',
}

//跨店消费-- 支付方式
export const crossPayModeEnum = {
  'time_card': '时长卡',
  'once_card': '次数卡',
  'fund_card': '储值卡',
}

// 消费项目
export const consumeTypeEnum = {
  'buy_card': '购卡',
  'buy_course': '购课',
  'return_card': '退卡',
  'return_course': '退课',
  'refund': '普通退款',
}
// 来源
export const sourceTypeEnum = {
  'mini': '小程序',
  'manage': '店长端',
  'web': '管理后台',
}

// 支付方式
export const payTypeEnum = {
  'wxpay': '微信支付',
  'alipay': '支付宝',
  'meituan': '美团核销',
  'share': '朋友分享',
  'give': '赠送',
  'transfer': '银行转账',
}

// 完成状态 状态 1已预约 2已签到 3已完成 4已爽约 5已取消
export const completeStatusEnum = {
  '0': '无',
  '1': '已预约',
  '2': '已签到',
  '3': '已完成',
  '4': '已爽约',
  '5': '已取消',
}


