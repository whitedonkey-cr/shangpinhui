<template>
   <header class="header">
      <!-- 头部的第一行 -->
      <div class="top">
         <div class="container">
            <div class="loginList">
               <p>尚品汇欢迎您！</p>
               <p v-if="!username">
                  <span>请</span>
                  <!-- 声明式导航，务必要有to属性 -->
                  <router-link to="/login">登录</router-link>
                  <router-link to="/register" class="register">免费注册</router-link>
               </p>
               <p v-else>
                  <a>{{ username }}</a>
                  <a class="register" @click="userlogout">退出登录</a>
               </p>
            </div>
            <div class="typeList">
               <router-link to="/center">我的订单</router-link>
               <router-link to="/shopcart">我的购物车</router-link>
               <a href="###">我的尚品汇</a>
               <a href="###">尚品汇会员</a>
               <a href="###">企业采购</a>
               <a href="###">关注尚品汇</a>
               <a href="###">合作招商</a>
               <a href="###">商家后台</a>
            </div>
         </div>
      </div>
      <!--头部第二行 搜索区域-->
      <div class="bottom">
         <h1 class="logoArea">
            <!-- 这里点击图片也可以跳到相应的页面所以这里也要路由跳转 -->
            <router-link class="logo" title="尚品汇" to="/home">
               <img src="./images/logo.png" alt="">
            </router-link>
         </h1>
         <div class="searchArea">
            <form action="###" class="searchForm">
               <!-- 收集输入的信息 -->
               <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="keyWord"
                  @keyup.enter="goSearch" />
               <!-- 这里使用的是编程式导航 -->
               <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">搜索</button>
            </form>
         </div>
      </div>
   </header>
</template>

<script>
export default {
   name: 'Header',
   data() {
      return {
         keyWord: ''
      }
   },
   methods: {
      goSearch() {
         // 传递参数  第一种第二种在项目中不用 常用第三种对象写法
         // 第一种：字符串形式 传递params 和 query参数
         //this.$router.push('/search/'+this.keyWord+'?k='+this.keyWord.toUpperCase())
         // 第二种：模板字符串形式 传递params 和 query参数
         // this.$router.push(`/search/${this.keyWord}?k=${this.keyWord.toUpperCase()}`)
         // 第三种：对象写法 传递params 和 query参数
         //如果传递时params参数，则path属性要换成name 即不能像上面直接写具体路径，而是要写name：'xxx'
         if (this.$route.query) {
            this.$router.push({ name: "search", params: { keyword: this.keyWord || undefined }, query: this.$route.query })
         }
      },

      //退出登录
      async userlogout() {
         try {
            await this.$store.dispatch('userlogout')
            this.$router.push('/home')
         } catch (error) {
            alert(error.message)
         }
      }
   },
   mounted() {
      // 绑定一个事件，当有人发送clear事件的时候 我们执行回调函数
      this.$bus.$on('clear', () => {
         this.keyWord = ''
      })
   },
   computed: {
      username() {
         return this.$store.state.user.username
      }
   }
}
</script>

<style lang="less" scoped>
.header {
   &>.top {
      background-color: #eaeaea;
      height: 30px;
      line-height: 30px;

      .container {
         width: 1200px;
         margin: 0 auto;
         overflow: hidden;

         .loginList {
            float: left;

            p {
               float: left;
               margin-right: 10px;

               .register {
                  border-left: 1px solid #b3aeae;
                  padding: 0 5px;
                  margin-left: 5px;
               }
            }
         }

         .typeList {
            float: right;

            a {
               padding: 0 10px;

               &+a {
                  border-left: 1px solid #b3aeae;
               }
            }

         }

      }
   }

   &>.bottom {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .logoArea {
         float: left;

         .logo {
            img {
               width: 175px;
               margin: 25px 45px;
            }
         }
      }

      .searchArea {
         float: right;
         margin-top: 35px;

         .searchForm {
            overflow: hidden;

            input {
               box-sizing: border-box;
               width: 490px;
               height: 32px;
               padding: 0px 4px;
               border: 2px solid #ea4a36;
               float: left;

               &:focus {
                  outline: none;
               }
            }

            button {
               height: 32px;
               width: 68px;
               background-color: #ea4a36;
               border: none;
               color: #fff;
               float: left;
               cursor: pointer;

               &:focus {
                  outline: none;
               }
            }
         }
      }
   }
}
</style>