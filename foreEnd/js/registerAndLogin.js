$(function () {
    let borderLight = $(".borderLight");
    let onfocus = $(".onfocus");
    let len = borderLight.length;
    for (let i = 0; i < len; i ++){
        onfocus[i].onfocus = function () {
            borderLight.removeClass("active");
            borderLight.eq(i).addClass("active")
        }
    }
})