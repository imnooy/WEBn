const http=require('http'); //http라는 모듈을 요구.
const template=require('./lib/template.js');

const server=http.createServer( function(request, response) { //웹 서버 객체 생성

    const html=template.html();
    response.writeHead(200); //응답 200번
    response.end(html); //표시할 내용
});

server.listen(3001);