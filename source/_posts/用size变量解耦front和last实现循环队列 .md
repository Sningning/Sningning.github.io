---
title: 用 size 变量解耦 front 和 last 实现循环队列
tags:
  - LeetCode
  - 算法
  - Java
comments: true
categories: 数据结构与算法
abbrlink: 15ce7a39
date: 2020-04-29 15:34:01
---

用数组实现循环队列和双端循环队列，并用`size`变量实现解耦`front`和`last`。

---

<!-- more -->

LeetCode 中 第【[622](https://leetcode-cn.com/problems/design-circular-queue)】题是设计一个循环队列，把题目抄过来：

> 设计你的循环队列实现。 循环队列是一种线性数据结构，其操作表现基于 FIFO（先进先出）原则并且队尾被连接在队首之后以形成一个循环。它也被称为“环形缓冲器”。
>
> 循环队列的一个好处是我们可以利用这个队列之前用过的空间。在一个普通队列里，一旦一个队列满了，我们就不能插入下一个元素，即使在队列前面仍有空间。但是使用循环队列，我们能使用这些空间去存储新的值。
>
> 你的实现应该支持如下操作：
>
> - MyCircularQueue(k): 构造器，设置队列长度为 k 。
> - Front: 从队首获取元素。如果队列为空，返回 -1 。
> - Rear: 获取队尾元素。如果队列为空，返回 -1 。
> - enQueue(value): 向循环队列插入一个元素。如果成功插入则返回真。
> - deQueue(): 从循环队列中删除一个元素。如果成功删除则返回真。
> - isEmpty(): 检查循环队列是否为空。
> - isFull(): 检查循环队列是否已满。

---

之前用数组设计循环队列，里面为了判断元素位置，`front` 和 `last` 两个变量算来算去，很是糊涂。后来看了左程云老师的一节课，里面讲了下用数组实现循环队列，最主要的是，用`size`变量来实现了`front`和`last`两个指针的解耦，很清爽，总结一下。

我们用数组实现循环队列。定义一个数组`arr`来记录数据，定义变量`size`来记录当前数组或者队列的元素个数。

显然，当`size == arr.length`时，队列已经满了，就不能再添加元素了；当`size != arr.length`时，说明还有空位，可以新加元素。所以，我们是**通过`size`和`arr.length`的关系来判断是否能添加元素**。后续的工作就是维护好`size`这个重要的变量。

此外，还需要定义`front`指针和`last`指针。**`front`指针永远指向队列头部的那个元素**；**`last`指针永远指向队尾最后一个元素的后一个位置**，也就是新元素待插入的位置。
<br/>
有了`size`变量后，一切变得简单。

- `enQueue(int value)`操作：因为 last 的位置就是新元素待插入的位置，因此直接将新元素放到last位置，维护 size。那么怎样维护 last 指针呢？有两种情况：
  
  - 情况 1：last 当前指向的不是数组最后一个位置，即 `last != arr.length - 1`，此时，直接 last++ 就好；

  - 情况 2：last 当前指向数组最后一个位置，即 `last == arr.length - 1`，此时，last 再往后的话就越界了，所以要从头开始，即 last = 0。
  
 <br/>   
  
- `deQueue()`操作：因为front指针指的就是队首元素，所以我们只需要后移 front 指针就可以实现出队操作，同时维护 size。这时也有两种情况：
  
  - 情况 1：front 不在数组最后位置，因为不在最后，所以可以放心的执行 front++；
  
  - 情况 2：front 位于数组最后位置，即`front==arr.length - 1`，这时，front 后移的操作变成了 front 回到数组第一个位置，即`front = 0`。
  
 <br/>
 
- `Front()`操作：很简单，因为 front 指针永远指向队首元素，所以返回`arr[front]`即可。

<br/>

- `Rear()`操作：因为 last 并不是指向队尾元素，而是队尾元素后面那个位置，所以需要判断下 last 当前的位置是不是在数组的第一个位置，如果是，那么队尾元素就是数组最后一个元素；否则直接返回 last 前面那个元素即可。

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures/02-Stacks-and-Queues/CircularQueue.gif" width=""/> </div>

这样思考的话，写代码就比较容易了。

```java
class Solution {

    private int[] arr;
    private int size;
    private int front;
    private int last;

    /** Initialize your data structure here. Set the size of the queue to be k. */
    public MyCircularQueue(int k) {
        if (k < 0) {
            throw new IllegalArgumentException("Queue size is less than 0!");
        }
        this.arr = new int[k];
        this.size = 0;
        this.front = 0;
        this.last = 0;
    }

    /** Insert an element into the circular queue. Return true if the operation is successful. */
    public boolean enQueue(int value) {
        if (size == arr.length) {
            return false;
        }
        arr[last] = value;
        size ++;
        last = last == arr.length - 1 ? 0 : last + 1;
        return true;
    }

    /** Delete an element from the circular queue. Return true if the operation is successful. */
    public boolean deQueue() {
        if (size == 0) {
            return false;
        }
        front = front == arr.length - 1 ? 0 : front + 1;
        size--;
        return true;
    }

    /** Get the front item from the queue. */
    public int Front() {
        if (size == 0) {
            return -1;
        }
        return arr[front];
    }

    /** Get the last item from the queue. */
    public int Rear() {
        if (size == 0) {
            return -1;
        }
        return last == 0 ? arr[arr.length - 1] : arr[last - 1];
    }

    /** Checks whether the circular queue is empty or not. */
    public boolean isEmpty() {
        return size == 0;
    }

    /** Checks whether the circular queue is full or not. */
    public boolean isFull() {
        return size == arr.length;
    }

}
```

---

【[641](https://leetcode-cn.com/problems/design-circular-deque/)】题也是设计一个循环队列，不过是双端循环队列，即在队列两头都可以删除或添加元素。把题目抄过来：

> 设计实现双端队列。
> 你的实现需要支持以下操作：
>
> - MyCircularDeque(k)：构造函数,双端队列的大小为k。
> - insertFront()：将一个元素添加到双端队列头部。 如果操作成功返回 true。
> - insertLast()：将一个元素添加到双端队列尾部。如果操作成功返回 true。
> - deleteFront()：从双端队列头部删除一个元素。 如果操作成功返回 true。
> - deleteLast()：从双端队列尾部删除一个元素。如果操作成功返回 true。
> - getFront()：从双端队列头部获得一个元素。如果双端队列为空，返回 -1。
> - getRear()：获得双端队列的最后一个元素。 如果双端队列为空，返回 -1。
> - isEmpty()：检查双端队列是否为空。
> - isFull()：检查双端队列是否满了。



可以看出来总体思路和 622 题差不多，多了`insertFront()`和`deleteLast()`两个方法。剩下的方法实现照搬 622 题。

我们还是通过`size`和`arr.length`的关系来判断是否能添加或者删除元素，实现 front 和 last 的解耦。

- `insertFront()`操作：由于 front 是队首元素的位置，要在队首插入元素，就是要在 front 前面一个位置插入元素，这时候还是两种情况：
  - 情况 1：front 不是指向数组第一个位置，这时候直接将新元素插入到 front - 1 位置即可，然后 front--，同时维护 size；
  - 情况 2：front 指向数组最后一个位置，此时，要插入的元素位置应该是数组最后位置，即`arr.length - 1`位置，然后维护 front 和 size。

<br/>

- `deleteLast()`操作：由于 last 指向队尾元素的后一个位置，所以从队尾删除元素，就是删除 last 前面那个元素，两种情况：
  - 情况 1：last 不是指向数组第一个位置，此时直接维护 last-- 即可；
  - 情况 2：last 指向数组第一个位置，这是 last 前面的元素就是数组最后一个位置的元素，这是，只需让 last 指向数组最后一个位置即可。

直接上代码：
```java
class Solution {

    int[] arr;
    int size;
    int front;
    int last;

    /** Initialize your data structure here. Set the size of the deque to be k. */
    public MyCircularDeque(int k) {
        if (k < 0) {
            throw new IllegalArgumentException("Deque size is less than 0!");
        }
        this.arr = new int[k];
        this.size = 0;
        this.front = 0;
        this.last = 0;
    }

    /** Adds an item at the front of Deque. Return true if the operation is successful. */
    public boolean insertFront(int value) {
        if (size == arr.length) {
            return false;
        }
        if (front == 0) {
            arr[arr.length - 1] = value;
            front = arr.length - 1;
        } else {
            arr[--front] = value;
        }
        size ++;
        return true;
    }

    /** Adds an item at the rear of Deque. Return true if the operation is successful. */
    public boolean insertLast(int value) {
        if (size == arr.length) {
            return false;
        }
        arr[last] = value;
        size ++;
        last = last == arr.length - 1 ? 0 : last + 1;
        return true;
    }

    /** Deletes an item from the front of Deque. Return true if the operation is successful. */
    public boolean deleteFront() {
        if (size == 0) {
            return false;
        }
        front = front == arr.length - 1 ? 0 : front + 1;
        size--;
        return true;
    }

    /** Deletes an item from the rear of Deque. Return true if the operation is successful. */
    public boolean deleteLast() {
        if (size == 0) {
            return false;
        }
        if (last == 0) {
            last = arr.length - 1;
        } else {
            last --;
        }
        size --;
        return true;
    }

    /** Get the front item from the deque. */
    public int getFront() {
        if (size == 0) {
            return -1;
        }
        return arr[front];
    }

    /** Get the last item from the deque. */
    public int getRear() {
        if (size == 0) {
            return -1;
        }
        return last == 0 ? arr[arr.length - 1] : arr[last - 1];
    }

    /** Checks whether the circular deque is empty or not. */
    public boolean isEmpty() {
        return size == 0;
    }

    /** Checks whether the circular deque is full or not. */
    public boolean isFull() {
        return size == arr.length;
    }

}
```