Page({
  data: {
    tikuList: [] // 用于存储从后端获取的题库列表
  },

  onLoad: function () {
    this.fetchTikuList();
  },

  fetchTikuList: function () {
    wx.request({
      url: 'http://127.0.0.1:3000/api/tiku',
      method: 'GET',
      success: (res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          this.setData({
            tikuList: res.data
          });
        } else {
          wx.showToast({
            title: '没有题库数据',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '加载失败，请稍后再试',
          icon: 'none'
        });
      }
    });
  },

  onTikuSelect: function (e) {
    const tikuId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/timu/timu?id=${tikuId}`
    });
  },

  navigateToHistory: function () {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  navigateToAddQuestion: function () { // 增加题目的跳转方法
    wx.navigateTo({
      url: '/pages/addQuestion/addQuestion' // 确保路径正确
    });
  },

  navigateToAddTiku: function () { // 新增的跳转到新增题库页面的方法
    wx.navigateTo({
      url: '/pages/addTiku/addTiku' // 新增题库页面路径
    });
  },

  onPullDownRefresh: function () {
    this.fetchTikuList();
    wx.stopPullDownRefresh();
  }
});
