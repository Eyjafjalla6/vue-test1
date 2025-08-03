## 测试小页面

辅助AI：Deepseek  R1，Grok 3

本项目采用前后端分离架构，前端可通过WebSocket获取实时系统指标，并通过标准REST API进行用户管理操作。



### 1. 前端vue简介

注册页面，登录页面，重置密码页面，主页。

主要包括数据看板，系统设置和个人中心。

组件：element plus，router，vuex，axios，echarts等。

Register.vue，Login.vue，Home.vue，Forget.vue需要跨域向python后端发送请求。

假定后端地址为127.0.0.1:8033/。

![image-20250803183227740](./README.assets/image-20250803183227740.png)

响应包格式如下

成功

```json
{
    "data": {
        "code": 200,
        "message": "",
        "data": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc1MzQzNTc4Mn0.DjgcBQOiTJsBubP9n6Jyc2VFYYbZFM2tlYE1UlZYPLc",
            "userInfo": {
                "id": 1,
                "username": "admin"
            }
        }
    },
    "status": 200,
    "statusText": "OK",
    "headers": {
        "content-length": "208",
        "content-type": "application/json"
    },
    "config": {
        "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
        },
        "adapter": [
            "xhr",
            "http",
            "fetch"
        ],
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 5000,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "env": {},
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        "baseURL": "http://127.0.0.1:8033",
        "method": "post",
        "url": "/api/login",
        "data": "{\"username\":\"admin\",\"password\":\"27672cf37b9e600016e25dd5fa603155ccf66f8146149404e894fb0c8cc9cff1\"}",
        "allowAbsoluteUrls": true
    },
    "request": {}
}
```

失败

```json
{
    "message": "Request failed with status code 400",
    "name": "AxiosError",
    "stack": "AxiosError: Request failed with status code 400\n    at settle (http://localhost:5173/node_modules/.vite/deps/axios.js?v=02461f12:1232:12)\n    at XMLHttpRequest.onloadend (http://localhost:5173/node_modules/.vite/deps/axios.js?v=02461f12:1564:7)\n    at Axios.request (http://localhost:5173/node_modules/.vite/deps/axios.js?v=02461f12:2122:41)\n    at async Store2.register (http://localhost:5173/src/store/index.js?t=1753431771681:44:9)",
    "config": {
        "transitional": {
            "silentJSONParsing": true,
            "forcedJSONParsing": true,
            "clarifyTimeoutError": false
        },
        "adapter": [
            "xhr",
            "http",
            "fetch"
        ],
        "transformRequest": [
            null
        ],
        "transformResponse": [
            null
        ],
        "timeout": 5000,
        "xsrfCookieName": "XSRF-TOKEN",
        "xsrfHeaderName": "X-XSRF-TOKEN",
        "maxContentLength": -1,
        "maxBodyLength": -1,
        "env": {},
        "headers": {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        "baseURL": "http://127.0.0.1:8033",
        "method": "post",
        "url": "/api/register",
        "data": "{\"username\":\"admin\",\"password\":\"27672cf37b9e600016e25dd5fa603155ccf66f8146149404e894fb0c8cc9cff1\"}",
        "allowAbsoluteUrls": true
    },
    "code": "ERR_BAD_REQUEST",
    "status": 400
}
```



创建vue项目

```bash
npm init vue@latest
cd vue-test1
npm install
npm run dev
```

下载组件

```bash
C:\Users\21609\Desktop\code\vue-test1>npm install vue@3
npm install element-plus --save
npm install vuex@4
npm install vue-router@4
npm install axios
npm install crypto-js
npm install echarts #图表
npm install systeminformation #系统信息
# 卡片
npm install --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/vue-fontawesome@latest
vue --version && npm list vue vuex vue-router element-plus
```



### 2. 后端python

navicat执行

```
create DATABASE vue_test1;
```



![image-20250803183248404](./README.assets/image-20250803183248404.png)



​	后端是一个基于 FastAPI 的 Web 应用程序，旨在提供用户身份验证和实时系统监控功能。FastAPI 是一个现代、高性能的 Python Web 框架，基于异步编程和类型提示，适合构建 RESTful API 和实时应用。该项目结合了用户管理（注册、登录、密码重置）和通过 WebSocket 实时传输系统指标（如网络速度、CPU 使用率、内存使用量）的功能，适用于需要实时数据更新的场景。

| **功能/问题**          | **描述**                                                     |
| ---------------------- | ------------------------------------------------------------ |
| 用户注册/登录/重置密码 | 支持通过 MySQL 存储，JWT 认证，有效期 2 小时。               |
| 实时系统指标           | 通过 WebSocket 每 10 秒发送网络速度、CPU、内存使用量。       |
| 网络速度测量           | 使用 aiohttp 下载 1MB 文件，计算 Kbps，可能不准确。          |
| WebSocket 认证         | 使用 `sec-websocket-protocol` 头，非标准，建议优化为查询参数或消息传递。 |
| 安全性                 | 密码未加密，JWT 密钥简单，生产环境需加强。                   |



一些值得注意的点：

