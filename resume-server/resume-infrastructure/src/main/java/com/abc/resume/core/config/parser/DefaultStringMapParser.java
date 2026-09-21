package com.abc.resume.core.config.parser;

import com.abc.resume.core.config.model.Config;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.google.common.collect.Maps;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class DefaultStringMapParser implements ConfigMapParser<String, String> {
    @Override
    public Map<String, String> parseMap(Config config) {
        try {

            JSONObject jsonObject = JSON.parseObject(config.getValue());
            Map<String, String> map = Maps.newHashMap();
            for (Map.Entry<String, Object> entry : jsonObject.entrySet()) {
                map.put(entry.getKey(), String.valueOf(entry.getValue()));
            }
            return map;
        } catch (Exception e) {
            return null;
        }
    }
}
