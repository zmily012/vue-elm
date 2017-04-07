<template>
  <div class="header">
    <div class="content-wrapper">
    	<div class="avatar">
    		<img :src="seller.avatar" width="64" height="64">
    	</div>
    	<div class="content">
    		<div class="title">
    			<span class="brand"></span>
    			<span class="name">{{ seller.name }}</span>
    		</div>
    		<div class="description">
    			{{ seller.description }}/{{ seller.deliveryTime }}分钟到达
    		</div>
    		<div v-if="seller.supports" class="support">
    			<span class="icon" :class="classMap[seller.supports[0].type]"></span>
    			<span class="text">{{seller.supports[0].description}}</span>
    		</div>
    	</div>
    	<div class="support-count" v-if="seller.supports" @click="showDetail">
    		<span class="count">{{ seller.supports.length }}个</span>
    		<i class="icon-keyboard_arrow_right"></i>
    	</div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
    	<span class="bullet-title"></span><span class="bullet-text">{{ seller.bulletin }}</span>
    	<i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
    	<img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition name="fade">
	    <div v-show="detailShow" class="detail">
	    	<div class="detail-wrapper clearfix">
	    		<div class="detail-main">
	    			<h1 class="name">{{ seller.name }}</h1>
	    			<div class="star-wrapper">
	    				<star :size="48" :score="seller.score"></star>
	    			</div>
	    			<div class="title">
	    				<div class="line"></div>
	    				<div class="text">优惠信息</div>
	    				<div class="line"></div>
	    			</div>
	    			<ul v-if="seller.supports" class="supports">
	    				<li class="support-item" v-for="n in seller.supports">
	    					<span class="icon" :class="classMap[n.type]"></span>
	    					<!-- <span class="icon" :class="classMap[seller.supports[$index].type]"></span> -->
	    					<span class="text">{{ n.description }}</span>    				
	    				</li>
	    			</ul>
	    			<div class="title">
						<div class="line"></div>
	    				<div class="text">商家公告</div>
	    				<div class="line"></div>
	    			</div>
	    			<div class="bulletin">
	    				<p class="content">{{ seller.bulletin }}</p>
	    			</div>
	    		</div>
	    	</div>
	    	<div class="detail-close" @click="closeDetail">
	    		<i class="icon-close"></i>
	    	</div>
	    </div>
    </transition>
  </div>
</template>

<script>
	import star from 'components/star/star';
	export default {
	  	props: {
			seller: {
				type: Object
			}
	  	},
	  	data() {
	  		return {
	  			detailShow: false
	  		};
	  	},
	  	methods: {
	  		showDetail() {
	  			this.detailShow = true;
	  		},
	  		closeDetail() {
	  			this.detailShow = false;
	  		}
	  	},
	  	created() {
	  		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	  	},
	  	components: {
	  		star
	  	}
	};
</script>

<style>
.header{
	color: #fff;position: relative;background: rgba(7,17,27,0.5);overflow: hidden;
}
.content-wrapper{
	padding: 24px 12px 18px 24px;font-size: 0;position: relative;
}
.content-wrapper .avatar{
	display: inline-block;vertical-align: top;
}
.content-wrapper .avatar img{
	border-radius: 2px;
}
.content-wrapper .content{
	display: inline-block;font-size: 14px;margin-left: 16px;
}
.content .title{
	margin: 2px 0 8px 0;
}
.title .brand{
	display: inline-block;width: 30px;height: 18px;background-image: url("brand@2x.png");
	background-size: 30px 18px;background-repeat: no-repeat;vertical-align: top;
}
.title .name{
	margin-left: 6px;font-size: 16px;line-height: 18px;font-weight: bold;
}

.description{
	margin-bottom: 10px;line-height: 12px;font-size: 12px;
}

.support .icon{
	display: inline-block;width: 12px;height: 12px;margin-right: 4px;background-size: 12px 12px;
	background-repeat: no-repeat;
}
.icon.decrease{
	background-image: url("decrease_1@2x.png");
}
.icon.discount{
	background-image: url("discount_1@2x.png");
}
.icon.guarantee{
	background-image: url("guarantee_1@2x.png");
}
.icon.invoice{
	background-image: url("invoice_1@2x.png");
}
.icon.special{
	background-image: url("special_1@2x.png");
}
.support .text{
	font-size: 12px;line-height: 10px;vertical-align: top;
}
.support-count{
	position: absolute;right: 12px;bottom: 18px;padding: 0 8px;height: 24px;line-height: 24px;border-radius: 14px;background:rgba(0,0,0,0.2);text-align: center;
}
.support-count .count{
	font-size: 10px;
}
.support-count .icon-keyboard_arrow_right{
	font-size: 10px;line-height: 24px;margin-left: 2px;display: inline-block;
}

.bulletin-wrapper{
	height: 28px;line-height: 28px;padding: 0 22px 0 12px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;background:rgba(7,17,27,0.2);/*font-size: 0;*/
}
.bulletin-wrapper .bullet-title{
	display: inline-block;width: 22px;height: 12px;background:url("bulletin@2x.png") no-repeat;background-size: 22px 12px;
}
.bulletin-wrapper .bullet-text{
	margin:0 4px;font-size: 10px;font-weight: 200;vertical-align: top;
}
.bulletin-wrapper .icon-keyboard_arrow_right{
	position: absolute;font-size: 10px;right: 12px;top: 8px;
}
.background{
	position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: -1;filter: blur(10px);
}
.header .detail{
	position: fixed;z-index: 100;width: 100%;height: 100%;overflow: auto;background:rgba(7,17,27,0.8);top: 0;left: 0;transition: all 1s;
}
.detail.fade-enter-active, .detail.fade-leave-active{
	opacity: 1;background:rgba(7,17,27,0.8);
}
.detail.fade-enter, .detail.fade-leave-active{
	opacity: 0;background:rgba(7,17,27,0);
}
.clearfix{
	display: inline-block;
}
.clearfix:after{
	display: block;content: ".";height: 0;line-height: 0;clear: both;visibility: hidden;
}
.detail-wrapper{
	min-height: 100%;width: 100%;
}
.detail-main{
	margin-top: 64px;padding-bottom: 64px;
}
.detail-close{
	position: relative;width: 32px;height: 32px;margin:-64px auto 0 auto;clear: both;font-size: 32px;
}
.detail-close i{
	display: inline-block;
}

.detail-main .name {
    line-height: 16px;
    text-align: center;
    font-size: 16px;
    font-weight: 700;
}
.detail-main .star-wrapper {
    margin-top: 18px;
    padding: 2px 0;
    text-align: center;
}
.detail-main .title {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 80%;
    margin: 28px auto 24px auto;
}
.detail-main .title .line{
	-webkit-box-flex:1;-ms-flex:1;flex: 1;position: relative;top: -6px;border-bottom: 1px solid rgba(255,255,255,0.2);
}
.detail-main .title .text{
	padding: 0 12px;font-weight: 700;font-size: 14px;
}
.detail-main .supports{
	width: 80%;margin:0 auto;
}
.supports .support-item{
	padding: 0 12px;margin-bottom: 12px;font-size: 0;
}
.support-item .icon{
	display: inline-block;width: 16px;height: 16px;vertical-align: top;margin-right: 6px; background-size: 16px 16px;background-repeat: no-repeat;
}
.support-item .text{
	line-height: 16px;font-size: 12px;
}

.detail-main .bulletin {
    width: 80%;
    margin: 0 auto;
}
.bulletin .content{
	padding: 0 12px;line-height: 24px;font-size: 12px;
}
</style>
