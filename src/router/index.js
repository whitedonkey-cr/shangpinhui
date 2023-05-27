//配置路由的地方

//先引入vue 在引入vue-router
import Vue from 'vue'
import VueRouter from 'vue-router'

//然后使用插件
Vue.use(VueRouter)

// 引入路由组件 @== ../==src/  因为我们在jsconfig.json文件中配置过了
import store from '@/store'

///以后使用路由懒加载 来提高效率！！  跟elementui一样 按需引入
const Home = () => import('../pages/Home')
// 所以直接在componentes写Home就可以
// 然后可以采用简写 直接在components里面直接写箭头函数 () => import('@/pages/Home')



//引入二级路由
import myOrder from '@/pages/Center/myOrder'
import groupOrder from '@/pages/Center/groupOrder'


// 重写push方法
//先把VueRouter原型对象中的push方法保存一份 这是个方法 里面的this指向的是当前的windows！！这个this指向很关键
let originpush = VueRouter.prototype.push

// 重写push|replace
// 第一个参数：告诉原来的push方法，传递那些参数，即 不能改变原来push的参数！！！
// 第二个参数：成功的回调
// 第三个参数：失败的回调
VueRouter.prototype.push = function (location, resolve, reject) {
    // this：指向的就是调用者，就是VueRouter的实例对象
    // 如果这里resolve的回调和reject的回调都传了，那么就调用原生的push方法即可
    if (resolve && reject) {
        //这里的this如果不改变就是上面所说的windows对象，因为我们触发push方法就会调用我们之前保存的原生的push方法即originpush，显然直接调用的话this指向的是windows对象，但是原生push方法的this指向的是vc属性$router的属性值（即VueRouter构造函数构造出来的实例对象），所以我们要改变一下this的指向
        originpush.call(this, location, resolve, reject)
    }
    // else表示 传入的有resolve参数 没reject参数 或者 有reject参数没有resolve参数 的时候
    else {
        // 如果我们没有传入参数，则直接传入两个空回调，因为我们之前就测试过push方法返回的是promise对象，
        // 只要是promise对象，返回的要么就是成功的回调，要么就是失败的回调，我们不管成功失败 都返回空的回调就实现了取消掉NavigationDuplicated的警告错误
        originpush.call(this, location, () => { }, () => { })
    }
}

// 重写replace方法 ---------与上面同理
let originreplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originreplace.call(this, location, resolve, reject)
    }
    else {
        originreplace.call(this, location, () => { }, () => { })
    }
}


