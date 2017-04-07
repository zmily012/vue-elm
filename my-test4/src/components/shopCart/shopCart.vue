<template>
<div>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class="{'highlight':totalCount>0}">
						<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right" @click.stop.prevent="pay">
				<div class="pay" :class="payClass">
					{{payDesc}}
				</div>
			</div>
		</div>
		<div class="ball-container">
			<transition-group 
				name="droping" 
				tag="div" 
				v-on:enter="enter"
				v-on:before-enter="beforeEnter"
				v-on:after-enter="afterEnter"
			>
				<div v-for="ball in balls" v-show="ball.show" class="ball" :key="ball.id">
					<div class="inner inner-hook"></div>
				</div>
			</transition-group>
		</div>
		<transition name="fold">
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h1 class="title">购物车</h1>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content" ref="listContent">
					<ul>
						<li class="food" v-for="food in selectFoods">
							<span class="name">{{ food.name }}</span>
							<div class="price">
								<span>￥{{food.price*food.count}}</span>
							</div>
							<div class="cartcontrol-wrapper">
								<cartcontrol :food="food"></cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>		
	</div>
	<transition name="fade">
		<div class="list-mask" v-show="listShow" @click="hideList"></div>
	</transition>
</div>
	
	
</template>

<script type="text/javascript">
	import BScroll from 'better-scroll';
	import cartcontrol from 'components/cartcontrol/cartcontrol';
	export default {
		props: {
			selectFoods: {
				type: Array,
				default() {
					return [];
				}
			},
			deliveryPrice: {
				type: Number,
				default: 0
			},
			minPrice: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				balls: [
					{
						show: false,
						id: 1
					},
					{
						show: false,
						id: 2
					},
					{
						show: false,
						id: 3
					},
					{
						show: false,
						id: 4
					},
					{
						show: false,
						id: 5
					}
				],
				dropBalls: [], // 已经下落的小球
				fold: true
			};
		},
		computed: {
			totalPrice() {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			totalCount() {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			payDesc() {
				if (this.totalPrice === 0) {
					return '￥' + this.minPrice + '元起送';
				} else if (this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return '还差￥' + diff + '元起送';
				} else {
					return '去结算';
				}
			},
			payClass() {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			listShow() {
				if (!this.totalCount) {
					this.fold = true;
					return false;
				}
				let showe = !this.fold;
				if (showe) {
					this.$nextTick(() => {
						if (!this.scroll) {
							this.scroll = new BScroll(this.$refs.listContent, {
								click: true
							});
						} else {
							this.scroll.refresh();
						}
					});
				}
				return showe;
			}
		},
		methods: {
			drop(el) {
				for (let i=0; i< this.balls.length; i++) {
					let ball = this.balls[i];
					if (!ball.show) {
						ball.show = true;
						ball.el = el;
						this.dropBalls.push(ball);
						// console.log(this.dropBalls);
						return;
					}					
				}
			},
			beforeEnter(el) { 				
				let count = this.balls.length;
				while (count--) {
					let ball = this.balls[count];
					if (ball.show) {
						let rect = ball.el.getBoundingClientRect(); // 获得此元素相当于视口的位置偏移
						// console.log(rect);
						let x = rect.left -32; 
						// console.log(x);
						let y = -(window.innerHeight - rect.top - 22);
						// console.log(el);
						el.style.display = '';
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
			            el.style.transform = `translate3d(0,${y}px,0)`;
			            let inner = el.getElementsByClassName('inner-hook')[0];
			            // console.log(inner);
			            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
			            inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			enter(el) {
				/* eslint-disable no-unused-vars */
				let rf = el.offsetHeight; // 此变量主动触发浏览器重绘,重绘后再次设置transform才有用
				this.$nextTick(() => {
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
				});
			},
			afterEnter(el) {
				let ball = this.dropBalls.shift(); // 数组开头删除一个，返回所删除的元素
				if (ball) {
					ball.show = false;
					el.style.display = 'none';
				}
			},
			toggleList() {
				if (!this.totalCount) {
					return;
				}
				this.fold = !this.fold; 
			},
			hideList() {
				this.fold = true;
			}, 
			empty() {
				this.selectFoods.forEach((food) => {
					food.count = 0;
				});
			},
			pay() {
				if (this.totalPrice < this.minPrice) {
					return;
				}
				window.alert(`支付${this.totalPrice}元`);
			} 			
		},
		components: {
			cartcontrol
		}
	};
</script>

<style type="text/css">
	.shopcart{
		position: fixed;left: 0;bottom: 0;z-index: 50;width: 100%;height: 48px;
	}
	.shopcart .content{
		display: flex;background:#141d27;font-size: 0;color: rgba(255,255,255,0.4);

	}
	.content .content-left{
		flex: 1;
	}
	.content-left .logo-wrapper{
		display: inline-block;position: relative;top: -10px;margin:0 12px;padding: 6px;width: 56px;height: 56px;box-sizing: border-box;vertical-align: top;border-radius: 50%;background:#141d27;
	}
	.content-left .logo-wrapper .logo{
		width: 100%;height:100%;border-radius: 50%;background: #2b343c;text-align: center;
	}
	.logo-wrapper .logo.highlight{
		background:rgb(0,160,220);
	}
	
	.logo-wrapper .logo .icon-shopping_cart{
		font-size: 24px;color: #80858a;line-height: 44px;
	}
	.icon-shopping_cart.highlight{
		color:#fff !important;
	}
	.logo-wrapper .num{
		position: absolute;top: 0;right: 0;width: 24px;line-height: 16px;text-align: center;border-radius: 16px;font-size: 9px;font-weight: 700;color: #fff;background: rgb(240,20,20);box-shadow: 0 4px 8px rgba(0,0,0,0.4)
	}
	.content-left .price{
		display: inline-block;vertical-align: top;line-height: 24px;margin-top:12px;box-sizing: border-box;padding-right:12px;border-right:1px solid rgba(255,255,255,0.1);font-size: 16px;font-weight: 700;  color: rgba(255,255,255,0.4);
	}
	.price.highlight{
		color: #fff;
	}
	.content-left .desc{
		display: inline-block;vertical-align: top;line-height: 24px;margin: 12px 0 0 12px;font-size: 10px;color: rgba(255,255,255,0.4);
	}

	.content .content-right{
		flex: 0 0 105px;width: 105px;
	}
	.content-right .pay{
		height: 48px;line-height: 48px;text-align: center;font-size: 12px;font-weight: 700;background: #2b333b;
	}
	.content-right .pay.not-enough{
		background: #2b333b;
	}
	.content-right .pay.enough{
		background:#00b43c;color: #fff;
	}

	.content .ball-container{

	}
	.ball-container .ball{
		position: fixed;left: 32px;bottom: 22px;z-index: 200;
	}
	 .ball.droping-enter-active, .ball.droping-enter{
		transition: all 0.4s cubic-bezier(.41,-0.35,.83,.67); 
	}
	.ball.droping-enter-active .inner, .ball.droping-enter .inner{
		width: 16px;height: 16px;border-radius: 50%;background:rgb(0,160,220);transition: all 0.4s linear; 
	}  

	.shopcart-list{
		position: absolute;left: 0;top: 0;z-index: -1;width: 100%;transform: translate3d(0,-100%,0);
	}
	

	.shopcart-list .list-header{
		height: 40px;line-height: 40px;padding: 0 18px;background:#f3f5f7;border-bottom: 1px solid rgba(7,17,27,0.1)
	}
	.shopcart-list .list-header .title{
		float: left;font-size: 14px;color: rgb(7,17,27);
	}
	.shopcart-list .list-header .empty{
		float: right;font-size: 12px;color: rgb(0,160,220);
	}
	.shopcart-list .list-content{
		padding: 0 18px;max-height: 217px;overflow: hidden;background:#fff;
	}
	.list-content .food{
		position: relative;padding: 12px 0;box-sizing: border-box;border-bottom: solid 1px rgba(7,17,27,0.1)
	}
	.list-content .food .name{
		line-height: 24px;font-size: 14px;color: rgb(7,17,27);
	}
	.list-content .food .price{
		position: absolute;right: 90px;bottom: 12px;line-height: 24px;font-size: 14px;font-weight: 700;color: rgb(240,20,20);
	}
	.list-content .food .cartcontrol-wrapper{
		position: absolute;right: 0;bottom: 6px;
	}

	.list-mask{
		position: fixed;top: 0;left: 0;width: 100%;height: 100%;z-index: 40;filter:blur(10px);opacity: 1;background:rgba(7,17,27,0.6);
	}

	

	.list-mask.fade-enter-active, .list-mask.fade-leave-active{
		opacity: 1;background:rgba(7,17,27,0.6);transition: all 1s;
	}
	.list-mask.fade-enter, .list-mask.fade-leave-active{
		opacity: 0;background:rgba(7,17,27,0);
	} 


	.shopcart-list.fold-enter-active, .shopcart-list.fold-leave-active{
		transform: translate3d(0,-100%,0);transition: all 1s;
	}	
	.shopcart-list.fold-enter, .shopcart-list.fold-leave-active{
		transform: translate3d(0, 0, 0);
	} 
</style>