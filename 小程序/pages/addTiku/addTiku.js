Page({
    data: {
        tikuName: '' // 存储输入的题库名称
    },

    /**
     * 输入框值变化事件
     */
    onInputChange: function (e) {
        this.setData({
            tikuName: e.detail.value
        });
    },

    /**
     * 提交题库信息
     */
    submitTiku: function () {
        const { tikuName } = this.data;

        if (!tikuName.trim()) {
            wx.showToast({
                title: '题库名称不能为空',
                icon: 'none'
            });
            return;
        }

        // 提交成功提示（前端模拟）
        wx.showToast({
            title: `题库 "${tikuName}" 添加成功`,
            icon: 'success'
        });

        // 返回首页
        wx.navigateBack();
    }
});
