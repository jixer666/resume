# 简历项目 Docker 部署流程（CentOS 7）

## 一、为什么要这么部署

报错：

```
/tmp/playwright-java-8373207590468870156/node: /lib64/libm.so.6: version `GLIBC_2.27' not found
/tmp/playwright-java-8373207590468870156/node: /lib64/libstdc++.so.6: version `GLIBCXX_3.4.20' not found
```

- playwright-java 1.40.0 的 jar 里自带一个 node 驱动（driver-bundle）。
- 即使代码写的是 `playwright.chromium().connect("ws://...")`（只连远程浏览器），`Playwright.create()` 也会先在**本地**解压并启动这个 node 驱动，协议通信走它。
- 这个 node 要求 `glibc >= 2.28`、`GLIBCXX >= 3.4.21`，CentOS 7 只有 glibc 2.17，所以必然报错。

结论：

1. **后端 jar 也必须跑在 glibc 够新的容器里**（本方案用 Ubuntu 22.04 / jammy，glibc 2.35）。
2. 后端连远程 Playwright Server，本地不用浏览器，用 `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` 跳过下载。
3. MySQL、Redis、Playwright、H5、后端全部加入同一个 docker 网络，容器之间用**服务名**互访，不再用 127.0.0.1。

## 二、部署后的网络结构

```
                   ┌──────────────────── resume-net（自定义 bridge 网络）────────────────────┐
                   │                                                                  │
 用户浏览器 ──────> │  app (resume-app:11000) ──> mysql:3306                            │
                   │        │                └──> redis:6379                             │
                   │        └── ws ──> playwright:3000 ── http ──> h5:8080（导出预览页）    │
 用户浏览器 ──────> │  h5 (9001 -> 8080)                                               │
                   └──────────────────────────────────────────────────────────────────┘
```

导出 PDF 的完整链路：

1. 前端调后端导出接口；
2. 后端通过本地 node 驱动连 `ws://playwright:3000`；
3. Playwright 容器里启动 Chromium，打开 `http://h5:8080/#/pages/export/index?id=xx&token=xx`；
4. 预览页调后端接口取简历详情并渲染；
5. 后端 `page.pdf()` 拿到 PDF 返回给前端。

## 三、目录结构

```
deploy/
├── docker-compose.yml     一键编排（方案 B）
├── .env.example           配置示例，复制成 .env 后改密码
├── build.ps1               本地打包 jar 并复制到 server/
├── server/
│   ├── Dockerfile          后端镜像
│   └── resume-web.jar      mvn package 产物（不进 git）
└── data/                   运行数据：mysql / redis / 日志（不进 git）
```

## 四、第一步：本地打包 jar

在项目根目录执行（PowerShell，也可以直接跑 `deploy/build.ps1`）：

```powershell
cd resume-server
mvn clean package -DskipTests
copy resume-web\target\resume-web.jar ..\deploy\server\resume-web.jar
```

Git Bash / Linux：

```bash
cd resume-server
mvn clean package -DskipTests
cp resume-web/target/resume-web.jar ../deploy/server/resume-web.jar
```

## 五、第二步：把代码传到服务器

```bash
scp -r deploy root@43.143.14.69:/lijunxi/project/resume/
```

服务器上建议的目录（compose 里要挂 sql、要 build H5 镜像，所以后端和前端源码也要在）：

```
/lijunxi/project/resume/
├── resume-server/     后端源码（挂载 sql/resume.sql 用）
├── resume-app/        前端源码（build H5 镜像用）
└── deploy/            上面的 deploy 目录
```

H5 镜像在服务器上 build，本地不用传 node_modules。

## 六、方案 A：复用你已经跑着的 mysql / redis / playwright（推荐）

以下命令都在 `deploy/` 目录下执行。

