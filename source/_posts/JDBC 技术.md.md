---
title: JDBC 技术
tags:
  - JDBC
  - Java
  - 数据库
comments: true
categories: 数据库
abbrlink: 17d7368a
date: 2020-04-08 14:28:49
---

Java 数据库连接，（Java Database Connectivity，简称JDBC）是 Java 语言中用来规范客户端程序如何来访问数据库的应用程序接口，提供了诸如查询和更新数据库中数据的方法。JDBC是面向关系型数据库的。
<!-- more -->


# 1. JDBC 概述


## 1.1 Java 中的数据存储技术

在 Java中，数据库存取技术可分为如下几类：
- JDBC 直接访问数据库
- JDO (Java Data Object )技术
- 第三方 O/R 工具，如 Hibernate, Mybatis 等

JDO、Hibernate、MyBatis 等更好的封装了 JDBC。


## 1.2 JDBC 介绍

JDBC(Java Database Connectivity)是一个**独立于特定数据库管理系统、通用的 SQL 数据库存取和操作的公共接口**（一组API），定义了用来访问数据库的标准Java类库，使用这些类库可以以一种**标准**的方法、方便地访问数据库资源。

JDBC为访问不同的数据库提供了一种**统一的途径**，为开发者屏蔽了一些细节问题。

使用 JDBC 可以连接任何**提供了JDBC驱动程序**的数据库系统，这样就使得程序员无需对特定的数据库系统的特点有过多的了解，从而大大简化和加快了开发过程。

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures/JDBC/jdbc.png" width="800"/> </div>


## 1.3 JDBC 体系结构

JDBC接口（API）包括两个层次：
- **面向应用的 API**：Java API，抽象接口，供应用程序开发人员使用（连接数据库，执行SQL语句，获得结果）。

- **面向数据库的 API**：Java Driver API，供开发商开发数据库驱动程序用。


> **JDBC 是 Sun 公司提供一套用于数据库操作的接口，程序员只需要面向这套接口编程即可。不同的数据库厂商，需要针对这套接口，提供不同实现。不同的实现的集合，即为不同数据库的驱动。——面向接口编程**


## 1.4 JDBC 程序编写步骤

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures/JDBC/flowchart.jpg" width="450"/> </div>

---

# 2. 获取数据库连接

四个要素：Driver 接口实现类、URL、用户名、密码。



```java
@Test
public void getConnection() throws Exception{

    // 1.读取配置文件中的 4 个基本信息
    InputStream is = ConnectionTest.class.getClassLoader().getResourceAsStream("jdbc.properties");
    BufferedInputStream bis = new BufferedInputStream(is);
    Properties pros = new Properties();
    pros.load(bis);

    String user = pros.getProperty("user");
    String password = pros.getProperty("password");
    String url = pros.getProperty("url");
    String driverClass = pros.getProperty("driverClass");

    // 2.加载驱动
    Class.forName(driverClass);

    // 3.获取连接
    Connection conn = DriverManager.getConnection(url, user, password);
    System.out.println(conn);
}
```

其中，配置文件声明在工程的src目录下：【jdbc.properties】

```properties
user=root
password=admin
url=jdbc:mysql://localhost:3306/test
driverClass=com.mysql.jdbc.Driver
```


{% note primary %} 
**使用配置文件的好处：**
① 实现了代码和数据的分离，如果需要修改配置信息，直接在配置文件中修改，不需要深入代码
② 如果修改了配置信息，省去重新编译的过程。
{% endnote %}

获取连接和关闭资源是常用操作，将其包装为一个工具类：JDBCUtils.java

```java
/**
 * 操作数据库的工具类
 *
 * @Classname: JDBCUtils
 * @Description:
 * @Author: Song Ningning
 * @Date: 2020-04-05 18:22
 */
public class JDBCUtils {

    private JDBCUtils() {}

    /**
     * 获取数据库连接
     *
     * @Description:
     * @param:
     * @return: java.sql.Connection
     * @Author: Song Ningning
     * @Date: 2020-04-05 18:33
     */
    public static Connection getConnection() throws Exception {

        // 1. 读取配置文件中的 4 个基本信息
        InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("jdbc.properties");
        BufferedInputStream bis = new BufferedInputStream(is);
        Properties properties = new Properties();
        properties.load(bis);

        String user = properties.getProperty("user");
        String password = properties.getProperty("password");
        String url = properties.getProperty("url");
        String driverClass = properties.getProperty("driverClass");

        // 2. 加载驱动
        Class.forName(driverClass);

        // 3. 获取连接
        Connection conn = DriverManager.getConnection(url, user, password);

        return conn;
    }


    /**
     * 关闭 Connection 和 Statement 的操作
     *
     * @Description: 直接将 Statement 关闭，PreparedStatement 也会一起关闭
     * @param: connection
     * @param: statement
     * @return: void
     * @Author: Song Ningning
     * @Date: 2020-04-05 18:37
     */
    public static void closeResourse(Connection conn, Statement ps) {

        try {
            if (conn != null) {
                conn.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        try {
            if (ps != null) {
                ps.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


    /**
     * 关闭 Connection, Statement, ResultSet 的操作
     *
     * @Description:
     * @param: connection
     * @param: statement
     * @param: resultSet
     * @return: void
     * @Author: Song Ningning
     * @Date: 2020-04-05 22:09
     */
    public static void closeResourse(Connection conn, Statement ps, ResultSet rs) {

        try {
            if (conn != null) {
                conn.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        try {
            if (ps != null) {
                ps.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        try {
            if (rs != null) {
                rs.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

}
```

---

# 3. 使用 PreparedStatement 实现 CRUD 操作


## 3.1 操作和访问数据库

数据库连接被用于向数据库服务器发送命令和 SQL 语句，并接受数据库服务器返回的结果。一个数据库连接就是一个Socket连接。

在 java.sql 包中有 3 个接口分别定义了对数据库的调用的不同方式：
- Statement：用于执行静态 SQL 语句并返回它所生成结果的对象。 
- PreparedStatement：SQL 语句被预编译并存储在此对象中，可以使用此对象多次高效地执行该语句。
- CallableStatement：用于执行 SQL 存储过程


## 3.2 使用 Statement 操作数据表的弊端

通过调用 Connection 对象的 createStatement() 方法创建该对象。该对象用于执行静态的 SQL 语句，并且返回执行结果。

Statement 接口中定义了下列方法用于执行 SQL 语句：

| 方法 | 说明 |
| :--: | :--:|
| int excuteUpdate(String sql) | 执行更新操作 INSERT、UPDATE、DELETE |
| ResultSet executeQuery(String sql) | 执行查询操作 SELECT |


但是使用 Statement 操作数据表存在弊端：
- **问题一：存在拼串操作，繁琐**
- **问题二：存在 SQL 注入问题**
  - SQL 注入是利用某些系统没有对用户输入的数据进行充分的检查，而在用户输入数据中注入非法的 SQL 语句段或命令(如：SELECT user, password FROM user_table WHERE user='a' OR 1 = ' AND password = ' OR '1' = '1') ，从而利用系统的 SQL 引擎完成恶意行为的做法。
  - 对于 Java 而言，要防范 SQL 注入，只要用 PreparedStatement(从Statement扩展而来) 取代 Statement 就可以了。



