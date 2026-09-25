package com.abc.resume.resume.service.impl;

import cn.hutool.core.util.StrUtil;
import com.abc.resume.core.base.BaseService;
import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.core.page.PageResult;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.resume.domain.dto.ResumeSaveDTO;
import com.abc.resume.resume.domain.entity.Resume;
import com.abc.resume.resume.domain.vo.ResumeVO;
import com.abc.resume.resume.mapper.ResumeMapper;
import com.abc.resume.resume.service.ResumeService;
import com.abc.resume.util.AssertUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.pagehelper.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ResumeServiceImpl extends BaseService implements ResumeService {

    /** 简历JSON最大长度（字符） */
    private static final int MAX_JSON_LENGTH = 1024 * 1024;
    /** 简历模块数量上限 */
    private static final int MAX_COMPONENTS = 100;
    private static final int MAX_TITLE_LENGTH = 128;
    private static final int MAX_LAYOUT_LENGTH = 64;
    private static final int MAX_THUMBNAIL_LENGTH = 512;
    /** 复制简历时的名称后缀 */
    private static final String COPY_SUFFIX = " 副本";

    @Autowired
    private ResumeMapper resumeMapper;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public ResumeVO save(String userId, ResumeSaveDTO saveDTO) {
        AssertUtils.isNotEmpty(userId, ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isNotEmpty(saveDTO, ExceptionEnum.PARAM_EXCEPTION);

        JsonNode resumeJson = saveDTO.getResumeJson();
        validateResumeJson(resumeJson);
        String title = resolveTitle(saveDTO.getName(), resumeJson);
        String layout = resolveText(saveDTO.getLayout(), MAX_LAYOUT_LENGTH, "布局标识过长");
        String thumbnail = resolveText(saveDTO.getThumbnail(), MAX_THUMBNAIL_LENGTH, "缩略图地址过长");
        // 列表名称与JSON内的NAME保持同一份事实，落库前统一
        String json = writeTitleIntoJson(resumeJson, title);

        Resume resume;
        if (Objects.isNull(saveDTO.getId())) {
            resume = new Resume();
            resume.setCommonParams();
        } else {
            resume = getOwnedResume(saveDTO.getId(), userId);
        }
        resume.setUserId(userId);
        resume.setTitle(title);
        resume.setResumeJson(json);
        resume.setLayout(layout);
        resume.setThumbnail(thumbnail);
        resume.setUpdateTime(new Date());

        if (Objects.isNull(saveDTO.getId())) {
            AssertUtils.isTrue(resumeMapper.insertResume(resume) > 0, ExceptionEnum.BIZ_EXCEPTION.getCode(), "简历保存失败");
        } else {
            AssertUtils.isTrue(resumeMapper.updateResume(resume) > 0, ExceptionEnum.BIZ_EXCEPTION.getCode(), "简历保存失败");
        }
        return toVO(resume, true);
    }

    @Override
    public PageResult list(String userId) {
        AssertUtils.isNotEmpty(userId, ExceptionEnum.PARAM_EXCEPTION);
        startPage();
        List<Resume> resumeList = resumeMapper.selectResumeList(userId);
        // 必须走 pageList2CustomList，否则 buildPageResult 取不到分页总数
        Page<ResumeVO> page = pageList2CustomList(resumeList,
                list -> list.stream().map(item -> toVO(item, false)).collect(Collectors.toList()));
        return buildPageResult(page);
    }

    @Override
    public ResumeVO detail(String userId, Long id) {
        AssertUtils.isNotEmpty(userId, ExceptionEnum.PARAM_EXCEPTION);
        return toVO(getOwnedResume(id, userId), true);
    }

    @Override
    public ResumeVO copy(String userId, Long id) {
        AssertUtils.isNotEmpty(userId, ExceptionEnum.PARAM_EXCEPTION);
        Resume source = getOwnedResume(id, userId);
        String title = buildCopyTitle(source.getTitle());

        Resume resume = new Resume();
        resume.setUserId(userId);
        resume.setTitle(title);
        resume.setLayout(source.getLayout());
        resume.setThumbnail(source.getThumbnail());
        resume.setResumeJson(writeTitleIntoJson(readResumeJson(source.getResumeJson()), title));
        resume.setCommonParams();
        AssertUtils.isTrue(resumeMapper.insertResume(resume) > 0, ExceptionEnum.BIZ_EXCEPTION.getCode(), "简历复制失败");
        return toVO(resume, true);
    }

    @Override
    public void delete(String userId, Long id) {
        AssertUtils.isNotEmpty(userId, ExceptionEnum.PARAM_EXCEPTION);
        getOwnedResume(id, userId);
        AssertUtils.isTrue(resumeMapper.deleteResumeById(id, new Date()) > 0, ExceptionEnum.BIZ_EXCEPTION.getCode(), "简历删除失败");
    }

    /**
     * 校验简历JSON结构（外部输入真边界）
     */
    private void validateResumeJson(JsonNode resumeJson) {
        int code = ExceptionEnum.PARAM_EXCEPTION.getCode();
        AssertUtils.isTrue(Objects.nonNull(resumeJson) && !resumeJson.isNull(), code, "简历内容不能为空");
        AssertUtils.isTrue(resumeJson.isObject(), code, "简历内容格式错误");
        AssertUtils.isTrue(resumeJson.toString().length() <= MAX_JSON_LENGTH, code, "简历内容过大，无法保存");

        JsonNode layout = resumeJson.get("LAYOUT");
        AssertUtils.isTrue(Objects.nonNull(layout) && layout.isTextual() && StrUtil.isNotBlank(layout.asText()), code, "简历缺少布局信息");

        JsonNode components = resumeJson.get("COMPONENTS");
        AssertUtils.isTrue(Objects.nonNull(components) && components.isArray(), code, "简历缺少模块列表");
        AssertUtils.isTrue(components.size() <= MAX_COMPONENTS, code, "简历模块数量超出上限");
        for (JsonNode item : components) {
            AssertUtils.isTrue(item.isObject(), code, "简历模块格式错误");
            AssertUtils.isTrue(isNotBlankText(item.get("model")), code, "简历模块缺少类型");
            AssertUtils.isTrue(isNotBlankText(item.get("cptName")), code, "简历模块缺少名称");
        }

        JsonNode globalStyle = resumeJson.get("GLOBAL_STYLE");
        AssertUtils.isTrue(Objects.nonNull(globalStyle) && globalStyle.isObject(), code, "简历缺少全局样式");
    }

    private boolean isNotBlankText(JsonNode node) {
        return Objects.nonNull(node) && node.isTextual() && StrUtil.isNotBlank(node.asText());
    }

    /**
     * 简历名称以入参为准，入参为空时回退到JSON内的NAME
     */
    private String resolveTitle(String name, JsonNode resumeJson) {
        String title = name;
        if (StrUtil.isBlank(title)) {
            title = isNotBlankText(resumeJson.get("NAME")) ? resumeJson.get("NAME").asText() : null;
        }
        int code = ExceptionEnum.PARAM_EXCEPTION.getCode();
        AssertUtils.isTrue(StrUtil.isNotBlank(title), code, "简历名称不能为空");
        title = StrUtil.trim(title);
        AssertUtils.isTrue(title.length() <= MAX_TITLE_LENGTH, code, "简历名称过长");
        return title;
    }

    private String resolveText(String value, int maxLength, String message) {
        String text = StrUtil.trim(value);
        AssertUtils.isTrue(StrUtil.length(text) <= maxLength, ExceptionEnum.PARAM_EXCEPTION.getCode(), message);
        return text;
    }

    private String buildCopyTitle(String title) {
        String copyTitle = StrUtil.trim(title) + COPY_SUFFIX;
        return StrUtil.sub(copyTitle, 0, MAX_TITLE_LENGTH);
    }

    /**
     * 把名称写回JSON，避免列表名称与JSON内NAME分叉
     */
    private String writeTitleIntoJson(JsonNode resumeJson, String title) {
        ((ObjectNode) resumeJson).put("NAME", title);
        return resumeJson.toString();
    }

    private JsonNode readResumeJson(String resumeJson) {
        AssertUtils.isNotEmpty(resumeJson, ExceptionEnum.SYSTEM_EXCEPTION.getCode(), "简历内容缺失");
        try {
            return objectMapper.readTree(resumeJson);
        } catch (JsonProcessingException e) {
            throw new GlobalException(ExceptionEnum.SYSTEM_EXCEPTION.getCode(), "简历内容解析失败");
        }
    }

    private Resume getOwnedResume(Long id, String userId) {
        AssertUtils.isNotEmpty(id, ExceptionEnum.PARAM_EXCEPTION);
        Resume resume = resumeMapper.selectResumeById(id);
        AssertUtils.isNotEmpty(resume, ExceptionEnum.BIZ_EXCEPTION.getCode(), "简历不存在");
        AssertUtils.isTrue(Objects.equals(resume.getUserId(), userId),
                ExceptionEnum.UNAUTHORIZED_EXCEPTION.getCode(), "无权访问该简历");
        return resume;
    }

    private ResumeVO toVO(Resume resume, boolean withJson) {
        ResumeVO resumeVO = new ResumeVO();
        resumeVO.setId(resume.getId());
        resumeVO.setName(resume.getTitle());
        resumeVO.setLayout(resume.getLayout());
        resumeVO.setThumbnail(resume.getThumbnail());
        resumeVO.setUpdateTime(resume.getUpdateTime());
        if (withJson) {
            resumeVO.setResumeJson(readResumeJson(resume.getResumeJson()));
        }
        return resumeVO;
    }

}
