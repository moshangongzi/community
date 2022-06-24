let behavior = require('../../../behavior/news_index_bh.js');
let PassortBiz = require('../../../biz/passport_biz.js');
let skin = require('../../skin/skin.js');
const db = wx.cloud.database()
Page({
	behaviors: [behavior],
	data: {
		id: '',
		dataList: {}
	},

	onLoad(options) {
		console.log('onLoad',options.id);
		this.setData({
			id: options.id,
			_params:options.id
		})
	},

	onShow: function () {
		let id1 = this.data.id
		console.log('onShow',this.data.id);
		PassortBiz.initPage({
			skin,
			that: this,
			isLoadSkin: true,
			tabIndex: -1,
			isModifyNavColor: true
		});

		this._setCateTitle(skin);
		console.log(id1);
		db.collection('com_notice').where({
			kind: parseInt(this.data.id)
		}).get({
			success: res => {
				console.log(this.data.id);
				console.log(res.data);
				// res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
				//   console.log("fff",res) 
				this.setData({
					'dataList.list': res.data,
					'dataList.isLoad': true
				})
			}
		})
	},
})