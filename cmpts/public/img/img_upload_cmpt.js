const pageHelper = require('../../../helper/page_helper.js');
const contentCheckHelper = require('../../../helper/content_check_helper.js');
const setting = require('../../../setting/setting.js');

Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		imgList: {
			type: String,
			value: ''

		},
		imgMax: {
			type: Number,
			value: 4,
		},
		title: {
			type: String,
			value: '图片上传',
		},
		isCheck: { //是否做图片内容校验
			type: Boolean,
			value: true,
		},
		isShowNo: { //是否显示序号
			type: Boolean,
			value: false,
		},
		imgUploadSize: { //图片最大大小
			type: Number,
			value: setting.IMG_UPLOAD_SIZE,
		},
		isShowSize: { //是否提示图片尺寸
			type: Boolean,
			value: true,
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		//imgList:[]
	},


	/**
	 * 生命周期方法
	 */
	lifetimes: {
		attached: function () {

		},

		ready: function () {

		},
		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		/**
		 * 选择上传图片 
		 */
		bindChooseImgTap: function (e) {
			wx.chooseImage({
				count: this.data.imgMax - this.data.imgList.length, //默认9
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success: async (res) => {
					wx.showLoading({
						title: '图片校验中',
						mask: true
					});
					console.log('图片',res.tempFilePaths[0]);
					wx.cloud.uploadFile({//上传至微信云存储
						cloudPath: 'com_notice/社团简介章程福利/' + new Date().getTime() + "_.png",
						filePath: res.tempFilePaths[0],// 本地文件路径
						success: res => {
							console.log(res.fileID);
							that.setData({
								imgList: res.fileID
							})
							console.log(this.data.imgList);
							
						}
					})

					wx.hideLoading();
				}
			});
		},

		bindPreviewImgTap: function (e) {
			wx.previewImage({
				urls: this.data.imgList,
				current: e.currentTarget.dataset.url
			});
		},

		/**
		 * 	删除图片 
		 */
		catchDelImgTap: function (e) {
			let that = this;
			let callback = function () {
				// that.data.imgList;
				that.setData({
					imgList: ''
				});
				that.triggerEvent('upload', that.data.imgList);
			}
			pageHelper.showConfirm('确定要删除该图片吗？', callback);
		},

	}
})