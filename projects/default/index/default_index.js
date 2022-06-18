let behavior = require('../../../behavior/default_index_bh.js');
let PassortBiz = require('../../../biz/passport_biz.js');
let skin = require('../../skin/skin.js');

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

    behaviors: [behavior],

	onReady: function () {
		PassortBiz.initPage({
			skin,
			that: this,
			isLoadSkin: true,
			tabIndex: -1,
			isModifyNavColor: true
		});
	},

    
})