```bash
# 1. 建网络
docker network create resume-net

# 2. 已有 mysql、redis 接进网络
#    容器名用 docker ps 查。名字就叫 mysql / redis 就直接连，不用别名
docker network connect resume-net mysql
docker network connect resume-net redis
#    容器名不叫 mysql / redis 时，用 --alias 起别名，后端配置里写别名
# docker network connect --alias mysql resume-net 你的容器名
# docker network connect --alias redis resume-net 你的容器名
MYSQL_PASSWORD=你的mysql密码
REDIS_PASSWORD=你的redis密码

# 3. playwright 容器：先确认它已经是 run-server 方式在跑
docker logs playwright-server | grep "Listening on"
#    有 "Listening on ws://0.0.0.0:3000/" 就直接接进网络，不用重建：
docker network connect resume-net playwright-server
#    没有（只是个空容器）才需要重建，版本必须和客户端一致（1.40.0）：
# docker rm -f playwright-server
# docker run -d --name playwright-server --network resume-net --restart unless-stopped \
#   --shm-size=1g mcr.microsoft.com/playwright:v1.40.0-jammy \
#   /bin/sh -c "npx -y playwright@1.40.0 run-server --port 3000 --host 0.0.0.0"
#    国内镜像源：mcr.azure.cn/playwright:v1.40.0-jammy（和上面二选一）

# 4. H5（导出预览页，Playwright 容器要能打开它）
docker build -t resume-h5:latest ../resume-app
docker run -d --name resume-h5 --network resume-net --network-alias h5 \
  --restart unless-stopped \
  -p 9001:8080 resume-h5:latest

# 5. 后端
docker build -t resume-app:latest ./server
docker run -d --name resume-app --network resume-net --network-alias app \
  --restart unless-stopped \
  -p 11000:11000 \
  -e PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  resume-app:latest \
  --resume.mysql.ip=mysql \
  --resume.mysql.password="$MYSQL_PASSWORD" \
  --resume.redis.host=redis \
  --resume.redis.password="$REDIS_PASSWORD" \
  --resume.system.export.playwright-server=ws://playwright-server:3000 \
  --resume.system.export.preview-url=http://h5:8080/#/pages/export/index
```

说明：

- mysql / redis 容器不用重建，`docker network connect` 只是把它接进网络，容器本身不动。
- Playwright 容器只要 `docker logs` 能看到 `Listening on ws://0.0.0.0:3000/` 就直接接进网络；只有它不是 `run-server` 方式（空容器）才需要重建。
- 配置里 `ws://playwright-server:3000` 的名字要跟容器在网络里的名字一致：直接用容器名，或 `docker network connect --alias playwright` 起别名都行。
- 如果 H5 继续放在宿主机 nginx（9001），不想容器化：Playwright 容器启动时加 `--add-host=host.docker.internal:host-gateway`，preview-url 改成 `http://host.docker.internal:9001/#/pages/export/index`。
- 如果 H5 在宿主机、又不想重建 Playwright 容器加 `--add-host`：查网关 IP `docker network inspect resume-net --format '{{(index .IPAM.Config 0).Gateway}}'`（一般是 172.18.0.1），preview-url 写 `http://172.18.0.1:9001/#/pages/export/index`。
- 如果 9001 端口被占用，H5 换个宿主机端口即可（如 `-p 9002:8080`），preview-url 走容器名不受影响。

### H5 直接跑在宿主机 nginx（不容器化）时的完整步骤

```bash
# 1. 建网络 + 已有容器接进来（容器名按 docker ps 填）
docker network create resume-net
docker network connect resume-net mysql
docker network connect resume-net redis
docker network connect resume-net playwright-server
# 用了 minio 才需要：docker network connect resume-net minio

# 2. 查 resume-net 的网关 IP（宿主机在这个网络里的地址，一般是 172.18.0.1）
docker network inspect resume-net --format '{{(index .IPAM.Config 0).Gateway}}'

# 3. 确认宿主机 nginx 监听 0.0.0.0:9001（默认就是），且防火墙没拦 docker 网段
ss -lntp | grep 9001
firewall-cmd --list-all

# 4. 后端
docker build -t resume-app:latest ./server
docker run -d --name resume-app --network resume-net --network-alias app \
  --restart unless-stopped -p 11000:11000 \
  -e PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  resume-app:latest \
  --resume.mysql.ip=mysql \
  --resume.mysql.password=你的mysql密码 \
  --resume.redis.host=redis \
  --resume.redis.password=你的redis密码 \
  --resume.system.export.playwright-server=ws://playwright-server:3000 \
  --resume.system.export.preview-url=http://172.18.0.1:9001/#/pages/export/index
```

验证（从 playwright 容器访问宿主机 H5）：

