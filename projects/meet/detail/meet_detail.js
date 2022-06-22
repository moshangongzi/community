// let behavior = require('../../../behavior/meet_detail_bh.js');
const db = wx.cloud.database()
Page({
	// behaviors: [behavior], 
	onLoad: function (option) {
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
	bindJoinTap: function (e) {
		// 获取用户的id
		// 获取活动的id
		// 将两个id存入审批表user_id,act_id

		wx.navigateTo({
			url: `../join/meet_join?id=${e.currentTarget.dataset.id}`,
		})
		console.log(e.currentTarget.dataset.id);
		
	}
})