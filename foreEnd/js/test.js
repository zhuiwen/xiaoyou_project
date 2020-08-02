let arr = [1,4,3,2,9,10];
let arr2 = arr.slice(1,-1)
console.log(arr2);
function mySlice(start, end) {
    let arr1 = [];
    for (let i = start; i < end; i++){
        arr1.push(this[i])
    }
    return arr1;
}
console.log(mySlice(1,2,arr))
arr.__proto__.mySlice = mySlice;
console.log(arr.mySlice(1, 2));