const db = wx.cloud.database()
Page({
	data: {
		id: '',
		info: {
			name: '',
			phone: '',
			studentID: '',
			Class: '',
			act_name: ''
		},
	},
	onLoad: function (option) {
		// console.log(option.id);
		this.setData({
			'info.act_id': option.id,
			'info.act_name': option.actname,
			id: option.id
		})
		db.collection('ax_meet').where({
			_id: option.id
		}).get({
			success: res => {
				// res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
				//   console.log("fff",res) 
				this.setData({
					meet: res.data[0],
					// isLoad: true
				})
				console.log(this.data.meet);
			}
		})
	},
	nameInput(e) {
		console.log(e);
		this.setData({
			'info.name': e.detail
		})
	},
	phoneInput(e) {
		this.setData({
			'info.phone': e.detail
		})
	},
	studentIDInput(e) {
		this.setData({
			'info.studentID': e.detail
		})
	},
	ClassInput(e) {
		this.setData({
			'info.Class': e.detail
		})
	},
	save(e) {
		if(this.data.info.name===''||this.data.info.phone===''||this.data.info.studentID===''||this.data.info.Class===''){
			wx.showToast({
				icon: 'none',
				title: '必填项不能为空',
			})
			return 
		}
		if(this.data.info.phone.length!==11){
			wx.showToast({
				icon: 'none',
				title: '请输入正确的手机号',
			})
			return 
		}
		if(this.data.info.studentID.length!==9){
			wx.showToast({
				icon: 'none',
				title: '请输入正确的学号',
			})
			return 
		}
		db.collection('check_table').add({
			// data 字段表示需新增的 JSON 数据
			data: this.data.info,
			success: res => {
				// res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
				console.log(res)
				wx.showToast({
					title: '已提交审核',
				})
			}
		})
		wx.navigateTo({
			url: `../detail/meet_detail?id=${this.data.id}`,
		})
	},
})