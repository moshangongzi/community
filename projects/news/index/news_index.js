let behavior = require('../../../behavior/news_index_bh.js');
let PassortBiz = require('../../../biz/passport_biz.js');
let skin = require('../../skin/skin.js');
const db = wx.cloud.database()
Page({
	behaviors: [behavior],

	onReady: function () {
		PassortBiz.initPage({
			skin,
			that: this,
			isLoadSkin: true,
			tabIndex: -1,
			isModifyNavColor: true
		});

		this._setCateTitle(skin);
		db.collection('com_notice').get({
			success: res => {
			  // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
			//   console.log("fff",res) 
			 this.setData({
				'dataList.list':res.data,
				'dataList.isLoad': true
			 })
			}
		  })
	},
})