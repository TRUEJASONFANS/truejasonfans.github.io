---
title: 在mac上部署flask+mod_wsgi+apache
date: 2018-04-02 21:32:47
tags: python
---

1. 安装mac brew工具，brew -v 命令测试
2. brew install apache2, 安装完会注意log message, 会显示配置文件http.conf文件在哪，我是在/usr/local/etc/httpd/httpd.conf
3. 安装mod_wsgi模块
   a. ./configure
   b. make
   c. make install

4. 修改httpd.conf,配置虚拟主机映射到本地。
5. lsof -i 端口号 检查端口号是否被占用
