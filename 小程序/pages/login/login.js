// pages/login/login.js
Page({

  data: {
    username: '',
    password: ''
  },
  onLoad() {
    // 设置默认用户名和密码，假设我们使用 "admin" 和 "123" 作为默认的用户名和密码
    wx.setStorageSync('username', '1');  // 存储用户名
    wx.setStorageSync('password', '1');    // 存储默认密码
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value });
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value });
  },

  onLogin() {
    const { username, password } = this.data;

    // 尝试从本地存储获取用户名和密码
    const storedUsername = wx.getStorageSync('username');
    const storedPassword = wx.getStorageSync('password');

    // 检查本地存储的用户名和密码
    if (username === storedUsername && password === storedPassword) {
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });
      wx.redirectTo({
        url: '/pages/mainpage/mainpage'  // 登录成功后跳转到首页
      });
    } else {
      wx.showToast({
        title: '用户名或密码错误',
        icon: 'none'
      });
    }
  },
  // 登录按钮点击事件
  // onLogin() {
  //   const { username, password } = this.data;
    
  //   if (!username || !password) {
  //     wx.showToast({
  //       title: '请输入用户名和密码',
  //       icon: 'none'
  //     });
  //     return;
  //   }

  //   // 假设通过后台服务验证用户信息
  //   wx.request({
  //     url: 'http://localhost:3000/login',  // 替换为后端登录接口地址
  //     method: 'POST',
  //     data: {
  //       username: username,
  //       password: password
  //     },
  //     success(res) {
  //       if (res.data.success) {
  //         wx.setStorageSync('userInfo', res.data.userInfo);  // 保存用户信息
  //         wx.showToast({
  //           title: '登录成功',
  //           icon: 'success'
  //         });
  //         wx.switchTab({
  //           url: '/pages/index/index'  // 登录成功后跳转到首页
  //         });
  //       } else {
  //         wx.showToast({
  //           title: '登录失败，请检查用户名或密码',
  //           icon: 'none'
  //         });
  //       }
  //     },
  //     fail() {
  //       wx.showToast({
  //         title: '网络异常，请稍后再试',
  //         icon: 'none'
  //       });
  //     }
  //   });
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  

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
