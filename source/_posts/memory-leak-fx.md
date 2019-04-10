---
title: fx中的内存泄漏问题
date: 2019-04-10 00:10:28
tags:
---
## 原因 Root cause 
The listener like changeListener, invalidationListener, EventHandler hold the strong reference of UI. And then somehow finally will be holded by
a fx static root object.
一些监听器诸如changeListener, invalidationListener , EventHandler 持有了UI 的强引用， 而这些监听起又被某些fx property 所持有， 而fx的某些property又被某些静态根对象所持有。
最后导致UI对象一直被持有而无法释放，从而导致了内存泄漏。
## 样例 normal case 
1. ![leak_1](images/ChartToolTip.png)
引用链：component-> MouseListener ->持有 chartTooltipBehavior实例 -> 持有FXToolTipHandler实例-> 持有ToolTIp->... -> 最终持有 AutoSelectioHeatMapPlotPoint (一个HeatMap block对象)
该component是JLightFrame的一个实例， 此处代码应该是chartDirector 基于swing的实现， 最终被disposer的records的根对象处理。

这里我们两种方案解决这个内存泄漏，
fix Disposer的源码， value对象使用weakReference存储
fix mouseLisenter，使上层 Ui 对象得到回收


1. ![leak2](images/RichChangeListener.png) 
引用链：lamda 对象-> 持有content->持有richChangeList-> .... -> PatternContrainCodeArea对象


## 避免内存泄漏的建议 How to get rid of memeory leak

1. 禁止使用匿名内部类表达式 （匿名内部类对象一定持有当前上下文this对象）
2. 使用lamda表达式或者静态内部类
3. 在lamda表达式以及静态内部类中 对于外部对象， 使用弱引用（尤其是UI）。
使用weakReference 封装需要在lambda表达式
``` java
  public static <O> InvalidationListener weak(O obj, Action2<Observable, O> listener) {
    WeakReference<O> weak = new WeakReference<>(obj);
    return new InvalidationListener() {
      @Override
      public void invalidated(Observable ob) {
        O object = weak.get();
        if (object == null) { // isDispose() == true
          ob.removeListener(this);
        } else { // 类似在swt 中 判断 isDispose() == false
          listener.call(ob, object);
        }
      }
    };
  }
```