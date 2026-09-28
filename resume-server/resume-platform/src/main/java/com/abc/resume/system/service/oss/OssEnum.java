package com.abc.resume.system.service.oss;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OssEnum {

    MINIO(1, "Minio"),
    ALIYUN(2, "阿里云"),
    LOCAL(3, "本地")
    ;

    private int type;
    private String ossKey;

    public static OssEnum typeOf(Integer type) {
        for (OssEnum ossEnum : OssEnum.values()) {
            if (ossEnum.type == type) {
                return ossEnum;
            }
        }
        return null;
    }
}