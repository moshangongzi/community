// let behavior = require('../../../behavior/meet_detail_bh.js');
const db = wx.cloud.database()
Page({
	data:{
		inputValue: '',
		showbtn:true
	},
	// behaviors: [behavior], 
	onLoad: function (option) {
		this.setData({
			id: option.id
		})
		db.collection('activeList').doc(this.data.id).get({
			success: res => {
				this.setData({
					meet: res.data,
				})
				// console.log(this.data.meet);
			}
		})
		if(option.title){
			this.setData({
				showbtn: false
			})
		}
	},
	bindJoinTap: function (e) {
		// 获取用户的id
		// 获取活动的id
		// 将两个id存入审批表user_id,act_id

		wx.navigateTo({
			url: `../join/meet_join?id=${e.currentTarget.dataset.id}&actname=${e.currentTarget.dataset.actname}`,
		})
		console.log(e.currentTarget.dataset.id);
		
	},

})