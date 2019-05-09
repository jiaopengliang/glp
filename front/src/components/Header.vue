<template>
	<div class="header">
		<img src="../assets/images/glp/glpLogo.png" alt="" @click='goFirst'>
		<div class="head-right" @click="logoutEve()">
			<span class="name">{{this.admin.name}}</span>
			<p class="login-out" @click="logout()" :class="{'active':isshowExc}">退出登录</p>
		</div>
	</div>
</template>
<script>
import network from "@/libs/network"
import { removeItem, getItem } from "@/libs/storage"
export default {
	name: 'HeaderBar',
	data() {
		return {
			name: "",
			isshowExc: false,
			admin: getItem('admin') || {},
		};
	},
	methods: {
		goFirst() {

		},
		logout() {
			network.post("/api/login/doLogout").finally(() => {
				removeItem('token')
				this.$router.push("/login")
			})
		},
		logoutEve() {
			this.isshowExc = !this.isshowExc
		}
	},
	mounted() {
		// var query = this.$route.query;
		// if (query.ticket) {
		// 	this.isReferenced = true;
		// }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" rel="stylesheet/less">
.header {
	position: fixed;
	z-index: 1003;
	left: 0;
	right: 0;
	top: 0;
	height: 60px;
	background: #141A20;
	img {
		float: left;
		width: 96px;
		margin: 10px;
	}
	.head-right {
		float: right;
		height: 60px;
		span {
			display: inline-block;
			color: #74c4ff;
			font-size: 16px;
			vertical-align: middle;
			&.name {
				color: #fff;
				padding-right: 9px;
				position: relative;
				cursor: pointer;
				&::after {
					content: "";
					position: absolute;
					right: -14px;
					width: 16px;
					height: 16px;
					background: url('../assets/images/glp/admin.png') no-repeat;
					cursor: pointer;
				}
			}
		}
		.login-out {
			position: absolute;
			right: 11px;
			top: 60px;
			width: 143px;
			height: 0;
			line-height: 40px;
			padding-left: 52px;
			color: #fff;
			background: #141A20;
			font-size: 14px;
			transition: height .3s;
			-ms-transition: height .3s;
			-moz-transition: height .3s;
			overflow: hidden;
			cursor: pointer;
			&.active {
				height: 40px;
			}

			&::before {
				content: "";
				position: absolute;
				top: 11px;
				left: 26px;
				width: 16px;
				height: 16px;
				background: url('../assets/images/glp/login-out.png') no-repeat;
			}
		}
	}
}
</style>
