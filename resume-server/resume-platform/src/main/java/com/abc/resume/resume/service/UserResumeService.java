package com.abc.resume.resume.service;

import com.abc.resume.core.page.PageResult;
import com.abc.resume.resume.domain.dto.UserResumeCreateDTO;
import com.abc.resume.resume.domain.dto.UserResumePageDTO;
import com.abc.resume.resume.domain.vo.UserResumeVO;

/**
 * 用户简历服务
 */
public interface UserResumeService {
    PageResult getUserResumePage(UserResumePageDTO dto);

    UserResumeVO createResume(UserResumeCreateDTO dto);
}
