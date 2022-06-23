let db = wx.cloud.database();
Page({
	data: {
		userIdList: [],
		userList: [],
		inputValue: '',
		title: '',
		titleEn: '',
		actId: ''
	},
	onLoad: function (options) {
		if (options && options.title) {
			let title = options.title;
			this.setData({
				title,
				titleEn: options.title,
				actId: options.meetId
			});
			wx.setNavigationBarTitle({
				title: '活动名单统计 - ' + title
			});
			this.getUserIdList();
		}
	},
	// 获取参加活动的用户id列表
	getUserIdList() {
		db.collection('activeList').doc(this.data.actId)
			.get()
			.then(res => {
				this.setData({
					userIdList: res.data.memberList
				})
				console.log('拿到了id列表', res.data.memberList);
				this.getUserList()
			})
			.catch(err => {
				console.log('没拿到id列表', err)
			})
	},
	//获取用户数据
	getUserList() {
		let user = {};
		let list = []
		for (var i = 0; i < this.data.userIdList.length; i++) {
			db.collection('User')
				.doc(this.data.userIdList[i])
				.get()
				.then(res => {
					user = res.data
					list.push(user); 
					this.setData({
						userList: list
					})
				})
				.catch(res => {
					console.log('获取活动的用户列表失败', res)
				})
		}
	},
	onChange(e) {
		this.setData({
			inputValue: e.detail,
		});
	},
	onSearch() {
		var value = this.data.inputValue;
		db.collection('User').where({
			uname: value
		})
			.get()
			.then(res => {
				console.log(res)
				this.setData({
					userList: res.data,
					inputValue: ''
				})
			})
			.catch(err => {
				console.log('用户筛选后数据请求失败', err)
			})
		console.log(this.data.inputValue)
	},
})