---
title: java_fx_css
date: 2016-12-18 22:26:48
tags: java_fx
categories: java_fx
---
### java css 与HTML css 语法类似
Selector 选择器：
* \# ID (选择某ID的node们)
``` css
#closeButton {
-fx-text-fill: red;
}
```
* \. className(选择定义某个class的node们)
``` css
.button {
-fx-text-fill: blue;
}
```
``` css
.button#closeButton {
-fx-text-fill: red;
}
```
选择ID既为closeButton又属于button类的node


* 归组同样的样式
``` css
.button {
-fx-text-fill: blue;
}
.label {
-fx-text-fill: blue;
}
```
等价于：
```css
.button, .label {
-fx-text-fill: blue;
}
```
后代选择器（选择某个类型的后代类型）
``` css
/*选则祖先为hbox类样式的.button样式节点*/
.hbox .button {
-fx-text-fill: blue;
}
```
子节点选择器（选择某个父类型的子类型）
``` css
.hbox > .button {
-fx-text-fill: blue;
}
```
状态选择器也称为伪类型选择器，它会匹配当前所处状态的node，比如匹配拥有focus的，鼠标的hover等等
```css
.button:hover {
-fx-text-fill: red;
}
```

***
### 样式皮肤主题的区别(styles,skin,themes)
styles 控件级别
skin  应用级别
themes  操作系统级别
***
### 样式的取名
Property names in JavaFX styles start with -fx-. For example, the property name font-size in normal CSS
styles becomes -fx-font-size in JavaFX CSS style. JavaFX uses a convention to map the style property names
to the instance variables. It takes an instance variable; it inserts a hyphen between two words; if the instance variable
consists of multiple words, it converts the name to the lowercase and prefixes it with -fx-. For example, for an
instance variable named textAlignment, the style property name would be -fx-text-alignment
***
### 直接修改应用样式
```java 
Application.setUserAgentStylesheet(Application.STYLESHEET_CASPIAN);
```
setUserAgentStyleSheet方法可以直接替换应用的style.
## 内联写法与 样式表单的区别（difference between inline style and style sheet style)

### 设置css 样式的优先级
1. Inline style (the highest priority) 内联写法
``` java
node.setStyle("-fx.....");
//不能重复的setStyle(styleProperty)，以最后一次setStyle为准
//错误的写法
    node.setStyle("-fx-background-color: #9400D3");
    node.setStyle("-fx-background-insets: 5");
    node.setStyle("-fx-background-radius: 10");
//正确的写法
    node.setStyle("-fx-background-color: #9400D3;-fx-background-insets: 5;-fx-background-radius: 0");
```
2. Parent style sheets  父节点样式表单
3. Scene style sheets   场景样式表单
4. Values set in the code using JavaFX API(直接API调用: setFont())
5. User agent style sheets (the lowest priority)
***
### css 属性的继承
Java fx 对于css 属性有两种继承机制：
1. 一种是继承属性类型 （通过类的继承关系继承）
2. 一种是继承属性值
``` java
public class CSSInheritance extends Application {
	public static void main(String[] args) {
		Application.launch(args);
	}

	@Override
	public void start(Stage stage) {
		Button okBtn = new Button("OK");
		Button cancelBtn = new Button("Cancel");

		HBox root = new HBox(10); // 10px spacing
		root.getChildren().addAll(okBtn, cancelBtn);

		// Set styles for the OK button and its parent HBox
		root.setStyle("-fx-cursor: hand;-fx-border-color: blue;-fx-border-width: 5px;");
		okBtn.setStyle("-fx-border-color: red;-fx-border-width: inherit;");

		Scene scene = new Scene(root);
		stage.setScene(scene);
		stage.setTitle("CSS Inheritance");
		stage.show();
	}
}
```

![Upload Paste_Image.png failed. Please try again.]

### css 属性值类型
* inherit : fx-xxx: inherit(继承父节点的样式)
* boolean(true or false) : -fx-display-caret: false
* string : -fx-skin:"com.xxx.xxxSkin" 
* number : -fx-opacity:0.60
* angle : -fx-rotate:45deg
* point : 用 x,y 表示横纵坐标
* color-stop: 颜色梯度
* URI ：.image-view {-fx-image: url("http://jdojo.com/myimage.png");}  描述资源位置
* effect ： 阴影效果， 使用dropshadow和innershadow两个css 函数,参数
.drop-shadow-1 {-fx-effect: dropshadow(gaussian, gray, 10, 0.6, 10, 10);}
* font type: 
``` css 
//散开的写法
.my-font-style {
-fx-font-family: "serif";
-fx-font-size: 20px;
-fx-font-style: normal;
-fx-font-weight: bolder;
}
```
一句式写法
``` css
.my-font-style {
-fx-font: italic bolder 20px "serif";
}
```
* paint
A paint type value specifies a color.(定制你的动态颜色）
```
.my-style {
-fx-fill: linear-gradient(from 0% 0% to 100% 0%, black 0%, red 100%);
-fx-background-color: radial-gradient(radius 100%, black, red);
}
```
对于固定的颜色，你可以用
Using named colors(已命名定义好的颜色）
``` css
.my-style {
-fx-background-color: red;
}
```
Using looked-up colors
在根节点中定义，然后在子节点中向上查找所得：
``` css
.root {
my-color: black;
}
.my-style {
-fx-fill: my-color;
} 
```
Using the rgb() and rgba() functions
``` css
/* 使用rgb或者rgba*/
.my-style-1 {
-fx-fill: rgb(0, 0, 255);
}
.my-style-2 {
-fx-fill: rgba(0, 0, 255, 0.5);
}
/*16进制 */
.my-style-3 {
-fx-fill: #0000ff;
}
/* 8 进制*/
.my-style-4 {
-fx-fill: #0bc;
}
```
Using the hsb() or hsba() function
``` css
.my-style-1 {
-fx-fill: hsb(200, 70%, 40%);
}
.my-style-2 {
-fx-fill: hsba(200, 70%, 40%, 0.30);
}
```
Using color functions: derive() and ladder()
``` css
.root {
my-base-text-color: red;
}
.my-style {
-fx-text-fill: ladder(my-base-text-color, white 29%, black 30%);
}
```
ladder函数依赖于my-base-text-color的光亮程度,低于29%为红色，反之为黑色。

### 背景色的几个属性
-fx-background-color: 背景颜色
-fx-background-insets: 背景内边框距离外边框距离
-fx-background-radius: 背景边框矩形四个角半径
### 边界的几个属性
-fx-border-color : 边框颜色
-fx-border-width ： 边框厚度
-fx-border-radius ： 边框圆角半径
-fx-border-insets ： 边框距离边界距离（layoutbounds)
-fx-border-style: 边框线样式，比如点线：-fx-border-style: dotted