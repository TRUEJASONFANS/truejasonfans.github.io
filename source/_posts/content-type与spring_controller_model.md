---
title: content-type 与spring boot 控制器的值注入关系
tags: Web前端
---
## content-type = 'application/x-www-form-urlencoded' (不支持@RequestBody annotation)

前端传值template string为如下形式
``` js
var http = new XMLHttpRequest();
var url = 'get_data.php';
var params = 'orem=ipsum&name=binny';
http.open('POST', url, true);

//Send the proper header information along with the request
http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        alert(http.responseText);
    }
}
http.send(params);
```
var params = 'orem=ipsum&name=binny';

## content-type = 'application/json' (支持@RequestBody annotation)
``` js
        let request = new XMLHttpRequest()
        let url = "http://localhost:8080/user/regist";
        request.open("POST", url, true)
        request.setRequestHeader('Content-type','application/json; charset=utf-8');
        let formData = {'userName=' + user.value + '&' + 'password=' + passwd.value};
        formData.userName =  user.value
        formData.password = passwd.value
        console.log(JSON.stringify(formData))
        request.send(formData)

```
