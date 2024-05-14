<template>
  <div id="app">
    <Header />
    <!-- 路由组件出口的地方显示 -->
    <router-view></router-view>
    <!-- 在login 、 register下隐藏Footer组件 其他情况显示 -->
    <Footer v-show="isShow"></Footer>
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: 'App',
  components: { Header, Footer },
  methods: {
    
  },
  mounted() {
    // 通知vuex发送请求，且请求在全局只发送一次 然后将数据存放在仓库中
    this.$store.dispatch('categoryList')
  },
  computed: {
    isShow() {
      return this.$route.meta.isShow
    }
  }
}
</script>