// 配置路由
const router = new VueRouter({
    routes: [
        // 重定向：在项目跑起来的时候，立马访问/ 或者/#的时候 立马让他定向到指定的路由组件
        // meta：为路由元信息，程序员自己存放属性的，这里isshow控制的是是否显示Footer
        {
            name: 'center',
            path: '/center',
            component: () => import('@/pages/Center'),
            meta: { isShow: true },
            children: [
                {
                    name: 'myorder',
                    path: 'myorder',
                    component: myOrder,
                },
                {
                    name: 'grouporder',
                    path: 'grouporder',
                    component: groupOrder,
                },
                //配置二级重定向
                {
                    path: '/center',
                    redirect: '/center/myorder'
                }
            ],
        },
        {
            name: 'paysuccess',
            path: '/paysuccess',
            component: () => import('@/pages/PaySuccess'),
            meta: { isShow: true },
        },
        {
            name: 'pay',
            path: '/pay',
            component: () => import('@/pages/Pay'),
            meta: { isShow: true },
            beforeEnter: (to, from, next) => {
                let token = store.state.user.token
                if ((from.path.indexOf('/trade') != -1 || from.path.indexOf('/paysuccess') != -1) && token) {
                    next()
                }
                else {
                    if (!token) {
                        next('/login?redirect=' + to.path)
                    }
                    else {
                        if (from.path.indexOf('/shopcart') == -1) {
                            //中断导航从哪里来回哪里去
                            next(false)
                        }
                        else {
                            next()
                        }
                    }
                }
            }
        },
        {
            name: 'trade',
            path: '/trade',
            component: () => import('@/pages/Trade'),
            meta: { isShow: true },
            beforeEnter: (to, from, next) => {
                //路由独享守卫和全局守卫的参数一样的
                //怎么理解呢 ，to代表的是我们要去的页面，from是来自哪里的，
                //这里的to并不是指trade跳到的页面 from也不是指当前的trade页面
                //总之参数的理解就把他当成全局路由守卫的参数理解就行
                let token = store.state.user.token
                if ((from.path.indexOf('/shopcart') != -1 || from.path.indexOf('/pay') != -1) && token) {
                    next()
                }
                else {
                    if (!token) {
                        next('/login?redirect=' + to.path)
                    }
                    else {
                        if (from.path.indexOf('/shopcart') == -1) {
                            //中断导航从哪里来回哪里去
                            next(false)
                        }
                        else {
                            next()
                        }
                    }
                }
            }
        },
        {
            name: 'shopcart',
            path: '/shopcart',
            component: () => import('@/pages/ShopCart'),
            meta: { isShow: true },
        },
        {
            name: 'addcartsuccess',
            path: '/addcartsuccess',
            component: () => import('@/pages/AddCartSuccess'),
            meta: { isShow: true },
        },
        {
            path: '*',
            redirect: '/home',
            meta: { isShow: true },
        },
        {
            path: '/home',
            component: Home,
            meta: { isShow: true },
        },
        {
            //谁接受数据 给谁配置占位符 加个问号代表路由传参的时候 可传可不传
            name: 'search',
            path: '/search/:keyword?',
            component: () => import('@/pages/Search'),
            meta: { isShow: true },
            // 路由组件传递props数据
            // 第一种 布尔值写法：true 代表把params数据当作路由组件身上的属性，但是只能是params参数不可以是query参数
            // props:true,
            //对象写法，额外给路由传递一些props
            // props:{a:1,b:2}
            //常用函数写法：可以传递params 和 query参数 通过props传递给路由组件,且写成箭头函数的时候，会默认把$route当作参数
            // props:($route)=>{
            //     return {keyWord:this.$route.keyWord,k:this.$route.query.k}
            // }

            //通过函数解构的形式传入参数 return的是一个对象的时候 记得外面加上小括号当成一个整体
            props: ({ params: { keyword } }) => ({ keyword })

        },
        {
            path: '/register',
            component: () => import('@/pages/Register'),
            meta: { isShow: false },
        },
        {
            path: '/login',
            component: () => import('@/pages/Login'),
            meta: { isShow: false },
        },
        {   //根据接口文档 跳转需要带params参数给detail组件
            path: '/detail/:skuid',
            component: () => import('@/pages/Detail'),
            meta: { isShow: true }
        }
    ],
    //滚动行为 路由切换 滚动条自动到顶部
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
})

//配置全局路由 传入的是个回调函数，参数分别是to：跳到那里去 from：从那个路由来的 next：放行
router.beforeEach(async (to, from, next) => {
    //如果已经登陆了 就不应该在跳转到登录页面了
    // 如何判断已经登陆了呢？ 有无token的值
    let name = store.state.user.username
    let token = store.state.user.token
    //这里判断是否登录
    if (token) {
        if (to.path == '/login' || to.path == '/register') {
            next('/')
        }
        else //这里的前提是没有去登录页面,去了其他的页面 那么我们是不是要在其他页面展示个人信息呢？
        {
            //如果跳转的时候有用户信息放行，没有用户信息的时候我们发请求获取信息
            if (name) { next() }
            else {
                try {
                    // 获取用户信息成功
                    await store.dispatch('getuserinfo')
                    next()
                } catch (error) {
                    //这里的是 没有获取到用户信息 就是token过期的时候 获取不到信息
                    //那我们就清除过期的token信息 返回到登录页面
                    await store.dispatch('userlogout')
                    next('/login')
                }

            }
        }
    }
    else {
        // 未登录不能去trade交易页面 支付页面也不能去pay|paysuccess 也不能去个人中心center
        // 如果未登录去了上面的页面 就要去登陆页面
        let topath = to.path
        if (topath.indexOf('/trade') != -1 || topath.indexOf('/pay') != -1 || topath.indexOf('/center') != -1) {
            //把未登录的时候想去的地址通过query参数放在登陆页面的后面
            next('/login?redirect=' + topath)
        }
        else {
            // 如果登录了才可以去上面的页面,其他页面也可以去
            next()

        }
    }
})
export default router