## 3.3 PreparedStatement 的使用


### 3.3.1 PreparedStatement 介绍

可以通过调用 Connection 对象的 `preparedStatement(String sql)` 方法获取 PreparedStatement 对象

**PreparedStatement 接口是 Statement 的子接口，它表示一条预编译过的 SQL 语句。**
> An object that represents a precompiled SQL statement. 

PreparedStatement 对象所代表的 SQL 语句中的参数用问号(?)来表示，调用 PreparedStatement 对象的 setXxx() 方法来设置这些参数. setXxx() 方法有两个参数，第一个参数是要设置的 SQL 语句中的参数的索引(从 1 开始)，第二个是设置的 SQL 语句中的参数的值。



### 3.3.2 PreparedStatement vs Statement


PreparedStatement 能最大可能提高性能：
- DBServer 会对**预编译**语句提供性能优化。因为预编译语句有可能被重复调用，所以<u>语句在被DBServer的编译器编译后的执行代码被缓存下来，那么下次调用时只要是相同的预编译语句就不需要编译，只要将参数直接传入编译过的语句执行代码中就会得到执行。</u>
- 在 Statement 语句中,即使是相同操作但因为数据内容不一样,所以整个语句本身不能匹配,没有缓存语句的意义.事实是没有数据库会对普通语句编译后的执行代码缓存。这样<u>每执行一次都要对传入的语句编译一次。</u>
- (语法检查，语义检查，翻译成二进制命令，缓存)

PreparedStatement 可以防止 SQL 注入。



### 3.3.3 Java 与 SQL 对应数据类型转换表


|      Java 类型      |           SQL 类型       |
| :----------------: | :----------------------: |
| boolean            | BIT                      |
| byte               | TINYINT                  |
| short              | SMALLINT                 |
| int                | INTEGER                  |
| long               | BIGINT                   |
| String             | CHAR,VARCHAR,LONGVARCHAR |
| byte   array       | BINARY, VAR BINARY       |
| java.sql.Date      | DATE                     |
| java.sql.Time      | TIME                     |
| java.sql.Timestamp | TIMESTAMP                |



### 3.3.4 使用 PreparedStatement 实现增、删、改操作


```java
// 通用的增删改操作

public static void update(String sql, Object ... args) { 

    Connection conn = null;
    PreparedStatement ps = null;

    try {
        //1.获取数据库的连接
        conn = JDBCUtils.getConnection();

        //2.预编译sql语句，返回PreparedStatement的实例
        ps = conn.prepareStatement(sql);

        //3.填充占位符
        for (int i = 0; i < args.length; i++) {
            ps.setObject(i + 1, args[i]);
        }

        //4.执行
        ps.executeUpdate();

    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        //5.资源的关闭
        JDBCUtils.closeResourse(conn, ps);
    }
}
```


### 3.3.5 使用 PreparedStatement 实现查询操作


```java
// 针对于不同的表的通用的查询操作，返回表中的一条记录

public <T> T getInstance(Class<T> cls, String sql, Object ... args) {

    Connection conn = null;
    PreparedStatement ps = null;
    ResultSet rs = null;

    try {
        // 1.获取数据库的连接
        conn = JDBCUtils.getConnection();

        // 2.预编译sql语句，返回PreparedStatement的实例
        ps = conn.prepareStatement(sql);

        // 3.填充占位符
        for (int i = 0; i < args.length; i++) {
            ps.setObject(i + 1, args[i]);
        }

        // 4.执行,并返回结果集
        rs = ps.executeQuery();

        // 5.处理结果集

        ResultSetMetaData metaData = rs.getMetaData();

        int columnCount = metaData.getColumnCount();

        if (rs.next()) {

            T t = cls.newInstance();
            for (int i = 0; i < columnCount; i++) {

                Object columValue = rs.getObject(i + 1);
                String columnLabel = metaData.getColumnLabel(i + 1);
                Field field = cls.getDeclaredField(columnLabel);
                field.setAccessible(true);
                field.set(t, columValue);
            }

            return t;
        }
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        JDBCUtils.closeResourse(conn, ps, rs);
    }

    return null;
}
```

```java
// 针对于不同的表的通用的查询操作，返回记录组成的 List

public <T> List<T> getForList(Class<T> cls, String sql, Object ... args) {

    Connection conn = null;
    PreparedStatement ps = null;
    ResultSet rs = null;

    try {
        // 1.获取数据库的连接
        conn = JDBCUtils.getConnection();

        // 2.预编译sql语句，返回PreparedStatement的实例
        ps = conn.prepareStatement(sql);

        // 3.填充占位符
        for (int i = 0; i < args.length; i++) {
            ps.setObject(i + 1, args[i]);
        }

        // 4.执行,并返回结果集
        rs = ps.executeQuery();

        // 5.处理结果集

        ResultSetMetaData metaData = rs.getMetaData();

        int columnCount = metaData.getColumnCount();

        ArrayList<T> list = new ArrayList<>();
        while (rs.next()) {

            T t = cls.newInstance();
            for (int i = 0; i < columnCount; i++) {

                Object columValue = rs.getObject(i + 1);
                String columnLabel = metaData.getColumnLabel(i + 1);
                Field field = cls.getDeclaredField(columnLabel);
                field.setAccessible(true);
                field.set(t, columValue);
            }
            list.add(t);
        }
        return list;

    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        JDBCUtils.closeResourse(conn, ps, rs);
    }

    return null;
}
```


## 3.4 ResultSet 与 ResultSetMetaData


### 3.4.1 ResultSet


查询需要调用 PreparedStatement 的 executeQuery() 方法，查询结果是一个ResultSet 对象。

ResultSet 对象以逻辑表格的形式封装了执行数据库操作的结果集，ResultSet 接口由数据库厂商提供实现。

ResultSet 返回的实际上就是一张数据表。有一个指针指向数据表的第一条记录的前面。

ResultSet 对象维护了一个指向当前数据行的**游标**，初始的时候，游标在第一行之前，可以通过 ResultSet 对象的 next() 方法移动到下一行。调用 next()方法检测下一行是否有效。若有效，该方法返回 true，且指针下移。相当于Iterator对象的 hasNext() 和 next() 方法的结合体。

当指针指向一行时, 可以通过调用 getXxx(int index) 或 getXxx(int columnName) 获取每一列的值。
- 例如: getInt(1), getString("name")
- **注意：Java 与数据库交互涉及到的相关 Java API 中的索引都从1开始。**

ResultSet 接口的常用方法：
  - boolean next()
  - getString()
  - …
<br>


### 3.4.2 ResultSetMetaData


可用于获取关于 ResultSet 对象中列的类型和属性信息的对象。

ResultSetMetaData rsmd = rs.getMetaData();

ResultSetMetaData 中的部分抽象方法：

