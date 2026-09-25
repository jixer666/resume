package com.abc.resume.resume.service.impl;

import com.abc.resume.core.base.BaseService;
import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.core.page.PageResult;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.resume.domain.dto.UserResumePageDTO;
import com.abc.resume.resume.domain.dto.UserResumeSubmitDTO;
import com.abc.resume.resume.domain.entity.UserResume;
import com.abc.resume.resume.domain.vo.UserResumeVO;
import com.abc.resume.resume.mapper.UserResumeMapper;
import com.abc.resume.resume.service.UserResumeService;
import com.abc.resume.system.domain.entity.User;
import com.abc.resume.system.service.UserService;
import com.abc.resume.system.utils.SecurityUtils;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.CollectionUtils;
import com.alibaba.fastjson2.JSON;
import com.github.pagehelper.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserResumeServiceImpl extends BaseService implements UserResumeService {

    /** 默认布局 */
    private static final String DEFAULT_LAYOUT = "classical";

    /** 复制简历的名称后缀 */
    private static final String COPY_SUFFIX = " 副本";

    @Autowired
    private UserResumeMapper userResumeMapper;

    @Autowired
    private UserService userService;

    @Override
    public PageResult getUserResumePage(UserResumePageDTO dto) {
        startPage();
        List<UserResume> resumes = userResumeMapper.selectUserResumePage(SecurityUtils.getUserId(), dto);
        Page<UserResumeVO> page = pageList2CustomList(resumes, (list) -> list.stream()
                .map(resume -> toVO(resume, false))
                .collect(Collectors.toList()));
        return buildPageResult(page);
    }

    @Override
    public UserResumeVO getUserResumeDetail(Long id) {
        return toVO(requireOwnResume(id, SecurityUtils.getUserId()), true);
    }

    /**
     * 简历写操作的统一入口：按 act 分发到新增 / 更新 / 复制 / 删除。
     */
    @Override
    public UserResumeVO submitResume(UserResumeSubmitDTO dto) {
        AssertUtils.isNotEmpty(dto, ExceptionEnum.PARAM_EXCEPTION);
        switch (dto.getAct()) {
            case UserResumeSubmitDTO.ADD:
                return addResume(dto);
            case UserResumeSubmitDTO.UPDATE:
                return updateResume(dto);
            case UserResumeSubmitDTO.COPY:
                return copyResume(dto.getId());
            case UserResumeSubmitDTO.DELETE:
                deleteResume(dto.getId());
                return null;
            default:
                throw new GlobalException(ExceptionEnum.PARAM_EXCEPTION.getCode(), "未知的操作类型");
        }
    }

    /**
     * 新增简历。
     */
    private UserResumeVO addResume(UserResumeSubmitDTO dto) {
        AssertUtils.isNotEmpty(dto.getName(), ExceptionEnum.PARAM_EXCEPTION.getCode(), "简历名称不能为空");

        UserResume resume = new UserResume();
        resume.setUid(SecurityUtils.getUserId());
        fillResume(resume, dto);
        resume.setCommonParams();

        int row = userResumeMapper.insertUserResume(resume);
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
        return toVO(resume, true);
    }

    /**
     * 更新简历，主键必须存在且属于当前用户。
     */
    private UserResumeVO updateResume(UserResumeSubmitDTO dto) {
        AssertUtils.isNotEmpty(dto.getName(), ExceptionEnum.PARAM_EXCEPTION.getCode(), "简历名称不能为空");

        UserResume resume = requireOwnResume(dto.getId(), SecurityUtils.getUserId());
        fillResume(resume, dto);
        resume.setUpdateTime(new Date());
        resume.setVer((resume.getVer() == null ? 0 : resume.getVer()) + 1);

        int row = userResumeMapper.updateUserResume(resume);
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
        return toVO(resume, true);
    }

    /**
     * 复制一份简历，名称加「 副本」后缀。
     */
    private UserResumeVO copyResume(Long id) {
        String uid = SecurityUtils.getUserId();
        UserResume source = requireOwnResume(id, uid);

        UserResume copy = new UserResume();
        copy.setUid(uid);
        copy.setTitle(source.getTitle() + COPY_SUFFIX);
        copy.setLayout(source.getLayout());
        copy.setResumeJson(source.getResumeJson());
        copy.setThumbnail(source.getThumbnail() == null ? "" : source.getThumbnail());
        copy.setTemplateCode(isBlank(source.getTemplateCode()) ? "" : source.getTemplateCode());
        copy.setCommonParams();

        int row = userResumeMapper.insertUserResume(copy);
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
        return toVO(copy, true);
    }

    /**
     * 删除简历（软删除，is_delete 置成主键）。
     */
    private void deleteResume(Long id) {
        String uid = SecurityUtils.getUserId();
        UserResume resume = requireOwnResume(id, uid);
        int row = userResumeMapper.deleteUserResume(resume.getId());
        AssertUtils.isTrue(row > 0, ExceptionEnum.BIZ_EXCEPTION);
    }

    /**
     * 把入参里的可变字段落到实体上；resumeJson 不传时保留库里的旧值。
     */
    private void fillResume(UserResume resume, UserResumeSubmitDTO dto) {
        resume.setTitle(dto.getName());
        resume.setLayout(isBlank(dto.getLayout()) ? DEFAULT_LAYOUT : dto.getLayout());
        resume.setThumbnail(dto.getThumbnail() == null ? "" : dto.getThumbnail());
        if (isBlank(resume.getTemplateCode())) {
            resume.setTemplateCode("");
        }
        if (dto.getResumeJson() != null) {
            resume.setResumeJson(JSON.toJSONString(dto.getResumeJson()));
        }
    }

    /**
     * 校验简历存在且属于当前用户。
     */
    private UserResume requireOwnResume(Long id, String uid) {
        AssertUtils.isNotEmpty(id, ExceptionEnum.PARAM_EXCEPTION);
        UserResume resume = userResumeMapper.selectUserResumeById(id, uid);
        AssertUtils.isNotEmpty(resume, ExceptionEnum.BIZ_EXCEPTION.getCode(), "简历不存在或无权访问");
        return resume;
    }

    private UserResumeVO toVO(UserResume resume, boolean withJson) {
        if (resume == null) {
            return null;
        }
        UserResumeVO vo = new UserResumeVO();
        vo.setId(resume.getId());
        vo.setName(resume.getTitle());
        vo.setLayout(resume.getLayout());
        vo.setThumbnail(resume.getThumbnail() == null ? "" : resume.getThumbnail());
        vo.setUpdateTime(resume.getUpdateTime());
        if (withJson) {
            vo.setResumeJson(parseJson(resume.getResumeJson()));
        }
        return vo;
    }

    /**
     * 简历JSON落库时是字符串，返回前端统一解析成对象；脏数据不阻断接口，退化成 null。
     */
    private Object parseJson(String json) {
        if (isBlank(json)) {
            return null;
        }
        try {
            return JSON.parse(json);
        } catch (Exception e) {
            return null;
        }
    }

    private boolean isBlank(String text) {
        return text == null || text.trim().isEmpty();
    }
}
