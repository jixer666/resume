# 后端运行镜像：JDK8 + 一个 jar
#
# 为什么 jar 也必须跑在容器里：
# playwright-java 即使只连远程 Playwright Server，Playwright.create() 也会在本地解压并启动
# 自带的 node 驱动（driver-bundle），该 node 需要 glibc >= 2.28 / GLIBCXX_3.4.21，
# CentOS 7 只有 glibc 2.17，所以宿主机上必然报 GLIBC not found。
# Ubuntu 22.04（jammy，glibc 2.35）里跑就没这个问题。
# 如果 eclipse-temurin:8-jre-jammy 拉不到，可换成 eclipse-temurin:8-jre-focal（glibc 2.31，同样够用）。
FROM eclipse-temurin:8-jre-jammy

ENV TZ=Asia/Shanghai

WORKDIR /app

# resume-web.jar 由 deploy/build.ps1 / build.sh 从 resume-server/resume-web/target 复制过来
COPY resume-web.jar /app/resume-web.jar

EXPOSE 11000

# 默认用 prod 环境（读 jar 内 application-prod.properties）
# 要跑 dev 就改这一行，或在 docker run 时覆盖
ENTRYPOINT ["java", "-Xms512m", "-Xmx1g", "-Dfile.encoding=UTF-8", "-Duser.timezone=Asia/Shanghai", "-jar", "/app/resume-web.jar", "--spring.profiles.active=prod"]
