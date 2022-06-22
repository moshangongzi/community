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
		// db.collection('check_table').add({
		// 	// data 字段表示需新增的 JSON 数据
		// 	data: {
		// 	  // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
		// 	  act_id: e.currentTarget.dataset.id,
		// 	  user_id: 1
		// 	},
		// 	success: res => {
		// 	  // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
		// 	  console.log(res)
		// 	}
		//   })
	}
})