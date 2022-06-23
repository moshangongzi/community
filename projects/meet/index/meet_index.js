const db = wx.cloud.database().collection('activeList')
Page({
	// behaviors: [behavior], 
	data:{
		inputValue: '',
		actList:[],
		isLoad:false
	},
	onReady: function () {
		db.get({
			success: res => {
			 this.setData({
				actList:res.data,
				isLoad: true
			 })
			}
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
})