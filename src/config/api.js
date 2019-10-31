// 后端新api接口
// let baseUrl = '/busrvapi/'
let baseUrl = '/api/online/{vcode}/'

// // 景区门票交叉，汽车票的接口
// let busUrl = '/busresapi/'

// let oldUrl = '/tcsceniccarbasicdsfclient/'

export default {
    // 获取banner列表
    bannerUrl: baseUrl + 'user/bannerUrl',
    // 获取城市列表
    citylist: baseUrl + 'city/list',
    // 获取车次列表
    schedulelist: baseUrl + 'schedule/list',
    // 查询座位
    listSeat: baseUrl + 'schedule/listSeat',
    // 登录
    login: baseUrl + 'user/login',
    // 注册验证码
    getVerifyCode: baseUrl + 'user/getVerifyCode',
    // 根据手机或邮箱查询用户 // 判断是否登录 POST /{vcode}/user/queryByPhone
    queryByPhone: baseUrl + 'user/queryByPhone',
    // 找回验证码
    verifyCode: baseUrl + 'user/verifyCode',
    // Omise注册customer
    registerCustomer: baseUrl + 'onlineOrderPay/omise/registerCustomer',
    // Omise支付
    pay: baseUrl + 'onlineOrderPay/omise/pay',
    // Omise绑卡
    bindCard: baseUrl + 'onlineOrderPay/omise/bindCard',
    // 查询customer
    listCustomer: baseUrl + 'onlinePayCustomer/findListByMemberId',
    // Omise卡列表
    listCard: baseUrl + 'onlineOrderPay/omise/listCard',
    // Omise等待支付结果
    waitPayResult: baseUrl + 'onlineOrderPay/omise/waitPayResult',
    // 注册
    add: baseUrl + 'user/add',
    // 分页查询常旅
    queryPsger: baseUrl + 'onlineFrequentPassengers/page',
    // 新增常旅
    addPsger: baseUrl + 'onlineFrequentPassengers/add',
    // 更新常旅
    updatePsger: baseUrl + 'onlineFrequentPassengers/update',
    // 计算订单价格
    calculateOrderPrice: baseUrl + 'onlineOrder/calculateOrderPrice',
    // 票种
    ticketTypelist: baseUrl + 'ticketType/list',
    // 票种
    createOrder: baseUrl + 'onlineOrder/createOrder',
    // 获取设施
    getCarModelInfo: baseUrl + 'schedule/getCarModelInfo',
    // 订单列表
    onlineOrder: baseUrl + 'onlineOrder/page',
    // 查询订单价格详情
    getOrderPriceDetail: baseUrl + 'onlineOrder/getOrderPriceDetail',
    // 查询订单乘客票详情
    getOrderPassengerTicketDetail: baseUrl + 'onlineOrder/getOrderPassengerTicketDetail',
    // 查询订单班次详情
    getOrderScheduleDetail: baseUrl + 'onlineOrder/getOrderScheduleDetail',
    // 分页查询登录人的可用订单班次(行程助手)
    pageOrderSchedule: baseUrl + 'onlineOrder/pageOrderSchedule',
    // 取消订单(手动)
    cancelOrder: baseUrl + 'onlineOrder/cancelOrder',
    // 获取当前时区时间
    getCurrentDate: baseUrl + 'onlineOrder/getCurrentDate',
    // 登出
    logout: baseUrl + 'user/logout',
    // 查询乘客类型POST /{vcode}/passengerType/list
    passengerType: baseUrl + 'passengerType/list',
    couponPageList: baseUrl + 'coupon/page',
    logo2Url: baseUrl + 'user/logo2Url',
    // 根据id查询优惠券
    findById: baseUrl + 'coupon/findById',
    /// 通过手机领取券
    bindPhoneNo: baseUrl + 'coupon/bindPhoneNo'
}
