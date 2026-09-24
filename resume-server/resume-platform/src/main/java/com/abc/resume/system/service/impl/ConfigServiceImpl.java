package com.abc.resume.system.service.impl;

import com.abc.resume.core.base.BaseService;
import com.abc.resume.core.config.model.Config;
import com.abc.resume.system.domain.context.ConfigQueryContext;
import com.abc.resume.system.mapper.ConfigMapper;
import com.abc.resume.system.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfigServiceImpl extends BaseService implements ConfigService {

    @Autowired
    private ConfigMapper configMapper;

    @Override
    public List<Config> getConfigList(ConfigQueryContext context) {
        return configMapper.selectConfigByContext(context);
    }
}
