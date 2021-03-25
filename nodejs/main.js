const http = require('http');
const fs = require('fs');
const u=require('url'); //모듈 url
const qs=require('querystring');
//모듈: 기본적으로 제공하는 기능들을 그룹핑 해놓은 각각의 그룹들

const path=require('path');
const template=require('./lib/template.js');
const sanitizeHtml=require('sanitize-html');

let app = http.createServer(function(request,response){
    const url = request.url;
    const queryData=u.parse(url, true).query;
    const pathname=u.parse(url, true).pathname;
    const title=queryData.id;
    //console.log(queryData.id); //HTML 출력

    //console.log(u.parse(url, true).pathname);

    if(pathname==='/') { 
        if(title===undefined) { //페이지 홈
            fs.readdir('./data', function(error, filelist) {
                const t='Welcome';
                const d='Hello, Node.js';

                /*
                var list=`<ul>
                <li><a href="/?id=HTML">HTML</a></li>
                <li><a href="/?id=CSS">CSS</a></li>
                <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ul>`
                */

                const list=template.list(filelist);         
                const html=template.html(title, list, `<h2>${t}</h2>${d}`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
                })            
        } else {
            //queryString에 따라 읽는 파일의 경로가 달라진다!
            //id값이 있을 경우
            fs.readdir('./data', function(error, filelist) {
                const filteredId=path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
                    const sanitizedTitle=sanitizeHtml(title);
                    //let sanitizedDescription=sanitizeHtml(description);
                    const sanitizedDescription=sanitizeHtml(description, { allowedTags:['h1']});

                    const list=template.list(filelist);
                    const html=template.html(title, list, `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a> 
                    <form class="delete_form" action="delete_process" method="post" onsubmit="">
                    <input type="hidden" name="id" value="${sanitizedTitle}">
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
            const t='WEB - create';
            const list=template.list(filelist);         
            const html=template.html(title, list, `
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
            const post=qs.parse(body);
            const ti=post.title;
            const filteredId=path.parse(ti).base;
            const de=post.description;
            console.log(filteredId);

            fs.writeFile(`data/${filteredId}`, de, 'utf8', function(err) {
                response.writeHead(302, {Location: `/?id=${ti}`}); //302: page를 redirection 시켜라
                response.end('success');
            })
        });
    }
    else if(pathname === '/update') {
        fs.readdir('./data', function(error, filelist) {
            const filteredId=path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf8', function(err, description) {
                const tit=queryData.id;
                const list=template.list(filelist);
                const html=template.html(title, list, 
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
            const post=qs.parse(body);
            const id=post.id;
            const ti=post.title;
            const de=post.description;
            
            const filteredId=path.parse(id).base;
            const filteredTi=path.parse(ti).base;

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
            const post=qs.parse(body);
            const id=post.id;
            const filteredId=path.parse(id).base;
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