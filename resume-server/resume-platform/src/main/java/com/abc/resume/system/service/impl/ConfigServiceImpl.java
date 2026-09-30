package com.abc.resume.system.service.impl;

import cn.hutool.extra.spring.SpringUtil;
import com.abc.resume.config.AppConfig;
import com.abc.resume.core.base.BaseService;
import com.abc.resume.core.config.model.Config;
import com.abc.resume.system.domain.context.ConfigQueryContext;
import com.abc.resume.system.domain.entity.config.GlobalConfig;
import com.abc.resume.system.domain.entity.config.ResumeTemplateConfig;
import com.abc.resume.system.domain.vo.ResumeConfigVO;
import com.abc.resume.system.mapper.ConfigMapper;
import com.abc.resume.system.service.ConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class ConfigServiceImpl extends BaseService implements ConfigService {

    @Autowired
    private ConfigMapper configMapper;

    @Override
    public List<Config> getConfigList(ConfigQueryContext context) {
        return configMapper.selectConfigByContext(context);
    }

    @Override
    public ResumeConfigVO getResumeConfig() {
        ResumeConfigVO vo = new ResumeConfigVO();
        AppConfig appConfig = SpringUtil.getBean(AppConfig.class);
        ResumeTemplateConfig templateConfig = appConfig.getResumeTemplateConfig();
        if (Objects.nonNull(templateConfig)) {
            vo.setGlobalStyle(templateConfig.getGlobalStyle());
            vo.setModelStyle(templateConfig.getModelStyle());
        }
        GlobalConfig globalConfig = appConfig.getGlobalConfig();
        if (Objects.nonNull(globalConfig)) {
            vo.setFeedbackSheet(globalConfig.getFeedbackSheet());
        }
        return vo;
    }
}
