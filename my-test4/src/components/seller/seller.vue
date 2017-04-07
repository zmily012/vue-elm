<template>
  <div class="seller" ref="seller">
   	<div class="seller-content">
   		<div class="overview">
   			<h1 class="title">{{seller.name}}</h1>
   			<div class="desc">
   				<star :size="36" :score="seller.score"></star>
   				<span class="text">({{seller.ratingCount}})</span>
   				<span class="text">月售{{seller.sellCount}}单</span>
   			</div>
   			<ul class="remark">
   				<li class="block">
   					<h2>起送价</h2>
   					<div class="content">
   						<span class="stress">{{seller.minPrice}}</span>元
   					</div>
   				</li>
   				<li class="block">
   					<h2>商家配送</h2>
   					<div class="content">
   						<span class="stress">{{seller.deliveryPrice}}</span>元
   					</div>
   				</li>
   				<li class="block">
   					<h2>平均配送时间</h2>
   					<div class="content">
   						<span class="stress">{{seller.deliveryTime}}</span>分钟
   					</div>
   				</li>
   			</ul>
   			<div class="favorite" @click="toggleFavorite">
   				<span class="icon-favorite" :class="{'active':favorite}"></span>
   				<span class="text">{{favoriteText}}</span>
   			</div>
   		</div>
   		<split></split>
   		<div class="bulletin">
   			<h1 class="title">公告与活动</h1>
   			<div class="content-wrapper">
   				<p class="contenten">{{seller.bulletin}}</p>
   			</div>
   			<ul v-if="seller.supports" class="supports">
   				<li class="support-item" v-for="(item, index) in seller.supports">
   					<span class="icon-seller" :class="classMap[item.type]"></span>
   					<span class="text">{{seller.supports[index].description}}</span>
   				</li>
   			</ul>
   		</div>
   		<split></split>
   		<div class="pics">
   			<h1 class="title">商家实景</h1>
   			<div class="pic-wrapper" ref="picWrapper">
   				<ul class="pic-list" ref="picList">
   					<li class="pic-item" v-for="pic in seller.pics">
   						<img :src="pic" width="120" height="90">
   					</li>
   				</ul>
   			</div>
   		</div>
		<split></split>
		<div class="info">
			<h1 class="title">商家信息</h1>
			<ul>
				<li class="info-item" v-for="info in seller.infos">{{info}}</li>
			</ul>
		</div>
   	</div>
  </div>
</template>

<script>
	import BScroll from 'better-scroll';
	import {saveToLocal, loadFromLocal} from '../../common/js/store';
	import star from 'components/star/star';
	import split from 'components/split/split';
    export default {
    	props: {
    		seller: {
    			type: Object
    		}
    	},
    	data() {
    		return {
    			favorite: (() => {
    				return loadFromLocal(this.seller.id, 'favorite', false);
    			})()
    		};
    	},
    	computed: {
    		favoriteText() {
    			return this.favorite ? '已收藏' : '收藏';
    		}
    	},
    	created() {
    		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    	},
    	watch: {
    		'seller'() {
    			this._initScroll();
    			this._initPics();
    		}
    	},
    	ready() {
    		this._initScroll();
    		this._initPics();
    	},
    	methods: {
    		toggleFavorite(event) {
    			if (!event._constructed) {
    				return;
    			}
    			this.favorite = !this.favorite;
    			saveToLocal(this.seller.id, 'favorite', this.favorite);
    		},
    		_initScroll() {
    			if (!this.scroll) {
    				this.scroll = new BScroll(this.$refs.seller, {
    					click: true
    				});
    			} else {
    				this.scroll.refresh();
    			}
    		},
    		_initPics() {
    			if (this.seller.pics) {
    				let picWidth = 120;
    				let margin = 6;
    				let width = (picWidth + margin) * this.seller.pics.length -margin;
    				this.$refs.picList.style.width = width + 'px';
    				// console.log(width);
    				this.$nextTick(() => {
    					if (!this.picScroll) {
    						this.picScroll = new BScroll(this.$refs.picWrapper, {
    							scrollX: true,
    							eventPassthrough: 'vertical'
    						});
    					} else {
    						this.picScroll.refresh();
    					}
    				});
    			}
    		}
    	},
    	components: {
    		star,
    		split
    	}
    };
