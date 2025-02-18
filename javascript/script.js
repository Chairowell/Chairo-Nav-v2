// 页面背景滚动变化遮罩(这玩意真的超级消耗资源，如果可以还是用纯CSS的方法会更好)
window.onscroll = function () {
    //为了保证兼容性，这里取两个值，哪个有值取哪一个
    //scrollTop就是触发滚轮事件时滚轮的高度
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var n = (scrollTop / screen.height).toFixed(4);
    if (n <= 1) {
        document.getElementById("bg-cover").style.cssText = "-webkit-backdrop-filter: blur(" + n*2 + "px) brightness(" + (100 - n * 52) + "%); backdrop-filter: blur(" + n*2 + "px) brightness(" + (100 - n * 52) + "%);";
    } else {
        document.getElementById("bg-cover").style.cssText = "-webkit-backdrop-filter: blur(2px) brightness(36%); backdrop-filter: blur(2px) brightness(48%);";
    }
}

// 通用自定义函数
function getRandomNumber(min, max, decimalPlaces) {
    if (min >= max) {
        throw new Error('The minimum value must be less than the maximum value.');
    }

    const randomValue = Math.random() * (max - min) + min;

    if (decimalPlaces !== undefined) {
        if (decimalPlaces === 0) {
            return Math.round(randomValue); // 返回整数
        } else {
            const factor = Math.pow(10, decimalPlaces);
            return Math.round(randomValue * factor) / factor; // 返回保留指定小数位数的数值
        }
    }

    return Math.floor(randomValue); // 返回原始随机数（使用Math.floor()进行四舍五入）
}

