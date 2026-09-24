package com.abc.resume.config;

import com.abc.resume.constants.CommonConstants;
import com.abc.resume.core.async.AsyncManager;
import com.abc.resume.core.config.AppConfigBootstrap;
import com.abc.resume.core.config.model.Config;
import com.abc.resume.system.domain.context.ConfigQueryContext;
import com.abc.resume.system.service.ConfigService;
import com.abc.resume.util.CollectionUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.TimerTask;
import java.util.concurrent.TimeUnit;

/**
 * 配置中心初始化器
 */
@Slf4j
@Order(CommonConstants.HIGH)
@Component
public class AppConfigInitialization extends AppConfigBootstrap implements ApplicationRunner {

    @Autowired
    private ConfigService configService;

    private static Long CONFIG_VERSION = 0L;

    @Override
    public void run(ApplicationArguments args) {
        log.info("启动配置中心初始化器定时任务");
        AsyncManager.me().scheduleWithFixedDelay(new TimerTask() {
            @Override
            public void run() {
                List<Config> configList = loadAllConfig();
                if (CollectionUtils.isEmpty(configList)) {
                    return;
                }
                CONFIG_VERSION = new Date().getTime();
                for (Config config : configList) {
                    handleUpdateConfig(config);
                }
            }
        }, 5, 10, TimeUnit.SECONDS);
    }

    private List<Config> loadAllConfig() {
        ConfigQueryContext context = new ConfigQueryContext();
        context.setDelete(false);
        context.setUpdateTime(new Date(CONFIG_VERSION));
        return configService.getConfigList(context);
    }
}