| 方法 | 描述 |
| :--: | :--: |
| String **getColumnName**(int column) | 获取指定列的名称 |
| String **getColumnLabel**(int column) | 获取指定列的别名 |
| int **getColumnCount**() | 返回当前 ResultSet 对象中的列数 |
| String getColumnTypeName(int column) | 检索指定列的数据库特定的类型名称 |
| int getColumnDisplaySize(int column) | 指示指定列的最大标准宽度，以字符为单位 |
| int **isNullable**(int column) | 指示指定列中的值是否可以为 null |
| boolean isAutoIncrement(int column) | 指示是否自动为指定列进行编号，这样这些列仍然是只读的 |

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures/JDBC/ResultSetMetaData.png" width=""/> </div><br>

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures/JDBC/step.png
" width=""/> </div>



## 3.5 资源的释放


- 释放 ResultSet, Statement,Connection。
- 数据库连接（Connection）用完后必须马上释放，如果 Connection 不能及时正确的关闭将导致系统宕机。Connection 的使用原则是**尽量晚创建，尽量早的释放。**
- 可以在 finally 中关闭，保证及时其他代码出现异常，资源也一定能被关闭。



## 3.6 小结


两种思想
- 面向接口编程的思想

- ORM 思想(object relational mapping)
  - 一个数据表对应一个 Java 类
  - 表中的一条记录对应 Java 类的一个对象
  - 表中的一个字段对应 Java 类的一个属性

  > sql 是需要结合列名和表的属性名来写。注意起别名。

两种技术
- JDBC结果集的元数据：ResultSetMetaData
  - 获取列数：getColumnCount()
  - 获取列的别名：getColumnLabel()
- 通过反射，创建指定类的对象，获取指定的属性并赋值

---


# 4. 操作 BLOB 类型字段


## 4.1 MySQL BLOB 类型

MySQL中，BLOB 是一个二进制大型对象，是一个可以存储大量数据的容器，它能容纳不同大小的数据。插入BLOB类型的数据必须使用 PreparedStatement，因为 BLOB 类型的数据无法使用字符串拼接写的。

MySQL 的四种 BLOB 类型(除了在存储的最大信息量上不同外，他们是等同的):

| 类型 | 大小(单位:字节) |
| :---: | :---: |
| TinyBlob | 最大 255 |
| Blob | 最大 65K |
| MediumBlob | 最大 16M |
| LongBlob | 最大 4G |


实际使用中根据需要存入的数据大小定义不同的 BLOB 类型。如果存储的文件过大，数据库的性能会下降。

如果在指定了相关的 Blob 类型以后，还报错：xxx too large，那么在 MySQL 的安装目录下，找 my.ini 文件加上如下的配置参数： `max_allowed_packet=16M`。同时注意：修改了my.ini文件之后，需要重新启动 mysql 服务。


## 4.2 向数据表中插入大数据类型


```java
// 向数据表 customers 中插入 Blob 类型的字段
@Test
public void testInsert() {

    Connection conn = null;
    PreparedStatement ps = null;
    BufferedInputStream bis = null;

    try {
        // 获取连接
        conn = JDBCUtils.getConnection();

        String sql = "INSERT INTO customers (cust_name, cust_address, cust_city, cust_photo) VALUES (?, ?, ?, ?)";
        ps = conn.prepareStatement(sql);
        
        // 填充占位符
        ps.setObject(1, "E Fudd");
        ps.setObject(2, "4545 53rd Street");
        ps.setObject(3, "Chicago");

        // 操作 Blob 类型变量
        FileInputStream is = new FileInputStream(new File("Fudd.jpg"));
        bis = new BufferedInputStream(is);
        ps.setBlob(4, bis);

        // 执行
        ps.executeUpdate();
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
    
        // 关闭资源
        try {
            if (bis != null) {
                bis.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        JDBCUtils.closeResourse(conn, ps);
    }
}
```


## 4.3 从数据表中查询大数据类型


```java
//查询数据表 customers 中 Blob 类型的字段

@Test
public void testQuery() {

    Connection conn = null;
    PreparedStatement ps = null;
    ResultSet rs = null;
    InputStream is = null;
    FileOutputStream os = null;
    BufferedInputStream bis = null;
    BufferedOutputStream bos = null;

    try {
        conn = JDBCUtils.getConnection();
        String sql = "SELECT cust_id, cust_name, cust_address, cust_city, cust_photo FROM customers WHERE id = ?";
        ps = conn.prepareStatement(sql);

        ps.setObject(1, 10001);

        rs = ps.executeQuery();

        if (rs.next()) {

            int cust_id = rs.getInt("cust_id");
            String cust_name = rs.getString("cust_name");
            String cust_address = rs.getString("cust_address");
            String cust_city = rs.getString("cust_city");

            Customer customer = new Customer(cust_id, cust_name, cust_address, cust_city);
            System.out.println(customer);

            //将 Blob 类型的字段下载下来，以文件的方式保存在本地
            Blob photo = rs.getBlob("photo");
            is = photo.getBinaryStream();
            os = new FileOutputStream("photo.jpg");

            bis = new BufferedInputStream(is);
            bos = new BufferedOutputStream(os);

            byte[] buffer = new byte[1024];
            int len = 0;

            while ( (len = bis.read(buffer)) != -1 ) {
                bos.write(buffer, 0, len);
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
    } finally {

        try {
            if (bos != null) {
                bos.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            if (bis != null) {
                bis.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        JDBCUtils.closeResourse(conn, ps, rs);
    }
}
```

---

# 5. 批量操作


## 5.1 批量执行 SQL 语句


当需要成批插入或者更新记录时，可以采用 Java 的批量更新机制，这一机制允许多条语句一次性提交给数据库批量处理。通常情况下比单独提交处理效率更高。

JDBC 的批量处理语句包括下面三个方法：
- **addBatch(String)：添加需要批量处理的SQL语句或是参数；**
- **executeBatch()：执行批量处理语句；**
- **clearBatch():清空缓存的数据**

通常会遇到两种批量执行SQL语句的情况：
- 多条SQL语句的批量处理；
- 一个SQL语句的批量传参；



## 5.2 高效的批量插入


向数据表中插入 1000000 条数据

- 数据库中提供一个 goods 表:

```sql
CREATE TABLE goods(
id INT PRIMARY KEY AUTO_INCREMENT,
NAME VARCHAR(20)
);
```
<br>

```java
// 批量插入 1000000 条数据

@Test
public void testInsert3() {

    Connection conn = null;
    PreparedStatement ps = null;
    try {

        long startTime = System.currentTimeMillis();

        conn = JDBCUtils.getConnection();

        // 设置不允许自动提交数据
        conn.setAutoCommit(false);

        String sql = "INSERT INTO goods(name) VALUES (?)";
        ps = conn.prepareStatement(sql);

        for (int i = 1; i <= 1000000; i++) {
            ps.setObject(1, "name_" + i);

            // 1."攒"sql
            ps.addBatch();

            if ( i % 500 == 0 ) {
                // 2.执行batch
                ps.executeBatch();

                // 3.清空batch
                ps.clearBatch();
            }
        }

        // 提交数据
        conn.commit();

        long endTime = System.currentTimeMillis();

        System.out.println("时间为：" + (endTime - startTime) + " ms.");

    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        JDBCUtils.closeResourse(conn, ps);
    }
}
```
---


# 6. 数据库事务


## 6.1 数据库事务介绍


**事务**：一组逻辑操作单元,使数据从一种状态变换到另一种状态。

