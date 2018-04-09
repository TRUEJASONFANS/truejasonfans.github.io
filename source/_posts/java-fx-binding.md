---
title: java_fx_binding
date: 2016-12-18 22:22:37
tags: java_fx
categories: java_fx
---
# Binding在fx的使用
***
##  Binding的概念
` soldPrice = listPrice - discounts + taxes`
通过这个表达式，如果你知道listPrice, discounts, taxes, 你是不是很快能计算出soldPrice? 这就是一个binding的关系,反之如果你知道了一个soldPrice,你能推算出其他3项吗？答案是no. 这里为我们揭示了binding中存在方向的概念，是单向 or 双向。
***
### NumberBinding
 1. 利用property对象返回一个NumberBinding对象,当它的值没有被计算出来，它是invalid:
``` 
//NumberBinding
IntegerProperty digit1 = new SimpleIntegerProperty(1);
IntegerProperty digit2 = new SimpleIntegerProperty(2);
NumberBinding numberBinding = digit1.add(digit2);
System.out.println("sum.isValid(): " + sum.isValid());
System.out.println(sum.getValue());
System.out.println("sum.isValid(): " + sum.isValid());
```

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2053209-12d0a5d087a88344.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

 2.或者它依赖的propery更新的时候，它也会失效
```
digit1.set(3);
System.out.println("sum.isValid(): " + sum.isValid());
```

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2053209-01931b910c192303.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

***
### Binding in String
1. 直接使用property
``` java
//StringBinding
StringProperty str1 = new SimpleStringProperty("11");
StringProperty str2 = new SimpleStringProperty("22");
StringProperty str3 = new SimpleStringProperty("33");
str3.bind(str1.concat(str2));
System.out.println(str3.get());	
```
2.使用StringExpression
``` java
StringProperty str1 = new SimpleStringProperty("11");
StringProperty str2 = new SimpleStringProperty("22");
StringExpression desc = str1.concat(str2);
System.out.println(desc .get());	
```
3.使用String binding
``` java
StringProperty str1 = new SimpleStringProperty("11");
StringProperty str2 = new SimpleStringProperty("22");
StringBinding strBinding = new StringBinding() {
	              {
	              bind(str1.concat(str2));
		      }
			@Override
			protected String computeValue() {
				return str1.concat(str2).get();
			}};
System.out.println("StringBinding: + " + strBinding.getValue());
str2.set("22");
System.out.println("StringBinding: + " + strBinding.getValue());
```
***
### Binding of boolean
通过property之间的逻辑方法比较构造。
```
Book b1 = new Book("J1", 90, "1234567890");
Book b2 = new Book("J2", 80, "0123456789");
ObjectProperty<Book> book1 = new SimpleObjectProperty<>(b1);
ObjectProperty<Book> book2 = new SimpleObjectProperty<>(b2);
// Create a binding that computes if book1 and book2 are equal
BooleanBinding isEqual = book1.isEqualTo(book2);
System.out.println(isEqual.get());// false
book2.set(b1);
System.out.println(isEqual.get());// true
```
```
IntegerProperty x = new SimpleIntegerProperty(1);
IntegerProperty y = new SimpleIntegerProperty(2);
IntegerProperty z = new SimpleIntegerProperty(3);
// Create a boolean expression for x > y && y <> z
BooleanExpression condition = x.greaterThan(y).and(y.isNotEqualTo(z));
System.out.println(condition.get());// false
// Make the condition true by setting x to 3
x.set(3);
System.out.println(condition.get());// true
```
***
### 单向绑定以及双向绑定
### 单向绑定实例 (C = A X B)
单向绑定只受绑定对象的影响，Binding对象（或这属性）自身的变化不影响绑定对象。
``` java
public class BoundProperty {
	public static void main(String[] args) {
		IntegerProperty x = new SimpleIntegerProperty(10);
		IntegerProperty y = new SimpleIntegerProperty(20);
		IntegerProperty z = new SimpleIntegerProperty(60);
		z.bind(x.add(y));
		System.out.println("After binding z: Bound = " + z.isBound() + ", z = "
				+ z.get());
		// Change x and y
		x.set(15);
		y.set(19);
		System.out.println("After changing x and y: Bound = " + z.isBound()
				+ ", z = " + z.get());
		// Unbind z
		z.unbind();
		// Will not affect the value of z as it is not bound to x and y anymore
		x.set(100);
		y.set(200);
		System.out.println("After unbinding z: Bound = " + z.isBound()
				+ ", z = " + z.get());
	}
}
```
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2053209-6f5115a552c75aff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
###双向绑定
双向绑定，改变任何一方，都会触发另一方的改变，给予这种前提（X=Y), 两边必须是同一类型。

