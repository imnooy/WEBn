var started = false;
var circle=false;
var leftArm=false;
var body=false;
var rightArm=false;
var leftLeg=false;
var rightLeg=false;

var arr=new Array('apple', 'avocado', 'banana', 'blueberry', 'cherry', 
        'coconut', 'cranberry', 'durian', 'grapefruit', 'grapes',
        'guava', 'lemon', 'mango', 'olive', 'orange', 'papaya',
        'peach', 'pear', 'pineapple', 'plum', 'raspberry',
        'starfruit', 'strawberry', 'tangerine', 'watermelon');

function setup() {
    createCanvas(windowWidth, windowHeight);
    noLoop();
}

function draw(){
    if(started){
        clear();
        line(65, 100, 170, 100); //위 연결 선
        line(65, 400, 65, 100); //세로줄  
        line(10, 400, 130, 400);  //맨 밑줄
        line(170, 100, 170, 120);
    }
 }
 
 function start(){ //시작버튼 클릭함수
    started = true;
    loop();

    create();
    makeRandomfruit();

    var btn=document.getElementById('start');
    btn.disabled='disabled';
 }

 function create() { //알파벳 버튼 생성
    var asciiNum=97;
    for(var i=1; i<=26; i++) {
        var ch;
        ch=String.fromCharCode(asciiNum);
        var button = document.createElement('input');
        button.type="button";
        button.value=ch;
        button.name=ch;
        button.className="alphabetButton";
        button.onclick=function () { 
            var x=prop.fruit;
            var answer;
            for(var i=0; i<x.length; i++) {
                if(x[i]==this.name[0]) {
                    answer=document.getElementById(String(i));
                    answer.value=this.name[0];
                
                }
            }
        }
        var foo=document.querySelector(".alphabet");
        foo.appendChild(button);

        asciiNum++;
    }
 }

 function makeRandomfruit() { //배열 중 랜덤 하나 선택 후 칸 생성
    prop.fruit=randomItem(arr);
    var x=prop.fruit;
    for(var i=0; i<x.length; i++) {
        var fname=document.createElement('input');
        fname.type="text";
        fname.className="fname";
        fname.id=String(i);
        //fname.value=x[i];
        //fname.style.visibility="hidden";
        fname.readOnly=true;

        var foo=document.querySelector(".solve");
        foo.appendChild(fname);
    }
 }

// 주어진 배열에서 요소 1개를 랜덤하게 골라 반환하는 함수
function randomItem(a) {
    return a[Math.floor(Math.random() * a.length)];
}

function summitAlphabet(c) {
    var x=prop.fruit;
    for(var i=0; i<x.length; i++) {
        if(x[i]==c) {
            //x=document.getElementsByName(String(i));
            //x[0].value=fruit[i];
            alert('hi');
        }
    }
}

var fruit="";
var prop = {
    get fruit() {
        return fruit;
    },
    set fruit(x) {
        fruit = x;
    }
}