```bash
docker exec playwright-server node -e "fetch('http://172.18.0.1:9001/').then(r=>console.log('h5',r.status)).catch(e=>console.error('h5 FAIL',e.message))"
```

注意：网关 IP 换成第 2 步实际查到的值；H5 打包时的 `VITE_SERVER_BASEURL` 要用 Playwright 容器里也能访问到的后端地址（公网地址最稳）。

### 日志挂载

后端日志写在容器内 `/app/logs`（logback 默认 `./logs`，工作目录是 `/app`），想留到宿主机挂这一个目录就够了：

```bash
mkdir -p /lijunxi/project/resume/logs
# docker run 里加：-v /lijunxi/project/resume/logs:/app/logs
```

| 文件 | 内容 |
| --- | --- |
| resume-default.log | 全量日志（info 起），按天滚动保留 7 天 |
| common-error.log | 只记 error |
| resume-dao.log | mapper 的 SQL（debug） |
| startup.log | 启动日志，每次启动覆盖 |

控制台日志不用挂，`docker logs -f resume-app` 就能看（启动失败、导出报错都在这）。CentOS 7 如果 SELinux 是 enforcing，挂载要加 `:Z`（`-v /lijunxi/project/resume/logs:/app/logs:Z`），否则容器可能没权限写。

## 七、方案 B：compose 一键起全套

```bash
cd deploy
cp .env.example .env
vim .env                       # 改密码、端口
docker compose up -d --build
docker compose logs -f app
```

- 第一次启动 MySQL 会自动执行 `../resume-server/sql/resume.sql` 建库建表（只有 `deploy/data/mysql` 为空时才会执行）。
- 如果 11000 / 9001 被占用，改 `.env` 里的 `APP_PORT` / `H5_PORT` 即可，容器内部端口不用改。
- 需要 Docker Compose v2，用 `docker compose version` 确认；老的 `docker-compose` v1 不支持 `depends_on.condition`。
- 镜像 ENTRYPOINT 里已固定 `--spring.profiles.active=prod`（读 `application-prod.properties`），`docker run` / compose 都不用再传；要跑 dev 就改 `deploy/server/Dockerfile` 后重新 build。

## 八、配置对照表（关键）

| jar 内 application-prod.properties | 原值 | 容器里改成 | 原因 |
| --- | --- | --- | --- |
| resume.mysql.ip | 127.0.0.1 | mysql | 容器里的 127.0.0.1 是容器自己 |
| resume.redis.host | 127.0.0.1 | redis | 同上 |
| resume.system.export.playwright-server | ws://127.0.0.1:3000 | ws://playwright:3000 | 连 playwright 容器 |
| resume.system.export.preview-url | http://127.0.0.1:9001/... | http://h5:8080/... | 这个地址是给 Playwright 容器里的浏览器打开的，必须是该网络内能访问到的地址 |
| H5 打包变量 VITE_SERVER_BASEURL | https://ukw0y1.laf.run | 后端公网地址 | 预览页在 Playwright 容器里跑，要能请求到后端 |

`resume-app/env/.env` 里的 `VITE_SERVER_BASEURL` 在 build H5 镜像前确认一下，指向你的后端（例如 `http://43.143.14.69:11000`），改完重新 build H5 镜像即可。

只有指向 `127.0.0.1` 的参数必须覆盖（容器里的 127.0.0.1 永远是容器自己，和网络无关）：

| 参数 | 是否必须覆盖 | 说明 |
| --- | --- | --- |
| resume.mysql.ip | 必须 | 改成 mysql（容器名 / 网络别名） |
| resume.redis.host | 必须 | 改成 redis |
| resume.system.export.playwright-server | 必须 | 改成 ws://playwright-server:3000 |
| resume.system.export.preview-url | 必须 | 改成 Playwright 容器能访问的 H5 地址 |
| resume.mysql.password | 可省 | 现有容器密码就是 prod 里的 jixer666mysql 时不用传 |
| resume.redis.password | 可省 | 同上（jixer666redis） |
| resume.redis.index | 可省 | prod 里就是 3 |

密码和 prod 一致时的最小启动命令：

