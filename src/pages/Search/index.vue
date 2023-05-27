<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread:面包屑 带有x的结构-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-if="searchparams.categoryName">{{ searchparams.categoryName }}<i
                @click="removeCategoryName">×</i></li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchparams.keyword">{{ searchparams.keyword }}<i @click="removekeyword">×</i>
            </li>
            <!-- trademark字段面包屑 小技巧，切割字符串 返回数组！！！-->
            <li class="with-x" v-if="searchparams.trademark">{{ searchparams.trademark.split(':')[1] }}<i
                @click="removetrademark">×</i>
            </li>
            <!-- 选择属性面包屑 因为props是数组 所以这里不能在用v-if了 用v-for-->
            <li class="with-x" v-for="(attr, index) in searchparams.props" :key="index">{{
              attr.split(':')[1] }}<i @click="removeattr(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector   绑定自定义事件：实现子给父传参数-->
        <SearchSelector @gettrademark="gettrademark" @getattr="getattr" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 小导航 -->
              <ul class="sui-nav">
                <li :class="{ active: isOne }" @click="changeOrder('1')">
                  <a>综合 <span v-show="isOne" class="iconfont"
                      :class="{ 'icon-long-arrow-up': isAsc, 'icon-long-arrow-down': isDesc }"></span>
                  </a>
                </li>
                <li :class="{ active: isTwo }" @click="changeOrder('2')">
                  <a>价格<span v-show="isTwo" class="iconfont"
                      :class="{ 'icon-long-arrow-up': isAsc, 'icon-long-arrow-down': isDesc }"></span></a>
                </li>
              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="(good) in goodsList" :key="good.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 路由跳转带上params参数 -->
                    <router-link :to="`/detail/${good.id}`">
                      <img v-lazy="good.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" :title="good.title">{{ good.title }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination :pageNo="searchparams.pageNo" :pageSize="searchparams.pageSize" :total="total" :continues="5"
            @getpage="getpage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import { mapGetters, mapState } from 'vuex';
export default {
  name: 'Search',
  components: { SearchSelector },

  // 我们需要在发送请求之前把这些参数发给服务器
  beforeMount() {
    Object.assign(this.searchparams, this.$route.params, this.$route.query)
  },
  // 组件挂在完毕就执行一次 且只执行一次
  mounted() {
    this.getData()
  },

  data() {
    return {
      // 带给服务器的参数
      searchparams: {
        "category1Id": "",//一级分类的id
        "category2Id": "",//二级分类的id
        "category3Id": "",//三级分类的id
        "categoryName": "",//产品的名字
        "keyword": "",//关键字
        "order": "1:desc",//排序初始状态是综合降序
        "pageNo": 1,//当前第几页
        "pageSize": 10,//每一页需要展示多少条数据
        "props": [],//平台属性的选择参数
        "trademark": ""//品牌参数
      }
    }
  },

  computed: {
    //mapGetters里面的方法，传递是数组，因为getters不分模块化 直接拿数据，而state会分模块化
    ...mapGetters(['goodsList', 'trademarkList', 'attrsList']),
    isOne() {
      return this.searchparams.order.indexOf('1') != -1
    },
    isTwo() {
      return this.searchparams.order.indexOf('2') != -1
    },
    isAsc() {
      return this.searchparams.order.indexOf('asc') != -1
    },
    isDesc() {
      return this.searchparams.order.indexOf('desc') != -1
    },
    ...mapState({ total: state => state.search.searchlist.total, continues: state => state.search.searchlist.totalPages }),
  },
  //封装给仓库请的请求函数，便于可以调用多次
  methods: {
    //把请求封装成函数，可以多次调用且 根据参数不同，返回不同的数据进行展示
    getData() {
      this.$store.dispatch('getSearList', this.searchparams)
    },
    // 删除分类的名字和对应的地址栏
    removeCategoryName() {
      this.searchparams.categoryName = undefined
      this.searchparams.category1Id = undefined
      this.searchparams.category2Id = undefined
      this.searchparams.category3Id = undefined
      // 清除之后根据参数重新发送请求
      this.getData()
      //如果直接写this.$router.push({ name: 'search'}) 会导致params参数也会丢失，所以我们需要判断是否还有params参数
      if (this.$route.params) {
        // 这里是小技巧 自己跳自己路劲
        this.$router.push({ name: 'search', params: this.$route.params })
      }
    },
    // 删除对应的关键字也就是keyword
    removekeyword() {
      this.searchparams.keyword = undefined
      this.getData()
      if (this.$route.query) {
        this.$router.push({ name: 'search', query: this.$route.query })
      }
      //触发全局事件 通知兄弟组件删除里面keyword
      this.$bus.$emit('clear')
    },
    // 删除trademark属性然后发送请求
    removetrademark() {
      this.searchparams.trademark = undefined
      this.getData()
    },
    // 子组件给父组件传递品牌信息
    gettrademark(trademark) {
      //按照接口文档的示例，拼接参数
      this.searchparams.trademark = `${trademark.tmId}:${trademark.tmName}`
      // 再次发送请求获取
      this.getData()
    },
    // 子组件给父组件传递属性信息
    getattr(attr, attrvalue) {
      //按照接口文档的格式 先把属性按照规定格式拍好，然后push进数组中
      let pop = `${attr.attrId}:${attrvalue}:${attr.attrName}`
      //数组去重 否则在展示面包屑的时候每点击一次显示一个 因为数组一样的元素在重复添加，所以要去重
      if (this.searchparams.props.indexOf(pop) == -1) this.searchparams.props.push(pop)
      this.getData()
    },
    removeattr(index) {
      // 删除指定下标的元素   都是基础！！！注重基础！！还有上面的split拆分字符串返回数组的方法！
      this.searchparams.props.splice(index, 1)
      this.getData()
    },
    // 排序的操作  通过传入的参数来判断用户点击的是那个1:综合 2:价格
    changeOrder(flag) {
      //先获取在点击之前的数据
      let originFlag = this.searchparams.order.split(':')[0]
      let originsort = this.searchparams.order.split(':')[1]
      let newOrder = ''
      if (flag == originFlag) {
        newOrder = `${flag}:${originsort == 'desc' ? 'asc' : 'desc'}`
      }
      else {
        newOrder = `${flag}:${'desc'}`
      }
      this.searchparams.order = newOrder
      this.getData()
    },
    getpage(page) {
      this.searchparams.pageNo = page
      this.getData()
    }
  },
  //实时监测路由信息，一旦发生变化就根据对应的参数请求相应的数据进行展示
  watch: {
    // 这里直接监听$route 不需要this.$route 因为他也属于data中的数据，可以通过vue插件查看
    $route: {
      handler() {
        //合并好参数 传递给服务器
        Object.assign(this.searchparams, this.$route.params, this.$route.query)
        this.getData()
        // 每次请求之后不同层级的id会滞留在数据中，我们需要清除
        this.searchparams.category1Id = undefined
        this.searchparams.category2Id = undefined
        this.searchparams.category3Id = undefined
      }
    }
  },
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: 3px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>