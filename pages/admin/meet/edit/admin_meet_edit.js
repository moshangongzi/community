let db = wx.cloud.database().collection('activeList');
Page({
	data: {
		isLoad: false,
		id: null,
		show: false,

		title: '',
		formTitleFocus: '',
		place: '',
		formPlaceFocus: '',
		imgSrc: '',
		formStyleSet: {},
		formStyleSetFocus: '',
		date: '',
		formDateFocus: '',
		time: '',
		formTimeFocus: '',
		contentDesc: '',
		formContentDescFocus: ''
	},
	onLoad: async function (options) {
		if (options.id) {
			this.setData({
				id: options.id,
				isLoad: true
			})
			this.getActDetail()
		}
	},
	getActDetail() {
		db.doc(this.data.id).get()
			.then(res => {
				this.setData({
					title: res.data.title,
					place: res.data.place,
					['formStyleSet.pic']: res.data.imgSrc,
					imgSrc: res.data.imgSrc,
					date: res.data.date,
					time: res.data.time,
					contentDesc: res.data.content,
				})
			})
			.catch(err => {
				console.log('获取活动详情失败', err)
			})
	},
	//选择日期的相关函数开始
	onDisplay() {
		this.setData({ show: true });
	},
	onClose() {
		console.log('进入了onClose');
		this.setData({ show: false });
	},
	onConfirm(e) {
		this.setData({
			show: false,
			date: this.changeTime(e.detail),
		});
	},
	//格式化日期函数
	changeTime(value) {
		var date = new Date(value);
		let Y = date.getFullYear() + '-';
		let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		let D = date.getDate() + ' ';
		return Y + M + D;
	},
	//选择日期的相关函数结束


	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	// onPullDownRefresh: async function () {
	// 	await this._loadDetail();
	// 	wx.stopPullDownRefresh();
	// },

	// model: function (e) {
	// 	pageHelper.model(this, e);
	// },

	// bindFormSetCmpt: function (e) {
	// 	this.setData({
	// 		formFormSet: e.detail,
	// 	});
	// },
	//检查是否填写必填项
	Submit() {
		if (this.data.title.length <= 0) {
			wx.showToast({
				icon: 'none',
				title: '请填写「标题」',
			})
			this.setData({
				formTitleFocus: '请填写「标题」'
			})
		}
		else if (this.data.place.length <= 0) {
			wx.showToast({
				icon: 'none',
				title: '请填写「地点」',
			})
			this.setData({
				formPlaceFocus: '请填写「地点」'
			})
		}
		else if (this.data.formStyleSet.pic == undefined) {
			wx.showToast({
				icon: 'none',
				title: '请上传「封面」',
			})
			this.setData({
				formStyleSetFocus: '请上传「封面」'
			})
		}
		else if (this.data.date.length <= 0) {
			wx.showToast({
				icon: 'none',
				title: '请填写「活动日期」',
			})
			this.setData({
				formDateFocus: '请填写「活动日期」'
			})
		}
		else if (this.data.time.length <= 0) {
			wx.showToast({
				icon: 'none',
				title: '请填写「活动时段」',
			})
			this.setData({
				formTimeFocus: '请填写「活动时段」'
			})
		}
		else if (this.data.contentDesc.length <= 0) {
			wx.showToast({
				icon: 'none',
				title: '请填写「详细介绍」',
			})
			this.setData({
				formContentDescFocus: '请填写「详细介绍」'
			})
		}
		else {
			var that = this;
			if (!this.data.imgSrc) {
				wx.cloud.uploadFile({//上传至微信云存储
					cloudPath: 'actImage/' + new Date().getTime() + "_.jpg",
					filePath: that.data.formStyleSet.pic,// 本地文件路径
					success: res => {
						that.setData({
							imgSrc: res.fileID
						})
						that.creatAct()
					}
				})
			} else {
				this.saveAct();
			}
		}
	},
	//创建活动
	creatAct() {
		db.add({
			data: {
				title: this.data.title,
				place: this.data.place,
				imgSrc: this.data.imgSrc,
				date: this.data.date,
				time: this.data.time,
				content: this.data.contentDesc,
				status: '-1'
			}
		})
			.then(res => {
				wx.showToast({
				  title: '创建成功！',
				})
			})
			.catch(err => {
				console.log('添加失败', err)
			})
	},
	//保存活动
	saveAct() {
		db.doc(this.data.id).update({
			data: {
				title: this.data.title,
				place: this.data.place,
				imgSrc: this.data.imgSrc,
				date: this.data.date,
				time: this.data.time,
				content: this.data.contentDesc,
			}
		})
			.then(res => {
				wx.showToast({
					title: '修改成功！',
				  })
			})
			.catch(err => {
				console.log('修改失败', err)
			})
	}
})