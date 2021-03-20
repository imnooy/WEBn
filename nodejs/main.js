let http = require('http');
let fs = require('fs');
let u=require('url'); //모듈 url
let qs=require('querystring');
//모듈: 기본적으로 제공하는 기능들을 그룹핑 해놓은 각각의 그룹들

function templateHTML(title, list, body) {
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">create</a>
    ${body}
    </body>
    </html>
    `;
}

function templateList(filelist) {
    let list='<ul>';

    let i=0;
    while(i<filelist.length) {
        list=list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i=i+1;
    }

    list=list+'</ul>';
    return list;
}

let app = http.createServer(function(request,response){
    let url = request.url;
    let queryData=u.parse(url, true).query;
    let pathname=u.parse(url, true).pathname;
    console.log(pathname);
    let title=queryData.id;
    //console.log(queryData.id); //HTML 출력

    //console.log(u.parse(url, true).pathname);

    if(pathname==='/') { 
        if(title===undefined) { //페이지 홈
            fs.readdir('./data', function(error, filelist) {
                let t='Welcome';
                let d='Hello, Node.js';

                /*
                var list=`<ul>
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ul>`
                */

                let list=templateList(filelist);         
                let template=templateHTML(title, list, `<h2>${t}</h2>${d}`);
                response.writeHead(200);
                response.end(template);
                })            
        } else {
            //queryString에 따라 읽는 파일의 경로가 달라진다!
            //id값이 있을 경우
            fs.readdir('./data', function(error, filelist) {
                fs.readFile(`data/${title}`, 'utf8', function(err, description) {
                    let list=templateList(filelist);
                    let template=templateHTML(title, list, `<h2>${title}</h2>${description}`);
                    response.writeHead(200);
                    response.end(template);
                });
            })
        }
    }
    else if(pathname==='/create') {
        fs.readdir('./data', function(error, filelist) {
            let t='WEB - create';
            let list=templateList(filelist);         
            let template=templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="POST">
            <p></p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" id="" cols="30" rows="10" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>`);
            response.writeHead(200);
            response.end(template);
            })  
              
    }
    else if(pathname === '/create_process') {
        let body='';
        request.on('data', function(data) {
            body=body+data;
            //callback이 실행될 때마다 data를 추가
        });
        //특정한 양의 data를 서버에서 수신할 때마다 callback func를 호출하도록 약속 되어있음.
        request.on('end', function() {
            //더 이상 들어올 data가 없을 때 이 func 수행
            let post=qs.parse(body);
            //console.log(post);
            console.log(post.title);
            //object!

            let ti=post.title;
            let de=post.description;
        });
        response.writeHead(200);
        response.end('success');
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
   
});
app.listen(3000);