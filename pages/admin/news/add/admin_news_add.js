const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const bizHelper = require('../../../../biz/biz_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
const validate = require('../../../../helper/validate.js');
const AdminNewsBiz = require('../../../../biz/admin_news_biz.js');
const db = wx.cloud.database()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		formCateId: 1,
		cateIdOptions: ['社团通知', '社团简介', '社团福利', '社团章程', '社团招新',],
		imgList: '',
		formOrder: '',
		formType: '',
		formTitle: '',
		formContent: '',
		formUrl: '',
		time: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		this.setData({
			isLoad: true
		});
	},

	model: function (e) {
		pageHelper.model(this, e);
	},

	//格式化日期函数
	changeTime(value) {
		var date = new Date(value);
		let Y = date.getFullYear() + '-';
		let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		let D = date.getDate() + ' ';
		return Y + M + D;
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {
		this.setData({
			time: this.changeTime(new Date().getTime())
		})
		console.log(this.data.time);
		// let data = this.data;
		// console.log(data);
		// 数据校验  
		if (this.data.formContent.length == 0 || this.data.formOrder == '' || this.data.formTitle == '') {
			return pageHelper.showModal('带*号的选项不能为空');
		}
		if (parseInt(this.data.formOrder) < 0) {
			return pageHelper.showModal('排序号只能大于等于0');
		}
		// console.log('bindFormSubmit', this.data.imgList);
	
		
		// 修改数据
		db.collection('com_notice').add({
			// data 传入需要局部更新的数据
			data: {
				title: this.data.formTitle,
				kind: this.data.formCateId,
				NEWS_ORDER: this.data.formOrder,
				content: this.data.formContent,
				NEWS_TYPE: this.data.formType,
				NEWS_URL: this.data.formUrl,
				pic: this.data.imgList,
				time:this.data.time,
				type: 'news',
				new_cate_name: this.data.cateIdOptions[this.data.formCateId-1],
				NEWS_STATUS: 1,
				NEWS_HOME: 0
			},
			success: res => {
				console.log(res)
				wx.showToast({
					title: '添加成功',
				})
			}, fail: err => {
				console.log(err);
			}
		})
		console.log('ok');
	},

	// 选择图片
	bindChooseImgTap: function (e) {
		wx.chooseImage({
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], //从相册选择
			success: (res) => {
				console.log('图片', res.tempFilePaths[0]);
				wx.cloud.uploadFile({//上传至微信云存储
					cloudPath: 'com_notice/社团简介章程福利/' + new Date().getTime() + "_.png",
					filePath: res.tempFilePaths[0],// 本地文件路径
					success: res => {
						console.log(res.fileID);
						this.setData({
							imgList: res.fileID
						})
						console.log(this.data.imgList);

					}
				})
			}
		});
	},


	bindImgUploadCmpt: function (e) {
		this.setData({
			imgList: e.detail
		});
	},

	switchModel: function (e) {
		pageHelper.switchModel(this, e);
	},

	url: function (e) {
		pageHelper.url(e, this);
	}
})