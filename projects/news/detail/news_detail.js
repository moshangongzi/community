let behavior = require('../../../behavior/news_detail_bh.js');
let PassortBiz = require('../../../biz/passport_biz.js');
let skin = require('../../skin/skin.js');
const db = wx.cloud.database()
Page({
	onLoad: function (option) {
		// console.log(e);
		this.setData({
			id: option.id
		})
		db.collection('com_notice').doc(this.data.id).get({
			success: res => {
				// res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
				//   console.log("fff",res) 
				this.setData({
					news: res.data,
					// isLoad: true
				})
			}
		})
	}

	// behaviors: [behavior], 

	// onReady: function () {
	// 	PassortBiz.initPage({
	// 		skin,
	// 		that: this
	// 	});

	// 	db.collection('com_notice').doc().get({
	// 		success: res => {
	// 		  // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
	// 		//   console.log("fff",res) 
	// 		 this.setData({
	// 			news:res.data,
	// 			isLoad: true
	// 		 })
	// 		}
	// 	  })
	// },
})