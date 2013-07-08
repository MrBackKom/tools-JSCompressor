todo：
    此工具用于压缩js脚本及css压缩，核心压缩库采用uglifyjs。
feature list
    第一阶段，
       js压缩:传入参数方式调用 build Adir 参数为目标文件夹，在同级目录下生成output文件夹，对css及html保持原目录结构copy。
    第二阶段，
       css压缩:在第一段基础上进行css压缩。
    第三阶段
        自定义压缩。

process
    2013.7.7
    技术实现调研。
    核心压缩采用uglifyjs库，利用node进行调用。