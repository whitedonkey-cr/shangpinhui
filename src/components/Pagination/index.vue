<template>
    <!-- 封装分页器 -->
    <div class="pagination">
        <button :disabled="pageNo == 1" @click="$emit('getpage', pageNo - 1)">上一页</button>
        <button v-if="startnumANDendnum.start > 2" @click="$emit('getpage', 1)" :class="{ active: pageNo == 1 }">1</button>
        <button v-if="startnumANDendnum.start > 1">•••</button>

        <!-- 中间部分 -->
        <button v-for="(page, index) in startnumANDendnum.end" :key="index" :class="{ active: pageNo == page }"
            @click="$emit('getpage', page)" v-if="page >= startnumANDendnum.start">{{ page
            }}</button>

        <button v-if="startnumANDendnum.end <= startnumANDendnum.totalpage - 1">•••</button>
        <button :class="{ active: pageNo == startnumANDendnum.totalpage }"
            @click="$emit('getpage', startnumANDendnum.totalpage)"
            v-if="startnumANDendnum.end < startnumANDendnum.totalpage - 1">{{ startnumANDendnum.totalpage }}</button>
        <button :disabled="pageNo == startnumANDendnum.totalpage" @click="$emit('getpage', pageNo + 1)">下一页</button>

        <button style="margin-left: 30px">共 {{ total }} 条</button>
        <!-- <h1> {{ startnumANDendnum.start }}------{{ startnumANDendnum.end }}---当前{{ pageNo }}</h1> -->
    </div>
</template>

<script>
export default {
    name: "Pagination",
    props: ['pageNo', 'total', 'pageSize', 'continues'],//props接收后为vc对象的一个属性了 直接解构
    computed: {
        startnumANDendnum() {
            const { pageNo, total, pageSize, continues } = this
            let start = 0, end = 0, totalpage = 0
            totalpage = Math.ceil(total / pageSize)
            start = pageNo - ((continues - 1) / 2)
            end = pageNo + ((continues - 1) / 2)
            if (totalpage < continues) {
                start = 1
                end = totalpage
            }
            if (start < 1) {
                start = 1
                end = continues
            }
            if (end > totalpage) {
                start = totalpage - continues + 1
                end = totalpage
            }
            return { totalpage, start, end }
        }
    },

}
</script>

<style lang="less" scoped>
.pagination {
    text-align: center;

    button {
        margin: 0 5px;
        background-color: #f4f4f5;
        color: #606266;
        outline: none;
        border-radius: 2px;
        padding: 0 4px;
        vertical-align: top;
        display: inline-block;
        font-size: 13px;
        min-width: 35.5px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        box-sizing: border-box;
        text-align: center;
        border: 0;

        &[disabled] {
            color: #c0c4cc;
            cursor: not-allowed;
        }

        &.active {
            cursor: not-allowed;
            background-color: #409eff;
            color: #fff;
        }
    }
}
</style>
