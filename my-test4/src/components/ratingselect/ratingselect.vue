<template>
  <div class="ratingselect">
  	<div class="rating-type">
  		<span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
  		<span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
  		<span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
  	</div>
  	<div @click="toggleContent($event)" class="switch" :class="{'on':onlyContent}">
  		<span class="icon-check_circle"></span>
  		<span class="text">只看有内容的评价</span>
  	</div>
  </div>
</template>

<script>
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL =2;

    export default {
	  	props: {
	  		ratings: {
	  			type: Array,
	  			default() {
	  				return [];
	  			}
	  		},
	  		selectType: {
	  			type: Number,
	  			default: ALL
	  		},
	  		onlyContent: {
	  			type: Boolean,
	  			default: false
	  		},
	  		desc: {
	  			type: Object,
	  			default() {
	  				return {
	  					all: '全部',
	  					positive: '满意',
	  					negative: '不满意'
	  				};
	  			}
	  		}
	  	},
	  	computed: {
	  		positive() {
	  			return this.ratings.filter((rating) => {
	  				return rating.rateType === POSITIVE;
	  			});
	  		},
	  		negative() {
	  			return this.ratings.filter((rating) => {
	  				return rating.rateType === NEGATIVE;
	  			});
	  		}
	  	},
	  	methods: {
	  		select(type, event) {
	  			if (!event._constructed) {
	  				return;
	  			}
	  			this.selectType = type;
	  			this.$root.eventHub.$emit('ratingtype.select', type);
	  		},
	  		toggleContent(event) {
	  			if (!event._constructed) {
	  				return;
	  			}
	  			this.onlyContent = !this.onlyContent;
	  			this.$root.eventHub.$emit('content.toggle', this.onlyContent);
	  		}
	  	}
    }; 
</script>

<style>
  .ratingselect .rating-type{
	padding: 18px 0;margin:0 18px;border-bottom: solid 1px rgba(7,17,27,0.1);
  }
  .rating-type .block{
  	display: inline-block;padding: 8px 12px;margin-right: 8px;border-radius: 1px;color: rgb(77,85,93);font-size: 12px;line-height: 16px;
  }
  .rating-type .block.active{
  	color: #fff;
  }
  .rating-type .block.positive{
  	background:rgba(0,160,220,0.2);
  }
  .rating-type .block.positive.active{
  	background:rgb(0,160,220);
  }
  .rating-type .block.negative{
  	background:rgba(77,87,93,0.2);
  }
  .block.negative.active{
  	background:rgb(77,87,93);
  }
  .rating-type .block .count{
	font-size: 8px;margin-left: 2px;
  }

  .ratingselect .switch{
  	 padding: 12px 18px;line-height: 24px;border-bottom: 1px solid rgba(7,17,27,0.1);color: rgb(147,153,159);
  }
  .switch .icon-check_circle{
  	margin-right: 4px;font-size: 24px;display: inline-block;vertical-align: top;
  }
  .switch.on .icon-check_circle{
  	color: #00c850;
  }
  .switch .text{
  	font-size: 12px;
  }
</style>