```bash
docker run -d --name resume-app --network resume-net --network-alias app \
  --restart unless-stopped -p 11000:11000 \
  -e PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  resume-app:latest \
  --resume.mysql.ip=mysql \
  --resume.redis.host=redis \
  --resume.system.export.playwright-server=ws://playwright-server:3000 \
  --resume.system.export.preview-url=http://172.18.0.1:9001/#/pages/export/index
```

## 九、验证

```bash
# 1. 看网络里都有谁
docker network inspect resume-net --format '{{range .Containers}}{{.Name}} {{end}}'

# 2. 后端容器里 DNS 能否解析各服务
docker exec resume-app getent hosts mysql redis playwright h5

# 3. Playwright Server 是否在监听
docker logs resume-playwright | grep "Listening on"

# 4. 后端是否连上远程浏览器（应打印：简历导出浏览器初始化完成, server=ws://playwright:3000）
docker logs resume-app | grep "简历导出浏览器初始化完成"

# 5. 从 Playwright 容器访问 H5 预览页
docker exec resume-playwright node -e "fetch('http://h5:8080/').then(r=>console.log('h5', r.status)).catch(e=>console.error('h5 FAIL', e.message))"

# 6. 实际导出一次 PDF，观察日志
docker logs -f resume-app
```

## 十、常见问题

1. **还报 GLIBC not found**
   → 后端还在宿主机上 `java -jar`。报错路径出现 `/tmp/playwright-java-xxx/node` 就说明还是宿主机执行，必须用容器跑。

2. **Failed to install browsers, exit code: 1**
   → 没跳过浏览器下载。确认后端容器有环境变量 `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`（连远程 Server 时本地不需要浏览器）。

3. **连 ws://playwright:3000 失败 / 超时**
   → 三个可能：Playwright 容器没带 `run-server` 命令；不在同一个网络；版本不一致（镜像 tag `v1.40.0` 必须和 `pom.xml` 里 `playwright.version=1.40.0` 一致）。

4. **导出一直超时 / PDF 空白**
   → `preview-url` 不对。容器里的 `127.0.0.1` 是容器自己，要用 `http://h5:8080/#/pages/export/index`；H5 在宿主机时用 `http://host.docker.internal:9001/#/pages/export/index`。

5. **预览页白屏、接口请求失败**
   → H5 打包时的 `VITE_SERVER_BASEURL` 要指向 Playwright 容器里能访问到的后端地址，改完重新 build H5 镜像。

6. **Chromium 崩溃 / 页面渲染一半**
   → Playwright 容器加 `--shm-size=1g`（compose 里已配 `shm_size: 1gb`）。

7. **第一次导出很慢**
   → 正常：后端首次要解压 node 驱动，Playwright 容器首次要冷启动 Chromium，之后就快了。

8. **改了 .env 密码还是连不上 MySQL**
   → 复用已有 MySQL 时密码要和现有容器一致；`deploy/data/mysql` 一旦有数据，初始化 SQL 不会再执行。

9. **服务器 Docker 较老（低于 20.10）**
   → 不支持 `host.docker.internal`，用 `ip -4 addr show docker0` 查到网关 IP（一般是 172.17.0.1）代替。

10. **H5 的 9001 端口被宿主机 nginx 占用**
    → 直接用宿主机 nginx 那份 H5，Playwright 容器加 `--add-host=host.docker.internal:host-gateway`，preview-url 用 `http://host.docker.internal:9001/#/pages/export/index`，不必再起 h5 容器。

11. **Access denied for user 'root'@'172.x.x.x'（容器连 MySQL）**
    → 之前的 jar 在宿主机上连 127.0.0.1，MySQL 认为来源是 localhost；换成容器后来源 IP 变了。在 MySQL 里放行：

    ```sql
    CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY '你的密码';
    GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
    ```

12. **Redis 报 NOAUTH / 连不上**
    → 已有的 redis 设了密码，就用 `--resume.redis.password` 传；没设密码就不要传这个参数（传了反而会报错）。

13. **镜像拉不动 / 标签不存在**
    → `eclipse-temurin:8-jre-jammy` 拉不到就换 `eclipse-temurin:8-jre-focal`（glibc 2.31，同样够用）；`mcr.microsoft.com/playwright:v1.40.0-jammy` 多试几次，或给服务器配镜像加速。
