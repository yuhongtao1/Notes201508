/**
 * Created by 银鹏 on 2016/1/16.
 */
//要开启哪个端口
var PORT = 3000;
//加载http
var http = require('http');
//引进url
var url=require('url');
//读文件
var fs=require('fs');
//加载mimejs
var mine=require('./mime').types;
//处理路径
var path=require('path');
//创建服务
var server = http.createServer(function (request, response) {
	//拿到请求路径虚拟路径
    var pathname = url.parse(request.url).pathname;
    //拿到请求文件的真实路径
    var realPath = path.join("../", pathname);
    //拿到请求资源的后缀名
    var ext = path.extname(realPath);
    //判断请求的文件存在不存在
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        //如果不存在就返回404
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
//存在的话就读取文件
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                	//读取文件失败服务器错误
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                	//文件读取成功
                	//判断有没有指定的后缀名如果没有就设置为ascii文本
                    var contentType = mine[ext] || "text/plain";
         
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    //发送response主体
                    response.end();
                }
            });
        }
    });
});
//本机监听指定端口
server.listen(PORT);
//如果监听成功打印日志
console.log("Server runing at port: " + PORT + ".");