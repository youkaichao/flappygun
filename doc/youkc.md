# use markdown to mark what I have done



游戏选择：

​	7.10 与南亚同学试玩4399小游戏，选定打枪游戏。



游戏开发引擎选择: 

​	在南亚同学推荐下选用cocos creator 及其自带的物理引擎Cocos2d

​	7.12 调试物理引擎，环境搭建。 物理引擎对rigidBody有用，要给组件加RigidBody物理引擎才对物体起作用。通过施加冲量来控制物体运动。要施加冲量矩来控制转动，则需要再额外加上physical collider component，否则刚体的转动惯量为0，无法受力矩。



后端主体框架搭建(7.14):

​	先尝试着使用WebSocket进行后端与前端的通信，但是发觉WebSocket不适合用在这里。本游戏中前端和后端的交互主要有：登录时，前端读取玩家的存档数据。 一场游戏结束后，前端更新玩家存档数据并获取排行榜。这些请求都是前端主动发起的，适合于使用http服务。WebSocket的优点在于建立了连接后服务器可以主动发起消息，适用于联网对战游戏。另外，由于WebSocket的特点，交互并不是一问一答的，一方发消息后另一方不一定回答、也可能回答多条消息，所以，WebSocket的send函数是不包括回调函数参数的，要用WebSocket来做的话，需要在消息中自定义type并根据type分发消息给不同的函数，本质上是在做路由。而http这一块已经有成熟的路由组件了，所以最后决定删除WebSocket的实现，采用http实现。由于作业4中使用了express，所以这里继续使用express。



数据库选择：

​	由于规模较小，且本人在使用Django时了解过sqlite数据库，所以选取了sqlite。npm上的sqlite3数据库相关的包里面，sqlite3没有使用成功，最后选取了better-sqlite3, 这个使用成功了，而且它声称效率高。



遇到的坑：

​	分号问题：

​		写代码时，多次遇到有的地方报语法错误，但是看起来并没有什么问题，而且加了个分号之后就解决了，查询文档知，有可能是因为不加分号代码解析有歧义，比如 ``({a, b} = {"a":1, "b":1})``如果不加分号，括号会被解析成函数调用语句，从而出错。

​		**所以，一定要加分号！**



​	server端无法得到client端post的数据：使用微信提供的``wx.request``函数，参数中的数据并不能被服务器获取。后来细看微信发起的网络请求，发现微信是把数据放在了``payload``中，并不是直接放在body中的。