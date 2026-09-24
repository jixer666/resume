package com.abc.resume.system.mapper;

import com.abc.resume.system.domain.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    User selectUserByUsername(String username);

    User selectUserByEmail(String email);

    int insertUser(User user);

    User selectUserByUid(String uid);

    User getUserByOpenidAndCh(@Param("openid") String openid, @Param("ch") String ch);
}