**事务处理（事务操作）：** 保证所有事务都作为一个工作单元来执行，即使出现了故障，都不能改变这种执行方式。当在一个事务中执行多个操作时，要么所有的事务都被 **提交(commit)**，那么这些修改就永久地保存下来；要么数据库管理系统将放弃所作的所有修改，整个事务 **回滚(rollback)** 到最初状态。

为确保数据库中数据的 **一致性**，数据的操纵应当是离散的成组的逻辑单元：当它全部完成时，数据的一致性可以保持，而当这个单元中的一部分操作失败，整个事务应全部视为错误，所有从起始点以后的操作应全部回退到开始状态。 


## 6.2 JDBC 事务处理


数据一旦提交，就不可回滚。

数据什么时候意味着提交？
- **当一个连接对象被创建时，默认情况下是自动提交事务**：每次执行一个 SQL 语句时，如果执行成功，就会向数据库自动提交，而不能回滚。
- **关闭数据库连接，数据就会自动的提交。** 如果多个操作，每个操作使用的是自己单独的连接，则无法保证事务。即同一个事务的多个操作必须在同一个连接下。

JDBC 程序中为了让多个 SQL 语句作为一个事务执行：

- 调用 Connection 对象的 **setAutoCommit(false);** 以取消自动提交事务
- 在所有的 SQL 语句都成功执行后，调用 **commit();** 方法提交事务
- 在出现异常时，调用 **rollback();** 方法回滚事务

> 若此时 Connection 没有被关闭，还可能被重复使用，则需要恢复其自动提交状态 setAutoCommit(true)。尤其是在使用数据库连接池技术时，执行 close() 方法前，建议恢复自动提交状态。

【案例：用户 AA 向用户 BB 转账100】

```java
public void testJDBCTransaction() {

    Connection conn = null;
    try {
        // 1.获取数据库连接
        conn = JDBCUtils.getConnection();

        // 2.开启事务
        conn.setAutoCommit(false);

        // 3.进行数据库操作
        String sql1 = "UPDATE user_table SET balance = balance - 100 WHERE user = ?";
        update(conn, sql1, "AA");

        // 模拟网络异常
        //System.out.println(10 / 0);

        String sql2 = "UPDATE user_table SET balance = balance + 100 WHERE user = ?";
        update(conn, sql2, "BB");

        // 4.若没有异常，则提交事务
        conn.commit();

    } catch (Exception e) {
        e.printStackTrace();

        // 5.若有异常，则回滚事务
        try {
            conn.rollback();
        } catch (SQLException e1) {
            e1.printStackTrace();
        }
    } finally {

        try {
            // 6.恢复每次DML操作的自动提交功能
            conn.setAutoCommit(true);
        } catch (SQLException e) {
            e.printStackTrace();
        }
        // 7.关闭连接
        JDBCUtils.closeResource(conn, null, null); 
    }  
}
}

```

其中，对数据库操作的方法为：

```java
// 通用的增删改操作---version 2.0(考虑事务)
// 从外部传入 Connection 连接，避免自动关闭连接导致 commit
public static int update(Connection conn, String sql, Object ... args) {

    PreparedStatement ps = null;

    try {
        // 1.预编译sql语句，返回PreparedStatement的实例
        ps = conn.prepareStatement(sql);

        // 2.填充占位符
        for (int i = 0; i < args.length; i++) {
            ps.setObject(i + 1, args[i]);
        }

        // 3.执行
        return ps.executeUpdate();

    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        // 4.关闭资源
        JDBCUtils.closeResourse(null, ps);
    }

    return 0;
}
```


## 6.3 事务的 ACID 属性    


1. **原子性（Atomicity）**
    原子性是指事务是一个不可分割的工作单位，事务中的操作要么都发生，要么都不发生。 

2. **一致性（Consistency）**
    事务必须使数据库从一个一致性状态变换到另外一个一致性状态。

3. **隔离性（Isolation）**
    事务的隔离性是指一个事务的执行不能被其他事务干扰，即一个事务内部的操作及使用的数据对并发的其他事务是隔离的，并发执行的各个事务之间不能互相干扰。

4. **持久性（Durability）**
    持久性是指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来的其他操作和数据库故障不应该对其有任何影响。


### 6.3.1 数据库的并发问题


对于同时运行的多个事务, 当这些事务访问数据库中相同的数据时, 如果没有采取必要的隔离机制, 就会导致各种并发问题:
- **脏读**: 对于两个事务 T1, T2, T1 读取了已经被 T2 更新但还**没有被提交**的字段。之后, 若 T2 回滚, T1读取的内容就是临时且无效的。
- **不可重复读**: 对于两个事务T1, T2, T1 读取了一个字段, 然后 T2 **更新**了该字段。之后, T1再次读取同一个字段, 值就不同了。
- **幻读**: 对于两个事务T1, T2, T1 从一个表中读取了一个字段, 然后 T2 在该表中**插入**了一些新的行。之后, 如果 T1 再次读取同一个表, 就会多出几行。

**数据库事务的隔离性**: 数据库系统必须具有隔离并发运行各个事务的能力, 使它们不会相互影响, 避免各种并发问题。

一个事务与其他事务隔离的程度称为隔离级别。数据库规定了多种事务隔离级别, 不同隔离级别对应不同的干扰程度, **隔离级别越高, 数据一致性就越好, 但并发性越弱。**



### 6.3.2 四种隔离级别


数据库提供的 4 种事务隔离级别：

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures/JDBC/isolation.png" width=""/> </div>

Oracle 支持的 2 种事务隔离级别：**READ COMMITED**, SERIALIZABLE。 Oracle 默认的事务隔离级别为: **READ COMMITED** 。


MySQL 支持 4 种事务隔离级别。MySQL 默认的事务隔离级别为: **REPEATABLE READ。**


### 6.3.3 在 MySQL 中设置隔离级别


每启动一个 MySQL 程序, 就会获得一个单独的数据库连接. 每个数据库连接都有一个全局变量 @@tx_isolation, 表示当前的事务隔离级别。

- 查看当前的隔离级别: 

  ```mysql
  SELECT @@tx_isolation;
  ```

- 设置当前 MySQL 连接的隔离级别:  

  ```mysql
  SET  transaction isolation level read committed;
  ```

- 设置数据库系统的全局的隔离级别:

  ```mysql
  SET global transaction isolation level read committed;
  ```

- 补充操作：

  - 创建 MySQL 数据库用户：

    ```mysql
    create user tom identified by 'abc123';
    ```

  - 授予权限

    ```mysql
    #授予通过网络方式登录的 Jeremy 用户，对所有库所有表的全部权限，密码设为abc123.
    grant all privileges on *.* to Jeremy@'%'  identified by 'abc123'; 
    
     #给 Jeremy 用户使用本地命令行方式，授予atguigudb这个库下的所有表的插删改查的权限。
    grant select,insert,delete,update on atguigudb.* to Jeremy@localhost identified by 'abc123'; 

    ```
---


# 7. DAO 及相关实现类


DAO：Data Access Object访问数据信息的类和接口，包括了对数据的CRUD（Create、Retrival、Update、Delete），而不包含任何业务相关的信息。有时也称作：BaseDAO。

