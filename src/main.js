// 引入总组件
import Vue from 'vue'
import App from './App.vue'
// 引入我们自己创建的路由文件，然后再下面注册路由
import router from '@/router'

//懒加载插件lazyload
import VueLazyload from 'vue-lazyload'
import dog from '@/assets/dog.png'
Vue.use(VueLazyload, {
  loading: dog,
})

//引入vuex仓库 然后在下面注册仓库
import store from './store'

//不需要对外暴露 直接引入js文件
import '@/mock/mockServe.js'
//引入swiper的css样式
import 'swiper/css/swiper.css'

// 引入全局组件三级联动 全局组件也放在components文件夹下的
import TypeNav from '@/components/TypeNav'
import Carsouel from '@/components/Carsouel'
import Pagination from '@/components/Pagination'
//注册全局组件  第一个参数为组件的名字，第二个参数为那个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carsouel.name, Carsouel)
Vue.component(Pagination.name, Pagination)


// 统一引入api中的所有请求函数 类似于$bus 引入一次全局使用,记得在里面注册
//使用到的原理和$bus一样，利用了 vc.__proto__.prototype==vue.prototype
import * as API from '@/api'
// console.log(API)  这里API是一个对象，里面都是key：value的请求函数



//按需引入elementui
import { MessageBox, Button } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;



Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  //注册路由，key-value形式，kv一致可以简写
  //当这里书写router的时候，组件身上拥有$route 和 $router属性
  router,
  // 组件实例身上会多出一个$store属性
  store,
  //配置全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
    //配置全局请求函数
    Vue.prototype.$API = API
  },

}).$mount('#app')
