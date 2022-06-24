// const db = wx.cloud.database().collection('activeList')
const db = wx.cloud.database()
Page({
	// behaviors: [behavior], 
	data: {
		inputValue: '',
		actList: [],
		actIdList: [],
		isLoad: false,
		openid: '',
	},
	onLoad() {
		this.getopenid();
	},
	//获取openid
	getopenid() {
		wx.cloud.callFunction({
			name: 'getOpenid'
		}).then(res => {
			this.setData({ openid: res.result.openid });
			this.getActIdList();
			console.log('获取openid函数成功', res.result.openid);
		}).catch(res => {
			console.log('获取openid函数失败', res)
		});
	},
	// 获取用户的活动id列表
	getActIdList() {
		db.collection('User').doc(this.data.openid)
			.get()
			.then(res => {
				this.setData({
					actIdList: res.data.actList
				})
				console.log('拿到了id列表', res.data.actList);
				this.getActList()
			})
			.catch(err => {
				console.log('没拿到id列表', err)
			})
	},
	//拿到活动列表
	getActList() {
		let act = {};
		let list = []
		for (var i = 0; i < this.data.actIdList.length; i++) {
			db.collection('activeList')
				.doc(this.data.actIdList[i])
				.get()
				.then(res => {
					act = res.data
					list.push(act);
					this.setData({
						actList: list
					})
				})
				.catch(res => {
					console.log('获取用户的活动列表失败', res)
				})
		}
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
})