作用：为了实现功能的模块化，更有利于代码的维护和升级。

customers 表的字段
<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures/JDBC/customes.png" width=""/> </div>



层次结构：

<div align="center"> <img src="https://cdn.jsdelivr.net/gh/Sningning/BlogPictures/JDBC/DAO.png" width=""/> </div>

**【BaseDAO.java】**

```java
/**
 * @Classname: BaseDAO
 * @Description: 封装了针对于数据表的通用的操作
 * @Author: Song Ningning
 * @Date: 2020-04-06 22:38
 */
public abstract class BaseDAO<T> {

    private Class<T> cls = null;

    {
        // 获取当前 BaseDAO 的子类继承的父类中的泛型

        Type genericSuperclass = this.getClass().getGenericSuperclass();
        ParameterizedType paramType = (ParameterizedType) genericSuperclass;

        // 获取父类的泛型参数
        Type[] typeArguments = paramType.getActualTypeArguments();
        // 泛型的第一个参数
        cls = (Class<T>) typeArguments[0];
    }


    /**
     * 通用的增删改操作---version 2.0(考虑事务)
     *
     * @Description:
     * @param: conn
     * @param: sql
     * @param: args
     * @return: int
     * @Author: Song Ningning
     * @Date: 2020-04-06 22:42
     */
    public static int update(Connection conn, String sql, Object ... args) {  // sql 中占位符的个数与可变形参的长度相同

        PreparedStatement ps = null;

        try {

            // 1.预编译sql语句，返回PreparedStatement的实例
            ps = conn.prepareStatement(sql);

            // 2.填充占位符
            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }

            // 3.执行
            return ps.executeUpdate();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 4.资源的关闭
            JDBCUtils.closeResourse(null, ps);
        }

        return 0;
    }


    /**
     * 针对于不同的表的通用的查询操作，返回表中的一条记录（version 2.0：考虑事务）
     *
     * @Description:
     * @param: conn
     * @param: cls
     * @param: sql
     * @param: args
     * @return: T
     * @Author: Song Ningning
     * @Date: 2020-04-06 22:01
     */
    public T getInstance(Connection conn, String sql, Object ... args) {

        PreparedStatement ps = null;
        ResultSet rs = null;

        try {

            // 1.预编译sql语句，返回PreparedStatement的实例
            ps = conn.prepareStatement(sql);

            // 2.填充占位符
            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }

            // 3.执行,并返回结果集
            rs = ps.executeQuery();

            // 4.处理结果集

            ResultSetMetaData metaData = rs.getMetaData();

            int columnCount = metaData.getColumnCount();

            if (rs.next()) {

                T t = cls.newInstance();
                for (int i = 0; i < columnCount; i++) {

                    Object columValue = rs.getObject(i + 1);
                    String columnLabel = metaData.getColumnLabel(i + 1);
                    Field field = cls.getDeclaredField(columnLabel);
                    field.setAccessible(true);
                    field.set(t, columValue);
                }

                return t;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 5.关闭资源
            JDBCUtils.closeResourse(null, ps, rs);
        }

        return null;
    }


    /**
     * 针对于不同的表的通用的查询操作，返回记录组成的 List（version 2.0：考虑事务）
     *
     * @Description:
     * @param: cls
     * @param: sql
     * @param: args
     * @return: java.util.List<T>
     * @Author: Song Ningning
     * @Date: 2020-04-06 10:59
     */
    public List<T> getForList(Connection conn, String sql, Object ... args) {

        PreparedStatement ps = null;
        ResultSet rs = null;

        try {
            // 1.预编译 sql 语句，返回 PreparedStatement 的实例
            ps = conn.prepareStatement(sql);

            // 2.填充占位符
            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }

            // 3.执行,并返回结果集
            rs = ps.executeQuery();

            // 4.处理结果集

            ResultSetMetaData metaData = rs.getMetaData();

            int columnCount = metaData.getColumnCount();

            ArrayList<T> list = new ArrayList<>();
            while (rs.next()) {

                T t = cls.newInstance();
                for (int i = 0; i < columnCount; i++) {

                    Object columValue = rs.getObject(i + 1);
                    String columnLabel = metaData.getColumnLabel(i + 1);
                    Field field = cls.getDeclaredField(columnLabel);
                    field.setAccessible(true);
                    field.set(t, columValue);
                }
                list.add(t);
            }
            return list;

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 5.关闭资源
            JDBCUtils.closeResourse(null, ps, rs);
        }

        return null;
    }


    /**
     * 用于查询特殊值的通用的方法
     *
     * @Description:
     * @param: conn
     * @param: sql
     * @param: args
     * @return: E
     * @Author: Song Ningning
     * @Date: 2020-04-07 9:22
     */
    public <E> E getValue(Connection conn, String sql, Object ... args) {

        PreparedStatement ps = null;
        try {
            ps = conn.prepareStatement(sql);

            for (int i = 0; i < args.length; i++) {
                ps.setObject(i + 1, args[i]);
            }

            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return (E) rs.getObject(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            JDBCUtils.closeResourse(null, ps);
        }

        return null;
    }

}
```

**【CustomerDAO.java】**

```java
/**
 * 用于规范针对于 customers 表的常用操作
 * @Classname: CustomerDAO
 * @Description:
 * @Author: Song Ningning
 * @Date: 2020-04-07 9:25
 */
public interface CustomerDAO {

    /**
     * 将cust对象添加到数据库中
     *
     * @Description:
     * @param: conn
     * @param: cust
     * @return: void
     * @Author: Song Ningning
     * @Date: 2020-04-07 9:31
     */
    void insert(Connection conn, Customer cust);


    /**
     * 针对指定的 id，删除表中的一条记录
     *
     * @Description:
     * @param: conn
     * @param: id
     * @return: void
     * @Author: Song Ningning
     * @Date: 2020-04-07 9:40
     */
    void deleteById(Connection conn, int id);


    /**
     * 针对内存中的cust对象，去修改数据表中指定的记录
     *
     * @Description:
     * @param: conn
     * @param: cust
     * @return: void
     * @Author: Song Ningning
     * @Date: 2020-04-07 9:38
     */
    void update(Connection conn, Customer cust);


    /**
     * 针对指定的id查询得到对应的Customer对象
     *
     * @Description:
     * @param: conn
     * @param: id
     * @return: Customers
     * @Author: Song Ningning
     * @Date: 2020-04-07 9:37
     */
    Customer getCustomerById(Connection conn, int id);


    /**
     * 查询表中的所有记录构成的集合
     *
     * @Description:
     * @param: conn
     * @return: List<Customers>
     * @Author: Song Ningning
     * @Date: 2020-04-07 9:37
     */
    List<Customer> getAll(Connection conn);


    /**
     * 返回数据表中数据的条目数
     *
     * @Description:
     * @param: conn
     * @return: Long
     * @Author: Song Ningning
     * @Date: 2020-04-07 9:36
     */
    Long getCount(Connection conn);


    /**
     * 返回数据表中最大的生日
     *
     * @Description:
     * @param: conn
     * @return: Date
     * @Author: Song Ningning
     * @Date: 2020-04-07 9:36
     */
    Date getMaxBirth(Connection conn);

}
```

