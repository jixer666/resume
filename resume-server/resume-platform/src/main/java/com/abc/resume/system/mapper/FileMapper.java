package com.abc.resume.system.mapper;

import com.abc.resume.system.domain.dto.FileDTO;
import com.abc.resume.system.domain.entity.File;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 文件Mapper接口
 *
 * @author LiJunXi
 * @date 2025-10-07
 */
@Mapper
public interface FileMapper {

    List<File> selectFileList(FileDTO fileDTO);

    File selectById(Long id);

    int insert(File file);

    int updateById(File file);

    int deleteBatchIds(@Param("ids") List<Long> ids);

}