const AdminBiz = require('../../../../biz/admin_biz.js');
const AdminMeetBiz = require('../../../../biz/admin_meet_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
let db = wx.cloud.database().collection('activeList');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		actList: [],
		inputValue: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		// if (!AdminBiz.isAdmin(this)) return;

		//设置搜索菜单
		// await this._getSearchMenu();
		this.getActList()
	},
	//获取活动列表数据
	getActList() {
		db.get()
			.then(res => {
				console.log('获取活动列表数据成功')
				this.setData({
					actList: res.data
				})
			})
			.catch(err => {
				console.log('获取活动列表数据请求失败', err)
			})
	},
	onChange(e) {
		this.setData({
			inputValue: e.detail,
		});
	},
	//搜索筛选
	onSearch() {
		var value = this.data.inputValue;
		db.where({
			title: value
		})
			.get()
			.then(res => {
				this.setData({
					actList: res.data,
					inputValue: ''
				})
			})
			.catch(err => {
				console.log('筛选活动后数据请求失败', err)
			})
		console.log(this.data.inputValue)
	},
	//删除活动
	bindDelTap(e) {
		var that = this;
		wx.showModal({
			title: '提示',
			content: '确认删除？删除不可恢复',
			success: function (sm) {
				if (sm.confirm) {
					that.del(e.target.dataset.id);
				} else if (sm.cancel) {
					console.log('用户点击取消')
				}
			}
		})
	},
	del(id) {
		db.doc(id).remove()
			.then(res => {
				this.getActList()
				wx.showToast({
					title: '删除成功！',
				})
			})
			.catch(err => {
				console.log('删除失败', err)
			})
	},

	url: async function (e) {
		pageHelper.url(e, this);
	},

	bindCommListCmpt: function (e) {
		pageHelper.commListListener(this, e);
	},

	bindScanTap: function (e) {
		let meetId = pageHelper.dataset(e, 'id');
		let title = encodeURIComponent(pageHelper.dataset(e, 'title'));
		wx.navigateTo({
			url: '../scan/admin_meet_scan?meetId=' + meetId + '&title=' + title,
		});
	},
	//修改状态
	bindStatus: async function (e) {
		let itemList = ['启用', '停止预约', '未开始'];
		let meetId = e.target.dataset.id;
		wx.showActionSheet({
			itemList,
			success: async res => {
				switch (res.tapIndex) {
					case 0: { //启用
						await this.updateStatus(meetId, 0, this);
						break;
					}
					case 1: { //停止预约
						await this.updateStatus(meetId, 1, this);
						break;
					}
					case 2: { //未开始
						await this.updateStatus(meetId, -1, this);
						break;
					}
				}
			},
			fail: function (res) { }
		})
	},
	updateStatus(meetId, s) {
		if (!meetId) return;
		db.doc(meetId)
			.update({
				data: {
					status: s
				}
			})
			.then(res => {
				this.getActList()
				wx.showToast({
					title: '修改状态成功！',
				})
			})
			.catch(err => {
				console.log('修改状态失败', err)
			})
	}
})