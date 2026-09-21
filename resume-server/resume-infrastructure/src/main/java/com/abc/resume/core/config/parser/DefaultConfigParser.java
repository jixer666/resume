package com.abc.resume.core.config.parser;

import com.abc.resume.core.config.model.Config;
import com.alibaba.fastjson2.JSON;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DefaultConfigParser implements ConfigParser {

    @Override
    public <T> T parse(Config config, Class<T> clazz) {
        return JSON.parseObject(config.getValue(), clazz);
    }

    @Override
    public <T> List<T> parseList(Config config, Class<T> componentType) {
        return JSON.parseArray(config.getValue(), componentType);
    }

    @Override
    public <T> T[] parseArray(Config config, Class<T> componentType) {
        return null;
    }
}