**【CustomerDAOImpl.java】**

```java
/**
 * @Classname: CustomerDAOImpl
 * @Description: TODO
 * @Author: Song Ningning
 * @Date: 2020-04-07 9:57
 */
public class CustomerDAOImpl extends BaseDAO<Customer> implements CustomerDAO {

    @Override
    public void insert(Connection conn, Customer cust) {

        String sql = "INSERT INTO customers (name, email, birth) VALUES (?, ?, ?)";
        update(conn, sql, cust.getName(), cust.getEmail(), cust.getBirth());
    }

    @Override
    public void deleteById(Connection conn, int id) {

        String sql = "DELETE FROM customers WHERE id = ?";
        update(conn, sql,id);
    }

    @Override
    public void update(Connection conn, Customer cust) {

        String sql = "UPDATE customers SET name = ?, email = ?, birth = ? WHERE id = ?";
        update(conn, sql, cust.getName(), cust.getEmail(), cust.getBirth(), cust.getId());
    }

    @Override
    public Customer getCustomerById(Connection conn, int id) {

        String sql = "SELECT id, name, email, birth FROM customers WHERE id = ?";
        return getInstance(conn, sql, id);
    }

    @Override
    public List<Customer> getAll(Connection conn) {

        String sql = "SELECT id, name, email, birth FROM customers";
        return getForList(conn, sql);
    }

    @Override
    public Long getCount(Connection conn) {

        String sql = "SELECT COUNT(*) FROM customers";
        return getValue(conn, sql);
    }

    @Override
    public Date getMaxBirth(Connection conn) {

        String sql = "SELECT MAX(birth) FROM customers";
        return getValue(conn, sql);
    }
}
```
---


# 8. 数据库连接池


## 8.1 JDBC 数据库连接池的必要性


在使用开发基于数据库的 web 程序时，传统的模式基本是按以下步骤：　　
- **在主程序（如servlet、beans）中建立数据库连接**
- **进行 sql 操作**
- **断开数据库连接**

这种模式开发，存在的问题:
  - 普通的 JDBC 数据库连接使用 DriverManager 来获取，每次向数据库建立连接的时候都要将 Connection 加载到内存中，再验证用户名和密码(得花费0.05s～1s的时间)。需要数据库连接的时候，就向数据库要求一个，执行完成后再断开连接。这样的方式将会消耗大量的资源和时间。 **数据库的连接资源并没有得到很好的重复利用。** 若同时有几百人甚至几千人在线，频繁的进行数据库连接操作将占用很多的系统资源，严重的甚至会造成服务器的崩溃。
  - **对于每一次数据库连接，使用完后都得断开。** 否则，如果程序出现异常而未能关闭，将会导致数据库系统中的内存泄漏，最终将导致重启数据库。
  - **这种开发不能控制被创建的连接对象数**，系统资源会被毫无顾及的分配出去，如连接过多，也可能导致内存泄漏，服务器崩溃。 


## 8.2 数据库连接池技术


为解决传统开发中的数据库连接问题，可以采用数据库连接池技术。

- **数据库连接池的基本思想**：就是为数据库连接建立一个“缓冲池”。预先在缓冲池中放入一定数量的连接，当需要建立数据库连接时，只需从“缓冲池”中取出一个，使用完毕之后再放回去。

- **数据库连接池**负责分配、管理和释放数据库连接，它**允许应用程序重复使用一个现有的数据库连接，而不是重新建立一个**。
- 数据库连接池在初始化时将创建一定数量的数据库连接放到连接池中，这些数据库连接的数量是由**最小数据库连接数来设定**的。无论这些数据库连接是否被使用，连接池都将一直保证至少拥有这么多的连接数量。连接池的**最大数据库连接数量**限定了这个连接池能占有的最大连接数，当应用程序向连接池请求的连接数超过最大连接数量时，这些请求将被加入到等待队列中。


**数据库连接池技术的优点:**

* **资源重用**

  由于数据库连接得以重用，避免了频繁创建，释放连接引起的大量性能开销。在减少系统消耗的基础上，另一方面也增加了系统运行环境的平稳性。

* **更快的系统反应速度**

  数据库连接池在初始化过程中，往往已经创建了若干数据库连接置于连接池中备用。此时连接的初始化工作均已完成。对于业务请求处理而言，直接利用现有可用连接，避免了数据库连接初始化和释放过程的时间开销，从而减少了系统的响应时间

* **新的资源分配手段**

  对于多应用共享同一数据库的系统而言，可在应用层通过数据库连接池的配置，实现某一应用最大可用数据库连接数的限制，避免某一应用独占所有的数据库资源

* **统一的连接管理，避免数据库连接泄漏**

  在较为完善的数据库连接池实现中，可根据预先的占用超时设定，强制回收被占用连接，从而避免了常规数据库连接操作中可能出现的资源泄露


## 8.3 多种开源的数据库连接池


JDBC 的数据库连接池使用 javax.sql.DataSource 来表示，DataSource 只是一个接口，该接口通常由服务器(Weblogic, WebSphere, Tomcat)提供实现，也有一些开源组织提供实现：
  - **DBCP** 是Apache提供的数据库连接池。Tomcat 服务器自带dbcp数据库连接池。**速度相对 c3p0 较快**，但因自身存在BUG，Hibernate3已不再提供支持。
  - **C3P0** 是一个开源组织提供的一个数据库连接池，**速度相对较慢，稳定性还可以。**hibernate官方推荐使用。
  - **Proxool** 是 SourceForge下 的一个开源项目数据库连接池，有监控连接池状态的功能，**稳定性较 c3p0 差一点**
  - **BoneCP** 是一个开源组织提供的数据库连接池，速度快。
  - **Druid** 是阿里提供的数据库连接池，监控做的很好。

DataSource 通常被称为数据源，它包含连接池和连接池管理两个部分，习惯上也经常把 DataSource 称为连接池。
**DataSource 用来取代 DriverManager 来获取 Connection，获取速度快，同时可以大幅度提高数据库访问速度。**

目前使用较多的是 Druid。

注意：
  - 数据源和数据库连接不同，数据源无需创建多个，它是产生数据库连接的工厂，因此**整个应用只需要一个数据源即可。**
  - 当数据库访问结束后，程序还是像以前一样关闭数据库连接：conn.close(); 但 conn.close() 并没有关闭数据库的物理连接，它仅仅把数据库连接释放，归还给了数据库连接池。


### 8.3.1 C3P0 数据库连接池


- 获取连接方式一

```java
// 方式一：硬编码，不推荐
public static Connection testGetConnection() throws Exception {

    // 获取 c3p0 数据库连接池
    ComboPooledDataSource cpds = new ComboPooledDataSource();
    cpds.setDriverClass( "com.mysql.jdbc.Driver" );
    cpds.setJdbcUrl( "jdbc:mysql://localhost:3306/test" );
    cpds.setUser("root");
    cpds.setPassword("admin");

    // 通过设置相关的参数，对数据库连接池进行管理：
    // 设置初始时数据库连接池中的连接数
    cpds.setInitialPoolSize(10);

    Connection conn = cpds.getConnection();
    return conn;
}
```

- 获取连接方式二

