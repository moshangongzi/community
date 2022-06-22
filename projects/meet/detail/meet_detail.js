const db = wx.cloud.database()
Page({
	onLoad:function(option) {
		this.setData({
			id: option.id
		})
		console.log(option.id);
		db.collection('ax_meet').doc(this.data.id).get({
			success: res => {
				// res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
				//   console.log("fff",res) 
				this.setData({
					meet: res.data,
					// isLoad: true
				})
				console.log(this.data.meet);
			}
		})
	},
})