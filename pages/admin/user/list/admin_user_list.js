let db = wx.cloud.database().collection('User');
Page({
	data: {
		userList: [],
		inputValue: '',
	},
	onLoad: function () {
		this.getUserList()
	},
	//获取用户数据
	getUserList() {
		db.get()
			.then(res => {
				this.setData({
					userList: res.data
				})
			})
			.catch(err => {
				console.log('用户数据请求失败', err)
			})
	},
	onChange(e) {
		this.setData({
			inputValue: e.detail,
		});
	},
	onSearch() {
		var value = this.data.inputValue;
		db.where({
			uname: value
		})
			.get()
			.then(res => {
				console.log(res)
				this.setData({
					userList: res.data,
					inputValue:''
				})
			})
			.catch(err => {
				console.log('用户筛选后数据请求失败', err)
			})
		console.log(this.data.inputValue)
	},
	//删除用户
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
				this.getUserList()
				wx.showToast({
					title: '删除成功！',
				})
			})
			.catch(err => {
				console.log('删除失败', err)
			})
	}
})