</script>

<style>
.seller {
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
}
.seller .overview {
    position: relative;
    padding: 18px;
}
.seller .overview .title {
    margin-bottom: 8px;
    line-height: 14px;
    color: #07111b;
    font-size: 14px;
}
.seller .overview .desc {
    padding-bottom: 18px;
    position: relative;
    font-size: 0;
}
.seller .overview .desc .star {
    display: inline-block;
    margin-right: 8px;
    vertical-align: top;
}
.seller .overview .desc .text {
    display: inline-block;
    margin-right: 12px;
    line-height: 18px;
    vertical-align: top;
    font-size: 10px;
    color: #4d555d;
}
.seller .overview .remark {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    padding-top: 18px;
}
.seller .overview .remark .block {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    text-align: center;
    border-right: 1px solid rgba(7,17,27,0.1);
}
.seller .overview .remark .block h2 {
    margin-bottom: 4px;
    line-height: 10px;
    font-size: 10px;
    color: #93999f;
}
.seller .overview .remark .block .content {
    line-height: 24px;
    font-size: 10px;
    color: #07111b;
}
.seller .overview .remark .block .content .stress {
    font-size: 24px;
}
.seller .overview .favorite {
    position: absolute;
    width: 50px;
    right: 11px;
    top: 18px;
    text-align: center;
}
.seller .overview .favorite .icon-favorite.active {
    color: #f01414;
}
.seller .overview .favorite .icon-favorite {
    display: block;
    margin-bottom: 4px;
    line-height: 24px;
    font-size: 24px;
    color: #d4d6d9;
}
.seller .overview .favorite .text {
    line-height: 10px;
    font-size: 10px;
    color: #4d555d;
}

.seller .bulletin {
    padding: 18px 18px 0 18px;
}
.seller .bulletin .title {
    margin-bottom: 8px;
    line-height: 14px;
    color: #07111b;
    font-size: 14px;
}
.seller .bulletin .content-wrapper {
    padding: 0 12px 16px 12px;
    position: relative;
    border-bottom: solid 1px rgba(7,17,27,0.1);
}
.seller .bulletin .content-wrapper .contenten {
    line-height: 24px;
    font-size: 12px;
    color: #f01414;
}
.seller .bulletin .supports .support-item {
    padding: 16px 12px;
    position: relative;
    font-size: 0;
    border-bottom: solid 1px rgba(7,17,27,0.1);
    margin-bottom: 0;
}

.seller .bulletin .supports .text {
    line-height: 16px;
    font-size: 12px;
    color: #07111b;
}

.seller .bulletin .supports .icon-seller {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: top;
    margin-right: 6px;
    background-size: 16px 16px;
    background-repeat: no-repeat;
}
.icon-seller.decrease{
	background-image: url("decrease_4@2x.png");
}
.icon-seller.discount{
	background-image: url("discount_4@2x.png");
}
.icon-seller.guarantee{
	background-image: url("guarantee_4@2x.png");
}
.icon-seller.invoice{
	background-image: url("invoice_4@2x.png");
}
.icon-seller.special{
	background-image: url("special_4@2x.png");
}



.seller .pics .title {
    margin-bottom: 12px;
    line-height: 14px;
    color: #07111b;
    font-size: 14px;
}
.seller .pics .pic-wrapper {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
}
.seller .pics .pic-wrapper .pic-list .pic-item {
    display: inline-block;
    margin-right: 6px;
    width: 120px;
    height: 90px;
}
.seller .info {
    padding: 18px 18px 0 18px;
    color: #07111b;
}
.seller .info .title {
    padding-bottom: 12px;
    line-height: 14px;
    position: relative;
    font-size: 14px;
    border-bottom: solid 1px rgba(7,17,27,0.1);
}
.seller .info .info-item {
    padding: 16px 12px;
    line-height: 16px;
    position: relative;
    font-size: 12px;
    border-bottom: solid 1px rgba(7,17,27,0.1);
}

.seller .pics {
    padding: 18px;
}
</style>
