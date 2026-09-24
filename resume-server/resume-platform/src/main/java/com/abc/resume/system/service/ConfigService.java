package com.abc.resume.system.service;

import com.abc.resume.core.config.model.Config;
import com.abc.resume.system.domain.context.ConfigQueryContext;

import java.util.List;

/**
 * 配置服务
 */
public interface ConfigService {

    List<Config> getConfigList(ConfigQueryContext context);
}
