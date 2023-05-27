<template>
    <!-- 商品分类导航 -->
    <div class="type-nav">
        <div class="container">
            <!-- 采用时间委托的形式给h2的全部商品和列表展示元素添加一个父元素，通过委托的形式来控制只有当移除全部商品的时候 才消失 这个方法要学会-->
            <div @mouseleave="leavehide" @mouseenter="entershow">
                <h2 class="all">全部商品分类</h2>
                <!-- 过度动画 -->
                <transition name="sort">
                    <div class="sort" v-show="show">
                        <div class="all-sort-list2" @click="goSearch($event)">
                            <div class="item" v-for="(c1, index) in categoryList" :key="c1.categoryId"
                                :class="{ cur: currentIndex == index }">
                                <h3 @mouseenter="changesky(index)">
                                    <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId"
                                        href="javaScript:;">{{
                                            c1.categoryName }}</a>
                                </h3>

                                <div class="item-list clearfix"
                                    :style="{ display: currentIndex == index ? 'block' : 'none' }">
                                    <div class="subitem" v-for="(c2) in c1.categoryChild" :key="c2.categoryId">
                                        <dl class="fore">
                                            <dt>
                                                <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId"
                                                    href="javaScript:;">{{ c2.categoryName }}</a>
                                            </dt>
                                            <dd>
                                                <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                                                    <a :data-categoryName="c3.categoryName"
                                                        :data-category3Id="c3.categoryId" href="javaScript:;">{{
                                                            c3.categoryName }}</a>
                                                </em>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <nav class="nav">
                <a href="###">服装城</a>
                <a href="###">美妆馆</a>
                <a href="###">尚品汇超市</a>
                <a href="###">全球购</a>
                <a href="###">闪购</a>
                <a href="###">团购</a>
                <a href="###">有趣</a>
                <a href="###">秒杀</a>
            </nav>
        </div>
    </div>
</template>

<script>
// 获取仓库中的数据
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
    name: 'TypeNav',
    data() {
        return {
            currentIndex: -1,
            show: true,
        }
    },
    methods: {
        //鼠标进入接受当前的索引 动态获取索引，根据索引来控制样式的添加 用来lodash库来实现节流
        changesky: _.throttle(function (currnetindex) {
            this.currentIndex = currnetindex
        }, 50),
        // 鼠标离开的时候移除样式
        goSearch(e) {
            // 获取事件对象中自定义属性 进行复习！！！
            if (e.target.dataset.categoryname) {
                // 整理路由的参数
                let location = { name: 'search' }
                let query = { categoryName: e.target.dataset.categoryname }
                if (e.target.dataset.category1id) {
                    query.category1Id = e.target.dataset.category1id
                }
                else if (e.target.dataset.category2id) {
                    query.category2Id = e.target.dataset.category2id
                }
                else {
                    query.category3Id = e.target.dataset.category3id
                }
                location.query = query
                if (this.$route.params) {
                    location.params = this.$route.params
                }
                this.$router.push(location)
            }
        },
        entershow() {
            this.show = true
        },
        leavehide() {
            if (this.$route.path != '/home') {
                this.show = false
            }
            else {
                this.currentIndex = -1
            }
        }
    },
    //组件一旦挂载完毕，可以向服务器发送请求
    mounted() {
        if (this.$route.path != '/home') {
            this.show = false
        }
    },

    computed: {
        //这个state是大仓库 里面包含各个模块
        ...mapState({ categoryList: (state) => state.home.categoryList })
    }
}
</script>

<style scoped lang="less">
.cur {
    background-color: skyblue;
}

.type-nav {
    border-bottom: 2px solid #e1251b;

    .container {
        width: 1200px;
        margin: 0 auto;
        display: flex;
        position: relative;

        .all {
            width: 210px;
            height: 45px;
            background-color: #e1251b;
            line-height: 45px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
        }

        .nav {
            a {
                height: 45px;
                margin: 0 22px;
                line-height: 45px;
                font-size: 16px;
                color: #333;
            }
        }

        .sort {
            position: absolute;
            left: 0;
            top: 45px;
            width: 210px;
            height: 461px;
            position: absolute;
            background: #fafafa;
            z-index: 999;

            .all-sort-list2 {
                .item {
                    h3 {
                        line-height: 30px;
                        font-size: 14px;
                        font-weight: 400;
                        overflow: hidden;
                        padding: 0 20px;
                        margin: 0;

                        a {
                            color: #333;
                        }
                    }

                    .item-list {
                        display: none;
                        position: absolute;
                        width: 734px;
                        min-height: 460px;
                        background: #f7f7f7;
                        left: 210px;
                        border: 1px solid #ddd;
                        top: 0;
                        z-index: 9999 !important;

                        .subitem {
                            float: left;
                            width: 650px;
                            padding: 0 4px 0 8px;

                            dl {
                                border-top: 1px solid #eee;
                                padding: 6px 0;
                                overflow: hidden;
                                zoom: 1;

                                &.fore {
                                    border-top: 0;
                                }

                                dt {
                                    float: left;
                                    width: 54px;
                                    line-height: 22px;
                                    text-align: right;
                                    padding: 3px 6px 0 0;
                                    font-weight: 700;
                                }

                                dd {
                                    float: left;
                                    width: 415px;
                                    padding: 3px 0 0;
                                    overflow: hidden;

                                    em {
                                        float: left;
                                        height: 14px;
                                        line-height: 14px;
                                        padding: 0 8px;
                                        margin-top: 5px;
                                        border-left: 1px solid #ccc;
                                    }
                                }
                            }
                        }
                    }

                    // &:hover {
                    //     .item-list {
                    //         display: block;
                    //     }
                    // }
                }
            }
        }

        // 动画进入的开始状态
        .sort-enter {
            opacity: 0;
        }

        .sort-enter-active {
            transition: all 1s;
        }

        //动画的结束状态
        .sort-enter-to {
            opacity: 1;
        }

        .sort-leave {
            opacity: 1;
        }

        .sort-leave-active {
            transition: all .5s;
        }

        .sort-leave-to {
            opacity: 0;
        }
    }
}
</style>