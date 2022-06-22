// let behavior = require('../../../behavior/meet_join_bh.js');
// let PassortBiz = require('../../../biz/passport_biz.js');
// let skin = require('../../skin/skin.js');
const db = wx.cloud.database()
Page({
	// behaviors: [behavior], 

	onLoad: function (option) {
		// PassortBiz.initPage({
		// 	skin,
		// 	that: this
		// });

		db.collection('ax_meet').where({
			_id: option.id
		}).get({
			success: res => {
				// res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
				//   console.log("fff",res) 
				this.setData({
					meet: res.data[0],
					// isLoad: true
				})
				console.log(this.data.meet);
			}
		})
	},
})