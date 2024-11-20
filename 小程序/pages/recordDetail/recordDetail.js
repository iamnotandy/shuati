// pages/recordDetail/recordDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyDetails: [], // 存储单个题目的历史记录
    user_id: "user123", // 当前用户
    question_id: null    // 当前题目ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const questionId = options.question_id;
    this.setData({
      question_id: questionId
    });
    this.getHistoryDetails(questionId);
  },

  // 获取单个题目的历史记录
  getHistoryDetails(question_id) {
    wx.request({
      url: `http://127.0.0.1:3000/api/getHistoryDetails`,
      method: 'GET',
      data: {
        user_name: this.data.user_id,
        question_id: question_id
      },
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            historyDetails: res.data // 存储该题目的历史记录
          });
          
        } else {
          wx.showToast({ title: '获取历史记录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '请求失败，请检查网络', icon: 'none' });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})