```java
// 方式二：推荐使用配置文件
ComboPooledDataSource cpds = new ComboPooledDataSource("c3p0");
public static Connection testGetConnection() throws Exception {
    Connection conn = cpds.getConnection();
    return conn;
}
```

其中，src 下的配置文件为：【c3p0-config.xml】

```xml
<?xml version="1.0" encoding="UTF-8"?>
<c3p0-config>
    <named-config name="c3p0">
        <!-- 提供获取连接的 4 个基本信息 -->
        <property name="driverClass">com.mysql.jdbc.Driver</property>
        <property name="jdbcUrl">jdbc:mysql://localhost:3306/test</property>
        <property name="user">root</property>
        <property name="password">admin</property>

        <!-- 进行数据库连接池管理的基本信息 -->
        <!-- 当数据库连接池中的连接数不够时，c3p0 一次性向数据库服务器申请的连接数 -->
        <property name="acquireIncrement">50</property>
        <!-- c3p0 数据库连接池中初始化时的连接数 -->
        <property name="initialPoolSize">10</property>
        <!-- c3p0 数据库连接池维护的最少连接数 -->
        <property name="minPoolSize">10</property>
        <!-- c3p0 数据库连接池维护的最多的连接数 -->
        <property name="maxPoolSize">100</property>

        <!-- c3p0 数据库连接池最多维护的 Statement 的个数 -->
        <property name="maxStatements">50</property>
        <!-- 每个连接中可以最多使用的 Statement 的个数 -->
        <property name="maxStatementsPerConnection">2</property>
    </named-config>
</c3p0-config>
```


### 8.3.2 DBCP 数据库连接池


- DBCP 是 Apache 下的开源连接池实现，该连接池依赖该组织下的另一个开源系统：Common-pool。如需使用该连接池实现，应在系统中增加如下两个 jar 文件：
  - Commons-dbcp.jar：连接池的实现
  - Commons-pool.jar：连接池实现的依赖库
- **Tomcat 的连接池正是采用该连接池来实现的。** 该数据库连接池既可以与应用服务器整合使用，也可由应用程序独立使用。
- 数据源和数据库连接不同，数据源无需创建多个，它是产生数据库连接的工厂，因此整个应用只需要一个数据源即可。
- 当数据库访问结束后，程序还是像以前一样关闭数据库连接：conn.close(); 但上面的代码并没有关闭数据库的物理连接，它仅仅把数据库连接释放，归还给了数据库连接池。


- 获取连接方式一：

```java
// 方式一：硬编码不推荐
public static Connection testGetConnection() throws SQLException {

	// 创建了DBCP的数据库连接池
	BasicDataSource source = new BasicDataSource();

	// 设置基本信息
	source.setDriverClassName( "com.mysql.jdbc.Driver" );
	source.setUrl( "jdbc:mysql://localhost:3306/test" );
	source.setUsername( "root" );
	source.setPassword( "admin" );

	// 还可以设置其他涉及数据库连接池管理的相关属性：
	source.setInitialSize(10);
	source.setMaxActive(10);
	// ...

	Connection conn = source.getConnection();
	return conn;
}
```

- 获取连接方式二：

```java
// 使用 dbcp 数据库连接池的配置文件方式，获取数据库的连接：推荐

private static DataSource source = null;

static {
    try {
        Properties pros = new Properties();
        
        InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("dbcp.properties");
        BufferedInputStream bis = new BufferedInputStream(is);
        
        pros.load(bis);
        
        //根据提供的BasicDataSourceFactory创建对应的DataSource对象
        source = BasicDataSourceFactory.createDataSource(pros);
        
    } catch (Exception e) {
        e.printStackTrace();
    }
}

public static Connection getConnection6() throws Exception {
    Connection conn = source.getConnection();
    return conn;
}
```


其中，src 下的配置文件为：【dbcp.properties】

```properties
driverClassName=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/test
username=root
password=admin

initialSize=10
maxActive=10
#...
```

### 8.3.3 Druid（德鲁伊）数据库连接池


Druid 是阿里巴巴开源平台上一个数据库连接池实现，它结合了C3P0、DBCP、Proxool等DB池的优点，同时加入了日志监控，可以很好的监控DB池连接和SQL的执行情况，可以说是针对监控而生的DB连接池。

```java
public static Connection getConnection() throws Exception {

    InputStream is = ClassLoader.getSystemClassLoader().getResourceAsStream("druid.properties");
    BufferedInputStream bis = new BufferedInputStream(is);

    Properties pros = new Properties();
    pros.load(bis);

    DataSource source = DruidDataSourceFactory.createDataSource(pros);
    Connection conn = source.getConnection();

    return conn;
}
```

其中，src下的配置文件为：【druid.properties】

```java
url=jdbc:mysql://localhost:3306/test
username=root
password=admin
driverClassName=com.mysql.jdbc.Driver

# 根据需要设置参数
initialSize=10
maxActive=10
#...
```
---


# 9. Apache-DBUtils 实现 CRUD 操作


## 9.1 Apache-DBUtils 简介


commons-dbutils 是 Apache 组织提供的一个开源 JDBC工具类库，它是对JDBC的简单封装，学习成本极低，并且使用dbutils能极大简化jdbc编码的工作量，同时也不会影响程序的性能。

API介绍：
  - org.apache.commons.dbutils.QueryRunner
  - org.apache.commons.dbutils.ResultSetHandler
  - 工具类：org.apache.commons.dbutils.DbUtils   



## 9.2 主要 API 的使用


### 9.2.1 DbUtils


DbUtils ：提供如关闭连接、装载JDBC驱动程序等常规工作的工具类，里面的所有方法都是静态的。主要方法如下：
- **public static void close(…) throws java.sql.SQLException**：　DbUtils类提供了三个重载的关闭方法。这些方法检查所提供的参数是不是NULL，如果不是的话，它们就关闭Connection、Statement和ResultSet。
- public static void closeQuietly(…): 这一类方法不仅能在Connection、Statement和ResultSet为NULL情况下避免关闭，还能隐藏一些在程序中抛出的SQLEeception。
- public static void commitAndClose(Connection conn)throws SQLException： 用来提交连接的事务，然后关闭连接
- public static void commitAndCloseQuietly(Connection conn)： 用来提交连接，然后关闭连接，并且在关闭连接时不抛出SQL异常。 
- public static void rollback(Connection conn)throws SQLException：允许conn为null，因为方法内部做了判断
- public static void rollbackAndClose(Connection conn)throws SQLException
- rollbackAndCloseQuietly(Connection)
- public static boolean loadDriver(java.lang.String driverClassName)：这一方装载并注册JDBC驱动程序，如果成功就返回true。使用该方法，你不需要捕捉这个异常ClassNotFoundException。


### 9.2.2 QueryRunner 类


该类简单化了SQL查询，它与ResultSetHandler组合在一起使用可以完成大部分的数据库操作，能够大大减少编码量。

QueryRunner类提供了两个构造器：
- 默认的构造器
- 需要一个 javax.sql.DataSource 来作参数的构造器

QueryRunner类的主要方法：
- **更新**
  - public int update(Connection conn, String sql, Object... params) throws SQLException:用来执行一个更新（插入、更新或删除）操作。
  -  ......
