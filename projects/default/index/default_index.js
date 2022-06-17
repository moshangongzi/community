// projects/default/index/default_index.js
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
        dataList: [
            {
                desc: '滑板社招新啦！！！',
                ext: '2022-6-14',
                pic: '../../skin/images/menu/skate.png',
                title: '社团招新标题',
                type: "news",
                _id: 1
            },
            {
                desc: '滑板社招新啦！！！',
                ext: '2022-6-14',
                pic: '../../skin/images/menu/skate.png',
                title: '社团招新标题',
                type: "news",
                _id: 2
            },
            {
                desc: '滑板社招新啦！！！',
                ext: '2022-6-14',
                pic: '../../skin/images/menu/skate.png',
                title: '社团招新标题',
                type: "news",
                _id: 3
            },
            {
                desc: '滑板社招新啦！！！',
                ext: '2022-6-14',
                pic: '../../skin/images/menu/skate.png',
                title: '社团招新标题',
                type: "news",
                _id: 4
            },
        ]
    },
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})