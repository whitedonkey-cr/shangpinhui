<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in carInfoList" :key="cart.id">
          <!-- 选中状态 -->
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked == '1'"
              @click="changeisChecked(cart.skuId, cart.isChecked)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}.00</span>
          </li>
          <!-- 数量 -->
          <li class="cart-list-con5">
            <a class="mins" @click="handler('minus', -1, cart)">-</a>
            <input autocomplete="off" type="text" value="1" minnum="1" class="itxt" :value="cart.skuNum"
              @change="handler('change', $event.target.value * 1, cart)">
            <a class="plus" @click="handler('add', 1, cart)">+</a>
          </li>
          <!-- 总价 -->
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <!-- 删除和收藏 -->
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deletecarlist(cart.skuId)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <!-- 全选状态 -->
        <input class="chooseAll" type="checkbox" :checked="isAllCheck" @click="isallchecked(!isAllCheck)">
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteallcheckedcart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalprice }}</i>
        </div>
        <div class="sumbtn">
          <router-link to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import throttel from 'lodash/throttle'
export default {
  name: 'ShopCart',
  mounted() {
    this.getData()
  },
  methods: {
    // 获取个人购物车数据
    getData() {
      this.$store.dispatch('getcarlist')
    },
    //处理产品的个数[节流]
    handler: throttel(async function (type, disNum, cart) {
      // type:表示点击的是三个中的那个 disnum：代表传递的是正值还是负值，对于input来说要传的是差值，这里目前是输入的值，不是差值！ cart标识点的是那个产品
      switch (type) {
        case 'minus':
          ///请求回来的数据中 产品数量只要大于1 再点减号的时候可以传-1 但是小于等于1的时候传入的数据就是0（不变）
          disNum = cart.skuNum > 1 ? -1 : 0
          break;
        case 'add':
          disNum = 1
          break;
        case 'change':
          disNum = (isNaN(disNum) || disNum < 1) ? 0 : parseInt(disNum) - cart.skuNum
          break
      }
      try {
        // 代表的是修改成功后
        await this.$store.dispatch('addorupdatashopcar', { skuId: cart.skuId, skuNum: disNum })
        // 发送完请求后 记得要重新获取数据！！！
        this.getData()
      } catch (error) {

      }
    }, 1000),

    // 删除某一个产品的信息
    async deletecarlist(skuId) {
      try {
        await this.$store.dispatch('deletecarlist', skuId)
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },

    // 切换商品选中状态 传进去的是个对象，在store里面进行解构 注意接口文档中的传递参数要求
    async changeisChecked(skuId, isChecked) {
      try {
        isChecked = isChecked == 0 ? '1' : '0'
        await this.$store.dispatch('changeischecked', { skuId, isChecked })
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },
    // 删除选中的商品
    async deleteallcheckedcart() {
      try {
        await this.$store.dispatch('deleteallcheckedcart')
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    },

    async isallchecked(isAllCheck) {
      console.log(isAllCheck)
      try {
        await this.$store.dispatch('isallchecked', isAllCheck)
        this.getData()
      } catch (error) {
        alert(error.message)
      }
    }

  },
  computed: {
    ...mapGetters(['carlist']),
    carInfoList() {
      return this.carlist.cartInfoList || []
    },
    // 计算产品总价
    totalprice() {
      let sum = 0
      this.carInfoList.forEach(item => sum += item.skuNum * item.skuPrice);
      return sum
    },
    //判断底部全选框是否勾选
    isAllCheck() {
      if (!this.carInfoList.length) return false
      return this.carInfoList.every(item => item.isChecked == 1)
    }
  },
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      &>div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;

      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        &>li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }


        .cart-list-con4 {
          width: 10%;

        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>