const db = wx.cloud.database()

Page({
	onReady: function () {
		db.collection('com_notice').where({
			kind:1
		  }).get({
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