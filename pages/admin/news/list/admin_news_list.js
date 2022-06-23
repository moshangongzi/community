const AdminNewsBiz = require('../../../../biz/admin_news_biz.js');
const pageHelper = require('../../../../helper/page_helper.js');
const cloudHelper = require('../../../../helper/cloud_helper.js');
const db = wx.cloud.database()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		sortIndex: 8,
		filterFlag: {
		},

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		//设置搜索菜单  获取sortMenu
		await this._getSearchMenu();
		// 获取 导航栏 全部 的数据
		wx.cloud.callFunction({
			// 云函数名称
			name: 'getData',
			// 传给云函数的参数
			data: {
				filterFlag: this.data.filterFlag
			}
		})
			.then(res => {
				this.setData({
					'dataList.list': res.result.data,
					'dataList.isLoad': true,
					'dataList.total': res.result.data.length,
				})
			})
			.catch(console.error)
	},

	onShow() {
		wx.cloud.callFunction({
			// 云函数名称
			name: 'getData',
			// 传给云函数的参数
			data: {
				filterFlag: this.data.filterFlag
			}
		})
			.then(res => {
				this.setData({
					'dataList.list': res.result.data,
					'dataList.isLoad': true,
					'dataList.total': res.result.data.length,
				})
			})
			.catch(console.error)
	},


	url: async function (e) {
		pageHelper.url(e, this);
	},

	// 分类&排序一级菜单选择  
	bindSortTap1: function (e) {
		this.setData({
			filterFlag: {}
		})
		console.log(e.currentTarget.dataset.index);
		let sortIndex = e.currentTarget.dataset.index;
		this.setData({
			sortIndex,
		});
		// 全部8 正常9（NEWS_STATUS==1） 停用10（NEWS_STATUS==0） 首页推荐11（NEWS_HOME==0）先定义常量，然后点击9 10 11分别赋值 index大于=12  -11 否则不要
		// 社团通知12（kind：1） 简介13（kind：2）  福利14（kind：3） 章程15（kind：4）index-11
		// 招新16（kind：5）
		if (this.data.sortIndex == 9) {
			this.setData({
				'filterFlag.NEWS_STATUS': 1,
			})
		} else if (this.data.sortIndex == 10) {
			this.setData({
				'filterFlag.NEWS_STATUS': 0,
			})
		} else if (this.data.sortIndex == 11) {
			this.setData({
				'filterFlag.NEWS_HOME': 0,
			})
		} else if (this.data.sortIndex > 11) {
			this.setData({
				'filterFlag.kind': sortIndex - 11,
			})
		}

		this.getData(this.data.filterFlag)

	},

	// 根据 导航栏 获取相应数据
	getData(filterFlag) {
		console.log(filterFlag);
		wx.cloud.callFunction({
			// 云函数名称
			name: 'getData',
			// 传给云函数的参数
			data: {
				filterFlag: filterFlag
			}
		})
			.then(res => {
				this.setData({
					'dataList.list': res.result.data,
					'dataList.isLoad': true,
					'dataList.total': res.result.data.length,
				})
			})
			.catch(console.error)
	},

	// 上首页
	bindSortTap: async function (e) {
		let home = 0;
		let tip = '成功推荐到首页';
		db.collection('com_notice').doc(e.currentTarget.dataset.id).get({
			success: res => {
				console.log(res.data.NEWS_HOME)
				if (res.data.NEWS_HOME == 0) {
					home = 9999;
					tip = '取消推荐到首页'
				}
				db.collection('com_notice').doc(e.currentTarget.dataset.id).update({
					// data 传入需要局部更新的数据
					data: {
						// 表示将 done 字段置为 true
						NEWS_HOME: home
					},
					success: res => {
						console.log(res)
						wx.showToast({
							title: tip,
						})
						this.getData(this.data.filterFlag)
					}
				})
			}
		})

	},

	bindReviewTap: function (e) {
		let id = pageHelper.dataset(e, 'id');
		wx.navigateTo({
			url: pageHelper.fmtURLByPID('/pages/news/detail/news_detail?id=' + id),
		});
	},

	// 修改状态
	bindStatusSelectTap(e) {
		console.log(e.currentTarget.dataset.id);
		let itemList = ['停用', '启用', '删除'];
		wx.showActionSheet({
			itemList,
			success: res => {
				console.log(res.tapIndex)
				console.log(itemList[res.tapIndex]);
				//   res.tapIndex 是1 修改NEWS_STATUS==1
				//   res.tapIndex 是0 修改NEWS_STATUS==0
				//   res.tapIndex 是2 删除记录，然后重新加载页面
				if (res.tapIndex < 2) {
					db.collection('com_notice').doc(e.currentTarget.dataset.id).update({
						// data 传入需要局部更新的数据
						data: {
							// 表示将 done 字段置为 true
							NEWS_STATUS: res.tapIndex
						},
						success: res => {
							console.log(res)
							this.getData(this.data.filterFlag)
						}
					})
				} else if (res.tapIndex == 2) {
					wx.showModal({
						title: '',
						content: '确定要删除吗？',
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							if (res.confirm) {
								db.collection('com_notice').doc(e.currentTarget.dataset.id).remove({
									success: res => {
										this.getData(this.data.filterFlag)
									}
								})
							} else if (res.cancel) {
								console.log('用户点击取消')
							}
						}
					})

				}
			},
			fail: res => {
				console.log(res.errMsg)
			}
		})

	},

	_getSearchMenu: async function () {
		let arr = await AdminNewsBiz.getCateList();

		let sortItems = [];
		let sortMenus = [{
			label: '全部',
			type: '',
			value: ''
		}, {
			label: '正常',
			type: 'status',
			value: 1
		},
		{
			label: '停用',
			type: 'status',
			value: 0
		},
		{
			label: '首页推荐',
			type: 'home',
			value: 0
		}
		]
		sortMenus = sortMenus.concat(arr);
		this.setData({
			sortItems,
			sortMenus
		})


	}

})