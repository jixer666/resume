package com.abc.resume.resume.service;

import com.abc.resume.core.page.PageResult;
import com.abc.resume.resume.domain.dto.UserResumePageDTO;
import com.abc.resume.resume.domain.dto.UserResumeSubmitDTO;
import com.abc.resume.resume.domain.vo.UserResumeVO;

/**
 * 用户简历服务
 */
public interface UserResumeService {

    /**
     * 查询用户简历分页
     */
    PageResult getUserResumePage(UserResumePageDTO dto);

    /**
     * 简历详情
     */
    UserResumeVO getUserResumeDetail(Long id);

    /**
     * 提交简历
     */
    UserResumeVO submitResume(UserResumeSubmitDTO dto);

    /**
     * 导出简历为 PDF
     */
    byte[] exportPdf(Long id);
}
