/* eslint-disable */
var shell = require('shelljs');

function getIPAdress(){
  var interfaces = require('os').networkInterfaces();  
  for(var devName in interfaces){  
        var iface = interfaces[devName];  
        for(var i=0;i<iface.length;i++){  
              var alias = iface[i];  
              if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){  
                    return alias.address;  
              }  
        }  
  }  
} 

var net = require('net');
let curPort = 2000;
 
function portIsOccupied (port,success) {
    var server = net.createServer().listen(port,'0.0.0.0')
    server.on('listening', function () { // 执行这块代码说明端口未被占用
        server.close() // 关闭服务
        success(port);
    })
    
    server.on('error', function (err) {
        if (err.code === 'EADDRINUSE') { // 端口已经被使用
            portIsOccupied(port+1,success)
        }
    })
}

function getParams(ipStr) {
    var arr = [];
    for(let i = 0,j= process.argv.length;i<j;i+=1) {
        const item = process.argv[i];
        if(item.indexOf("--env.")>=0) {
            arr.push(item);
        }
    }
    arr.push(`--env.openurl=${ipStr}pc.html`);
    return arr.join(' ');
}

portIsOccupied(curPort, function(unusePort){
    const ip =  getIPAdress();
    const ipStr = `http://${ip}:${unusePort}/`;
    const str = `webpack-dev-server --host 0.0.0.0 --port ${unusePort} --profile ${getParams(ipStr)}`;
    console.log(str);
    console.log("++++++++++++++++++++++++++++++++");
    console.log(`网站地址为：http://127.0.0.1:${unusePort}/pc.html` );
    console.log(`IP地址为：${ipStr}` );
    if (shell.exec(str).code !== 0) {//执行npm run build 命令
        shell.echo('Error: SERVER start failed');
        shell.exit(1);
    }
});

  
