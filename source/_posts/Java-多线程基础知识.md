---
title: Java 多线程基础知识
tags:
  - Java
  - 多线程
  - 并发
comments: true
date: 2020-04-27 23:34:01
categories: Java
---

Java 多线程基础知识学习。

---

<!-- more -->

# 1. 创建多线程的方式

实现多线程本质上是两种方式：**继承 Thread 类并重写 run() 方法**和**实现 Runnable 接口**。其他的方法，例如实现 Callable 接口、线程池等，也能新建线程，但是从源码看，其他方式都是这两种方式的变种。

## 1.1 Thread 类官方文档

查看下 JDK 1.8 [官方文档](https://docs.oracle.com/javase/8/docs/api/index.html)：

> There are <u>**two ways**</u> to create a new thread of execution. One is to <u>declare a class to be a subclass of `Thread`</u>. This subclass should override the `run` method of class `Thread`. An instance of the subclass can then be allocated and started. For example, a thread that computes primes larger than a stated value could be written as follows:
>
> ------
>
> ```java
>      class PrimeThread extends Thread {
>          long minPrime;
>          PrimeThread(long minPrime) {
>              this.minPrime = minPrime;
>          }
> 
>          public void run() {
>              // compute primes larger than minPrime
>               . . .
>          }
>      }
> ```
> ------
>
> The following code would then create a thread and start it running:
>
> ```java
>      PrimeThread p = new PrimeThread(143);
>      p.start();
> ```
>
> The other way to create a thread is to declare a class that <u>implements the `Runnable` interface</u>. That class then implements the `run` method. An instance of the class can then be allocated, passed as an argument when creating `Thread`, and started. The same example in this other style looks like the following:
>
> ------
>
> ```java
>      class PrimeRun implements Runnable {
>          long minPrime;
>          PrimeRun(long minPrime) {
>              this.minPrime = minPrime;
>          }
> 
>          public void run() {
>              // compute primes larger than minPrime
>               . . .
>          }
>      } 
> ```
> ------
>
> The following code would then create a thread and start it running:
>
> ```java
>      PrimeRun p = new PrimeRun(143);
>      new Thread(p).start();
> ```



## 1.2 两种创建多线程的方式


- 用继承 Thread 类方式实现线程：

```java
/**
 * 用继承 Thread 类方式实现线程
 *
 * @author: Song Ningning
 * @date: 2020-04-27 23:46
 */
public class ThreadStyle extends Thread {

    @Override
    public void run() {
        System.out.println("用继承 Thread 类方式实现线程");
    }

    public static void main(String[] args) {
        new ThreadStyle().start();
    }
}
```

- 用实现 Runnable 接口方式创建线程：

```java
/**
 * 用实现 Runnable 接口方式创建线程
 *
 * @author: Song Ningning
 * @date: 2020-04-27 23:42
 */
public class RunnableStyle implements Runnable {

    @Override
    public void run() {
        System.out.println("用实现 Runnable 接口方式创建线程");
    }
    
    public static void main(String[] args) {
        Thread thread = new Thread(new RunnableStyle());
        thread.start();
    }
}
```

-----

Thread 类的 run 方法如下：

```java
@Override
public void run() {
    if (target != null) {
        target.run();
    }
}
```

再仔细看下源码，可以发现，创建线程最终还是通过继承 Thread 类这种方式。但是类里面的 run 方法有两种方式来实现：

- 对于直接继承 Thread 这种方式，是直接重写了 run 方法；

- 对于实现 Runnable 接口这种方式，是实现 Runnable 接口中的 run 方法，然后把该 Runnable 实例作为 target 传给 Thread 类，最终执行的是 target 中实现的 run 方法。

因此，如果同时用以上两种方法实现一个线程，执行的肯定是被重写的 run 方法。

```java
/**
 * 同时使用 Runnable 和 Thread 两种方式实现线程
 *
 * @author: Song Ningning
 * @date: 2020-04-27 23:57
 */
public class BothRunnableThread {

    public static void main(String[] args) {

        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("Runnable");
            }
        }) {
            @Override
            public void run() {
                System.out.println("Thread");
            }
        }.start();
    }
}
```
```
// 输出：Thread
```


## 1.3 其他方式

再看下其他几种：

```java
/**
 * FutureTask + Callable
 * 
 * @author: Song Ningning
 * @date: 2020-04-30 16:21
 */
public class CallableDemo implements Callable<String> {
    
    @Override
    public String call() throws Exception {
        System.out.println("Callable Style");
        return "success";
    }

    public static void main(String[] args) {
        Thread thread = new Thread(new FutureTask<String>(new CallableDemo()));
        thread.start();
    }
}
```

```java
/**
 * ThreadPool
 *
 * @author: Song Ningning
 * @date: 2020-04-28 23:35
 */
public class ThreadPoolDemo {

    public static void main(String[] args) {

        ExecutorService service = Executors.newCachedThreadPool();
        service.execute(new Runnable() {
            @Override
            public void run() {
                System.out.println("ThreadPool");
            }
        });
        service.shutdown();
    }
}
```

```java
/**
 * TimerTask
 * 
 * @author: Song Ningning
 * @date: 2020-04-29 0:05
 */
public class TimmerTaskDemo {

    public static void main(String[] args) {

        Timer timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                System.out.println("TimerTask");
            }
        }, 1000, 1000);
    }
}
```

## 【问题】实现 Runnable 接口和继承 Thread 类哪种方式更好一些？

实现 Runnable 接口的方式会更好些。

- 从代码架构角度来看，具体的任务（run 方法）应该和 “创建和运行线程的机制（Thread类）” 解耦，用 Runnable 对象可以实现解耦。通过 Runnable 方式实现的 run 方法中的内容是具体执行的任务，可以让一个单独任务类实现 Runnable 接口，然后把对应的实例传入 Thread 类就可以。这样的话，同样的一个任务类，可以传给不同的 Thread，并且任务类也不负责创建线程等工作，是解耦的。

- 使用继承 Thread 的方式的话，每次新建一个任务，只能新建一个独立的线程，而这样做的损耗会比较大（比如重头开始创建一个线程、执行完毕以后再销毁等。如果线程的实际工作内容，也就是 run() 函数里只是执行一些简单的操作，那么创建线程的损耗可能远大于线程的实际工作内容）。如果使用 Runnable 和线程池，就可以大大减小这样的损耗。

- 继承 Thread 类以后，由于 Java 语言不支持多继承，这样就无法再继承其他的类，限制了可扩展性。

继承 Thread 类也有几个好处，比如：

- 在 run () 方法内获取当前线程可以直接用 this，而无须用 Thread. currentThread () 方法；

- 继承的类的内部变量不会直接共享，少数不需要共享变量的场景下使用起来会更方便。

但是和其缺点相比，优点就不值一提了。

-----

# 2. 启动线程的方式

用`start()`方法启动线程。

## 2.1 start() 方法含义

### 2.1.1 启动新线程

线程对象在初始化之后，调用 start() 方法。实际上，start() 是由当前线程（通常是主线程）来执行的，此时当前线程就会**通知** JVM 在有空闲的情况下来启动新线程。因此，启动新线程的本质就是请求 JVM 来运行新线程。至于什么时候能运行，是由线程调度器来决定的。所以，调用了 start() 方法后，并不意味着新线程就运行了，有可能 Thread-01 先执行了 start()，Thread-02 后执行 start()，但实际是 Thread-02 先运行了。

### 2.1.2 准备工作

在执行 start() 方法之后和真正启动该线程之前，还有很多准备工作。该线程会处于就绪状态，这表明，该线程已经获得了除 CPU 以外的其他资源，在做完准备工作之后，才可能被 CPU 调度到执行状态，等待获取 CPU 资源，然后才会真正进入到运行状态来执行 run() 方法中的代码。

### 2.1.3 重复调用 start() 方法

```java
/**
 * 不能两次调用start方法，否则会报错
 *
 * @author: Song Ningning
 * @date: 2020-04-29 17:42
 */
public class CantStartTwice {

    public static void main(String[] args) {
        Thread thread = new Thread();
        thread.start();
        thread.start();
    }
}
```

以上代码调用了两次 start() 方法，抛出的异常是

 `Exception in thread "main" java.lang.IllegalThreadStateException`

执行了 start() 方法之后，线程状态从 `New` 进入到后续的状态，一旦线程执行完毕，线程就会进入`Teminated`状态，此时就不能再返回了。 

## 2.2 start() 源码

```java
public synchronized void start() {
    /**
     * This method is not invoked for the main method thread or "system"
     * group threads created/set up by the VM. Any new functionality added
     * to this method in the future may have to also be added to the VM.
     *
     * A zero status value corresponds to state "NEW".
     */
    if (threadStatus != 0)
        throw new IllegalThreadStateException();

    /* Notify the group that this thread is about to be started
     * so that it can be added to the group's list of threads
     * and the group's unstarted count can be decremented. */
    group.add(this);

    boolean started = false;
    try {
        // 调用 native 的 start0() 方法
        start0();
        started = true;
    } finally {
        try {
            if (!started) {
                group.threadStartFailed(this);
            }
        } catch (Throwable ignore) {
            /* do nothing. If start0 threw a Throwable then
              it will be passed up the call stack */
        }
    }
}
```

- 检查线程状态

  Thread 类的 start() 方法源码中，执行的第一件事就是检查线程状态。

    ```java
    /**
     * A zero status value corresponds to state "NEW".
     */
    if (threadStatus != 0)
        throw new IllegalThreadStateException();
    ```
    threadStatus 定义在 Thread 类中，0 代表线程刚刚初始化完成，还没有启动。

    ```java
    /* Java thread status for tools,
     * initialized to indicate thread 'not yet started'
     */

    private volatile int threadStatus = 0;
    ```
  
  因此，只有`New`状态下的线程才能继续执行后面的内容，否则会抛出 `IllegalThreadStateException`。
  
- 加入线程组

  ```java
  /* Notify the group that this thread is about to be started
   * so that it can be added to the group's list of threads
   * and the group's unstarted count can be decremented. */
  group.add(this);
  ```

- 调用 start0() 方法

  start0() 方法是个 native 方法。

  ```java
  private native void start0();
  ```

-----

# 3. 停止线程的方式

## 3.1 原理

**使用 interrupt 来通知，而不是强制。**

线程大部分是会运行到结束，自然停止。有些时候会主动停止线程，比如用户主动取消、服务被突然关闭、运行超时或者出错等。

Java 没有正确、安全停止线程的机制，但是 Java  提供了 interrupt 这种合作机制，即用一个线程 **通知** 另一个线程让其停止当前工作。因此，在 Java 中，要想停止一个线程，能做的就是通知其中断，但被中断线程本身有决定权，可以决定何时响应中断、何时停止、以及是否停止。所以，想停止线程的一方是没有能力去强制停止一个线程的。

因为对于想要停止线程的一方来说，其对被停止线程的逻辑可能是不了解的，只有被停止线程本身才是最熟悉自身的，他自身更清楚该如何执行后续的停止和清理工作，因此 Java 将停止线程的主动权交给被停止线程本身。

所以，想要正确停止线程，其实是如何正确用 interrupt 通知被停止线程，以及被停止线程如何配合。

## 3.2 正确停止线程

### 3.2.1 线程会在什么情况下停止

- run() 方法所有代码执行完毕
- 出现异常，而且没有被捕获

### 3.2.2 正确的停止方法：interrupt

- 通常情况下如何停止

```java
/**
 * run 方法内没有 sleep 或 wait 方法时，停止线程
 *
 * @author: Song Ningning
 * @date: 2020-04-30 19:00
 */
public class RightWaysStopThreadWithoutSleep implements Runnable {

    @Override
    public void run() {
        int num = 10000;
        while (!Thread.currentThread().isInterrupted() && 
               num <= (Integer.MAX_VALUE >> 1)) {
            System.out.println(num + "是 10000 的倍数");
            num += 10000;
        }
        System.out.println("运行结束");
    }

    public static void main(String[] args) {

        Thread thread = new Thread(new RightWaysStopThreadWithoutSleep());
        thread.start();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread.interrupt();
    }
}
```
`Thread.sleep(1000)`时

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WithoutSleep1000.png" width=""/> </div>

`Thread.sleep(500)`时

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WithoutSleep500.png" width=""/> </div>

线程的 run 方法是从 10000 开始，一直输出 10000 的倍数，直到小于等于 Integer.MAX_VALUE 的一半，在执行到 1 s 后，调用 interrupt 方法，为了能让线程响应中断，run 方法的循环条件中加上`!Thread.currentThread().isInterrupted()`判断，即不被中断才继续执行。

- 线程可能被阻塞

```java
/**
 * run 方法中带有 sleep 的中断线程的写法
 *
 * @author: Song Ningning
 * @date: 2020-04-30 23:01
 */
public class RightWaysStopThreadWithSleep {

    public static void main(String[] args) {

        Runnable runnable = () -> {
            int num = 100;
            try {
                while (num <= 300 && !Thread.currentThread().isInterrupted()) {
                    System.out.println(num + " 是 100 的倍数");
                    num += 100;
                }
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        };

        Thread thread = new Thread(runnable);
        thread.start();
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread.interrupt();
    }
}
```
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WithSleep.png" width=""/> </div>

run 方法执行完循环之后，调用 sleep 方法进入阻塞状态，在线程处于阻塞状态时，请求中断。休眠过程中收到请求中断的信号时，此时响应的方式就是抛出异常并被捕获：`InterruptedException: sleep interrupted`。

- 线程在每次迭代后都阻塞

```java
/**
 * 如果在执行过程中，每次循环都会调用 sleep 或 wait 等方法，
 * 那么不需要每次迭代都检查是否已中断
 *
 * @author: Song Ningning
 * @date: 2020-04-30 23:36
 */
public class RightWayStopThreadWithSleepEveryLoop {

    public static void main(String[] args) {

        Runnable runnable = () -> {
            int num = 100;
            try {
                while (num <= 10000) {
                    System.out.println(num + " 是 100 的倍数");
                    num += 100;
                    Thread.sleep(1000);
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        };

        Thread thread = new Thread(runnable);
        thread.start();
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread.interrupt();
    }
}
```
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WithSleepEveryLoop.png" width=""/> </div>

如果每次循环中都加入 sleep，即每次迭代都会阻塞，此时不再需要在循环条件中添加`!Thread.currentThread().isInterrupted()`的判断。抛出异常并被捕获：`InterruptedException: sleep interrupted`。

**while 内 try / catch 的问题**

```java
/**
 * 如果 while 里面放 try/catch，会导致中断失效
 *
 * @author: Song Ningning
 * @date: 2020-05-01 0:38
 */
public class CantInterrupt {

    public static void main(String[] args) {

        Runnable runnable = () -> {
            int num = 100;
            while (num <= 10000 && !Thread.currentThread().isInterrupted()) {
                System.out.println(num + " 是 100 的倍数");
                num += 100;
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        };

        Thread thread = new Thread(runnable);
        thread.start();
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread.interrupt();
    }
}
```
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/cantinterrupt.png" width="650px"/> </div>

如果将 try / catch 放在 while 循环里面，在当前轮的循环中响应了中断请求，但循环还是会继续。即便在循环条件中加入`!Thread.currentThread().isInterrupted()`判断，依然无法停止线程，这是因为 sleep 方法一旦响应中断，便会把 interrupt 标志位清除，导致 while 循环的判断条件检测不到中断状态。

```java
    /**
     * Causes the currently executing thread to sleep (temporarily cease
     * execution) for the specified number of milliseconds, subject to
     * the precision and accuracy of system timers and schedulers. The thread
     * does not lose ownership of any monitors.
     *
     * @param  millis
     *         the length of time to sleep in milliseconds
     *
     * @throws  IllegalArgumentException
     *          if the value of {@code millis} is negative
     *
     * @throws  InterruptedException
     *          if any thread has interrupted the current thread. The
     *          <i>interrupted status</i> of the current thread is
     *          cleared when this exception is thrown.
     */
    public static native void sleep(long millis) throws InterruptedException;
```



### 3.2.3 两种较好的停止线程方式

#### 3.2.3.1 优先选择：传递中断

反例：在低级层次处理异常。

下面的 Demo 中，线程在执行 throwInMethod 方法时被中断，同时，将异常在 throwInMethod 方法中进行了处理，将异常“吞掉了”，并没有“上报”给调用它的线程，实际上应该是由调用  throwInMethod 的线程来处理中断请求。

```java
public class RightWayStopThreadInProd1 implements Runnable {
	// 反例
    @Override
    public void run() {
        // 业务逻辑
        while (true && !Thread.currentThread().isInterrupted()) {
            System.out.println("go");
            throwInMethod();
        }
    }

    private void throwInMethod() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {

        Thread thread = new Thread(new RightWayStopThreadInProd1());
        thread.start();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread.interrupt();
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WrongWayStopThread.png" width=""/> </div>

因此，对于设计  throwInMethod 方法的人来说，最好是将异常抛出，由调用者来处理。对于设计 run 方法的人来说，应该检查  throwInMethod 方法是否错误的处理了中断。

```java
/**
 * catch 住 InterruptedExcetion 之后的优先选择：
 * 在方法签名中抛出异常，在 run() 就会强制 try/catch
 *
 * @author: Song Ningning
 * @date: 2020-05-01 1:17
 */
public class RightWayStopThreadInProd1 implements Runnable {

    @Override
    public void run() {
        // 业务逻辑
        while (true && !Thread.currentThread().isInterrupted()) {
            System.out.println("go");
            try {
                throwInMethod();
            } catch (InterruptedException e) {
                // 响应中断的操作
                // 保存日志、停止程序等
                System.out.println("正确处理了中断请求");
                e.printStackTrace();
            }
        }
    }

    private void throwInMethod() throws InterruptedException {
        Thread.sleep(2000);
    }

    public static void main(String[] args) {

        Thread thread = new Thread(new RightWayStopThreadInProd1());
        thread.start();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread.interrupt();
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/RightWayStopThreadInProd1.png" width="500px"/></div>



#### 3.2.3.2 不想或无法传递：恢复中断

如果不抛出异常，就应该在 catch 子语句中调用 Thread.currentThread().interrupt() 来恢复设置中断状态，以便于在后续的执行中，依然能够检查到刚才发生了中断。

```java
/**
 * 在 catch 子语句中调用 Thread.currentThread().interrupt() 来恢复设置中断状态，
 *
 * @author: Song Ningning
 * @date: 2020-05-01 23:08
 */
public class RightWayStopThreadInProd2 implements Runnable {

    @Override
    public void run() {
        while (true) {
            if (Thread.currentThread().isInterrupted()) {
                System.out.println("Interrupted，程序运行结束");
                break;
            }
            System.out.println("go");
            reInterrupt();
        }
    }

    private void reInterrupt() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // 恢复中断状态
            Thread.currentThread().interrupt();
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {

        Thread thread = new Thread(new RightWayStopThreadInProd2());
        thread.start();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread.interrupt();
    }
}
```



<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/RightWayStopThreadInProd2.png" width="500px"/> </div>

**一句话总结就是：不应屏蔽中断。**

| 响应中断的方法                                           |
| :------------------------------------------------------- |
| Object. wait()/ wait( long)/ wait( long, int)            |
| Thread. sleep( long) /sleep( long, int)                  |
| Thread. join()/ join( long)/ join( long, int)            |
| java. util. concurrent. BlockingQueue. take() /put( E)   |
| java. util. concurrent. locks. Lock. lockInterruptibly() |
| java. util. concurrent. CountDownLatch. await()          |
| java. util. concurrent. CyclicBarrier. await()           |
| java. util. concurrent. Exchanger. exchange(V)           |
| java.nio.channels.InterruptibleChannel相关方法           |
| java.nio.channels.Selector的相关方法                     |

### 【问题】正确停止线程的好处？

被中断的线程自身拥有如何响应中断的权利，因为有些线程的某些代码是很重要的，必须要等待这些线程处理完之后，再由线程自己去主动终止。因此不应该鲁莽的使用 stop 方法，而是通过使用 interrupt 来发出一个信号，让线程自己去处理，这样使线程代码在实际中更加安全。

## 3.3 错误停止线程方式

### 3.3.1 被弃用的 stop、suspend 和 resume 方法

stop 被弃用是因为该方法本质是不安全的，不过该方法是会释放掉所有监视器的。参考：[Java Thread Primitive Deprecation](https://docs.oracle.com/javase/7/docs/technotes/guides/concurrency/threadPrimitiveDeprecation.html)

> This method is inherently unsafe.  Stopping a thread with `Thread.stop` causes it to unlock all of the monitors that it has locked (as a natural consequence of the unchecked `ThreadDeath` exception propagating up the stack).

suspend 和 resume 方法可能会造成死锁。

> This method has been deprecated, as it is inherently deadlock-prone.

### 3.3.2 用 volatile 设置 boolean 标记位

- **看似可行**

```java
/**
 * 演示用 volatile 的局限：看似可行
 *
 * @author: Song Ningning
 * @date: 2020-05-03 1:31
 */
public class WrongWayVolatile implements Runnable {

    private volatile boolean canceled = false;

    @Override
    public void run() {
        int num = 100;
        try {
            while (num <= 100000 && !canceled) {
                System.out.println(num + "是 100 的倍数");
                num += 100;
                Thread.sleep(200);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {

        WrongWayVolatile r = new WrongWayVolatile();
        Thread thread = new Thread(r);
        thread.start();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        r.canceled = true;
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WrongWayVolatile.png" width=""/> </div>

- **错误之处**

用 volatile 设置 boolean 标记位无法处理长时间阻塞的情况。

Demo 中，生产者生产 100 的倍数 put 到阻塞队列中，消费者从中消费 ；生产者生产速度快于消费者消费速度，所以阻塞队列满了以后，生产者会阻塞，等待消费者进一步消费。消费者中的 needMoreNums 有一定概率会将生产者中的 canceled 置为 true，意图使生产者停止生产。但实际运行情况可以看到，当消费者将 canceled 置为 true 之后，"生产者结束运行" 这条语句并没有输出，生产者依然没有停止生产。

```java
/**
 * 演示用 volatile 的局限：陷入阻塞时，volatile是无法停止线程的
 *
 * @author: Song Ningning
 * @date: 2020-05-05 22:53
 */
public class WrongWayVolatileCantStop {

    public static void main(String[] args) throws InterruptedException {

        ArrayBlockingQueue<Integer> storage = new ArrayBlockingQueue<>(10);

        // 生产
        Producer producer = new Producer(storage);
        Thread producerThread = new Thread(producer);
        producerThread.start();
        Thread.sleep(1000);

        // 消费
        Consumer consumer = new Consumer(storage);
        while (consumer.needMoreNums()) {
            System.out.println(consumer.storage.take() + "被消费了");
            Thread.sleep(100);
        }
        System.out.println("消费者不需要更多数据了");

        //一旦消费不需要更多数据了，应该尝试让生产者也停下来
        producer.canceled = true;
        System.out.println(producer.canceled);

    }

    // 生产者类
    static class Producer implements Runnable {

        public volatile boolean canceled = false;
        BlockingQueue storage;

        public Producer(BlockingQueue storage) {
            this.storage = storage;
        }

        @Override
        public void run() {
            int num = 100;
            try {
                while (num <= 10000 && !canceled) {
                    storage.put(num);
                    System.out.println(num + "是 100 的倍数，已被加到仓库中");
                    num += 100;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                System.out.println("生产者结束运行");
            }
        }
    }

    // 消费者类
    static class Consumer {

        BlockingQueue storage;

        public Consumer(BlockingQueue storage) {
            this.storage = storage;
        }

        public boolean needMoreNums() {
            if (Math.random() > 0.95) {
                return false;
            }
            return true;
        }
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WrongWayVolatileCantStop.png" width="400px"/></div>

- **修正方案**

```java
/**
 * 用中断来修复 WrongWayVolatileCantStop 中无尽等待问题
 *
 * @author: Song Ningning
 * @date: 2020-05-05 23:27
 */
public class WrongWayVolatileFixed {

    public static void main(String[] args) throws InterruptedException {

        ArrayBlockingQueue storage = new ArrayBlockingQueue(10);

        Producer producer = new Producer(storage);
        Thread producerThread = new Thread(producer);
        producerThread.start();
        Thread.sleep(1000);

        Consumer consumer = new Consumer(storage);
        while (consumer.needMoreNums()) {
            System.out.println(consumer.storage.take() + "被消费了");
            Thread.sleep(100);
        }

        System.out.println("消费者不需要更多数据了");

        // 一旦消费不需要更多数据了，应该让生产者也停下来
        producerThread.interrupt();
    }

    // 生产者类
    static class Producer implements Runnable {

        BlockingQueue storage;

        public Producer(BlockingQueue storage) {
            this.storage = storage;
        }

        @Override
        public void run() {
            int num = 100;
            try {
                while (num <= 10000 && !Thread.currentThread().isInterrupted()) {
                    storage.put(num);
                    System.out.println(num + "是 100 的倍数，已被加到仓库中");
                    num += 100;
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                System.out.println("生产者结束运行");
            }
        }
    }

    // 消费者类
    static class Consumer {

        BlockingQueue storage;

        public Consumer(BlockingQueue storage) {
            this.storage = storage;
        }

        public boolean needMoreNums() {
            if (Math.random() > 0.95) {
                return false;
            }
            return true;
        }
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WrongWayVolatileFixed.png" width="500px"/></div>

## 3.4 几个方法

### 3.4.1 interrupt()

```java
public void interrupt() {
    if (this != Thread.currentThread())
        checkAccess();

    // 获取到 blockerLock
    synchronized (blockerLock) {
        Interruptible b = blocker;
        if (b != null) {
            interrupt0();           // Just to set the interrupt flag
            b.interrupt(this);
            return;
        }
    }
    interrupt0();
}
```

```java
private native void interrupt0();
```

都需要调用 interrupt0() 方法，而 interrupt0()  是个 native 方法。



### 3.4.2 判断是否已被中断的 2 个方法

`public static boolean interrupted()`

该方法是静态方法，内部调用当前线程的 isInterrupted() 方法，获取**当前线程**的中断状态，并且会清除线程的状态标记。

```java
/**
 * Tests whether the current thread has been interrupted.  The
 * <i>interrupted status</i> of the thread is cleared by this method. 
 */
public static boolean interrupted() {
    return currentThread().isInterrupted(true);
}
```

```java
/**
 * Tests if some Thread has been interrupted.  The interrupted state
 * is reset or not based on the value of ClearInterrupted that is
 * passed.
 */
private native boolean isInterrupted(boolean ClearInterrupted);
```



`public boolean isInterrupted()`

该方法是一个实例方法，获取**调用该方法的对象所表示的线程**的中断状态，不会清除线程的状态标记。

```java
/**
 * Tests whether this thread has been interrupted.  The <i>interrupted
 * status</i> of the thread is unaffected by this method.
 */
public boolean isInterrupted() {
    return isInterrupted(false);
}
```



Thread.interrupted() 的目标对象

```java
/**
 * 演示 Thread.interrupted() 方法的目标对象
 *
 * @author: Song Ningning
 * @date: 2020-05-06 0:59
 */
public class RightWayInterrupted {

    public static void main(String[] args) throws InterruptedException {

        Thread threadOne = new Thread(new Runnable() {
            @Override
            public void run() {
                for (; ; ) {
                }
            }
        });

        // 启动线程
        threadOne.start();
        //设置中断标志
        threadOne.interrupt();
        //获取中断标志---①
        System.out.println("isInterrupted: " + threadOne.isInterrupted());
        //获取中断标志并重置---②
        System.out.println("isInterrupted: " + threadOne.interrupted());
        //获取中断标志并重置---③
        System.out.println("isInterrupted: " + Thread.interrupted());
        //获取中断标志---④
        System.out.println("isInterrupted: " + threadOne.isInterrupted());
        threadOne.join();
        System.out.println("Main thread is over.");
    }
}
```

静态的 interrupted() 方法的目标对象是“当前线程”，而不管本方法来自于哪个对象。

由于 threadOne 被中断了，因此 ① 处 isInterrupted() 检测到了，返回 true；

②、③ 处，虽然一个是 threadOne 调用 interrupted()，一个是 Thread 调用 interrupted()，但 interrupted() 静态方法返回的是“当前线程”的状态，由于当前主线程没有被中断过，所以 ②、③ 均返回 false；

由于 ① 处使用的 isInterrupted() 方法并不会清楚线程状态，所以 ④ 处还是返回 true。

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/RightWayInterrupted.png" width=""/> </div>

---

# 4. 线程的生命周期

## 4.1 线程的 6 种状态

**New**：new 出一个线程后，调用 start() 之前，线程是新建状态。

**Runnable**：线程对象调用 start() 方法时，会被线程调度器来执行，即交给操作系统来执行，此时线程处于可运行状态。该状态包括操作系统线程状态中 Ready 和 Running。如果一直没拿到时间片，就一直是Ready 状态；当线程调度选中该线程、并分配了CPU时间片后，线程处于Running 状态。注意：线程处在 Running 状态时，如果 CPU 资源突然被拿走（线程被**挂起**），此时线程就回从 Running 转成 Ready，不过此时线程还是处于 Runnable 状态。比如：调用 yiled() 时线程由 Running 状态转为 Ready 状态，线程被线程调度器选中执行的时候又会从 Ready 状态转换为 Running 状态。

**Blocked**：线程进入到被 synchronized 修饰的代码（代码块或方法）时，并且没有拿到锁就会进入阻塞状态。

**Waiting**：线程在运行时，如果调用了 Object.wait()、Thread.join()、LockSupport.park() 就会进入等待状态，如果再调用了 Object.notify()、Object.notifyAll()、LockSupport.unpark()，又会回到 Runnable 状态。

**Timed_Waiting**：线程在运行时，如果调用了 Thread.sleep(time)、Object.wait(time)、Thread.join(time)、LockSupport.parkNanos(time)、LockSupport.parkUntil(time)，线程进入计时等待状态；当等待时间结束或调用 Object.notify()、Object.notifyAll()、LockSupport.unpark()，线程又会进入 Runnable 状态。  

**Terminated**：线程顺利执行完毕就会进入终止状态；或出现了未被捕获的异常，导致意外终止。

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/ThreadStates.png" width=""/></div>

**Demo 1** : 展示线程的 New、Runnable、Terminated 状态。根据结果可以知道，即使是正在运行，也是 Runnable 状态，而不是 Running。

```java
/**
 * 展示线程的 New、Runnable、Terminated 状态。
 *
 * @author: Song Ningning
 * @date: 2020-05-08 0:39
 */
public class NewRunnableTerminated implements Runnable{

    public static void main(String[] args) {

        Thread thread = new Thread(new NewRunnableTerminated());
        // NEW
        System.out.println("调用 start() 之前的状态：" + thread.getState());
        thread.start();
        // RUNNABLE
        System.out.println("调用 start() 之后的状态：" + thread.getState());
        try {
            Thread.sleep(5);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // RUNNABLE
        System.out.println("休眠 5ms 后，处于运行中时的状态：" + thread.getState());
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // TERMINATED
        System.out.println("run() 方法正常执行完之后的状态：" + thread.getState());
    }

    @Override
    public void run() {
        for (int i = 0; i < 1000; i++) {
            System.out.println(i);
        }
    }
}
```
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/NewRunnableTerminated_1.png" width=""/></div></br>
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/NewRunnableTerminated_2.png" width="410px"/></div></br>
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/NewRunnableTerminated_3.png" width="410px"/></div>

**Demo 2** : 展示 Blocked, Waiting, TimedWaiting 状态。① 处打印出 TIMED_WAITING状态，是因为正在执行run() 方法中的 Thread.sleep(1000)；② 处打印出 BLOCKED 状态，是因为 thread2 没有拿到 sync() 的锁；③ 处打印出 WAITING 状态，是因为执行了 wait()。

```java
/**
 * 展示 Blocked, Waiting, TimedWaiting
 *
 * @author: Song Ningning
 * @date: 2020-05-08 0:58
 */
public class BlockedWaitingTimedWaiting implements Runnable {

    public static void main(String[] args) {

        BlockedWaitingTimedWaiting runnable = new BlockedWaitingTimedWaiting();
        Thread thread1 = new Thread(runnable);
        thread1.start();
        Thread thread2 = new Thread(runnable);
        thread2.start();
        try {
            Thread.sleep(5);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // TIMED_WAITING---①
        System.out.println("thread1 的状态：" + thread1.getState());
        // BLOCKED---②
        System.out.println("thread2 的状态：" + thread2.getState());
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // WAITING---③
        System.out.println("thread1 的状态：" + thread1.getState());
    }

    @Override
    public void run() {
        syn();
    }

    private synchronized void syn() {
        try {
            Thread.sleep(1000);
            wait();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/BlockedWaitingTimedWaiting.png" width=""/></div>

## 4.2 阻塞状态

一般来说，把 Blocked、Waiting、Timed_Waiting 都称为阻塞状态。

## 4.3 线程状态总结

### 4.3.1 6 种状态

Java 中定义了线程的 6 种状态，分别是 NEW、RUNNABLE、 BLOCKED、 WAITING、 TIMED_WAITING、TERMINATED。

[Thread.State 官方文档](https://docs.oracle.com/javase/8/docs/api/index.html?java/lang/Thread.State.html)

```java
public static enum Thread.State
extends Enum<Thread.State>
A thread state. A thread can be in one of the following states:
	- NEW
	  A thread that has not yet started is in this state.
	- RUNNABLE
	  A thread executing in the Java virtual machine is in this state.
	- BLOCKED
	  A thread that is blocked waiting for a monitor lock is in this state.
	- WAITING
	  A thread that is waiting indefinitely for another thread to perform a particular action is in this state.
	- TIMED_WAITING
	  A thread that is waiting for another thread to perform an action for up to a specified waiting time is in this state.
	- TERMINATED
	  A thread that has exited is in this state.
A thread can be in only one state at a given point in time. These states are virtual machine states which do not reflect any operating system thread states.
```

### 4.3.1 转换关系和转换条件

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/ThreadStates.png" width=""/></div>

- NEW 只能往走到 RUNNABLE，而不能直接跳跃到其他状态;
- 线程生命周期不可回头：一旦到了  RUNNABLE 就不能回到 NEW ，一旦状态为 TERMINATED， 就不能再有任何状态的变化。所以一个线程只能有一次 NEW 和 TERMINATED 状态。线程是不可以重复执行的，当它运行完了之后便会结束，一旦一个线程进入了 TERMINATED 状态，它便不可以重新变回 RUNNABLE 等状态，这个不可重复执行的性质和线程池是一样的。如果还想执行该任务，可以选择重新创建一个线程，而原对象会被 JVM 回收。
- 2 个特殊情况：
  
  - 如果发生异常， 可以直接跳到 TERMINATED 状态，不必再遵循路径，比如可以从 WAITING 直接到 TERMINATED。
    
  - 从 Object. wait() 刚被唤醒时，通常不能立刻抢到 monitor 锁，就会从 WATING 先进入 BLOCKED 状态，抢到锁后再转换到 RUNNABLE 状态。（因为某个线程被唤醒一定是其他的线程将其唤醒，而其他线程要唤醒它也需要持有同一把锁，通常在唤醒一个线程之后并不会释放掉锁。）
    
    [Thread.State 官方文档](https://docs.oracle.com/javase/8/docs/api/index.html)
    
    ```java
    BLOCKED
    public static final Thread.State BLOCKED
    Thread state for a thread blocked waiting for a monitor lock. A thread in the blocked state is waiting for a monitor lock to enter a synchronized block/method or reenter a synchronized block/method after calling Object.wait.
    ```
    
    根据官方文档的说明可知，有两种途径可以进入 BLOCKED 状态，一是线程进入到被 synchronized 修饰的代码块或方法，但没有拿到锁；二是调用了 wait 方法之后，线程被唤醒重新进入被 synchronized 修饰的代码块或方法，此时线程又会进入 BLOCKED 状态。

-----

# 5. Thread 和 Object 类中线程相关方法

## 5.1 概览

<table>
   <tr align="center">
      <th>类</th>
      <th>方法名</th>
      <th>描述</th>
   </tr>
   <tr>
      <td align="center" rowspan="7">Thread</td>
      <td>sleep 相关</td>
       <td>让当前“正在执行的线程”休眠</td>
   </tr>
   <tr>
      <td>join</td>
      <td>等待其他线程执行完毕</td>
   </tr>
   <tr>
      <td>yield 相关</td>
      <td>放弃已经获取到的 CPU 资源</td>
   </tr>
   <tr>
      <td>currentThread</td>
      <td>获取当前执行线程的引用</td>
   </tr>
   <tr>
      <td>start、run 相关</td>
      <td>启动线程相关</td>
   </tr>
   <tr>
      <td>interrupt 相关</td>
      <td>中断线程</td>
   </tr>
   <tr>
      <td>stop、suspend、resume</td>
      <td>已废弃</td>
   </tr>
   <tr>
      <td align="center">Object</td>
      <td>wait、notify、notifyAll 相关</td>
      <td>让线程暂时休眠或唤醒</td>
   </tr>
</table>
## 5.2 wait、notify、notifyAll

### 5.2.1 作用

**阻塞阶段**：在 **synchronized 内部**可以调用 wait() 使线程进入阻塞状态，不再参与线程调度；必须在已获得的锁对象上调用 wait() 方法。

直到以下 4 种情况之一发生时,才会被唤醒；

1. 另一个线程调用这个对象的 notify() 方法且刚好被唤醒的是本线程;

2. 另一个线程调用这个对象的 notifyAll() 方法;

3. 过了 wait(long timeout) 规定的超时时间,如果传入 0 就是永久等待;

4. 线程自身调用了 interrupt() 

**唤醒阶段**：在 **synchronized 内部**可以调用 notify() 或 notifyAll() 唤醒其他等待线程；必须在已获得的锁对象上调用 notify() 或 notifyAll() 方法。

### 5.2.2 几个 Demo

**Demo 1** : 演示 wait 和 notify 的基本用法

从代码执行结果看出，wait() 会释放锁。

```java
/**
 * 演示 wait 和 notify 的基本用法
 
 * @author: Song Ningning
 * @date: 2020-05-08 16:52
 */
public class Wait {

    private static final Object OBJ = new Object();

    static class Thread1 extends Thread {
        @Override
        public void run() {
            synchronized (OBJ) {
                System.out.println(Thread.currentThread().getName() + " 开始执行");
                try {
                    OBJ.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + " 又获取到了锁");
            }
        }
    }

    static class Thread2 extends Thread {
        @Override
        public void run() {
            synchronized (OBJ) {
                OBJ.notify();
                System.out.println(Thread.currentThread().getName() + " 调用了 notify()");
            }
        }
    }

    public static void main(String[] args) {

        Thread1 thread1 = new Thread1();
        Thread2 thread2 = new Thread2();
        thread1.start();
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread2.start();
    }
}
```
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/Wait.png" width=""/> </div>

**Demo 2** : 演示 notify 和 notifyAll

3 个线程，线程 0 和线程 1 首先被阻塞，线程 2 唤醒它们。

```java
/**
 * 演示 notify 和 notifyAll
 
 * @author: Song Ningning
 * @date: 2020-05-08 17:12
 */
public class WaitNotifyAll implements Runnable {

    private static final Object OBJ = new Object();

    @Override
    public void run() {
        synchronized (OBJ) {
            System.out.println(Thread.currentThread().getName() + " 拿到了锁");
            try {
                System.out.println(Thread.currentThread().getName() + " 等待被唤醒");
                OBJ.wait();
                System.out.println(Thread.currentThread().getName() + " 执行完毕");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {

        WaitNotifyAll r = new WaitNotifyAll();

        Thread thread0 = new Thread(r);
        Thread thread1 = new Thread(r);
        Thread thread2 = new Thread(() -> {
            synchronized (OBJ) {
                OBJ.notifyAll();
                System.out.println("Thread2 中执行了 notifyAll()");
            }
        });

        thread0.start();
        thread1.start();
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread2.start();
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WaitNotifyAll_1.png" width=""/> </div>

如果将第 33 行代码的 notifyAll() 改为 notify()，只会唤醒一个被阻塞的线程，另一个线程会一直处于阻塞状态等待被唤醒。运行结果如下图： 

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WaitNotifyAll_2.png" width=""/> </div>

如果 notifyAll() 不变，将 main 方法中的`Thread.sleep(200)`去掉，则无法保证 Thread2 最后被启动，执行结果如下图，可以看到 Thread2 先于 Thread1 执行，对于 Thread0 来说，可以被正常唤醒，但 Thread1 阻塞之后没有线程来唤醒它了。

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WaitNotifyAll_3.png" width=""/> </div>

**Demo 3** : 只会释放当前 monitor

```java
/**
 * 演示 wait 只释放当前的那把锁
 *
 * @author: Song Ningning
 * @date: 2020-05-08 17:53
 */
public class WaitNotifyReleaseOwnMonitor {

    private static Object ObjA = new Object();
    private static Object ObjB = new Object();

    public static void main(String[] args) {

        Thread thread1 = new Thread(new Runnable() {
            @Override
            public void run() {
                synchronized (ObjA) {
                    System.out.println("Thread-1 拿到了 ObjA 锁");
                    synchronized (ObjB) {
                        System.out.println("Thread-1 拿到了 ObjB 锁");
                        try {
                            System.out.println("Thread-1 释放了 ObjA 锁");
                            ObjA.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        });

        Thread thread2 = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (ObjA) {
                    System.out.println("Thread-2 拿到了 ObjA 锁");
                    System.out.println("Thread-2 尝试拿到 ObjB 锁");
                    synchronized (ObjB) {
                        System.out.println("Thread-2 拿到了 ObjB 锁");
                    }
                }
            }
        });

        thread1.start();
        thread2.start();

    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/WaitNotifyReleaseOwnMonitor.png" width=""/> </div>

### 5.2.2 wait, notify, notifyAll 特点、性质

1. 必须在已获得的锁对象上调用 wait、notify、notifyAll 方法，即必须先拥有 monitor。否则会抛出`IllegalMonitorStateException`异常。
2. notify 只能唤醒一个被阻塞的线程，而 notifyAll 是唤醒所有被阻塞的线程。
3. 三个方法都属于 Object 类。
4. wait, notify, notifyAll 是相对底层的功能，JDK 封装了一个有类似功能的 Condition 接口。
5. notify, notifyAll 只会释放当前的那把锁。

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/Java_Monator.png" width=""/> </div>

上图为 Java 中线程抢锁的示意图，绿色区域为入口集 Entry Set，蓝色和红色区域为等待集 Wait Set。某个线程想要抢锁，此时进入 Entry Set，Entry Set 中原来可能已经有很多线程也准备抢锁，当其中某个线程 ② 抢到锁后时，进入到了紫色区域，该线程有两种方式会释放锁，一种是正确执行完该线程，然后释放锁退出；另一种是被 wait 之后，就会释放锁，其他线程又有机会抢到锁，该线程则会进入蓝色的 Wait Set 中等待被唤醒，如果该线程被 notify 了，就会进如红色的 Wait Set 中，此时该线程和绿的 Entry Set 中线程一样，都在等待持有锁的线程去释放锁，再去抢锁。

### 【问题】如何选择用 notify 还是 nofityAll ?

Object.notify 可能导致信号丢失这样的正确性问题，而 Object.notifyAll 虽然效率不太高(把不需要唤醒的等待线程也给唤醒了)，但是其在正确性方面有保障。因此实现通知的一种比较流行的保守性方法是优先使用Object.notifyAll 以保障正确性，只有在有证据表明使用Object.notify 足够的情况下才使用Object.notify。

只有在满足下列两个条件的情况下才能够用 Object.notify 替代 notifyAll 方法。

1. 一次通知仅需要唤醒至多一个线程。
2. 相应对象上的所有等待线程都是同质等待线程。所谓同质等待线程指这些线程使用同一个保护条件，并且这些线程在 Object.wait 调用返回之后的处理逻辑一致。最为典型的同质线程是使用同一个 Runnable 接口实例创建的不同线程(实例)或者从同一个 Thread 子类 new 出来的多个实例。

### 【Demo】生产者消费者设计模式

```java
/**
 * 用 wait/notify 来实现生产者消费者模式
 *
 * @author: Song Ningning
 * @date: 2020-05-08 20:18
 */
public class ProducerConsumerModel {

    public static void main(String[] args) {

        EventStorage storage = new EventStorage();
        Producer producer = new Producer(storage);
        Consumer consumer = new Consumer(storage);
        new Thread(producer).start();
        new Thread(consumer).start();
    }
}

class Producer implements Runnable {

    private EventStorage storage;

    public Producer(EventStorage storage) {
        this.storage = storage;
    }

    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            storage.put();
        }
    }
}

class Consumer implements Runnable {

    private EventStorage storage;

    public Consumer(EventStorage storage) {
        this.storage = storage;
    }

    @Override
    public void run() {
        for (int i = 0; i < 100; i++) {
            storage.take();
        }
    }
}

class EventStorage {

    private int maxSize;
    private LinkedList<Date> storage;

    public EventStorage() {
        this.maxSize = 10;
        this.storage = new LinkedList<>();
    }

    public synchronized void put() {

        while (storage.size() == maxSize) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        storage.add(new Date());
        System.out.println("仓库中现有 " + storage.size() + " 个产品。");
        notify();
    }

    public synchronized void take() {

        while (storage.size() == 0) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        System.out.println("取走了 [" + storage.pollFirst() + "], 仓库还剩下 " + storage.size() + "个产品。");
        notify();
    }
}
```

### 【Demo】使用两个线程交替打印 1-100 的奇偶数。

```java
/**
 * 两个线程交替打印0~100的奇偶数，用 wait 和 notify
 *
 * @author: Song Ningning
 * @date: 2020-05-08 21:29
 */
public class WaitNotifyPrintOddEveNum {

    private static int count = 0;
    private static final Object OBJ = new Object();

    public static void main(String[] args) {

        new Thread(new PrintNumber(), "线程 1").start();
        new Thread(new PrintNumber(), "线程 2").start();
    }

    static class PrintNumber implements Runnable {

        @Override
        public void run() {
            while (count <= 100) {
                synchronized (OBJ) {
                    // 唤醒其他线程
                    OBJ.notify();
                    System.out.println(Thread.currentThread().getName() + ": " + count++);
                    if (count <= 100) {
                        try {
                            // 如果任务还未结束，就休眠并释放锁
                            OBJ.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
    }
}
```

### 【问题】为什么 wait 必须在同步（synchronized）方法/代码块使用?

对于对象的非同步方法而言，任意时刻可以有任意个线程调用该方法。在同步方法或同步代码块中使用会使线程更安全，避免死锁或永久等待。例如下面代码：

```java
class BlockingQueue {
    Queue<String> buffer = new LinkedList<String>();
    
    public void give(String data) {
        buffer.add(data);
        notify();  // Since someone may be waiting in take
    }
    
    public String take() throws InterruptedException {
        while (buffer.isEmpty())  // Avoid "if" due to spurious wakeups
            wait();
        return buffer.remove();
    }
}
```

那么可能发生如下的错误:

1. 消费者线程调用 take() 并看到了 buffer. isEimpty()。
2. 在消费者线程继续 wait() 之前，生产者线程调用一个完整的 give()，也就是 buffer. add (data) 和notify();
3. 消费者线程现在调用 wait()，但是错过了刚才的 notify()。
4. 如果运气不好， 即使有可用的数据，但是没有更多生产者生产的话，那么消费者会陷入 wait 的无限期等待。

解决方案就是用 synchronized 来确保 notify 永远不会在 isEmpty 和 wait 之间被调用。

[参考资料](https://programming.guide/java/why-wait-must-be-in-synchronized.html)

### 【问题】为什么线程通信的方法wait，notify 和notifyAll 被定义在 Object 类里?

锁是一种状态，是状态就要有地方存。锁又是一种很通用的需求，因此 Java 提供了对象级的锁，就是指每个对象都可以有锁状态，可通过线程来获得。而所有类都继承于 Object，所以完全可以把 wait 方法定义在 Object 类中，这样，当我们定义一个新类，并需要以它的一个对象作为锁时，不需要我们再重新定义 wait 方法的实现，而是直接调用父类的 wait。

### 【问题】wait 方法是属于 Object 对象的，那调用 Thread.wait 会怎么样? （Thread 肯定也是继承自 Object）

就把 Thread 当成是一个普通的类，和 Object 没有区别。但是这样会有一个问题，那就是线程退出的时候会自动唤醒，这会让我们自己设计的唤醒流程受到极大的干扰，所以不推荐调用 Thread 类的 wait()，因为这会影响到系统 API 的正常运行，或者被系统 API 影响到。

## 5.3 sleep

**作用：**可以让线程进入 Waiting 状态，并且不占用 CPU 资源。

**特点：**不释放锁，包括 synchronized 和 lock，直到规定的时间后再次执行，休眠期间如果被中断，会抛出`InterruptedException`，并清除中断状态。

### 5.3.1 关于 sleep 的几个 Demo

Demo 1：示线程 sleep 的时候不释放 synchronized 的 monitor，等 sleep 时间到了以后，正常结束后才释放锁。

```java
/**
 * 展示线程 sleep 的时候不释放 synchronized 的 monitor，
 * 等 sleep 时间到了以后，正常结束后才释放锁
 *
 * @author: Song Ningning
 * @date: 2020-05-09 16:44
 */
public class SleepDontReleaseMonitor implements Runnable {

    public static void main(String[] args) {
        SleepDontReleaseMonitor r = new SleepDontReleaseMonitor();
        new Thread(r).start();
        new Thread(r).start();
    }

    @Override
    public void run() {
        syn();
    }

    private synchronized void syn() {
        System.out.println(Thread.currentThread().getName() + " 获取到了 monitor");
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + " 退出了同步方法");
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/SleepDontReleaseMonitor.png" width=""/> </div>

Demo 2： sleep 不释放 lock（lock需要手动释放）

```java
/**
 * sleep 不释放 lock
 
 * @author: Song Ningning
 * @date: 2020-05-09 16:53
 */
public class SleepDontReleaseLock implements Runnable {

    private static final Lock LOCK = new ReentrantLock();

    public static void main(String[] args) {
        SleepDontReleaseLock r = new SleepDontReleaseLock();
        new Thread(r).start();
        new Thread(r).start();
    }

    @Override
    public synchronized void run() {
        LOCK.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " 获取了 Lock 锁");
            Thread.sleep(3000);
            System.out.println(Thread.currentThread().getName() + " 已经苏醒");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            LOCK.unlock();
        }
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/SleepDontReleaseLock.png" width=""/> </div>

**sleep 方法响应中断**

1. 抛出 `InterruptedException`
2. 清除中断状态
```java
* @throws  InterruptedException
*          if any thread has interrupted the current thread. The
*          <i>interrupted status</i> of the current thread is
*          cleared when this exception is thrown.
```


```java
/**
 * 每个 1 秒钟输出当前时间，被中断。
 * Thread.sleep()
 * TimeUnit.SECONDS.sleep()
 *
 * @author: Song Ningning
 * @date: 2020-05-09 17:07
 */
public class SleepInterrupted implements Runnable {

    public static void main(String[] args) {
        Thread thread = new Thread(new SleepInterrupted());
        thread.start();
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        thread.interrupt();
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(new Date());
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch (InterruptedException e) {
                e.printStackTrace();
                System.out.println("已被中断");
                System.out.println(Thread.currentThread().isInterrupted());
            }
        }
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/SleepInterrupted.png" width=""/> </div>

java.util.concurrent 下的 `TimeUnit` 使用起来更方便些，直接提供了时间的转换，内部也还是调用了 Thread 类中的`sleep(long millis, int nanos)`方法，只不过如果输入的是负数，Thread 类中的 `sleep(long millis, int nanos)`方法会抛出`IllegalArgumentException`，而 TimeUnit 中的方法直接忽略输入负数的情况。

```java
// Thread 类中的 sleep(long mills, int nanos) 方法
public static void sleep(long millis, int nanos)
    throws InterruptedException {
    if (millis < 0) {
        throw new IllegalArgumentException("timeout value is negative");
    }

    if (nanos < 0 || nanos > 999999) {
        throw new IllegalArgumentException(
            "nanosecond timeout value out of range");
    }

    if (nanos >= 500000 || (nanos != 0 && millis == 0)) {
        millis++;
    }

    sleep(millis);
}
```

```java
// TimeUnit 类中的 sleep(long timrout) 方法
public void sleep(long timeout) throws InterruptedException {
    if (timeout > 0) {
        long ms = toMillis(timeout);
        int ns = excessNanos(timeout, ms);
        Thread.sleep(ms, ns);
    }
}
```

### 【问题】wait、sleep异同

**相同点：**

1. wait和 sleep 方法都可以使线程**阻塞**，对应线程状态是 Waiting 或 Timed_Waiting。
2. wait 和 sleep 方法都可以**响应中断** Thread. interrupt ()，并抛出`InterruptedException`异常。

**不同点：**

1. 调用的要求不同：sleep() 可以在任何需要的场景下调用；wait 必须使用在同步代码块或同步方法中。

2. 关于是否释放锁：如果两个方法都使用在同步代码块或同步方法中，sleep 不会释放锁，wait 会释放锁。

3. 声明位置不同：sleep 声明在 Thread 类中，wait 声明在 Object 类中。

## 5.4 join

**作用：**通俗地说，有新的线程加入我们当前线程，当前线程等待，等调用的线程运行完成后，我们当前线程再去执行。t1 和 t2 两个线程，在 t1 的某个点调用 t2.join()，此时 t1 进入阻塞状态，直到 t2 执行完后，t1 结束阻塞状态。

**什么情况下使用**：等待好几个资源的初始完成后化，主线程才能开始工作。

### 5.4.1 几个关于 join 的 Demo：

**Demo 1**：普通用法。

```java
/**
 * 演示join，注意语句输出顺序，会变化。
 *
 * @author: Song Ningning
 * @date: 2020-05-09 19:28
 */
public class Join implements Runnable {

    public static void main(String[] args) throws InterruptedException {

        Join r = new Join();
        Thread thread1 = new Thread(r, "Thread-1");
        Thread thread2 = new Thread(r, "Thread-2");

        thread1.start();
        thread2.start();
        System.out.println("开始等待子线程运行完毕");
        thread1.join();
        thread2.join();
        System.out.println("所有子线程执行完毕");
    }

    @Override
    public void run() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + " 执行完毕");
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/Join_1.png" width=""/> </div>

可以从结果看出，调用了 thread1.join() 和 thread2.join() 之后，主线程会等待 thread1 和 thread2 执行完之后，才会执行后面的程序。如果把 thread1.join() 和 thread2.join() 注释掉，结果如下图所示，主线程不会等待，依然会继续执行。

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/Join_2.png" width=""/> </div>

**Demo 2**：join 期间遇到中断。

```java
/**
 * 演示 join 期间被中断的效果
 *
 * @author: Song Ningning
 * @date: 2020-05-09 20:00
 */
public class JoinInterrupt {

    public static void main(String[] args) {

        Thread mainThread = Thread.currentThread();
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(1000);
                    mainThread.interrupt();
                    Thread.sleep(5000);
                    System.out.println("sleep()结束");
                } catch (InterruptedException e) {
                    System.out.println("子线程被中断");
                }
            }
        }, "子线程");

        thread.start();
        System.out.println("主线程等待子线程执行完毕");
        try {
            thread.join();
        } catch (InterruptedException e) {
            System.out.println(Thread.currentThread().getName() + "线程被中断");
            thread.interrupt();
        }
        System.out.println("子线程执行完毕");
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/JoinInterrupt.png" width=""/> </div>

代码逻辑：通过 Thread.currentThread() 获得主线程的引用，在主线程中调用 thread.join()，此时主线程等待子线程执行完毕才能继续执行，而子线程的 run 方法中，将主线程中断，此时 join 期间的主线程进入 catch，输出“主线程被中断”，同时将子线程也中断，所以在 sleep 的子线程被中断，子线程进入 catch，输出“子线程被中断”。注意：这里子线程被中断后，其 catch 语句和主线程是并行执行的，所以无法确定 “子线程被中断” 和 “子线程执行完毕” 哪一个会先输出。

**Demo 3** ：join 期间，线程的状态：WAITING。

```java
/**
 * 先 join 再 mainThread.getState()
 *
 * @author: Song Ningning
 * @date: 2020-05-09 20:30
 */
public class JoinThreadState {

    public static void main(String[] args) {

        Thread mainThread = Thread.currentThread();
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(2000);
                    System.out.println("主线程状态: " + mainThread.getState());
                    System.out.println("Thread-0 执行完毕");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        thread.start();
        System.out.println("主线程等待子线程执行完毕");
        try {
            thread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("子线程执行完毕");
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/JoinThreadState.png" width=""/> </div>



### 5.4.2 join 原理

看看源码

```java
public final synchronized void join(long millis)
    throws InterruptedException {
    long base = System.currentTimeMillis();
    long now = 0;

    if (millis < 0) {
        // 输入参数 < 0，抛出异常。
        throw new IllegalArgumentException("timeout value is negative");
    }

    if (millis == 0) {
        while (isAlive()) {
            wait(0);
        }
    } else {
        while (isAlive()) {
            long delay = millis - now;
            if (delay <= 0) {
                break;
            }
            // 等待 delay 时间后苏醒
            wait(delay);
            now = System.currentTimeMillis() - base;
        }
    }
}
```

该方法的参数为 0 时，意味着永远等待，直到被唤醒、被中断或者前面的线程执行完毕。可以发现，join 内部是调用了 wait。如果输出参数为 0，调用了 wait(0)，但是代码中并没有唤醒的操作。实际上，Thread 类在 run() 方法执行完后，都会自动执行类似 notify 的操作，即唤醒线程（JVM层代码）。所以如之前所说，不推荐调用 Thread 类的 wait()，因为这会影响到系统 API 的正常运行，或者被系统 API 影响到。

```c++
作者：cao
链接：https://www.zhihu.com/question/44621343/answer/97640972
来源：知乎

//c++函数：这个函数的作用就是在一个线程执行完毕之后，jvm会做的收尾工作。里面有一行代码：ensure_join(this);
void JavaThread::exit(bool destroy_vm, ExitType exit_type);
```

```c++
作者：cao
链接：https://www.zhihu.com/question/44621343/answer/97640972
来源：知乎

// ensure_join(this) 的源码如下: 
static void ensure_join(JavaThread* thread) {
    Handle threadObj(thread, thread->threadObj());

    ObjectLocker lock(threadObj, thread);

    thread->clear_pending_exception();

    java_lang_Thread::set_thread_status(threadObj(), java_lang_Thread::TERMINATED);

    java_lang_Thread::set_thread(threadObj(), NULL);

    //thread 就是当前线程，比如在主线程中调用 thread1.join(),则就是 thread1 线程。
    lock.notify_all(thread);

    thread->clear_pending_exception();
}
```

知道了 join 的内部结构，也可以自己实现和 join 类似的功能，具体代码如下：

```java
/**
 * join 的代替写法
 *
 * @author: Song Ningning
 * @date: 2020-05-09 21:40
 */
public class JoinPrinciple {

    public static void main(String[] args) throws InterruptedException {
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + "执行完毕");
            }
        });

        thread.start();
        System.out.println("开始等待子线程执行完毕");
        // thread.join();
        synchronized (thread) {
            thread.wait();
        }
        System.out.println("所有子线程执行完毕");
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/JoinPrinciple.png" width=""/> </div>

## 5.5 yield

**作用**：当前线程正在执行的时候停下来进入等待队列，即释放当前线程的 CPU 时间片，此时该线程状态依然是 RUNNABLE。线程调度器依然有可能把刚刚 yield 的线程拿回来继续执行。

-----

# 6. 线程属性

| 总览                       | 用途                                                         |
| :------------------------- | :----------------------------------------------------------- |
| 线程Id                     | 用于标识不同线程。                                           |
| 名称（Name）               | 作用让用户或程序员在开发、调试或运行过程中，更容易区分每个不同的线程、定位问题等。 |
| 是否是守护线程（isDaemon） | true 代表该线程是【守护线程】, false 代表线程是，非守护线程,也就是【用户线程】。 |
| 优先级（Priority）         | 优先级这个属性的目的是告诉线程调度器，用户希望哪些线程相对多运行、哪些少运行。 |

## 6.1 线程 ID

Demo

```java
/**
 * 获取线程 ID
 *
 * @author: Song Ningning
 * @date: 2020-05-10 22:04
 */
public class Id {

    public static void main(String[] args) {
        Thread thread = new Thread();
        System.out.println("主线程ID：" + Thread.currentThread().getId());
        System.out.println("子线程ID：" + thread.getId());
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/Id.png" width=""/> </div>

从运行结果看，线程 ID 从 1 开始。但 JVM 运行起来后，还有很多线程也会启动，所以自己创建的线程的 ID 并不是 2。从源码来看，线程的 ID 是每次加一，由于是`++threadSeqNumber`，因此第一个线程的 ID 就是 1 了。

```java
public long getId() {
    return tid;
}
```

```java
/*
 * Thread ID
 */
private long tid;
```

```java
/* Set thread ID */
tid = nextThreadID();
```

```java
private static synchronized long nextThreadID() {
    return ++threadSeqNumber;
}
```

## 6.2 线程名字

直接看源码

```java
public Thread() {
    // 传入一个默认的名字，以 Thread- 开头，后面加上 nextThreadNum()
    init(null, null, "Thread-" + nextThreadNum(), 0);
}
```

```java
/* For autonumbering anonymous threads. */
private static int threadInitNumber;
// 该方法加上了 synchronized，保证了线程的名字是不重复的，
// 返回值就是 threadInitNumber，从 0 自增 1
private static synchronized int nextThreadNum() {
    return threadInitNumber++;
}
```

设置线程名字

```java
public final synchronized void setName(String name) {
    // 安全检查
    checkAccess();
    // 检查入参
    if (name == null) {
        throw new NullPointerException("name cannot be null");
    }
	// 将 name 属性重新赋值
    this.name = name;
    // 如果线程状态不是 0，调用 native 方法 setNativeName，将 name 传入。
    // 线程状态为 0 说明线程还未被启动
    if (threadStatus != 0) {
        setNativeName(name);
    }
}
```

## 6.3 守护线程

**作用**：为用户线程提供服务。

**特性**：

1. 线程类型默认继承自父线程；
2. 被谁启动：通常所有的守护线程是由 JVM 启动，在 JVM 启动时，main 用户线程也会被启动
3. 不影响 JVM 退出。

**守护线程与用户线程的区别**：

User 和 Daemon 两者几乎没有区别，唯一的不同之处就在于虚拟机的离开：如果User Thread已经全部退出运行了，只剩下Daemon Thread存在， 虚拟机也就退出了，因为没有了“被守护者”，Daemon 也就没有工作可做了，也就没有继续运行程序的必要了。

**是否需要给线程设置为守护线程？**
通常不应把自己的线程设置为守护线程，因为设置为守护线程是很危险的。比如线程正在访问如文件、数据库的时候，所有用户线程都结束了，那么守护线程会在任何时候甚至在一个操作的中间发生中断，所以守护线程永远不应该去访问固有资源。

## 6.4 线程优先级

有 10 个级别，创建的线程优先级默认是 5。

```java
/**
 * The minimum priority that a thread can have.
 */
public final static int MIN_PRIORITY = 1;

/**
 * The default priority that is assigned to a thread.
 */
public final static int NORM_PRIORITY = 5;

/**
 * The maximum priority that a thread can have.
 */
public final static int MAX_PRIORITY = 10;
```

**为什么程序设计不应依赖于线程优先级？**

{% note primary %} 
线程优先级并不是一项稳定的调节手段，很显然因为主流虚拟机上的Java线程是被映射到系统的原生线程上来实现的，所以线程调度最终还是由操作系统说了算。尽管现代的操作系统基本都提供线程优先级的概念，但是并不见得能与Java线程的优先级一一对应，如 Solaris 中线程有2147483648（2的31次幂）种优先级，但 Windows 中就只有七种优先级。如果操作系统的优先级比 Java 线程优先级更多，那问题还比较好处理，中间留出一点空位就是了，但对于比Java线程优先级少的系统，就不得不出现几个线程优先级对应到同一个操作系统优先级的情况了。

线程优先级并不是一项稳定的调节手段，这不仅仅体现在某些操作系统上不同的优先级实际会变得相同这一点上，还有其他情况让我们不能过于依赖线程优先级：优先级可能会被系统自行改变，例如在 Windows 系统中存在一个叫“优先级推进器”的功能（Priority Boosting，当然它可以被关掉），大致作用是当系统发现一个线程被执行得特别频繁时，可能会越过线程优先级去为它分配执行时间，从而减少因为线程频繁切换而带来的性能损耗。因此，我们并不能在程序中通过优先级来完全准确判断一组状态都为 Ready 的线程将会先执行哪一个。

***深入理解 Java 虚拟机  12.4.2***
{% endnote %}

-----

# 7. 线程的异常处理

## 7.1 UncaughtExceptionHandler 类

处理线程的未捕获异常 UncaughtException。

**为什么需要 UncaughtExceptionHandler ?**

1. 主线程可以轻松发现异常,子线程却不行。

   主线程如果发现未捕获异常，会抛出异常，程序终止，从异常堆栈中可以看到是哪里出现了异常；但是子线程却不行，从代码运行结果来看，子线程抛出了异常，但是不会影响主线程的运行，这就使得子线出现的异常被各种日志信息淹没。

```java
public class ExceptionInChildThread implements Runnable {

    public static void main(String[] args) {
        new Thread(new ExceptionInChildThread()).start();
        for (int i = 0; i < 1000; i++) {
            System.out.println(i);
        }
    }

    @Override
    public void run() {
        throw new RuntimeException();
    }
}
```
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/ExceptionInChildThread.png" width=""/> </div>

2. 子线程异常无法用传统方式捕获。

   不加 try-catch，以下代码会抛出 4 个异常，而且异常信息中会带有子线程的名字。

```java
/**
 * 不加 try-catch 会抛出4个异常，都带线程名字
 *
 * @author: Song Ningning
 * @date: 2020-05-11 10:29
 */
public class CantCatchDirectly implements Runnable {

    public static void main(String[] args) throws InterruptedException {

        new Thread(new CantCatchDirectly(), "Thread-1").start();
        Thread.sleep(500);
        new Thread(new CantCatchDirectly(), "Thread-2").start();
        Thread.sleep(500);
        new Thread(new CantCatchDirectly(), "Thread-3").start();
        Thread.sleep(500);
        new Thread(new CantCatchDirectly(), "Thread-4").start();
    }

    @Override
    public void run() {
        throw new RuntimeException();
    }
}
```
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/CantCatchDirectly_1.png" width=""/> </div>

如果在主线程中将子线程全都进行 try-catch 处理，还是无法正确处理异常，因为现在使用 try-catch 是在主线程中，所以只能捕获主线程中的异常，而真正的异常是在子线程中发生的，因此无法捕捉到子线程中的异常。


```java
/**
 * 加了try catch,期望捕获到第一个线程的异常，线程234不应该运行，希望看到打印出Caught Exception
 *
 * @author: Song Ningning
 * @date: 2020-05-11 10:29
 */
public class CantCatchDirectly implements Runnable {

    public static void main(String[] args) throws InterruptedException {

        try {
            new Thread(new CantCatchDirectly(), "Thread-1").start();
            Thread.sleep(500);
            new Thread(new CantCatchDirectly(), "Thread-2").start();
            Thread.sleep(500);
            new Thread(new CantCatchDirectly(), "Thread-3").start();
            Thread.sleep(500);
            new Thread(new CantCatchDirectly(), "Thread-4").start();
        } catch (RuntimeException e) {
            System.out.println("捕获了异常");
        }
    }

    @Override
    public void run() {
        throw new RuntimeException();
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/CantCatchDirectly_1.png" width=""/> </div>

**两种解决方案：**

方案一（不推荐）：手动在每个 run 方法里进行 try-catch。

方案二（推荐）：利用 UncaughtExceptionHandler 。

UncaughtExceptionHandler 是 Thread 类中的一个接口，去实现它就可以。

```java
// UncaughtExceptionHandler 接口
@FunctionalInterface
public interface UncaughtExceptionHandler {
    /**
      * Method invoked when the given thread terminates due to the
      * given uncaught exception.
      * <p>Any exception thrown by this method will be ignored by the
      * Java Virtual Machine.
      * @param t the thread
      * @param e the exception
      */
    void uncaughtException(Thread t, Throwable e);
}
```

实现 UncaughtExceptionHandler  接口：

```java
/**
 * 自己定义的 MyUncaughtExceptionHanlder
 * 
 * @author: Song Ningning
 * @date: 2020-05-11 11:27
 */
public class MyUncaughtExceptionHandler implements Thread.UncaughtExceptionHandler {

    private String name;

    public MyUncaughtExceptionHandler(String name) {
        this.name = name;
    }

    @Override
    public void uncaughtException(Thread t, Throwable e) {
        // 打印一些日志信息
        Logger logger = Logger.getAnonymousLogger();
        logger.log(Level.WARNING, t.getName() + "线程异常");
        System.out.println(name + "捕获了" + t.getName() + "的异常");
    }
}
```

使用刚才写的 MyUncaughtExceptionHanlder，根据运行结果可以看到，正确处理了异常并打印出相关信息。

```java
/**
 * 使用刚才自己写的 UncaughtExceptionHandler
 *
 * @author: Song Ningning
 * @date: 2020-05-11 11:32
 */
public class UseOwnUncaughtExceptionHandler implements Runnable {

    public static void main(String[] args) throws InterruptedException {
        // 设置默认的全局捕获器
        Thread.setDefaultUncaughtExceptionHandler(new MyUncaughtExceptionHandler("捕获器"));
        UseOwnUncaughtExceptionHandler r = new UseOwnUncaughtExceptionHandler();
        new Thread(r, "Thread-1").start();
        Thread.sleep(500);
        new Thread(r, "Thread-2").start();
        Thread.sleep(500);
        new Thread(r, "Thread-3").start();
        Thread.sleep(500);
        new Thread(r, "Thread-4").start();
    }

    @Override
    public void run() {
        throw new RuntimeException();
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/MyUncaughtExceptionHanlder.png" width=""/> </div>

## 7.2 几个问题

**Java 异常体系**

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/JavaException.png" width=""/> </div>

所有的异常都继承自 Throwable 类，在下一层分为 Error 和 Exception。

Error 类描述了 Java 运行时系统内部错误以及资源耗尽等问题。

Exception 又分为两个分支：RuntimeException 和 其他异常。划分的依据是：由程序错误导致的异常属于 RuntimeException，如果程序本身没有问题，但由于像IO错误这类问题导致的异常属于其他异常。因此，“如果出现 RuntimeException 一定是你的问题”。

Java 语言规范将派生于 Error 类和 RuntimeException 类的所有异常称为**非受检(unchecked)异常**或运行时异常；其他异常称为**受检(checked)异常**或编译时异常，编译器会检查是否为受检异常提供了异常处理器。

**如何全局处理异常？**

1. 给程序统一设置

首先实现 UncaughtExceptionHandler 接口，在实现的 uncaughtException(Thread t, Throwable e) 方法中，进行处理，比如把错误信息写入日志、或重启线程、或执行其他修复或诊断。其次要告诉 JVM 当线程抛出异常的时候，回调我们的 uncaughtException 方法，用 setDefaultUncaughtExceptionHandler 来设置默认的 UncaughtExceptionHandler。

2. 给每个线程或线程池单独设置

**run 方法是否可以抛出异常?**
run 方法不能抛出异常，如果运行时发生异常，默认行为是打印异常堆栈，线程停止运行，状态变成 Terminated，但是不影响主线程的运行。

-----

# 8. 线程安全问题

**什么是线程安全**

{% note primary %} 
当多个线程访问一个对象时,如果不用考虑这些线程在运行时环境下的调度和交替执行，也不需要进行额外的同步或者在调用方进行任何其他的协调操作,调用这个对象的行为都可以获得正确的结果，那这个对象是线程安全的。

***Java并发编程实战***
{% endnote %}

“不管业务中遇到怎样的多个线程访问某对象或某方法的情况,而在编程这个业务逻辑的时候,都不需要做任何额外的处理(也就是可以像单线程编程一样) , 程序也可以正常运行(不会因为多线程而出错) , 就可以称为线程安全。”

**主要是两个问题：**

1. 数据争用：同时进行数据的写操作，造成错误数据。
2. 竞争条件：即使不是同时写造成的错误数据，由于顺序原因依然会造成错误，例如在写之前就读取了数据。

**三类线程安全问题：**

1. 运行结果错误（a++ 多线程下出现消失的请求现象，属于 read-modify-write）。

2. 活跃性问题：死锁、活锁、饥饿等。

3. 对象发布和初始化时的安全问题：

   1. 方法返回一个 private 对象

   2. 未完成初始化就把对象提供给外界：

      1. 在构造方法中未初始化完成就 this 赋值

      2. 隐式逸出——注册监听事件

      3. 构造方法中运行线程

## 8.1 线程安全问题演示

### 8.1.1 线程安全问题之一：结果错误

```java
/**
 * 线程安全问题第一种：运行结果出错
 *
 * @author: Song Ningning
 * @date: 2020-05-11 19:24
 */
public class MultiThreadsError1 implements Runnable {

    int index = 0;
    static MultiThreadsError1 instance = new MultiThreadsError1();

    public static void main(String[] args) throws InterruptedException {

        Thread thread1 = new Thread(instance);
        Thread thread2 = new Thread(instance);
        thread1.start();
        thread2.start();
        // 为了让两个线程都执行完后再打印结果
        // 使用 join
        thread1.join();
        thread2.join();
        System.out.println(instance.index);
    }

    @Override
    public void run() {
        for (int i = 0; i < 10000; i++) {
            index++;
        }
    }
}
```

Demo 的逻辑是两个线程分别完成 10000次 `index++` 操作 ，即最后应该输出 20000。但该程序运行后，大概率输出结果是小于 20000。可以由下图分析，首先线程 1 拿到 index，此时 index == 1，线程 1 对其进行加一操作，但是还没有将结果写入index，此时线程 2 拿到了 index，此时 index 还是为 1，线程 2 对其进行加一操作，还没有将结果写入时，又切回了线程 1，最终将 2 写入 index，此时又切换回了线程 2，线程 2 接着上一步，将 2 又一次写入 index。本该是加两次后 index == 3，但实际 index == 2。

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/a++Error.png" width=""/> </div>

### 8.1.2 线程安全问题之二：活跃性问题（死锁、活锁、饥饿）

```java
/**
 * 线程安全问题第二种：演示死锁
 *
 * @author: Song Ningning
 * @date: 2020-05-11 20:50
 */
public class MultiThreadsError2 implements Runnable {

    boolean flag = true;
    static Object o1 = new Object();
    static Object o2 = new Object();

    public static void main(String[] args) {
        MultiThreadsError2 r1 = new MultiThreadsError2();
        MultiThreadsError2 r2 = new MultiThreadsError2();
        r1.flag = true;
        r2.flag = false;
        new Thread(r1).start();
        new Thread(r2).start();

    }

    @Override
    public void run() {
        System.out.println("flag = " + flag);

        if (flag == true) {
            synchronized (o1) {
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (o2) {
                    System.out.println("true");
                }
            }
        }

        if (flag == false) {
            synchronized (o2) {
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                synchronized (o1) {
                    System.out.println("false");
                }
            }
        }
    }
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/deadlock.png" width=""/> </div>

### 8.1.3 线程安全问题之三：对象发布和初始化的时候的安全问题

**对象发布**：使对象能够在当前作用域之外的代码使用。

**对象逸出：**某些不应该发布的对象被发布的情况。

具体有：

1. 方法返回一个private对象 ( private的本意是不让外部访问)。
2. 还未完成初始化(构造函数没完全执行完毕)就把对象提供给外界,比如:
   1. 在构造函数中未初始化完毕就 this 赋值
   2. 隐式逸出——注册监听事件
   3. 构造方法中运行线程

#### 8.1.3.1 对象逸出问题演示

**Demo 1: 方法返回一个 private对象**

```java
/**
 * 方法返回一个 private对象
 *
 * @author: Song Ningning
 * @date: 2020-05-12 8:28
 */
public class MultiThreadsError3 {

    private Map<String, String> states;

    public MultiThreadsError3() {
        states = new HashMap<>();
        states.put("1", "周一");
        states.put("2", "周二");
        states.put("3", "周三");
        states.put("4", "周四");
    }

    // 此处 getStates 直接将 private 类型的 states 直接发布了出去
    // 使得外界可以对其进行修改
    public Map<String, String> getStates() {
        return states;
    }

    public static void main(String[] args) {
        MultiThreadsError3 m = new MultiThreadsError3();
        Map<String, String> states = m.getStates();
        System.out.println(states.get("1"));  // 周一
        states.remove("1");
        System.out.println(states.get("1"));  // null
    }
}
```

**Demo 2: 在构造函数中未初始化完毕就 this 赋值**

```java
/**
 * 初始化未完毕，就 this 赋值
 *
 * @author: Song Ningning
 * @date: 2020-05-12 8:45
 */
public class MultiThreadsError4 {

    static Point point;

    public static void main(String[] args) throws InterruptedException {
        new PointMaker().start();
        Thread.sleep(20); // Point{x=1, y=0}
        // Thread.sleep(200);  // Point{x=1, y=1}
        if (point != null) {
            System.out.println(point);
        }
    }
}

class Point {
    private final int x, y;

    public Point(int x, int y) throws InterruptedException {
        this.x = x;
        MultiThreadsError4.point = this;
        Thread.sleep(50);
        this.y = y;
    }

    @Override
    public String toString() {
        return "Point{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }
}

class PointMaker extends Thread {
    @Override
    public void run() {
        try {
            new Point(1, 1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

在 Point 的构造方法中，还没有对 y 完成赋值，就将 this 赋值给静态变量 point。造成主函数中，等待时间不同，发布的 point 不同。

**Demo 3：隐式逸出——注册监听事件**

```java
/**
 * 隐式逸出——注册监听事件
 *
 * @author: Song Ningning
 * @date: 2020-05-12 9:22
 */
public class MultiThreadsError5 {

    int count;

    public MultiThreadsError5(MySource source) {
        // 注册监听器
        source.registerListener(new EventListener() {
            @Override
            public void onEvent(Event e) {
                // 打印出当前 count 值
                System.out.println("\n得到的数字是" + count);
            }
        });
        for (int i = 0; i < 10000; i++) {
            System.out.print(i + " ");
        }
        // 将 count 赋值为 100
        count = 100;
    }

    public static void main(String[] args) {
        MySource mySource = new MySource();
        // 利用子线程触发监听器
        new Thread(new Runnable() {
            @Override
            public void run() {
                // 10 ms 之后触发监听器
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                mySource.eventCome(new Event() {});
            }
        }).start();
        // 初始化
        MultiThreadsError5 multiThreadsError5 = new MultiThreadsError5(mySource);
    }

    static class MySource {
        private EventListener listener;
        void registerListener(EventListener eventListener) {
            this.listener = eventListener;
        }
        void eventCome(Event e) {
            if (listener != null) {
                listener.onEvent(e);
            } else {
                System.out.println("未初始化完毕");
            }
        }
    }

    interface EventListener {
        void onEvent(Event e);
    }

    interface Event {}
}
```

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures@master/Concurrency/MultiThreadsError5.png" width=""/> </div>

在构造方法中注册了监听器时，EventListener 是匿名内部类，而在其内部的 onEvent 方法中已经持有了外部类的引用，此时，由于构造方法还未完成对 count 的初始化，因此 onEvent 方法中会打印出 count 为 0。

**Demo 4：构造方法中运行线程**

```java
/**
 * 构造方法中新建线程
 *
 * @author: Song Ningning
 * @date: 2020-05-12 10:13
 */
public class MultiThreadsError6 {
    private Map<String, String> states;

    public MultiThreadsError6() {
        new Thread(new Runnable() {
            @Override
            public void run() {
                states = new HashMap<>();
                states.put("1", "周一");
                states.put("2", "周二");
                states.put("3", "周三");
                states.put("4", "周四");
            }
        }).start();
    }

    public Map<String, String> getStates() {
        return states;
    }

    public static void main(String[] args) throws InterruptedException {
        MultiThreadsError6 multiThreadsError6 = new MultiThreadsError6();
        // Thread.sleep(1000);
        System.out.println(multiThreadsError6.getStates().get("1"));
    }
}
```

在构造方法中运行子线程，完成初始化，但子线程执行完 run 方法需要时间，所以在获取 map 中数据时，由于实际上未完成初始化工作，会造成空指针异常。如果在获取数据之前等待一段时间，是可以正确获取到。

## 8.2 各种需要考虑线程安全的情况

1. 访问**共享**的变量或资源，会有并发风险，比如对象的属性、静态变量、共享缓存、数据库等。
2. 所有依赖**时序**的操作，即使每-步操作都是线程安全的，还是存在并发问题: 
   1. read- modify- write 操作: - 一个线程读取了一个共享数据，并在此基础上更新该数据，例如 index++。
   2. check- then- -act 操作:一个线程读取了一个共享数据，并在此基础上决定其下一一个的操作，例如：if 语句。
3. 不同的数据之间存在**捆绑**关系的时候，比如 IP和端口号，必须同时修改或同时不修改。
4. 我们使用**其他类**的时候，如果对方没有声明自己是线程安全的，那么大概率会存在并发问题的隐患。比如 HashMap 没有生命是并发安全的，如果在并发调用 HashMap 时会出错。

## 8.3 多线程性能问题

性能问题有很多体现，比如：服务响应慢、吞吐量降低、资源消耗大等。

### 多线程存在性能问题的原因：

1. 调度：上下文切换

2. 协作：内存同步

### 调度：上下文切换

当某个线程进入阻塞状态时，线程调度器就会阻塞该线程，让另一个等待的线程进入 Runnable 状态，上下文切换时需要挂起某个线程，同时将该线程的状态(上下文)保存在内存中。当线程调度器挂起一个线程，另一个线程执行时，之前缓存的数据也会失效，CPU 需要重新进行缓存。因此上下文切换以及缓存上的开销会造成性能问题。

为了避免频繁的上下文切换，CPU 设置一个最小执行时间，否则可能上下文切换的性能消耗已经大于程序本身执行的消耗。

当程序频繁地去抢锁或者经常进行 IO 读写等引起频繁阻塞，会导致密集的上下文切换。

### 协作：内存同步

CPU 为了提高处理速度，可能会对指令进行重排序，但多线程环境下，为了数据的正确性，同步手段往往会禁止编译器优化；

JMM 模型规定了主内存和本地内存，多线程为了数据的一致性有时会使各个线程的缓存失效，也会导致性能问题。

---

# 参考资料

- [Java并发核心知识体系精讲](https://coding.imooc.com/class/362.html)