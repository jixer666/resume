package com.abc.resume.system.mapper;

import com.abc.resume.system.domain.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    User selectUserByUsername(String username);

    User selectUserByEmail(String email);

    int insertUser(User user);

    Long selectUserLastServerIdByUid(Long userId);

    User selectUserByUid(Long uid);

    int updateUserLastServer(@Param("uid") Long userId, @Param("serverId") Long serverId);
}
