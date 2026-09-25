package com.abc.resume.resume.service;

import com.abc.resume.core.page.PageResult;
import com.abc.resume.resume.domain.dto.ResumeSaveDTO;
import com.abc.resume.resume.domain.vo.ResumeVO;

public interface ResumeService {

    ResumeVO save(String userId, ResumeSaveDTO saveDTO);

    PageResult list(String userId);

    ResumeVO detail(String userId, Long id);

    ResumeVO copy(String userId, Long id);

    void delete(String userId, Long id);

}
