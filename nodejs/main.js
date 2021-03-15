let http = require('http');
let fs = require('fs');
let u=require('url'); //모듈 url
//모듈: 기본적으로 제공하는 기능들을 그룹핑 해놓은 각각의 그룹들

let app = http.createServer(function(request,response){
    let url = request.url;
    let queryData=u.parse(url, true).query;
    let title=queryData.id;
    //console.log(queryData.id); //HTML 출력
    if(url == '/'){
        title='Welcome';
    }
    if(url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);

    //queryString에 따라 읽는 파일의 경로가 달라진다!
    fs.readFile(`data/${title}`, 'utf8', function(err, description) {
        let template=`
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        <ul>
            <li><a href="/?id=HTML">HTML</a></li>
            <li><a href="/?id=CSS">CSS</a></li>
            <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ul>
        <h2>${title}</h2>
        <p>${description}</p>
        </body>
        </html>
    `;
    response.end(template);
    })
   
});
app.listen(3000);