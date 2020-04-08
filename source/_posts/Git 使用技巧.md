---
title: Git 使用技巧
tags:
  - Git
  - 随笔
comments: true
categories: 随笔
abbrlink: f0688a92
date: 2020-04-04 14:10:40
---

记录一些遇到过的 Git 操作。

<!-- more -->

# 1. GitHub 仓库 HTTPS 和 SSH 通道的切换

> 2020.04.04

用 HTTPS 方式总是需要输入用户名和密码； SSH 方式使用之前需要先配置密钥。

查看当前本地仓库对应的远程仓库地址：

```
$ git remote -v
origin  https://github.com/Sningning/DataStructures.git (fetch)
origin  https://github.com/Sningning/DataStructures.git (push)
```

切换为 SSH 通道：

```
$ git remote set-url origin git@github.com:Sningning/DataStructures.git
```

再查看下，已经改为 SSH 通道了。

```
$ git remote -v
origin  git@github.com:Sningning/DataStructures.git (fetch)
origin  git@github.com:Sningning/DataStructures.git (push)
```