---
title: 自定义npm包的安装位置

date: 2020-03-24

tags:
- 随笔

categories:
- 随笔

---

`nodejs` 官网上下载的安装包中包含 `npm`，在 `Windows` 系统下安装完后，`npm` 下载模块默认安装在 `C:\Users\本机用户名\AppData\Roaming` 文件中。但在清理磁盘时容易将其清理掉，考虑将 `npm` 也安装在其他盘符。

通过以下几个步骤实现在安装 `nodejs` 时将 `npm` 也安装在自定义路径。
<br>


**1. 在[官网](https://nodejs.org/en/download/)下载 `zip` 文件**
这里不使用默认的 `msi` 安装包，使用 `zip` 压缩文件，之后自己配置安装路径和环境变量。
<br>

**2. 设置安装目录**
我这里将 `nodejs` 安装在D盘。在 `D:\Program Files\` 目录下新建 `node` 文件夹，然后在 `node` 文件夹中新建 `nodejs`、`npm_prefix`、`npm_cashe` 三个文件夹。将下载的压缩包中的所有文件拷贝到 `nodejs` 中。
<br>

**3. 设置环境变量**
① 将 `node` 路径加入环境变量。
在 `Path` 中添加 `D:\Program Files\node\nodejs`。或者通过以下命令将 `node` 加入到环境变量中。
```
setx PATH "%PATH%;D:\Program Files\node\nodejs
```

② 将 `npm` 的全局模块路径加入到环境变量。
在 `Path` 中添加 `D:\Program Files\node\npm_prefix`，或者通过以下命令将 `node` 加入到环境变量中 。
```
setx PATH "%PATH%;D:\Program Files\node\npm_prefix
```
<br>

**4. 设置 `npm` 全局模块和缓存路径**
```
npm config set prefix "D:\\Program Files\\node\\npm_prefix"
npm config set cache "D:\\Program Files\\node\\npm_cache"
```
<br>

大功告成！
<br>