// 设置Cookie
function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/`;
}

// 获取Cookie
function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        const cookiePair = cookieArr[i].split('=');
        if (cookiePair[0].trim() === name) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}



// 时间显示部分
function getCurrentTime() {
    const currentDate = new Date();

    // 获取时分秒
    const hours = addZeroPadding(currentDate.getHours());
    const minutes = addZeroPadding(currentDate.getMinutes());
    const seconds = addZeroPadding(currentDate.getSeconds());

    // 获取星期
    const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
    const dayOfWeek = daysOfWeek[currentDate.getDay()] + "曜日";

    // 获取日期
    const month = addZeroPadding(currentDate.getMonth() + 1); // 月份从0开始，需要加1
    const day = addZeroPadding(currentDate.getDate());
    const year = currentDate.getFullYear();

    // 拼接时间和日期字符串
    const timeString = `${hours}:${minutes}:${seconds}`;
    const dateString = `${year}.${month}.${day}`;

    // 返回结果
    return {
        time: timeString,
        dayOfWeek: dayOfWeek,
        date: dateString
    };
}

// 辅助函数：为个位数的小时、分钟、秒前面添加零，使其保持两位数
function addZeroPadding(num) {
    return num.toString().padStart(2, "0");
}

function updateClock() {
    // 获取当前时间和日期信息
    const currentTimeInfo = getCurrentTime();

    // 更新页面上的元素内容
    document.getElementById("time").textContent = currentTimeInfo.time;
    document.getElementById("dayOfWeek").textContent = currentTimeInfo.dayOfWeek;
    document.getElementById("date").textContent = currentTimeInfo.date;
}

// 每隔一秒钟更新一次时间和日期
setInterval(updateClock, 1000);

// Ping Url
function pingURL(obj,url){
    var urlBox = document.getElementById(obj.id);
    var urlDate = new Date();
    var urlTime = urlDate.getMinutes()*60 + urlDate.getSeconds() + urlDate.getMilliseconds()/1000;
    urlBox.innerHTML = "<img id='"+urlTime+"' src="+url+"/"+Math.random()+" width=0 height=0 onerror='checkTime(this,"+urlTime+")' >测试中...";
}
function checkTime(obj,tim){
    var nowDate = new Date();
    var timec = (nowDate.getMinutes()*60 + nowDate.getSeconds() + nowDate.getMilliseconds()/1000 - tim).toFixed(2);
    if(timec>20){
        document.getElementById(obj.id).parentNode.innerHTML = "<div class='url-R'></div>连接超时";
    }else{
        document.getElementById(obj.id).parentNode.innerHTML = "<div class='url-G'></div>"+timec+"s";
    }
}

// 获取当前网址
const currentUrl = window.location.href;

// 创建 URL 对象
const url = new URL(currentUrl);

// 获取查询参数
const queryParams = url.searchParams;

const r18 = queryParams.get('r18');
const live = queryParams.get('live');

if(getCookie("R18-VIEW") == null){
    setCookie("R18-VIEW","0");
}
if(window.location.hash == "#R18-OPEN" || r18 == "open"){
    setCookie("R18-VIEW","1");
}
if(window.location.hash == "#R18-CLOSE" || r18 == "close"){
    setCookie("R18-VIEW","0");
}

function removeProtocol(url) {
    const parsedUrl = new URL(url);
    
    // 构建新的URL，去除协议部分
    const cleanedUrl = parsedUrl.hostname + parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
    
    return cleanedUrl;
}
// document.addEventListener('DOMContentLoaded', function () {
    
    fetch(listAddress)
    .then((response) => response.json())
    .then((json) => {
        const obj = json;
        const box = document.querySelector('#linkbox');
        const r18 = getCookie("R18-VIEW");
        var urlnum = 0;
        var newnum = 0;
        var group = '';
        var newgroup = '';
        for(i in obj){
            var linkBox = '';
            for(l in obj[i]){
                var link = obj[i][l]["url"];
                var name = obj[i][l]["name"];
                var explain = obj[i][l]["explain"];
                var icon = obj[i][l]["icon"];
                // var favicon = link;
                var favicon = removeProtocol(link).replace('/','');
                var show =obj[i][l]["show"];
                // 剔除R18
                if(!explain.indexOf("[R18]") & r18 == "0" | show == "x"){
                    continue;
                }
                if(icon){
                    var linkIcon = `
                        <img class="link-icon-img" src="${icon}" alt="" loading="lazy" onerror="this.onerror=null;this.src='./nan.png';">
                        <!-- <div class="link-icon" style="background-image:url(${icon});"></div> -->
                    `
                }else{
                    var linkIcon = `
                        <img class="link-icon-img" src="https://api.chairo.cc/${favicon}.ico" alt="" loading="lazy" onerror="this.onerror=null;this.src='./nan.png';">
                        <!-- <div class="link-icon" style="background-image:url(https://api.chairo.cc/${favicon}.ico);"></div> -->
                    `
                }
                if(!explain.indexOf("[++]") && !explain.includes("[R18]")){
                    newgroup = `
                        ${newgroup}
                        <div class="link-box" data-umami-event="${link}">
                            <a href="${link}" rel="nofollow noopener noreferrer">
                                ${linkIcon}
                                <div class="link-name">${name}</div>
                                <div class="link-explain">${explain}</div>
                            </a>
                            <div class="url-test" id="${name}" onclick="pingURL(this,'${link}')">
                                <div class="url-B">
                            </div>点我测试</div>
                        </div>
                    `;
                    ++newnum;
                    // 是否开启更新进入分类
                    // ++urlnum;
                    // continue;
                }
                ++urlnum;
                linkBox = `
                    ${linkBox}
                    <div class="link-box" data-umami-event="${link}">
                        <a href="${link}" rel="nofollow noopener noreferrer">
                            ${linkIcon}
                            <div class="link-name">${name}</div>
                            <div class="link-explain">${explain}</div>
                        </a>
                        <div class="url-test" id="${name}" onclick="pingURL(this,'${link}')">
                            <div class="url-B"></div>点我测试
                        </div>
                    </div>
                `;
            }
            group = `
                ${group}
                <div class="partition">
                    <div class="partition-name" id="${i}">- ${i} -</div>
                    <div class="partition-box">${linkBox}</div>
                </div>
            `;
        }
        group = `
            <div class="partition">
                <div class="partition-name" id="newgroup">- 最近更新 ${newnum} -</div>
                <div class="partition-box">${newgroup}</div>
            </div>
            ${group}
        `
        box.innerHTML = group;
        document.getElementById("url-number").innerText = urlnum; //网址数量
    })

    if(live != "close" || getCookie("live") != "close"){
        const video = document.createElement('video');
        video.id = 'bg-video';
        if(live == "4k"){
            video.src = videoAddress;
            setCookie("live", videoAddress);
        }else{
            video.src = live || getCookie("live");
            setCookie("live", live);
        }
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        video.controls = false;
        document.getElementById("background").appendChild(video); // 将视频元素添加到背景
    }
    if(live == "close"){
        setCookie("live", "close");
    }

    if(posterURL){

        document.getElementById("poster-number").innerText = 1;

        const img = new Image();
        img.onload = function() {
            document.querySelector('#background').style.backgroundImage = `url(${posterURL})`;
            document.querySelector('#background').style.opacity = '1';
        };
        img.onerror = function() {
            console.error("图片加载失败");
        };
        img.src = posterURL;

    }else{ 

        fetch(posterAddress)
        .then((response) => response.json())
        .then((json) => {
            const data = json;
            const allNum = data['poster'].length;

            // if(getCookie("bgNumber") == null || parseInt(getCookie("bgNumber")) > allNum || parseInt(getCookie("bgNumber")) < 0){
            //     var bgNum = getRandomNumber(0,allNum);
            //     setCookie("bgNumber","0");
            // }
            // else{
            //     var bgNum = parseInt(getCookie("bgNumber")) - 1;
            // }
            
            if(getCookie("bgNumber") == null || parseInt(getCookie("bgNumber")) > allNum || parseInt(getCookie("bgNumber")) < 0){
                var bgNum = getRandomNumber(0,allNum);
                setCookie("bgNumber", bgNum);
            }
            else{
                var bgNum = parseInt(getCookie("bgNumber")) - 1;
            }
            
            // var bgNum = getRandomNumber(0,allNum);

            document.getElementById("poster-number").innerText = allNum; //壁纸数量
            
            var posterURL = data['poster'][bgNum];

            const img = new Image();
            img.onload = function() {
                document.querySelector('#background').style.backgroundImage = `url(${posterURL})`;
                document.querySelector('#background').style.opacity = '1';

                setCookie("bgNumber",(parseInt(getCookie("bgNumber"))+ 1).toString())
            };
            img.onerror = function() {
                console.error("图片加载失败");

                setCookie("bgNumber",(parseInt(getRandomNumber(0,allNum))).toString())
            };
            img.src = posterURL;

        });
        
    };

// });

