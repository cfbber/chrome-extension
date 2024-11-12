document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('generate');
    button.click(); // 自动触发按钮点击事件

    // 你可以在这里处理按钮点击事件
    button.addEventListener('click', () => {
        console.log("按钮被点击");
        // 在这里执行你的其他代码
    });
});