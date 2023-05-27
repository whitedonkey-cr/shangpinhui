<!-- 主页 -->
<template>
  <div>
    <!-- 使用main.js里面我们注册的三级联动全局组件 直接使用就可以-->
    <TypeNav />
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <Floor v-for="(f, index) in floorlist" :key="index" :floor="f" />
    <Brand />
  </div>
</template>

<script>
import ListContainer from './ListContainer'
import Recommend from './Recommend'
import Rank from './Rank'
import Like from './Like'
import Floor from './Floor'
import Brand from './Brand'
import { mapState } from 'vuex'
export default {
  name: 'Home',
  components: { ListContainer, Recommend, Rank, Like, Floor, Brand },
  mounted() {
    this.$store.dispatch('getfloor')
  },
  computed: {
    ...mapState({ floorlist: (state) => state.home.floorlist })
  }
}
</script>

<style></style>
