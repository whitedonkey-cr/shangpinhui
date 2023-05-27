// 当前模块进行 接口的统一管理

// 引入我们二次封装的axios请求
import requests from "./request";

// 引入的是我们模拟的mock数据 我们需要重新配置一下默认baseurl
import mockreq from './mockajax'

// 三级联动模块  /api/product/getBaseCategoryList  get请求  无参数
// 封装了一个函数并且对外暴露，以后谁要发送这个请求 直接调用函数即可
//发送请求：axios发请求返回的结果就是promise对象
//之前在baseURL中加上api了 所以在url中就不需要/api了
export const reqCategoryList = () => requests({ url: '/product/getBaseCategoryList', method: 'get' })

//配置在mockServe中我们配置的地址，模拟请求的数据 上面的请求时真实给服务器发送请求，下面的是我们模拟的
export const reqmockbannerlist = () => mockreq({ method: 'get', url: '/banner', })
//请求数据floor
export const reqfloor = () => mockreq({ method: 'get', url: '/floor' })
//搜索模块请求 且需要带参数  接受传递过来的参数用data
// 但是给服务器传递的参数的params至少是一个空对象
export const reqGetSeachInfo = (params) => requests({ url: '/list', method: 'post', data: params })

// 获取详情信息
export const reqGoodsInfo = (skuId) => requests({ url: `/item/${skuId}`, method: 'get' })

// 购物车发送请求 /api/cart/addToCart/{ skuId }/{ skuNum } POST  (在请求头中需要加入UUID的标识;请求头的名称叫userTempId)
export const reqaddorupdatashopcar = (skuId, skuNum) => requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: 'post' })

// 获取购物车列表 / api / cart / cartList
export const reqcarlist = () => requests({ url: '/cart/cartList', method: 'get' })

//删除购物车中的数据 /api/cart/deleteCart/{skuId}
export const reqdeletecarlist = (skuId) => requests({ url: `/cart/deleteCart/${skuId}`, method: 'delete' })

// 切换商品选中状态/api/cart/checkCart/{skuID}/{isChecked}
export const reqchangechecked = (skuID, isChecked) => requests({ url: `/cart/checkCart/${skuID}/${isChecked}`, method: 'get' })

// 请求验证码 / api / user / passport / sendCode / { phone }  get
export const reqphonecode = (phone) => requests({ url: `/user/passport/sendCode/${phone}`, method: 'get' })

//点击提交注册信息/api/user/passport/register
export const reqsendforminfo = (data) => requests({ url: '/user/passport/register', data, method: 'post' })

//登录用户/api/user/passport/login
export const requserlogin = (data) => requests({ url: '/user/passport/login', data, method: 'post' })

//获取用户个人信息/user/passport/auth/getUserInfo
export const requserinfo = () => requests({ url: '/user/passport/auth/getUserInfo', method: 'get' })

//退出登录 /api/user/passport/logout get
export const reqloginout = () => requests({ url: '/user/passport/logout', method: 'get' })

// 获取用户地址信息 / api / user / userAddress / auth / findUserAddressList
export const requseraddress = () => requests({ url: '/user/userAddress/auth/findUserAddressList', method: 'get' })

//获取商品清单 /api/order/auth/trade
export const reqgoodlist = () => requests({ url: '/order/auth/trade', method: 'get' })


//再转到支付页面之前 提交订单详细信息、/api/order/auth/submitOrder?tradeNo={tradeNo}
export const reqsubmitorder = (tradeNo, data) => requests({ url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, data, method: 'post' })

//利用订单编号 获取订单信息 来知道要支付的金额
export const reqgetordermsg = (orderId) => requests({ url: `/payment/weixin/createNative/${orderId}`, method: 'get' })

//查询订单状态/api/payment/weixin/queryPayStatus/{orderId}
export const reqorderstate = (orderId) => requests({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: 'get' })

//获取订单列表/api/order/auth/{page}/{limit}
export const reqorderlist = (page, limit) => requests({ url: `/order/auth/${page}/${limit}`, method: 'get' })