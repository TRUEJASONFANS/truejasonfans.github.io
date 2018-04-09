---
title: Maven在eclipse的配置（解决Plugin execution not covered by lifecycle configuration\:org.apache.maven.pl）
date: 2017-09-18 00:23:02
tags: java
---

# Maven在eclipse的配置（解决Plugin execution not covered by lifecycle configuration: org.apache.maven.pl）

1. 下载Maven binary 
2. 设置MVN_HOME 环境变量， 添加Bin下路径到Path环境变量
3. 修改conf文件下setting.xml,设置为阿里源
```
<mirrors>
		<mirror>
    	  <id>alimaven</id>
    	  <name>aliyun maven</name>
    	  <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
    	  <mirrorOf>central</mirrorOf>
    	</mirror>
</mirrors>
```
4. 打开eclipse->preference->Maven
5. 修改Installation，自己所装maven路径
6. 修改User setting, 制定为设置阿里源的setting.xml
7. 右键maven工程 -> Maven-> Update Project