1. 配置 CORS 中间件，允许来自 http://127.0.0.1:5173 和 http://localhost:5173 的请求，支持所有方法和头，允许凭证，暴露所有响应头，适合前端开发环境。
2. **异步与任务管理**：测速任务 (speed_test_task) 作为后台协程运行，使用 asyncio.create_task 启动，确保与主循环（每 10 秒发送指标）解耦。主循环通过 await asyncio.sleep(waitTime) 实现定时发送。若 WebSocket 断开或任务取消，系统会清理测速任务并关闭 aiohttp.ClientSession，避免资源泄漏。



```python
# -*- coding: gbk -*-
import pymysql
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import jwt  # pyjwt库，用于处理JWT令牌
from datetime import datetime, timedelta ,UTC
from contextlib import asynccontextmanager  # 用于替换@app.on_event("startup")，管理应用生命周期
from pymysql.cursors import DictCursor
import asyncio  # 用于异步操作，替换requests库
import aiohttp  # 用于异步测速，替换speedtest-cli
import time
import psutil
from fastapi import WebSocket, WebSocketDisconnect
from typing import List
from fake_useragent import UserAgent  # 导入 fake-useragent库，用于生成随机 User-Agent
#手动安装websockets库
#python 13

# 定义应用的生命周期管理函数
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("启动前执行")  # 应用启动前的初始化操作
    create_users_table()  # 创建用户表
    yield
    print("关闭后前执行")  # 应用关闭后的清理操作

# 创建FastAPI应用实例，绑定生命周期管理
app = FastAPI(lifespan=lifespan)
SECRET_KEY = "your-secret-key"  # JWT令牌的密钥
ALGORITHM = "HS256"  # JWT加密算法
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # OAuth2密码流，用于获取令牌

# 配置CORS中间件以支持跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],  # 允许的前端地址
    allow_credentials=True,  # 允许携带凭证
    allow_methods=["*"],  # 允许所有HTTP方法
    allow_headers=["*", "Sec-WebSocket-Protocol", "Sec-WebSocket-Version"],  # 允许的请求头
    expose_headers=["*"],  # 暴露所有响应头
)

# MySQL数据库连接配置
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '123456',
    'db': 'vue_test1',
    'charset': 'utf8mb4'  # 使用utf8mb4字符集
}

# 获取MySQL数据库连接
def get_db_conn():
    return pymysql.connect(**DB_CONFIG)

# 定义用户注册和登录的数据模型
class UserRegister(BaseModel):
    username: str
    password: str

# 创建用户表
def create_users_table():
    conn = get_db_conn()  # 获取数据库连接
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(100) NOT NULL
                )
            """)  # 创建users表，如果不存在
        conn.commit()  # 提交更改
    finally:
        conn.close()  # 关闭数据库连接

# 用户注册接口
@app.post("/api/register")
async def register(user: UserRegister):
    conn = get_db_conn()  # 获取数据库连接
    try:
        with conn.cursor() as cursor:
            # 检查用户名是否已存在
            cursor.execute("SELECT id FROM users WHERE username = %s", (user.username,))
            if cursor.fetchone():
                raise HTTPException(400, "用户名已存在")  # 用户名存在则抛出异常
            # 插入新用户
            cursor.execute(
                "INSERT INTO users (username, password) VALUES (%s, %s)",
                (user.username, user.password)
            )
            conn.commit()  # 提交更改
            return {
                "code": 200,
                "message": "注册成功",
                "data": ""
            }
    except pymysql.Error as e:
        raise HTTPException(500, "数据库操作失败")  # 数据库错误
    finally:
        conn.close()  # 关闭数据库连接

# 用户登录接口
@app.post("/api/login")
async def login(user: UserRegister):
    conn = get_db_conn()  # 获取数据库连接
    try:
        with conn.cursor(DictCursor) as cursor:  # 使用DictCursor返回字典形式的结果
            cursor.execute(
                "SELECT * FROM users WHERE username = %s",
                (user.username,)
            )
            result = cursor.fetchall()[0]  # 获取查询结果
            print(result['password'])
            print(user.password)
            if not result or result['password'] != user.password:
                raise HTTPException(400, "用户名或密码错误")  # 验证失败
            # 生成JWT令牌
            token = jwt.encode({
                "sub": user.username,
                "exp": datetime.now(UTC) + timedelta(hours=2)  # 令牌有效期2小时
            }, SECRET_KEY, ALGORITHM)
            return {
                "code": 200,
                "message": "",
                "data": {
                    "token": token,
                    "userInfo": {
                        "id": result['id'],
                        "username": result['username']
                    }
                }
            }
    except pymysql.Error:
        raise HTTPException(500, "数据库操作失败")  # 数据库错误
    finally:
        conn.close()  # 关闭数据库连接

# 重置密码接口
@app.post("/api/forget")
async def register(user: UserRegister):
    conn = get_db_conn()  # 获取数据库连接
    try:
        with conn.cursor() as cursor:
            # 检查用户名是否存在
            cursor.execute("SELECT id FROM users WHERE username = %s", (user.username,))
            if not cursor.fetchone():
                raise HTTPException(400, "用户名不存在")  # 用户名不存在则抛出异常
            # 更新用户密码
            cursor.execute(
                "UPDATE users SET password = %s WHERE username = %s",
                (user.password, user.username)
            )
            conn.commit()  # 提交更改
            return {
                "code": 200,
                "message": "重置密码成功",
                "data": ""
            }
    except pymysql.Error as e:
        raise HTTPException(500, "数据库操作失败")  # 数据库错误
    finally:
        conn.close()  # 关闭数据库连接

# 获取当前用户信息（通过JWT令牌验证）
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, [ALGORITHM])  # 解码JWT令牌
        return payload["sub"]  # 返回用户名
    except:
        raise HTTPException(401, "无效凭证")  # 令牌无效

# WebSocket路由，用于实时系统指标传输
@app.websocket("/ws/metrics")
async def websocket_endpoint(websocket: WebSocket):
    username = "unknown"  # 默认用户名
    task = None
    await websocket.accept()  # 接受WebSocket连接
    token = websocket.headers.get("sec-websocket-protocol")  # 获取WebSocket协议头中的令牌
    try:
        # 验证JWT令牌
        payload = jwt.decode(token, SECRET_KEY, [ALGORITHM], options={"verify_signature": True})
        username = payload["sub"]  # 获取用户名
        print(f"用户 {username} 已连接")
        # 创建测速任务
        task = asyncio.create_task(get_system_metrics(websocket, waitTime=10))
        # 等待任务完成或客户端断开
        try:
            await task #确保 get_system_metrics 运行直到完成或被取消
        except asyncio.CancelledError:
            print(f"用户 {username} 的测速任务已取消")
    except jwt.PyJWTError:
        print("认证失败")
        await websocket.close(code=1008, reason="认证失败")  # 关闭连接，认证失败
    except WebSocketDisconnect:
        print(f"用户 {username} 客户端断开连接")  # 客户端断开
        if task is not None:
            task.cancel()  # 取消测速任务
    except Exception as e:
        print(f"服务器错误: {e}")
        await websocket.close(code=1011, reason=f"服务器错误: {str(e)}")  # 关闭连接，服务器错误
        if task is not None:
            task.cancel()  # 取消测速任务

# 获取系统指标并通过WebSocket发送
async def get_system_metrics(websocket: WebSocket, waitTime: int):
    speed = 0  # 存储网络速度
    speed_task = None
    ua = UserAgent()
    # 单独的测速任务
    async def speed_test_task():
        nonlocal speed
        async with aiohttp.ClientSession() as session:  # 创建异步HTTP会话
            try:
                while True:
                    try:
                        url = "https://www.baidu.com"  # 使用百度网站进行测速
                        headers = {
                            "User-Agent": ua.random  # 使用随机生成的 User-Agent，避免被识别为爬虫
                        }
                        start = time.perf_counter()  # 高精度计时开始
                        async with session.get(url, timeout=30,headers=headers) as response:
                            total_downloaded = 0
                            while True:
                                chunk = await response.content.read(1024)  # 读取1KB数据块
                                if not chunk:
                                    break
                                total_downloaded += len(chunk)
                        elapsed = time.perf_counter() - start  # 计算耗时
                        speed = (total_downloaded * 8 / elapsed) / 1_000 if elapsed > 0 else 0  # 计算速度（Kbps）
                        print("测速成功")
                    except (aiohttp.ClientError, asyncio.TimeoutError) as e:
                        print(f"测速失败: {e}")
                        speed = 0  # 测速失败时速度置零
                    await asyncio.sleep(waitTime if waitTime > 30 else 30)  # 至少30秒，等待下一次测速
            except asyncio.CancelledError:
                print("测速任务被取消")
                raise  # 重新抛出以确保取消处理
            finally:
                await session.close()  # 确保HTTP会话关闭

    try:
        # 启动后台测速任务
        speed_task = asyncio.create_task(speed_test_task())
        # 主循环定期发送系统指标
        while True:
            metrics = {
                "network_speed": speed,  # 网络速度（Kbps）
                "cpu_usage": psutil.cpu_percent(),  # CPU使用率
                "memory_used": psutil.virtual_memory().used / (1024 ** 3),  # 内存使用量（GB）
                "timestamp": time.time()  # 当前时间戳
            }
            await websocket.send_json(metrics)  # 发送指标数据
            await asyncio.sleep(waitTime)  # 每waitTime秒发送一次
    except WebSocketDisconnect:
        print("WebSocket 断开，停止测速")  # WebSocket连接断开
    except asyncio.CancelledError:
        print("测速任务被取消")  # 任务被取消
    finally:
        # 清理测速任务
        if speed_task is not None:
            speed_task.cancel()  # 取消测速任务
        try:
            await speed_task  # 确保任务清理完成
        except asyncio.CancelledError:
            pass
        except Exception as e:
            print(e)  # 打印其他异常

# 启动FastAPI服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8033,
        ws_ping_interval=30,  # WebSocket心跳检测间隔
        ws_ping_timeout=60  # WebSocket心跳超时
    )
```

