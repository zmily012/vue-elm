<template>
<div>
  <div class="goods">
   	<div class="menu-wrapper" ref="menuWrapper">
   		<ul>
   			<li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)">
   				<span class="text">
   					<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{ item.name }}
   				</span>  				
   			</li>
   		</ul>
   	</div>
   	<div class="foods-wrapper" ref="foodsWrapper">
   		<ul>
   			<li v-for="item in goods" class="food-list food-list-hook">
   				<h1 class="title">{{ item.name }}</h1>
   				<ul>
   					<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item">
   						<div class="icon">
   							<img width="57" height="57" :src="food.icon">
   						</div>
   						<div class="content">
   							<h2 class="name">{{ food.name }}</h2>
   							<p class="desc">{{ food.description }}</p>
   							<div class="extra">
   								<span class="count">月售{{ food.sellCount }}份</span><span>好评率{{food.rating}}%</span>
   							</div>
   							<div class="price">
   								<span class="now">￥{{ food.price }}</span>
   								<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
   							</div>
   							<div class="cartcontrol-wrapper">
			                  <cartcontrol :food="food"></cartcontrol>
			                </div>
   						</div>
   					</li>
   				</ul>
   			</li>
   		</ul>
   	</div>
   	<shopcart ref="shopCart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
  <food :food="selectedFood" ref="food"></food>
 </div>
</template>

<script>
	import BScroll from 'better-scroll';
	import shopcart from 'components/shopCart/shopCart';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	import food from 'components/food/food';
	export default {
	  	props: {
	  		seller: {
	  			type: Object
	  		}
	  	},
	  	data() {
	  		return {
	  			goods: [],
	  			listHeight: [],
	  			scrollY: 0,
	  			selectedFood: {}
	  		};
	  	},
	  	computed: {
	  		currentIndex() {
	  			for (let i = 0; i < this.listHeight.length; i++) {
	  				let height1 = this.listHeight[i];
	  				let height2 = this.listHeight[i + 1];
	  				if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) { // !height2是判断如果落到最后一个时，返回最后一个的索引
	  					return i;
	  				}
	  			}
	  			return 0;
	  		},
	  		selectFoods() {
	  			let foods = [];
	  			this.goods.forEach((good) => {
	  				good.foods.forEach((food) => {
	  					if (food.count) {
	  						foods.push(food);
	  					}
	  				});
	  			});
	  			return foods;
	  		}
	  	},
	  	created() {
	  		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	  		this.$http.get('/api/goods').then((response) => {
	  			// resources插件里面返回的并不是json所有数据，他封装了一层，有body，bodyBlob，bodyText。
				// 所以获取数据时要通过response.body.data来获取信息
	  			response = response.body;
	  			if (response.errno === 0) {
	  				this.goods = response.data;
	  				this.$nextTick(() => {
	  					this._initScroll();
	  					this._calculateHeight();
	  				});
	  			}
	  		});
	  		this.$root.eventHub.$on('cart.add', (target) => {
	  			this._drop(target);
	  		});
	  	},
	  	methods: {
	  		selectMenu(key, event) {
	  			if (!event._constructed) {
	  				return;
	  			}
	  			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
	  			let el = foodList[key];
	  			this.foodsScroll.scrollToElement(el, 300);  // 左右联动，scrollToElement接口点击左侧右侧滚动到相应位置
	  			// console.log(key);
	  		},
	  		_initScroll() {
	  			this.menuScroll = new BScroll(this.$refs.menuWrapper, {
	  				click: true
	  			});
	  			this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
	  				click: true,
	  				probeType: 3 // 实时监控滚动的位置
	  			});
	  			this.foodsScroll.on('scroll', (pos) => {
	  				this.scrollY = Math.abs(Math.round(pos.y)); // 用于和左侧索引做映射。返回右边内容滚动的Y坐标
	  			});
	  		},
	  		_calculateHeight() {
	  			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
	  			let height = 0;
	  			this.listHeight.push(height);
	  			for (let i=0; i<foodList.length; i++) {
	  				let item = foodList[i];
	  				height += item.clientHeight;
	  				this.listHeight.push(height);
	  				// console.log(this.listHeight);
	  			}
	  		},
	  		_drop(target) {
	  			// 体验优化，异步执行下落动画
	  			this.$nextTick(() => {
	  				this.$refs.shopCart.drop(target);
	  			});
	  		},
	  		selectFood(food, event) {
	  			if (!event._constructed) {
	  				return;
	  			}
	  			this.selectedFood = food;
	  			this.$refs.food.show();
	  		}

	  	},
	  	components: {
	  		shopcart,
	  		cartcontrol,
	  		food
	  	}
	};
</script>

<style>
	.goods{
		display: flex;position: absolute;top: 174px;bottom: 46px;width: 100%;overflow: hidden;
	}
	.goods .menu-wrapper{
		flex: 0 0 80px;width: 80px;background:#f3f5f7;
	}
	.menu-wrapper .menu-item{
		display: table;height: 54px;width: 56px;padding: 0 12px;line-height: 14px;
	}
	.menu-wrapper .menu-item.current{
		position: relative;z-index: 10;margin-top: -1px;background:#fff;font-weight: 700;
	}
	.menu-item.current .text{
		border: none;
	}

	.menu-item .icon{
		display: inline-block;width: 12px;height: 12px;margin-right: 4px;background-size: 12px 12px;
		background-repeat: no-repeat;
	}
	.icon.decrease{
		background-image: url("decrease_1@3x.png");
	}
	.icon.discount{
		background-image: url("discount_1@3x.png");
	}
	.icon.guarantee{
		background-image: url("guarantee_1@3x.png");
	}
	.icon.invoice{
		background-image: url("invoice_1@3x.png");
	}
	.icon.special{
		background-image: url("special_1@3x.png");
	}
	.menu-item .text{
		display: table-cell;width: 56px;vertical-align: middle;font-size: 12px;border-bottom: solid 1px rgba(7,17,27,0.1);
	}

	.goods .foods-wrapper{
		flex: 1;
	}
	.foods-wrapper .title{
		padding-left: 14px;height: 26px;line-height: 26px;border-left: 2px solid #d9dde1;font-size: 12px;color: rgb(147,153,159);background:#f3f5f7;
	}
	.foods-wrapper .food-item{
		display: flex;margin:18px;padding-bottom: 18px;border-bottom: 1px solid rgba(7,17,27,0.1);
	}
	.foods-wrapper .food-item:last-child{
		border: none;margin-bottom: 0;
	}
	.food-item .icon{
		flex: 0 0 57px;margin-right: 10px;
	}
	.food-item .content{
		flex: 1;position: relative;
	}
	.content .name{
		margin:2px 0 8px 0;height: 14px;line-height: 14px;font-size: 14px;color: rgb(7,17,27);
	}
	.content .desc, .content .extra{
		line-height: 10px;font-size: 10px;color: rgb(147,153,159);
	}
	.content .desc{
		line-height: 12px;margin-bottom: 8px;
	}
	.content .extra .count{
		margin-right: 12px;
	}
	.content .price{
		font-weight: 700;line-height: 24px;
	}
	.price .now{
		margin-right: 8px;font-size: 14px;color: rgb(240,20,20);
	}
	.price .old{
		text-decoration: line-through;font-size: 10px;color: rgb(147,153,159);
	}

	.goods .foods-wrapper .food-item .content .cartcontrol-wrapper {
	    position: absolute;
	    right: 0;
	    bottom: 12px;
	}
</style>