- **插入**
  - public <T> T insert(Connection conn,String sql,ResultSetHandler<T> rsh, Object... params) throws SQLException：只支持INSERT语句，其中 rsh - The handler used to create the result object from the ResultSet of auto-generated keys.  返回值: An object generated by the handler.即自动生成的键值
    - ....
- **批处理**
  - public int[] batch(Connection conn,String sql,Object[][] params)throws SQLException： INSERT, UPDATE, or DELETE语句
  - public <T> T insertBatch(Connection conn,String sql,ResultSetHandler<T> rsh,Object[][] params)throws SQLException：只支持INSERT语句
  - .....
- **查询**
  - public Object query(Connection conn, String sql, ResultSetHandler rsh,Object... params) throws SQLException：执行一个查询操作，在这个查询中，对象数组中的每个元素值被用来作为查询语句的置换参数。该方法会自行处理 PreparedStatement 和 ResultSet 的创建和关闭。
    - ...... 


测试

```java
// 测试添加
@Test
void testInsert() {

    Connection conn = null;
    try {
        conn = JDBCUtils.getConnection3();
        String sql = "INSERT INTO customers(name, email, birth) VALUES (?,?,?)";

        QueryRunner runner = new QueryRunner();
        int insertCount = runner.update(conn, sql, "Jerry", "jerry@sina.com", "2002-06-01");

        System.out.println("添加了 " + insertCount + " 条记录");

    } catch (SQLException e) {
        e.printStackTrace();
    } finally {
        JDBCUtils.closeResourse(conn, null);
    }
}
```


### 9.2.3 ResultSetHandler 接口及实现类


该接口用于处理 java.sql.ResultSet，将数据按要求转换为另一种形式。

ResultSetHandler 接口提供了一个单独的方法：Object handle (java.sql.ResultSet .rs)。

接口的主要实现类：

| 实现类 | 描述 |
| :---: | :---: |
| ArrayHandler | 把结果集中的第一行数据转成对象数组 |
| ArrayListHandler | 把结果集中的每一行数据都转成一个数组，再存放到List中 |
| **BeanHandler** | 将结果集中的第一行数据封装到一个对应的JavaBean实例中 |
| **BeanListHandler** | 将结果集中的每一行数据都封装到一个对应的JavaBean实例中，存放到List里 |
| ColumnListHandler | 将结果集中某一列的数据存放到List中 |
| KeyedHandler(name) | 将结果集中的每一行数据都封装到一个Map里，再把这些map再存到一个map里，其key为指定的key |
| **MapHandler** | 将结果集中的第一行数据封装到一个Map里，key是列名，value就是对应的值 |
| **MapListHandler：** | 将结果集中的每一行数据都封装到一个Map里，然后再存放到List |
| **ScalarHandler：** | 查询单个值对象 |


测试

```java
/*
 * 测试查询:查询一条记录
 * 
 * 使用 ResultSetHandler 的实现类：BeanHandler
 */
@Test
void testQuery1() {

    Connection conn = null;
    try {
        conn = JDBCUtils.getConnection();
        QueryRunner runner = new QueryRunner();

        String sql = "SELECT id, name, email, birth FROM customers WHERE id = ?";
        BeanHandler<Customer> handler = new BeanHandler<>(Customer.class);
        Customer customer = runner.query(conn, sql, handler, 10);

        System.out.println(customer);

    } catch (SQLException e) {
        e.printStackTrace();
    } finally {
        JDBCUtils.closeResourse(conn, null);
    }
}
```

```java
/*
 * 测试查询:查询多条记录构成的 List
 * 
 * 使用 ResultSetHandler 的实现类：BeanListHandler
 */
@Test
void testQuery2() throws SQLException {

    Connection conn = null;
    try {
        conn = JDBCUtils.getConnection();
        QueryRunner runner = new QueryRunner();

        String sql = "SELECT id, name, email, birth FROM customers WHERE id < ?";
        BeanListHandler<Customer> handler = new BeanListHandler<>(Customer.class);
        List<Customer> customers = runner.query(conn, sql, handler, 10);

        customers.forEach(System.out::println);

    } catch (SQLException e) {
        e.printStackTrace();
    } finally {
        JDBCUtils.closeResourse(conn, null);
    }
}
```

```java
/*
 * 测试查询:查询一条记录
 * 使用 ResultSetHandler 的实现类：MapHander
 */
@Test
void testQuery3() {

    Connection conn = null;
    try {
        conn = JDBCUtils.getConnection();
        QueryRunner runner = new QueryRunner();

        String sql = "SELECT id, name, email, birth FROM customers WHERE id = ?";
        MapHandler handler = new MapHandler();
        Map<String, Object> map = runner.query(conn, sql, handler, 10);

        System.out.println(map);

    } catch (SQLException e) {
        e.printStackTrace();
    } finally {
        JDBCUtils.closeResourse(conn, null);
    }
}
```

```java
/*
 * 测试查询:查询条记录构成的 Map
 * 使用 ResultSetHandler 的实现类：MapListHander
 */
@Test
void testQuery4() {

    Connection conn = null;
    try {
        conn = JDBCUtils.getConnection();
        QueryRunner runner = new QueryRunner();

        String sql = "SELECT id, name, email, birth FROM customers WHERE id < ?";
        MapListHandler handler = new MapListHandler();
        List<Map<String, Object>> list = runner.query(conn, sql, handler, 10);

        list.forEach(System.out::println);

    } catch (SQLException e) {
        e.printStackTrace();
    } finally {
        JDBCUtils.closeResourse(conn, null);
    }
}
```


```java
/*
 * 自定义 ResultSetHandler 的实现类
 */
@Test
void testQuery5() {

    Connection conn = null;
    try {
        conn = JDBCUtils.getConnection();
        QueryRunner runner = new QueryRunner();

        String sql = "SELECT id, name, email, birth FROM customers WHERE id = ?";

        ResultSetHandler<Customer> handler = new ResultSetHandler<Customer>() {
            @Override
            public Customer handle(ResultSet resultSet) throws SQLException {

                if (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    String name = resultSet.getString("name");
                    String email = resultSet.getString("email");
                    java.sql.Date birth = resultSet.getDate("birth");

                    return new Customer(id, name, email, birth);
                }
                return null;
            }
        };

        Customer customer = (Customer) runner.query(conn, sql, handler, 10);

        System.out.println(customer);

    } catch (SQLException e) {
        e.printStackTrace();
    } finally {
        JDBCUtils.closeResourse(conn, null);
    }
}
```

```java
/*
 * 如何查询类似于最大的，最小的，平均的，总和，个数相关的数据，
 * 使用 ScalarHandler
 */
@Test
void testQuery6() {

    Connection conn = null;
    try {
        conn = JDBCUtils.getConnection();
        QueryRunner runner = new QueryRunner();

        String sql = "SELECT MAX(birth) FROM customers";
        ScalarHandler handler = new ScalarHandler();
        Date maxBirth = (Date) runner.query(conn, sql, handler);

        System.out.println(maxBirth);

    } catch (SQLException e) {
        e.printStackTrace();
    } finally {
        JDBCUtils.closeResourse(conn, null);
    }
}
```

