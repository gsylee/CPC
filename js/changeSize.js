    //动态设置不同屏幕尺寸的字体大小
(function () {
    // 获取设备的宽度，然后动态设置字体，一般都是用iphone6 为标准
    var docWidth,
        html;
        docWidth = document.documentElement.clientWidth || document.body.clientWidth;
        html = document.getElementsByTagName('html')[0];
        html.style.fontSize = docWidth / 15 + 'px';
})();