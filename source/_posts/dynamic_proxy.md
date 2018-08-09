---
title: AOP实践
---
## AOP

   面向切面编程实际上做一个代码增强， AOP像OOP一样是一种编程范式。 我们不光可以对方法进行增强，
也可以对构造函数，字段进行增强。(例如使用aspect J). 这里我只关注方法执行过程前后的织入,也就是运行期进行织入。

   根据织入的时期，可以分为以下几个时期

-    编译前
-    编译后
-    装载后
-    运行期

比较有名的Spring AOP 是在运行期实现代码增强。
Spring AOP 基于以下两种实现，当代理对象实现某个接口时候会优先采用jdk动态代理， 如果代理对象无任何接口实现则基于CGlib 实现动态代理

![](http://www.baeldung.com/wp-content/uploads/2017/10/springaop-process.png) 


## 动态代理

### 基于JDK的动态代理

  1. 定义一个回调类定义拦截后的方法回调对象（implement InvocationHandler)
  2. 使用Proxy.newProxyInstance() 生成代理对象。该方法有三个参数， 第一个是所属的classloader.
  第二个是该代理对象实现的接口的数组， 第三个是1定义的回调对象

```java
class AppClientProxyHandler implements InvocationHandler {
  public final AppClient bind(AppClientPool pool) {
    this.pool = pool;
    return (AppClient) (Proxy.newProxyInstance(
        pool.getClass().getClassLoader(), new Class<?>[] {AppClient.class}, this));    
  }
  @override
  public final Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
  }
}

```
AppClientProxyHandler 动态代理 AppClient 接口，对于applient 接口的调用都会被代理

增强的代码就是：

```Java
RpcConnection<D4cRpcClient, CommD4cService.Client> conn = pool.getAvailableConnnection();
 try {
    return call(method, conn.getInterfaces(), args);
 } catch (Exception e) {
    Throwable rootCause = e.getCause();
    if (rootCause instanceof AppClientException || rootCause instanceof UtilException) {
        throw rootCause;
      } else {
        LOGGER.error(e.getMessage(), e);
        throw new ServerFail("Fatal error during call app service", e);
      }
    } finally {
   	pool.pushBack(conn);
}
```
增强目的：重复使用pool中“可贵“资源RpcConnection

### 基于CGLib方案

对于每个DAO调用之前做方法拦截回调, 检查版本是否符合预期，不符合预期不加载， 类似于权限检查。
事实上对于sesion 的权限检查也应该基于AOP去做。 对于版本更新，则在sava成功之后去做。

 1. 定义方法调用前回调对象
在dao真正调用前进行"版本检测"

``` java
public class VersionCheckHandler implements MethodInterceptor {
	@Override
	public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
    handleBefore(method, args);// version check
    return proxy.invokeSuper(obj, args);
  }

}

```
 2. 定义方法调用后回调对象
 在dao完成写操作后，进行“写版本”操作

```java
public class VersionSaveHandler implements MethodInterceptor {
  @Override
  public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
    Object object = proxy.invokeSuper(obj, args);
    handleAfter(method, args);// version save
    return object;
  }
}
```
 3. 对于原来的DAO进行"代理"增强, 生成新的DAO 对象：

``` java
public class ProxyFactory {
   public static <T> T getProxy(T targetObject, List<MethodInterceptor> handlers, CallbackFilter filter) {
    if (!handlers.isEmpty()) {
      Enhancer enhancer = new Enhancer();
      enhancer.setSuperclass(targetObject.getClass());
      List<Callback> callbacks = Lists.newArrayList();
      for (int i = 0; i < handlers.size(); i++) {
        callbacks.add(handlers.get(i));
      }
      enhancer.setCallbacks(callbacks.toArray(new Callback[callbacks.size()]));
      if (filter != null) {
        enhancer.setCallbackFilter(filter);
      }
      return (T) enhancer.create();
    } else {
      return targetObject;
    }
  }
}
```
### AOP编程思想
OOP的有效补充（引用于知乎）
* 面向对象(OOP)引入了继承、多态、封装，将系统的业务功能按照模块划分，每个模块用一个或多个类来表示。
* 而对于一些系统功能，无法使用OOP的思想来实现它们。这些系统功能往往穿插在业务功能的各处，和业务代码耦合在一起；而且系统功能往往会被重复使用，这就导致了模块不利于复用，这就是使用OOP实现系统功能的弊端。 
* AOP即为面向切面编程，它把系统需求按照功能分门归类，把它们封装在一个个切面中，然后再指定这些系统功能往业务功能中织入的规则。最后由第三方机构根据你指定的织入规则，将系统功能整合到业务功能中。


