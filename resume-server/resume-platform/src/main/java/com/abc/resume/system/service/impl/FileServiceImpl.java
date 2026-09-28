package com.abc.resume.system.service.impl;

import cn.hutool.core.collection.CollUtil;
import com.abc.resume.core.base.BaseService;
import com.abc.resume.core.page.PageResult;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.system.domain.dto.FileDTO;
import com.abc.resume.system.domain.entity.File;
import com.abc.resume.system.domain.vo.FileVO;
import com.abc.resume.system.mapper.FileMapper;
import com.abc.resume.system.service.FileService;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 文件业务处理
 *
 * @author LiJunXi
 * @date 2025-10-07
 */
@Service
public class FileServiceImpl extends BaseService implements FileService {

    @Autowired
    private FileMapper fileMapper;

    @Override
    public PageResult getFilePageWithUiParam(FileDTO fileDTO) {
        startPage();
        List<File> files = fileMapper.selectFileList(fileDTO);
        List<FileVO> fileVOList = pageList2CustomList(files, (List<File> list) -> {
            return BeanUtils.copyToList(list, FileVO.class);
        });

        return buildPageResult(fileVOList);
    }

    @Override
    public void updateFile(FileDTO fileDTO) {
        AssertUtils.isNotEmpty(fileDTO, ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isNotEmpty(fileDTO.getId(), ExceptionEnum.PARAM_EXCEPTION);
        File file = fileMapper.selectById(fileDTO.getId());
        AssertUtils.isNotEmpty(file, ExceptionEnum.BIZ_EXCEPTION.getCode(), "文件不存在");
        BeanUtils.copyProperties(fileDTO, file);
        int row = fileMapper.updateById(file);
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
    }

    @Override
    public void saveFile(FileDTO fileDTO) {
        AssertUtils.isNotEmpty(fileDTO, ExceptionEnum.PARAM_EXCEPTION);
        File file = buildDefaultFileByFileDTO(fileDTO);
        int row = fileMapper.insert(file);
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
    }

    @Override
    public void deleteFile(FileDTO fileDTO) {
        AssertUtils.isNotEmpty(fileDTO, ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isTrue(CollUtil.isNotEmpty(fileDTO.getFileIds()), ExceptionEnum.PARAM_EXCEPTION.getCode(),"文件ID列表不能为空");
        fileMapper.deleteBatchIds(fileDTO.getFileIds());
    }

    @Override
    public File vaildAndGet(Long fileId) {
        AssertUtils.isNotEmpty(fileId, ExceptionEnum.PARAM_EXCEPTION);
        File fileEntity = fileMapper.selectById(fileId);
        AssertUtils.isNotEmpty(fileEntity, ExceptionEnum.BIZ_EXCEPTION.getCode(),"文件不存在");
        return fileEntity;
    }

    private File buildDefaultFileByFileDTO(FileDTO fileDTO) {
        File file = BeanUtils.copyProperties(fileDTO, File.class);
        file.setCommonParams();
        return file;
    }



}