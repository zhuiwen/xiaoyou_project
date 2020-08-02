
function getFlashTime(HoursArr){
    HoursArr = HoursArr.map(item => {
        let nowDate = new Date()
        nowDate.setHours(item);
        nowDate.setMinutes(0)
        nowDate.setSeconds(0);
        return nowDate;
    })
    return HoursArr;
}
module.exports = {
    getFlashTime
}