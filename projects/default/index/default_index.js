const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        skin: {
            meetTypeArr: [
                {
                    label: '社团活动',
                    val: 1,
                }
            ],
            newsCateArr: [
                {
                    ext: 'rightpic',
                    label: '社团通知',
                    val: 1
                },
                {
                    ext: 'leftpic',
                    label: '社团简介',
                    val: 2
                },
                {
                    label: '社团福利',
                    val: 3
                },
                {
                    label: '社团章程',
                    val: 4
                },
                {
                    label: '社团招新',
                    val: 5
                },
            ]
        },
        dataList: []
    },
    onLoad: function (options) {
        db.collection('com_notice').get({
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