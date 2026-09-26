package com.abc.resume.resume.service.impl;

import com.abc.resume.core.base.BaseService;
import com.abc.resume.core.page.PageResult;
import com.abc.resume.config.AppConfig;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.resume.domain.dto.UserResumePageDTO;
import com.abc.resume.resume.domain.dto.UserResumeSubmitDTO;
import com.abc.resume.resume.domain.entity.ResumeTemplate;
import com.abc.resume.resume.domain.entity.UserResume;
import com.abc.resume.resume.domain.entity.resume.UserResumeDetail;
import com.abc.resume.resume.domain.vo.UserResumeVO;
import com.abc.resume.resume.mapper.ResumeTemplateMapper;
import com.abc.resume.resume.mapper.UserResumeMapper;
import com.abc.resume.resume.service.UserResumeService;
import com.abc.resume.resume.service.pdf.ResumePdfRenderer;
import com.abc.resume.system.service.TokenService;
import com.abc.resume.system.utils.SecurityUtils;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.ServletUtils;
import com.abc.resume.util.StringUtils;
import com.github.pagehelper.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserResumeServiceImpl extends BaseService implements UserResumeService {

    @Autowired
    private UserResumeMapper userResumeMapper;

    @Autowired
    private ResumeTemplateMapper resumeTemplateMapper;

    @Autowired
    private AppConfig appConfig;

    @Autowired
    private ResumePdfRenderer resumePdfRenderer;

    @Autowired
    private TokenService tokenService;

    @Override
    public PageResult getUserResumePage(UserResumePageDTO dto) {
        startPage();
        List<UserResume> resumes = userResumeMapper.selectUserResumePage(SecurityUtils.getUserId(), dto);
        Page<UserResumeVO> page = pageList2CustomList(resumes, (list) -> list.stream()
                .map(resume -> buildUserResumeVO(resume, false))
                .collect(Collectors.toList()));
        return buildPageResult(page);
    }

    @Override
    public UserResumeVO getUserResumeDetail(Long id) {
        return buildUserResumeVO(validAndGetResume(id, SecurityUtils.getUserId()), true);
    }

    @Override
    public UserResumeVO submitResume(UserResumeSubmitDTO dto) {
        AssertUtils.isNotEmpty(dto, ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isTrue(dto.getAct() >= UserResumeSubmitDTO.ADD && dto.getAct() <= UserResumeSubmitDTO.COPY, ExceptionEnum.PARAM_EXCEPTION.getCode(), "未知操作");
        UserResumeVO vo = null;
        if (dto.getAct() == UserResumeSubmitDTO.ADD) {
            vo = addResume(dto);
        } else if (dto.getAct() == UserResumeSubmitDTO.UPDATE) {
            vo = updateResume(dto);
        } else if (dto.getAct() == UserResumeSubmitDTO.DELETE) {
            deleteResume(dto.getId());
        } else {
            vo = copyResume(dto.getId());
        }
        return vo;
    }

    @Override
    public ResponseEntity<byte[]> exportPdf(Long id) {
        UserResume userResume = validAndGetResume(id, SecurityUtils.getUserId());
        String token = tokenService.getToken(ServletUtils.getRequest());
        byte[] resumeByte = resumePdfRenderer.render(id, token);
        return download(resumeByte, userResume.getResumeDetail().getName(), MediaType.APPLICATION_PDF);
    }

    private UserResumeVO addResume(UserResumeSubmitDTO dto) {
        AssertUtils.isNotEmpty(dto.getTemplateCode(), ExceptionEnum.PARAM_EXCEPTION.getCode(), "请选择简历模板");
        UserResumeDetail detail = buildResumeDetail(dto.getTemplateCode());
        UserResume resume = buildUserResume(dto, detail);
        int row = userResumeMapper.insertUserResume(resume);
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
        return buildUserResumeVO(resume, true);
    }

    private UserResume buildUserResume(UserResumeSubmitDTO dto, UserResumeDetail detail) {
        UserResume resume = new UserResume();
        resume.setUid(SecurityUtils.getUserId());
        resume.setThumbnail(StringUtils.isEmpty(dto.getThumbnail()) ? StringUtils.EMPTY : dto.getThumbnail());
        resume.setTemplateCode(dto.getTemplateCode());
        resume.setResumeDetail(detail);
        resume.setCommonParams();
        return resume;
    }

    private UserResumeDetail buildResumeDetail(String templateCode) {
        ResumeTemplate template = resumeTemplateMapper.selectResumeTemplateByCode(templateCode);
        AssertUtils.isNotEmpty(template, ExceptionEnum.BIZ_EXCEPTION.getCode(), "模板不存在");
        return UserResumeDetail.fromTemplate(template, appConfig.getResumeModelDataConfig());
    }

    private UserResumeVO updateResume(UserResumeSubmitDTO dto) {
        AssertUtils.isNotEmpty(dto.getId(), ExceptionEnum.PARAM_EXCEPTION);
        UserResume resume = validAndGetResume(dto.getId(), SecurityUtils.getUserId());
        if (StringUtils.isNotEmpty(dto.getThumbnail())) {
            resume.setThumbnail(dto.getThumbnail());
        }
        if (StringUtils.isNotEmpty(dto.getTemplateCode())) {
            resume.setTemplateCode(dto.getTemplateCode());
        }
        if (Objects.nonNull(dto.getResumeDetail())) {
            resume.setResumeDetail(dto.getResumeDetail());
        }
        resume.setUpdateTime(new Date());
        resume.setVer(resume.getVer() + 1);
        int row = userResumeMapper.updateUserResume(resume);
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
        return buildUserResumeVO(resume, true);
    }

    private UserResumeVO copyResume(Long id) {
        UserResume source = validAndGetResume(id, SecurityUtils.getUserId());
        UserResume copy = new UserResume();
        copy.setUid(source.getUid());
        copy.setResumeDetail(source.getResumeDetail());
        copy.setThumbnail(source.getThumbnail());
        copy.setTemplateCode(source.getTemplateCode());
        copy.setCommonParams();
        int row = userResumeMapper.insertUserResume(copy);
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
        return buildUserResumeVO(copy, true);
    }

    private void deleteResume(Long id) {
        UserResume resume = validAndGetResume(id, SecurityUtils.getUserId());
        int row = userResumeMapper.deleteUserResume(resume.getId());
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
    }

    private UserResume validAndGetResume(Long id, String uid) {
        AssertUtils.isNotEmpty(id, ExceptionEnum.PARAM_EXCEPTION);
        UserResume resume = userResumeMapper.selectUserResumeById(id, uid);
        AssertUtils.isNotEmpty(resume, ExceptionEnum.BIZ_EXCEPTION.getCode(), "简历不存在");
        AssertUtils.isNotEmpty(resume.getUid().equals(uid), ExceptionEnum.BIZ_EXCEPTION.getCode(), "无权访问");
        return resume;
    }

    private UserResumeVO buildUserResumeVO(UserResume resume, boolean withDetail) {
        if (resume == null) {
            return null;
        }
        UserResumeDetail detail = resume.getResumeDetail();
        UserResumeVO vo = new UserResumeVO();
        vo.setId(resume.getId());
        vo.setName(detail.getName());
        vo.setLayout(detail.getLayout());
        vo.setThumbnail(resume.getThumbnail());
        vo.setUpdateTime(resume.getUpdateTime());
        if (withDetail) {
            vo.setResumeJson(detail);
        }
        return vo;
    }
}
