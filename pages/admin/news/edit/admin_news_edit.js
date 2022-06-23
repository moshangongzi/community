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
		cateIdOptions: ['社团通知','社团简介','社团福利','社团章程','社团招新',]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log(options.id);
		// 初始化表单数据
		this.loadDetail(options.id);
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
				console.log(res.data)
				news = res.data
				this.setData({
					imgList: news.pic,
		
					// 表单数据 
					formCateId: news.kind,
					formOrder: news.NEWS_ORDER,
		
					formType: news.NEWS_TYPE,
		
					formTitle: news.title,
					formContent: news.content,
					formUrl: news.NEWS_URL,
				});
				console.log(this.data.imgList);
			}
		})
	},

	

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {

		let data = this.data;
		console.log(data);
		// 数据校验  by 类型
		if (data.formType == 0) { //内部
			if (this.data.formContent.length == 0) {
				return pageHelper.showModal('详细内容不能为空');
			}
			// 检验是否合乎要求
			data = validate.check(data, AdminNewsBiz.CHECK_FORM, this);
		} else { //外部
			data = validate.check(data, AdminNewsBiz.CHECK_FORM_OUT, this);
		}

		if (!data) return;
		data.cateName = AdminNewsBiz.getCateName(data.cateId);

		try {
			let newsId = this.data.id;
			data.id = newsId;

			if (this.data.imgList.length == 0) {
				return pageHelper.showModal('请上传封面图');
			}

			// 提取简介  
			data.desc = AdminNewsBiz.getDesc(data.desc, this.data.formContent);

			// 先修改，再上传 
			await cloudHelper.callCloudSumbit('admin/news_edit', data);

			// 图片 提交处理 
			wx.showLoading({
				title: '提交中...',
				mask: true
			});
			let imgList = this.data.imgList;
			await AdminNewsBiz.updateNewsPic(newsId, imgList);

			let formContent = this.data.formContent;
			wx.showLoading({
				title: '提交中...',
				mask: true
			});
			await AdminNewsBiz.updateNewsCotnentPic(newsId, formContent, this);



			let callback = async () => {

				// 更新列表页面数据
				let node = {
					'NEWS_TITLE': data.title,
					'NEWS_CATE_NAME': data.cateName,
					'NEWS_ORDER': data.order,
					'NEWS_TYPE': data.type
				}
				pageHelper.modifyPrevPageListNodeObject(newsId, node);

				wx.navigateBack();

			}
			pageHelper.showSuccToast('修改成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},


	bindImgUploadCmpt: function (e) {
		this.setData({
			imgList: e.detail
		});
	},

	switchModel: function (e) {
		pageHelper.switchModel(this, e);
	},

})