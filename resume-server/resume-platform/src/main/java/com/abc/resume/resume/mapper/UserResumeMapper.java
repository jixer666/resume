package com.abc.resume.resume.mapper;

import com.abc.resume.resume.domain.dto.UserResumePageDTO;
import com.abc.resume.resume.domain.entity.UserResume;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserResumeMapper {

    List<UserResume> selectUserResumePage(@Param("uid") String uid, @Param("dto") UserResumePageDTO dto);

    UserResume selectUserResumeById(@Param("id") Long id, @Param("uid") String uid);

    int insertUserResume(UserResume userResume);

    int updateUserResume(UserResume userResume);

    int deleteUserResume(@Param("id") Long id);

}