一个简单的例子：
``` java
public class BidirectionalBinding {
	public static void main(String[] args) {
		IntegerProperty x = new SimpleIntegerProperty(1);
		IntegerProperty y = new SimpleIntegerProperty(2);
		IntegerProperty z = new SimpleIntegerProperty(3);

		System.out.println("Before binding:");
		System.out.println("x=" + x.get() + ", y=" + y.get() + ", z=" + z.get());

		x.bindBidirectional(y);
		System.out.println("After binding-1:");
		System.out.println("x=" + x.get() + ", y=" + y.get() + ", z=" + z.get());

		x.bindBidirectional(z);
		System.out.println("After binding-2:");
		System.out.println("x=" + x.get() + ", y=" + y.get() + ", z=" + z.get());

		System.out.println("After changing z:");
		z.set(19);
		System.out.println("x=" + x.get() + ", y=" + y.get() + ", z=" + z.get());

		// Remove bindings
		x.unbindBidirectional(y);
		x.unbindBidirectional(z);
		System.out.println("After unbinding and changing them separately:");
		x.set(100);
		y.set(200);
		z.set(300);
		System.out.println("x=" + x.get() + ", y=" + y.get() + ", z=" + z.get());
	}
}
``` 

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2053209-2c30201f85a812b6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 流式API
流式 API 是Java fx 在Binding提供的福利 API. 通过这些API，可以向DSL 一样描述 依赖关系。
```java
public class FluentAPITest {

	public static void main(String[] args) {
		
		//String property
		StringProperty s1 = new SimpleStringProperty("XX");
		StringProperty s2 = new SimpleStringProperty("qq");
		StringExpression s3 = s1.concat(s2);
		System.out.println(s3.get());
		
		//Number property
		IntegerProperty i1 = new SimpleIntegerProperty(4);
		IntegerProperty i2 = new SimpleIntegerProperty(2);
		IntegerProperty i3 = new SimpleIntegerProperty(2);
		IntegerBinding ib = (IntegerBinding) i1.add(i2).subtract(i2).multiply(i2).divide(i3);
		System.out.println(ib.get());
		
		//Boolean Property
		BooleanProperty b1 = new SimpleBooleanProperty(false);
		BooleanProperty b2 = new SimpleBooleanProperty(true);
		BooleanBinding b3 = b1.isEqualTo(b2).isNotEqualTo(b2).not().not();
		System.out.println(b3.get());
	}
}
```

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2053209-cf3e4fd4730204df.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 三元 API 操作
new When(condition).then(value1).otherwise(value2) 
condition对象必须实现了ObservableBooleanValue接口
```  java
public class TernaryTest {
	public static void main(String[] args) {
		IntegerProperty num = new SimpleIntegerProperty(10);
		StringBinding desc = new When(num.divide(2).multiply(2).isEqualTo(num)).then("even").otherwise("odd");
		System.out.println(num.get() + " is " + desc.get());
		num.set(19);
		System.out.println(num.get() + " is " + desc.get());
	}
}
```
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2053209-60fb60d4320dfd39.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### Binding Utility Class
Bingdings 类中包含之前提及全部流式API(诸如add,sustract,multiply,divide,concat,eqaul 等等).如果你不喜欢用流式API的写法，也可以用通过调用Bindings的方法的来满足你创建所需的binding.
``` java
public class BindingsClassTest {
	public static void main(String[] args) {
		DoubleProperty radius = new SimpleDoubleProperty(7.0);
		DoubleProperty area = new SimpleDoubleProperty(0.0);

		// Bind area to an expression that computes the area of the circle
		area.bind(Bindings.multiply(Bindings.multiply(radius, radius), Math.PI));
		// Create a string expression to describe the circle
		StringExpression desc = Bindings.format(Locale.US, "Radius = %.2f, Area = %.2f", radius, area);
		System.out.println(desc.get());

		// Change the radius
		radius.set(14.0);
		System.out.println(desc.getValue());
	}
}
```

![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2053209-0ce42ae455652888.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
***
### 与UI 之间的binding
讲了这么多，如果你看过java fx 源码， 你猜到java fx 是如何实现UI 与 Model  的 data binding 吗？
其实java fx ui 类 的所有属性 基本上是 实现了property接口的对象。
比如 textField的textProperty,再比如
``` java
public class ChoicBindingExample extends Application {
  ObservableList cursors = FXCollections.observableArrayList(
  Cursor.DEFAULT,
  Cursor.CROSSHAIR,
  Cursor.WAIT,
  Cursor.TEXT,
  Cursor.HAND,
  Cursor.MOVE,
  Cursor.N_RESIZE,
  Cursor.NE_RESIZE,
  Cursor.E_RESIZE,
  Cursor.SE_RESIZE,
  Cursor.S_RESIZE,
  Cursor.SW_RESIZE,
  Cursor.W_RESIZE,
  Cursor.NW_RESIZE,
  Cursor.NONE
); 
@Override
public void start(Stage stage) {
  ChoiceBox choiceBoxRef = ChoiceBoxBuilder.create()
  .items(cursors)
  .build();
VBox box = new VBox();
box.getChildren().add(choiceBoxRef);
final Scene scene = new Scene(box,300, 250);
scene.setFill(null);
stage.setScene(scene);
stage.show();
scene.cursorProperty().bind(choiceBoxRef.getSelectionModel().selectedItemProperty());
}
public static void main(String[] args) {
launch(args);
}
}
```