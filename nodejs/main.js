let http = require('http');
let fs = require('fs');
let u=require('url'); //모듈 url
let qs=require('querystring');
//모듈: 기본적으로 제공하는 기능들을 그룹핑 해놓은 각각의 그룹들

function templateHTML(title, list, body, control) {
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
    ${control}
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
                let template=templateHTML(title, list, `<h2>${t}</h2>${d}`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(template);
                })            
        } else {
            //queryString에 따라 읽는 파일의 경로가 달라진다!
            //id값이 있을 경우
            fs.readdir('./data', function(error, filelist) {
                fs.readFile(`data/${title}`, 'utf8', function(err, description) {
                    let list=templateList(filelist);
                    let template=templateHTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
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
            response.end(template);
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
            let de=post.description;

            fs.writeFile(`data/${ti}`, de, 'utf8', function(err) {
                response.writeHead(302, {Location: `/?id=${ti}`}); //302: page를 redirection 시켜라
                response.end('success');
            })
        });
    }
    else if(pathname === '/update') {
        fs.readdir('./data', function(error, filelist) {
            fs.readFile(`data/${title}`, 'utf8', function(err, description) {
                let tit=queryData.id;
                let list=templateList(filelist);
                let template=templateHTML(title, list, 
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
                response.end(template);
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
            //console.log(post);

            fs.rename(`data/${id}`, `data/${ti}`, function(err) {
                //비동기화된 메서드이기 때문에 rename이 끝나면 writeFile을 실행되게. writeFile을 콜백함수 바깥에서 호출하고 싶으면 동기식인 renameSync를 이용해 rename을 확실히 끝내고 writeFile을 실행하게 할 수 있다.
                fs.writeFile(`data/${ti}`, de, 'utf8', function(err) {
                    response.writeHead(302, {Location: `/?id=${ti}`});
                    response.end('success');
                })
            })
        });
    }
    else {
        response.writeHead(404);
        response.end('Not found');
    }
   
});
app.listen(3000);