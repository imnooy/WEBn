let args=process.argv; //배열로 입력값 저장
//console.log(args[2]); //node syntax/conditional.js yoonmi k880 라고 입력하면 yoonmi 출력
console.log('A');
console.log('B');
if(args[2]==='1') {
    console.log('C1');
} else {
    console.log('C2');  
}
console.log('D');