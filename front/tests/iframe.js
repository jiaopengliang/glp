//  将页面内嵌的测试方法

var pageURL = "http://localhost:8080/#/";
var apiURL = "http://172.16.6.193:8090/kg-api-web/api/login/doLogin/callback?account=admin&password=e10adc3949ba59abbe56e057f20f883e&callback=getToken";

function createPage(token) {
    var oPage = document.createElement('iframe');
    oPage.style.width = "100%";
    oPage.style.height = "100vh";
    oPage.style.position = "fixed";
    oPage.style.left = 0;
    oPage.style.top = 0;
    oPage.style.zIndex = 2018;
    oPage.style.background = "#fff";
    document.body.appendChild(oPage);
    console.log(token)
    oPage.src = "http://localhost:8080/#/home?name=平安科技（深圳）有限公司&token=" + token;
    //oPage.src = "http://localhost:8080/#/home?mode=2&name=安邦保险集团股份有限公司&name2=刘海&token=" + token;    
}

function getToken(o) {
    if (o.token) {
        createPage(o.token);
    }
}

function jsonpRequest() {
    var oScript = document.createElement('script');
    oScript.type = "text/javascript";
    oScript.src = apiURL;
    document.body.appendChild(oScript);
    oScript.onload = function () {
        document.body.removeChild(oScript);
    }
}

jsonpRequest()