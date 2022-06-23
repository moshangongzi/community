// const AdminBiz = require('../../../../biz/admin_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const timeHelper = require('../../../../helper/time_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
const validate = require('../../../../helper/validate.js');
const AdminNewsBiz = require('../../../../biz/admin_news_biz.js');
const dataHelper = require('../../../../helper/data_helper.js');
const setting = require('../../../../setting/setting.js');
const db = wx.cloud.database()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		originalData: {},
		cateIdOptions: ['社团通知', '社团简介', '社团福利', '社团章程', '社团招新',]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log(options.id);
		// 初始化表单数据
		this.loadDetail(options.id);
	},

	bindPickerChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			formCateId: parseInt(e.detail.value) + 1
		})
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	model: function (e) {
		pageHelper.model(this, e);
	},

	loadDetail(id) {
		let news = ''
		// 根据id拿到数据，对变量进行赋值
		db.collection('com_notice').doc(id).get({
			success: res => {
				// console.log(res.data)
				news = res.data
				this.setData({
					// 原来的数据
					originalData: news,
					imgList: news.pic,

					// 表单数据 
					formCateId: news.kind,
					formOrder: news.NEWS_ORDER,

					formType: news.NEWS_TYPE,

					formTitle: news.title,
					formContent: news.content,
					formUrl: news.NEWS_URL,
				});
				console.log(this.data.originalData);
				// console.log(this.data.imgList);
			}
		})
	},



	/** 
	 * 数据提交
	 */
	bindFormSubmit() {

		let data = this.data;
		console.log(data);
		// 数据校验  
		if (this.data.formContent.length == 0 || this.data.formOrder == '' || this.data.formTitle == '') {
			return pageHelper.showModal('带*号的选项不能为空');
		}
		if (parseInt(this.data.formOrder) < 0) {
			return pageHelper.showModal('排序号只能大于等于0');
		}
		console.log('bindFormSubmit', this.data.imgList);
		this.setData({
			'originalData.title': this.data.formTitle,
			'originalData.kind': this.data.formCateId,
			'originalData.NEWS_ORDER': this.data.formOrder,
			'originalData.content': this.data.formContent,
			'originalData.NEWS_TYPE': this.data.formType,
			'originalData.NEWS_URL': this.data.formUrl,
			'originalData.pic': this.data.imgList,
		})
		console.log('sdfsdf', this.data.originalData);
		let id = this.data.originalData._id
		console.log(id);

		// 修改数据
		db.collection('com_notice').doc(id).update({
			// data 传入需要局部更新的数据
			data: {
				title: this.data.originalData.title,
				kind: this.data.originalData.kind,
				NEWS_ORDER: this.data.originalData.NEWS_ORDER,
				content: this.data.originalData.content,
				NEWS_TYPE: this.data.originalData.NEWS_TYPE,
				NEWS_URL: this.data.originalData.NEWS_URL,
				pic: this.data.originalData.pic,
			},
			success: res => {
				console.log(res)
				wx.showToast({
					title: '修改成功',
				})
			}, fail: err => {
				console.log(err);
			}
		})
		console.log('ok');

	},


	bindImgUploadCmpt: function (e) {
		console.log(e.detail);
		this.setData({
			imgList: e.detail
		});
	},

	switchModel: function (e) {
		pageHelper.switchModel(this, e);
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
	// 删除图片
	catchDelImgTap: function (e) {
		let that = this;
		let callback = function () {
			// that.data.imgList;
			that.setData({
				imgList: ''
			});
		}
		pageHelper.showConfirm('确定要删除该图片吗？', callback);
	},


})