// pages/timu/timu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentQuestion: {},  // 当前题目
    options: [],          // 题目选项
    selectedOption: "",   // 用户选择的选项
    userAnswer: "",       // 用户输入的答案
    currentQuestionIndex: 0 , // 当前题目的索引
    totalQuestions: 20,
    question_id:'',
    user_id: "user123",  // 假设这是当前用户的 ID
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.updateQuestion(0);  // 初始化获取第一题
  },
  updateQuestion(index) {
    wx.request({
      url: `http://127.0.0.1:3000/api/question`,  // 使用实际的服务器地址和端口
      method: 'GET',
      data: {
        index: index  // 请求参数传递当前题目索引
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const { question, options } = res.data;
          this.setData({
            currentQuestion: question,
            options: options,  // 设置选项
            selectedOption: "",  // 重置选项选择
            userAnswer: ""  // 清空用户答案
          });
        } else {
          wx.showToast({ title: "获取题目失败", icon: "none" });
        }
      },
      fail: () => {
        wx.showToast({ title: "请求失败，请检查网络", icon: "none" });
      }
    });
  },

  // 选择选项
  onOptionSelect(e) {
    const selectedAnswer = e.currentTarget.dataset.answer;
    this.setData({
      userAnswer: selectedAnswer,  // 设置答案为选项字母
      selectedOption: selectedAnswer  // 设置选中的选项
    });
  },

  // 填写答案
  onInputAnswer(e) {
    const inputAnswer = e.detail.value;
    this.setData({
      userAnswer: inputAnswer  // 设置填写的答案
    });
  },
  submitAnswer() {
    const { user_id, currentQuestion, userAnswer } = this.data;

    if (!userAnswer) {
      wx.showToast({ title: '请选择答案或输入答案', icon: 'none' });
      return;
    }
      // 打印参数，确保它们正确
    console.log("user_id:", user_id);
    console.log("question_id:", currentQuestion.id);
    console.log("user_answer:", userAnswer);
    wx.request({
      url: `http://127.0.0.1:3000/api/submitAnswer`,  // 提交答案的 API 地址
      method: 'POST',
      data: {
        user_id: user_id,
        question_id: currentQuestion.id,
        user_answer: userAnswer
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const { isCorrect } = res.data;
          // style="background-color: {{item.is_correct ? '#BDFCC9' : '#FA8072'}}"
          wx.showToast({
            title: isCorrect ? '回答正确' : '回答错误',
            icon: 'success',
          });
        } else {
          wx.showToast({ title: '提交答案失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      }
    });
  },
  // 下一题
  onNext() {
    let { currentQuestionIndex, userAnswer,totalQuestions } = this.data;
    console.log(`用户的答案是: ${userAnswer}`);
    if (currentQuestionIndex < totalQuestions - 1) {
      currentQuestionIndex += 1;
      this.setData({ currentQuestionIndex });
      this.updateQuestion(currentQuestionIndex);  // 获取下一题
    } else {
      wx.showToast({ title: "已完成所有题目", icon: "success" });
    }
  },
  // 上一题
  onPrevious() {
    let { currentQuestionIndex } = this.data;

    if (currentQuestionIndex > 0) {
      currentQuestionIndex -= 1;
      this.setData({
        currentQuestionIndex,
        selectedOption: "", // 清空选项
        userAnswer: ""      // 清空用户答案
      });
      this.updateQuestion(currentQuestionIndex); // 获取上一题
    } else {
      wx.showToast({ title: "已经是第一题", icon: "none" });
    }
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
