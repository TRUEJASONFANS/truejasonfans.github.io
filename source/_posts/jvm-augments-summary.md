---
title: JVM的一些理解总结
date: 2016-06-09 23:15:03
tags: java
categories: java
---
jvm的**堆内存模型**，

 jvm 堆 = 年轻代 + 持久代 + 年老代

年轻代的组成(young generation) : 一个Eden区,两个Survivor区(from 和 to 区）。

通常情况下，一个新产生的对象会被分配在Eden区，在这里当Eden区发生一次minor gc(发生在新生代的gc，我个人理解应该是对主要是对Eden的gc，当然如果to 区满了以后也会触发），对象就会从Eden区移动到from区,刚开始的时候to区是空的， 之后的gc，Eden区存活下来的对象会被移动到"to“区，然后”From区"根据年龄来决定去向，到达的年龄的去往老年代（长达成人），然后其余的全部赶往"to"区. 这次gc后Eden区和from区将会被清空，之后 "to"区 将会和“from"交换，这样下次gc的时候，"to"区就空了。这种基于复制收集的算法不会产生内存碎片。