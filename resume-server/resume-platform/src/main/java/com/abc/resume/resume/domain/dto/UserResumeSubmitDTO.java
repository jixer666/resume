package com.abc.resume.resume.domain.dto;

import com.abc.resume.resume.domain.entity.resume.UserResumeDetail;
import lombok.Data;

/**
 * 用户简历提交入参：新增 / 更新 / 复制 / 删除共用一个入口，由 act 区分走哪条逻辑。
 *
 * @author LiJunXi
 * @date 2026/9/25
 */
@Data
public class UserResumeSubmitDTO {

    /** 新增简历 */
    public static final int ADD = 0;

    /** 更新简历 */
    public static final int UPDATE = 1;

    /** 删除简历 */
    public static final int DELETE = 2;

    /** 复制简历 */
    public static final int COPY = 3;

    /** 操作类型，取值见本类常量 */
    private int act;

    /** 主键：更新 / 复制 / 删除时必填，新增时为空 */
    private Long id;

    /** 缩略图地址，可不传 */
    private String thumbnail;

    /** 模板编码 */
    private String templateCode;

    /** 整份简历详情 */
    private UserResumeDetail resumeDetail;

}
