/**
 * Created with JetBrains WebStorm.
 * User: zhaolong324
 * Date: 13-7-7
 * Time: 上午12:06
 * To change this template use File | Settings | File Templates.
 */
var uglify = require("uglify-js");
var fs = require("fs");
var args = process.argv;

var _devPath = "",
    _outputPath = "";
/**
 * 开始编译，便利所有的目录结构
 * @param targetDir
 */
var buildStart = function(targetDir){
    if(targetDir && targetDir.indexOf('/dev') < 0){
        //截取工作目录dev
        _devPath = targetDir + "/dev";
        _outputPath = targetDir + "/output";
        fs.exists(_devPath,function(pathInfo){
            if(pathInfo){
                console.log("found " + _devPath);
                //创建output文件夹

                if(!fs.existsSync(_outputPath)){
                    fs.mkdirSync(_outputPath,0755);
                }
                var childPath = readFileFromPath(_devPath);
                for(var i= 0,len = childPath.length;i<len;i++){
                    build(_devPath + "/" +childPath[i]);
                }
            }else{
                console.log(_devPath + " not found");
            }
        })
    }
    else if(targetDir && targetDir.indexOf("/dev") > -1){
        var _devPath = targetDir.substring(0,targetDir.lastIndexOf("/dev")) + "/dev";
        var _outputParent = targetDir.substring(0,targetDir.lastIndexOf("/dev"));
        fs.exists(_devPath,function(pathInfo){
            if(pathInfo){
                console.log("found " + _devPath)
            }else{
                console.log(_devPath + " not found");
            }
        })
    }
}

var readFileFromPath = function(targetDir){
    if(targetDir){
        var childPath = fs.readdirSync(targetDir);
        return childPath;
    }
}

var copyFile = function(src, dst){
    var fileReadStream = fs.createReadStream(src);
    var fileWriteStream = fs.createWriteStream(dst);
    fileReadStream.pipe(fileWriteStream);
    fileWriteStream.on('close',function(){
        console.log('copy over');
    });
}


function build(targetPath){
    if(targetPath){
        var _targetStat = fs.statSync(targetPath)
        if(_targetStat.isFile()){//如果是文件

//
            //如果是js文件,压缩该文件然后coye到对应,文件名，文件的相对路径
            var fileName = targetPath.substring(targetPath.lastIndexOf("/"),targetPath.length);
            var _devIndex = targetPath.indexOf("/dev/") + 5;
            var _lastBlank = targetPath.lastIndexOf("/");
            var _path = targetPath.substring(_devIndex,_lastBlank) ;
            var finalCode = "";
            if(fileName.indexOf(".js") > -1 && fileName.indexOf("-min") <0){
                console.log("正在处理 " + targetPath);

                ast = uglify.minify(targetPath);
                finalCode = ast.code;
                var fileOut = _outputPath + "/" + _path + fileName;
                fs.writeFileSync(fileOut,finalCode,"utf8");
            }else{
                var fileOut = _outputPath + "/" +_path + fileName;
                copyFile(targetPath,fileOut);
            }
        }
        else{//如果是文件夹
            var dirName  =targetPath.substring(targetPath.indexOf("/dev/"));
            //在输出目录下创建文件夹
            if(!fs.existsSync(_outputPath + dirName.replace("/dev",""))){
                fs.mkdirSync(_outputPath + dirName.replace("/dev",""),0755);
            }
            var childPath = readFileFromPath(targetPath);
            for(var i= 0,len = childPath.length;i<len;i++){
                build(targetPath + "/" +childPath[i]);
            }


        }
    }
}

var init = function(dirs){
    if(dirs[2]){//走配置路径
        buildStart(dirs[2])
    }else{//走当前buildjs 所在路径
        buildStart(dirs[1]);
    }
}
init(args);








