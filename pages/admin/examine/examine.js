let db = wx.cloud.database().collection('check_table');
Page({
    data: {
        inputValue: '',
        List: [],
    },
    onLoad: function () {
        this.getList()
    },
    //获取审核表数据
    getList() {
        db.get()
            .then(res => {
                this.setData({
                    List: res.data
                })
            })
            .catch(err => {
                console.log('审核表数据请求失败', err)
            })
    },
    onChange(e) {
        this.setData({
            inputValue: e.detail,
        });
    },
    onSearch() {
        var value = this.data.inputValue;
        db.where({
            act_name: value
        })
            .get()
            .then(res => {
                console.log(res)
                this.setData({
                    List: res.data,
                    inputValue: ''
                })
            })
            .catch(err => {
                console.log('用户筛选后数据请求失败', err)
            })
        console.log(this.data.inputValue)
    },
    //删除用户
    no(e) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '确认删除？删除不可恢复',
            success: function (sm) {
                if (sm.confirm) {
                    that.del(e.target.dataset.id);
                } else if (sm.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    del(id) {
        db.doc(id).remove()
            .then(res => {
                this.getList()
                wx.showToast({
                    title: '操作成功！',
                })
            })
            .catch(err => {
                console.log('操作失败', err)
            })
    },
    ok(e) {
        var openid = e.target.dataset.oid;
        var act_id = e.target.dataset.aid;
        var id = e.target.dataset.id;
        var actlist = [];
        wx.cloud.database().collection('User').doc(openid)
            .get()
            .then(res => {
                console.log('获取操作人成功', res);
                if (!res.data.actList) {
                    actlist.push(act_id)
                } else {
                    actlist = res.data.actList;
                    actlist.push(act_id);
                }
                wx.cloud.database().collection('User')
                    .doc(openid)
                    .update({
                        data: {
                            actList: actlist
                        }
                    })
                    .then(res => {
                        this.del(id);
                    })
                    .catch(res => {
                        console.log('修改失败', res)
                    })
            })
            .catch(err => {
                console.log('获取操作人失败', err)
            })
    }
})