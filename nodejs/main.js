let http = require('http');
let fs = require('fs');
let u=require('url'); //모듈 url
let qs=require('querystring');
//모듈: 기본적으로 제공하는 기능들을 그룹핑 해놓은 각각의 그룹들

let path=require('path');

let template=require('./lib/template.js');

let app = http.createServer(function(request,response){
    let url = request.url;
    let queryData=u.parse(url, true).query;
    let pathname=u.parse(url, true).pathname;
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

                let list=template.list(filelist);         
                let html=template.html(title, list, `<h2>${t}</h2>${d}`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
                })            
        } else {
            //queryString에 따라 읽는 파일의 경로가 달라진다!
            //id값이 있을 경우
            fs.readdir('./data', function(error, filelist) {
                let filteredId=path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
                    let list=template.list(filelist);
                    let html=template.html(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a> <a href="/update?id=${title}">update</a> 
                    <form class="delete_form" action="delete_process" method="post" onsubmit="">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                    </form>`);
                    response.writeHead(200);
                    response.end(html);
                });
            })
        }
    }
    else if(pathname==='/create') {
        fs.readdir('./data', function(error, filelist) {
            let t='WEB - create';
            let list=template.list(filelist);         
            let html=template.html(title, list, `
            <form action="/create_process" method="POST">
            <p></p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" id="" cols="30" rows="10" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
            </form>`, '');
            response.writeHead(200);
            response.end(html);
            })  
              
    }
    else if(pathname === '/create_process') {
        let body='';
        request.on('data', function(data) {
            body=body+data;
        });
        request.on('end', function() {
            let post=qs.parse(body);
            let ti=post.title;
            let filteredId=path.parse(ti).base;
            let de=post.description;
            console.log(filteredId);

            fs.writeFile(`data/${filteredId}`, de, 'utf8', function(err) {
                response.writeHead(302, {Location: `/?id=${ti}`}); //302: page를 redirection 시켜라
                response.end('success');
            })
        });
    }
    else if(pathname === '/update') {
        fs.readdir('./data', function(error, filelist) {
            let filteredId=path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
                let tit=queryData.id;
                let list=template.list(filelist);
                let html=template.html(title, list, 
                `<form action="/update_process" method="POST">
                <input type="hidden" name="id" value="${title}">
                <p></p><input type="text" name="title" placeholder="title" value=${title}></p>
                <p>
                    <textarea name="description" id="" cols="30" rows="10" placeholder="description">${description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
                </form>`, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
                response.writeHead(200);
                response.end(html);
            });
        })
    }
    else if(pathname==='/update_process') {
        let body='';
        request.on('data', function(data) {
            body=body+data;
        });
        request.on('end', function() {
            let post=qs.parse(body);
            let id=post.id;
            let ti=post.title;
            let de=post.description;
            
            let filteredId=path.parse(id).base;
            let filteredTi=path.parse(ti).base;

            fs.rename(`data/${filteredId}`, `data/${filteredTi}`, function(err) {
                fs.writeFile(`data/${filteredTi}`, de, 'utf8', function(err) {
                    response.writeHead(302, {Location: `/?id=${filteredTi}`});
                    response.end('success');
                })
            })
        });
    }
    else if(pathname==='/delete_process') {
        let body='';
        request.on('data', function(data) {
            body=body+data;
        });
        request.on('end', function() {
            let post=qs.parse(body);
            let id=post.id;
            let filteredId=path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(err) {
                response.writeHead(302, {Location: `/`}); //go home
                response.end();
            })
        });
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
   
});
app.listen(3000);