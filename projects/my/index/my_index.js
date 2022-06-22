let behavior = require('../../../behavior/my_index_bh.js');
let PassortBiz = require('../../../biz/passport_biz.js');
const pageHelper = require('../../../helper/page_helper');
const setting = require('../../../setting/setting');
let skin = require('../../skin/skin.js');
let db = wx.cloud.database().collection('User');

Page({
	data: {
		openid: '',
		uname: '',
		userImg: '',
		loginShow: true,
		canIUse: wx.canIUse('button.open-type.getUserInfo'), // 这个是兼容
	},
	behaviors: [behavior],

	onReady: function () {
		PassortBiz.initPage({
			skin,
			that: this,
			isLoadSkin: true,
			tabIndex: -1
		});
	},

	bindSetTap: function (e) {
		var that = this;
			let itemList = ['退出登录', '后台管理'];
			wx.showActionSheet({
				itemList,
				success: async res => {
					let idx = res.tapIndex;
					if (idx == 0) {
						wx.showModal({
							title: '提示',
							content: '您确定要退出登录吗',
							success: function (res) {
								if (res.confirm) {//这里是点击了确定以后
									console.log('用户点击确定')
									wx.removeStorageSync('userinfo');
									that.setData({
										loginShow: true,
									})
								} else {
									console.log('用户点击取消')
								}
							}
						})
					}
					if (idx == 1) {
						pageHelper.setSkin(skin);
						if (setting.IS_SUB) {
							PassortBiz.adminLogin('admin', '123456', this);
						} else {
							wx.reLaunch({
								url: '/pages/admin/index/login/admin_login',
							});
						}

					}

				},
				fail: function (res) {}
			})
		// this.setTap(e, skin);
	},
	onShow: function () {
		this.showUser()
	},
	showUser() {
		var that = this;
		wx.getStorage({
			key: 'userinfo',
			success(res) {
				that.setData({
					uname: res.data.uname,
					userImg: res.data.userImg,
					loginShow: false,
				})
				console.log('获取本地存储用户数据成功')
			}, fail(res) {
				console.log('获取失败', res)
				that.setData({
					loginShow: true
				})
			}
		})
	},
	bindGetUserInfo(e) {
		var that = this;
		wx.setStorage({
			data: {
				uname: e.detail.userInfo.nickName,
				userImg: e.detail.userInfo.avatarUrl,
			},
			key: 'userinfo',//本地缓存中指定的 key
			success: function () {
				console.log("存记录到本地成功");
				that.showUser();
				that.getopenid();
			}, fail: function () {
				console.log("存记录到本地失败")
			}
		});
	},
	//获取openid
	getopenid() {
		wx.cloud.callFunction({
			name: 'getOpenid'
		}).then(res => {
			this.setData({ openid: res.result.openid });
			this.addUser();
			console.log('获取openid函数成功', res.result.openid);
		}).catch(res => {
			console.log('获取openid函数失败', res)
		});
	},
	//新增用户
	addUser() {
		var that = this.data;
		db.add({
			data: {
				_id: that.openid,
				uname: that.uname,
				userImg: that.userImg
			}
		}).then(res => {
			console.log('添加用户成功', res)
		}).catch(res => {
			console.log('添加用户失败', res)
		});

	}
})