<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
  import header from './components/header/header.vue';

  export default {
    data() {
      return {
        seller: {}
      };
    },
    created() {
      this.$http.get('/api/seller').then((response) => {
        // success callback
        response = response.body; 
        // console.log(response);
        if (response.errno === 0) {
          this.seller = response.data;
        }
      }, (response) => {
        // error callback

      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style>
  .tab{
    display:flex;
    width:100%;
    height:40px;
    line-height:40px;
    border-bottom: solid 1px rgba(7,17,27,0.1);
    position: relative;
  }
  .tab:after{
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid rgba(7,17,27,0.1);
    content: ''
  }
  .tab .tab-item{
    flex:1;
    text-align:center;
  }
  .tab-item{
    display: block;
    text-decoration: none;
    font-size: 14px;
    color: rgb(77,85,93);
  }
  .tab-item .active{
    color: rgb(240,20,20);
  }
</style>
