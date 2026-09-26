package com.abc.resume.resume.domain.entity.resume;

import com.abc.resume.core.mybatis.handler.JsonTypeHandler;
import org.apache.ibatis.type.MappedTypes;

/**
 * 用户简历详情字段TypeHandler
 */
@MappedTypes(UserResumeDetail.class)
public class UserResumeDetailTypeHandler extends JsonTypeHandler<UserResumeDetail> {

    public UserResumeDetailTypeHandler() {
        super(UserResumeDetail.class);
    }

}