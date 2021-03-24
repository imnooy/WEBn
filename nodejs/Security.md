# 의문점
## 21.03.24

</br>

'../!@$@%'로 접근하는 것을 막기 위해 강의에서는 Read와 Delete에 filteredId를 id 대신 넣어줬는데, Create와 Update에도 똑같은 보안 문제가 발생해 parse해서 id와 title대신 넣어주었다.  
그런데 update_process 블록에서 fs.rename에 들어가는  
`data/${id}`에서 id를 똑같이 path.parse 하게 되면  
경로에서 data/password.js를 발견할 수 없으니 fs.rename 함수에서는 콜백에서 에러가 나야하는 게 맞는 것 같은데 에러가 나지않고 잘 동작한다.....

?id=../password.js 로 접근했을 때 제대로(?) 동작한다..

</br>

```js
let filteredId=path.parse(id).base;
let filteredTi=path.parse(ti).base;

fs.rename(`data/${filteredId}`, `data/${filteredTi}`, function(err) {
    fs.writeFile(`data/${filteredTi}`, de, 'utf8', function(err) {
        response.writeHead(302, {Location: `/?id=${filteredTi}`});
        response.end('success');
    })
})
```
