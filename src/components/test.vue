<template>
 <!-- 测试组件 -->
 <!-- 测试组件 -->
 <!-- 测试组件 -->
 <!-- 测试组件 -->
 <!-- 测试组件 -->
 <!-- 测试组件 -->
  <div class="hello">
    <p>{{ count }}</p>
    <p>{{sex}}</p>
    <button @click="addCount">加一个</button>
    <button @click="change">变一下</button>
    <p>{{dopush}}</p>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "HelloWorld",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      count: state => state.count,
      sex: state => state.sex
    }),
    ...mapGetters({
      dopush: "doneTodos"
    })
    // getrer(){
    //   return this.$store.getters.doneTodos
    // }
  },

  methods: {
    ...mapMutations({
      addCount: "inscrment",
      change: "pinjie"
    }),
    ...mapActions({
      addCount: "AsyncInscrmennt",
      change: "Asyncadd"
    })
  },

  mounted() {
        // console.log("this", this.$router.options);
    // console.log("this", this.$router);
    // console.log("this", this.$route);
    // console.log('$route.matched',this.$route.matched);
    // function doubleCNum(num) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       resolve(2 * num);//两秒之后才有resolve
    //     }, 1000);
    //   });
    // }
    // async function testFun() {
    //   let first = await doubleCNum(2);//使用await可以通过await等两秒之后的resolve返回后才会被赋值，否则返回promise对象
    //   let second = await doubleCNum(4);
    //   let third = await doubleCNum(3);
    //   console.log(first+second+third);
    // }
    // testFun();//6秒之后打印18
    //总结：核心意义为在使用异步的过程中无法确定什么时候回调函数执行完，核心思想为把不确定的异步函数已同步函数的执行方式执行出来，但保留异步请求的原式
    // console.log("getters.doneTodos", this.$store.getters.doneTodos);
     console.log('this',this.$router.options);
      console.log('this',this.$router);
      console.log('this',this.$route);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
