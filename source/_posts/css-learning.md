---
title: CSS 原理
date: 2017-06-09 00:17:27
tags: Web前端
---
![image.png](http://upload-images.jianshu.io/upload_images/2053209-3b0d0fd9b8621146.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### css 盒子模型

![image.png](http://upload-images.jianshu.io/upload_images/2053209-6c70f2e96a08b509.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![image.png](http://upload-images.jianshu.io/upload_images/2053209-25389b6a34185752.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 * 内容(content)
 * 边框(border): 产生内边距padding和外边距margin
 * margin 到边距是透明的
***

#### 派生选择器

1.后代选择器（只有符合上下关系）
选中`<li>`标签下的`<strong>`标签
```js
li strong {
    font-style: italic;
    font-weight: normal;
  }
```
2.子元素选择器
不希望选择任意的后代元素，而是希望缩小范围，只选择某个元素的子元素
`h1 > strong {color:red;}`
只作用域第一个strong而不作用于第二个，因为第二个不是直接的子元素。

```
<h1>This is <strong>very</strong> <strong>very</strong> important.</h1>
<h1>This is <em>really <strong>very</strong></em> important.</h1>
```

3.相邻元素选择器
相邻兄弟选择器使用了加号（+），即相邻兄弟结合符（Adjacent sibling combinator）(用一个结合符只能选择两个相邻兄弟中的第二个元素)
`li + li {font-weight:bold;}`  item2. item3 被选中
```
<ul>
    <li>List item 1</li>
    <li>List item 2</li>
    <li>List item 3</li>
  </ul>
  <ol>
    <li>List item 1</li>
    <li>List item 2</li>
    <li>List item 3</li>
  </ol>
```
***
### 一些难懂的css 特性
#### display
display 属性规定元素应该生成的框的类型,默认值：	
inline
继承性：	no
版本：	CSS1
JavaScript 语法：	object.style.display="inline"
```
none	此元素不会被显示。
block	此元素将显示为块级元素，此元素前后会带有换行符。
inline	默认。此元素会被显示为内联元素，元素前后没有换行符。
inline-block	行内块元素。（CSS2.1 新增的值）
```