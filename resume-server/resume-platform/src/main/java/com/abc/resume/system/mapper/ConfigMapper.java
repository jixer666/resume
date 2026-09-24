package com.abc.resume.system.mapper;

import com.abc.resume.core.config.model.Config;
import com.abc.resume.system.domain.context.ConfigQueryContext;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ConfigMapper {

    List<Config> selectConfigByContext(ConfigQueryContext context);

}
