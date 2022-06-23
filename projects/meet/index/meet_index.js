// let behavior = require('../../../behavior/meet_index_bh.js');
// let PassortBiz = require('../../../biz/passport_biz.js');
// let skin = require('../../skin/skin.js');
const db = wx.cloud.database()
Page({
	// behaviors: [behavior], 
	
	onReady: function () {
		// PassortBiz.initPage({
		// 	skin,
		// 	that: this,
		// 	isLoadSkin: true,
		// 	isModifyNavColor: true
		// }); 

		// this._setTypeTitle(skin);

		db.collection('activeList').get({
			success: res => {
			 this.setData({
				'dataList.list':res.data,
				'dataList.isLoad': true
			 })
			}
		  })
	},
	// 页面跳转/图片预览 
	 url: function (e, that) {
		let url = e.currentTarget.dataset.url;
		if (!url) return;
		wx.navigateTo({
			url
		})
	}
})