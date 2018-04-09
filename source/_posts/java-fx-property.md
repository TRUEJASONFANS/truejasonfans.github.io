---
title: java_fx_property
date: 2016-12-18 22:21:32
tags: java_fx
categories: java_fx
---
#  property的概念

一个property 通常是外部不可见的，在该类之外，我们只能通过get/set这些接口方法实现对其读与修改，我们对其实现细节(setter/getter)不关心也并不需要知道。但是通常我们（view)对它是否改变，从什么值改变成什么值十分关心（view)
***

## the kinds of feature in property of java fx
* 对于 fx 的property 都是可观察的(observable) 实现了observable 和observableValue接口
observable接口
``` java
public interface observable {
    void addListener(InvalidationListener listener);
    void removeListener(InvalidationListener listener);
}
```
observalue接口
``` java
public abstract interface ObservableValue<T> extends Observable
{
    public abstract void addListener(ChangeListener<? super T> paramChangeListener);
    public abstract void removeListener(ChangeListener<? super T> paramChangeListener);  
    public abstract T getValue();
}
```
 它们监听失效(invalid) 和 变化(change) 事件 
* Property 可以分为只读的以及可读写的。
  
          每个Property 类一般提供 : get()/set() and getValue()/setValue 针对primitive type(Read only property don't provide the set interface.)  getValue/SetValue 针对装箱类型


read-write property is easy to understand, you can read-write it in internal or outside.
* 对于只读属性的认识. (read-only for outside and read-write internally)
一个ReadOnlyXXXWrapper 类 包裹了两个类型，一个是只读的，一个是可读写的.
``` java
ReadOnlyIntegerWrapper idWrapper = new ReadOnlyIntegerWrapper(100);
ReadOnlyIntegerProperty id = idWrapper.getReadOnlyProperty();
System.out.println("idWrapper:" + idWrapper.get());
System.out.println("id:" + id.get());
// Change the value
idWrapper.set(101);
System.out.println("idWrapper:" + idWrapper.get());
System.out.println("id:" + id.get());
```
***
##  A Book Class 同时拥有只读属性和可读写属性的一个实体类
对于可读写属性抽象类型为XXXProperty, 实现类型通常SimpleXXXProperty.对于只读属性抽象类型通常是ReadOnlyXXXProeprty, 实现类型是ReadOnlyXXXWrapper.
``` java
public class Book {
	private final StringProperty title = new SimpleStringProperty(this,"title", "Unknown");
	private final DoubleProperty price = new SimpleDoubleProperty(this,"price", 0.0);
	private final ReadOnlyStringWrapper ISBN = new ReadOnlyStringWrapper(this,"ISBN", "Unknown");
	public Book() {}
	public Book(String title, double price, String ISBN) {
		this.title.set(title);
		this.price.set(price);
		this.ISBN.set(ISBN);
	}
	public final String getTitle() {
		return title.get();
	}
	public final void setTitle(String title) {
		this.title.set(title);
	}
	public final StringProperty titleProperty() {
		return title;
	}
	public final double getprice() {
		return price.get();
	}
	public final void setPrice(double price) {
		this.price.set(price);
	}
	public final DoubleProperty priceProperty() {
		return price;
	}
	public final String getISBN() {
		return ISBN.get();
	}
	public final ReadOnlyStringProperty ISBNProperty() {
		return ISBN.getReadOnlyProperty();
	}
} ```
***
## Lazily Instantiating Property Objects （充分优化内存，使用懒加载）
只有当需要item的weightProperty被需要的时候(weightProperty（）被调用)初始化property.
``` java
public class Item {
	private DoubleProperty weight;
	private double _weight = 150;

	public double getWeight() {
		return (weight == null) ? _weight : weight.get();
	}

	public void setWeight(double newWeight) {
		if (weight == null) {
			_weight = newWeight;
		} else {
			weight.set(newWeight);
		}
	}

	public DoubleProperty weightProperty() {
		if (weight == null) {
			weight = new SimpleDoubleProperty(this, "weight", _weight);
		}
		return weight;
	}
}
```
Tips: 
使用懒加载或者饥饿加载主要试情况而定， 一个拥有少量属性的类，并且基本你必定会用到属性，那么可以考虑饥饿加载，如果是封装的对象开销过大或者一个类里面封装了许多属性，只有少数会使用到时候可以考虑懒加载来优化内存。
***
## Property Class Hierarchy
![Paste_Image.png](http://upload-images.jianshu.io/upload_images/2053209-31c4e3b00a88625c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
***
## 最好将 property 的getter/setter 声明为final  
``` java
public class Book2 {
	private final StringProperty title = new SimpleStringProperty(this,
			"title", "Unknown");
	public final StringProperty titleProperty() {
		return title;
	}
	public final String getTitle() {
		return title.get();
	}
	public final void setTitle(String title) {
		this.title.set(title);
	}
}
```
***
## 解析property 接口的方法
1. bind(建立单向绑定)
与一个来自于继承泛型T链的实现了observableValue接口的对象（一般为property）相绑定
```java
void bind(ObservableValue<? extends T> observable);
```
2. bindBidrectional(建立双向绑定)
必须与同一类型建立双向绑定
```java
void bindBidirectional(Property<T> other);
```
***
## 对property 对象添加Invalidation(失效)事件监听
``` java
main {
IntegerProperty counter = new SimpleIntegerProperty(100);
couter.set(100) // 会出发一个invalid事件
couter.set(101) // 不会触发，因为该属性已经失效
int value = couter.get() //使属性回复有效
couter.set(101) // 会再出发一个Invalid事件
// Add an invalidation listener to the counter property
counter.addListener(InvalidationTest::invalidated);
}
public static void invalidated(Observable prop) {
System.out.println("Counter is invalid.");
}
```
***
## 对property 对象添加change(值改变)事件监听
``` java
main {
IntegerProperty counter = new SimpleIntegerProperty(100);
// Add a change listener to the counter property
counter.set(101); // 产生changeEvent
counter.set(102); //产生changeEvent
counter.set(102); //不产生changeEvent
counter.addListener(ChangeTest::changed);
}
public static void changed(ObservableValue<? extends Number> prop,Number oldValue,Number newValue) {
System.out.print("Counter changed: ");
System.out.println("Old = " + oldValue + ", new = "+ newValue);
}
```
***
## 使用WeakListener来避免内存泄漏
应该在对某个property添加listener. 这样这些property中就有listener的强引用，这样这些listener就很难被回收。还有一种情况就是匿名的changlistener实现，会有外部的
对象的引用，如果外部对象包括比较占内存的view,就很容易出现这个问题。
```java
ChangeListener<Number> cListener = create a change listener...
WeakChangeListener<Number> wListener = new WeakChangeListener(cListener);
// Add a weak change listener, assuming that counter is a property
counter.addListener(wListener);
......
cListener = null;//不需要改listener的时候
```
***