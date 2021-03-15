let http = require('http');
let fs = require('fs');
let u=require('url'); //모듈 url

let app = http.createServer(function(request,response){
    let url = request.url;
    let queryData=u.parse(url, true).query;
    console.log(queryData.id); //HTML 출력
    if(url == '/'){
      url = '/index.html';
    }
    if(url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
    response.end(queryData.id); //queryData.id인 'HTML'만 웹 화면에 표시
    //localhost:3000/?id=css로 주소를 바꾸면 'css'만 화면에 표시된다.

    //response.end(fs.readFileSync(__dirname + url));
    //프로그래밍적으로 사용자에게 전송할 데이터를 생성할 수 있다!
});
app.listen(3000);