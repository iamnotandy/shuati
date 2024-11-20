// pages/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historySummary: [], // 存储历史记录概览
    user_id: "user123",  // 假设这是当前用户的 ID
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 调用 getHistorySummary 并传递当前的 user_id
    this.getHistorySummary(this.data.user_id);
  },

  // 获取历史记录概览
  getHistorySummary(user_id) {
    wx.request({
      url: `http://127.0.0.1:3000/api/getHistorySummary`,
      method: 'GET',
      data: {
        user_name: user_id  // 传递当前用户的 user_id
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // 设置获取到的历史记录概览数据
          console.log("History Summary Data:", res.data);
          this.setData({
            historySummary: res.data
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

  // 查看历史记录详情
  viewRecordDetails(e) {
    const questionId = e.currentTarget.dataset.questionid;
    console.log("Selected Question ID:", questionId);
    wx.navigateTo({
      url: `/pages/recordDetail/recordDetail?question_id=${questionId}`,
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