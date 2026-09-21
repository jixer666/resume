package com.abc.resume.core.config.parser;

import com.abc.resume.core.config.model.Config;

import java.util.Map;

public interface ConfigMapParser<K, V> {
    /**
     * 解析map
     */
    Map<K, V> parseMap(Config config);
}
