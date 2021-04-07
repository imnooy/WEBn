const http=require('http'); //http라는 모듈을 요구.
const template=require('./lib/template.js');
const path=require('path');
const fs=require('fs');
const express=require('express'); //설치한 express 등록
const app=express();

app.use(express.static('BOARD'));

const server=http.createServer( function(request, response) { //웹 서버 객체 생성
    const url=request.url;
    const myurl=new URL('http//localhost:3001'+url);
    const queryData=myurl.searchParams.get('id');
    //url parse가 deprecated되어있는 경우 querydata 가져오기
    const html=template.html();
    //const pathname=myurl.searchParams.get('') //url path를 요청해 담는 변수

    if(pathname==='/') { //페이지 홈
        
    }

    response.writeHead(200); //응답 200번
    response.end(html); //표시할 내용
});

server.listen(3001);