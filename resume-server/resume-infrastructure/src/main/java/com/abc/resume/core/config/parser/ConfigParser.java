package com.abc.resume.core.config.parser;

import com.abc.resume.core.config.model.Config;

import java.util.List;

public interface ConfigParser {
    /**
     * 配置解析器
     *
     * @return 解析后的配置
     */
    <T> T parse(Config config, Class<T> clazz);

    /**
     * 配置解析器
     *
     * @return 解析后的配置list
     */
    <T> List<T> parseList(Config config, Class<T> componentType);

    <T> T[] parseArray(Config config, Class<T> componentType);
}
