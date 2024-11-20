Page({
    data: {
        title: '',
        answer: '',
        bank: ''
    },
    handleTitleInput(e) {
        this.setData({ title: e.detail.value });
    },
    handleAnswerInput(e) {
        this.setData({ answer: e.detail.value });
    },
    handleBankInput(e) {
        this.setData({ bank: e.detail.value });
    },
    submitQuestion() {
        if (!this.data.title || !this.data.answer || !this.data.bank) {
            wx.showToast({
                title: '请填写完整信息',
                icon: 'none'
            });
            return;
        }

        wx.showToast({
            title: '提交成功',
            icon: 'success'
        });

        // 模拟提交，可以替换为真正的 API 请求
        console.log({
            title: this.data.title,
            answer: this.data.answer,
            bank: this.data.bank
        });

        // 返回主页
        wx.navigateBack();
    }
});
