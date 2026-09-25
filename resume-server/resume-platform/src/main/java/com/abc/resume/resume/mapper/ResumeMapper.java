package com.abc.resume.resume.mapper;

import com.abc.resume.resume.domain.entity.Resume;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

@Mapper
public interface ResumeMapper {

    int insertResume(Resume resume);

    int updateResume(Resume resume);

    Resume selectResumeById(@Param("id") Long id);

    List<Resume> selectResumeList(@Param("userId") String userId);

    int deleteResumeById(@Param("id") Long id, @Param("updateTime") Date updateTime);

}
