// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
    {
        env: 'cloud1-4g8zgsp8753a10d4'
    }
)

// 云函数入口函数
exports.main = async (event, context) => {
    return cloud.database().collection('com_notice').where(event.filterFlag).get()
}