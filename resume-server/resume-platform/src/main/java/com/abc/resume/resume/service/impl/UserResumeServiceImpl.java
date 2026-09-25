package com.abc.resume.resume.service.impl;

import com.abc.resume.core.base.BaseService;
import com.abc.resume.core.page.PageResult;
import com.abc.resume.resume.domain.dto.UserResumeCreateDTO;
import com.abc.resume.resume.domain.dto.UserResumePageDTO;
import com.abc.resume.resume.domain.vo.UserResumeVO;
import com.abc.resume.resume.mapper.UserResumeMapper;
import com.abc.resume.resume.service.UserResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserResumeServiceImpl extends BaseService implements UserResumeService {

    @Autowired
    private UserResumeMapper userResumeMapper;

    @Override
    public PageResult getUserResumePage(UserResumePageDTO dto) {
        return null;
    }

    @Override
    public UserResumeVO createResume(UserResumeCreateDTO dto) {
        return null;
    }
}
