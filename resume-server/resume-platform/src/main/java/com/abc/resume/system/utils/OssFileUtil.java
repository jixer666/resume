package com.abc.resume.system.utils;

import cn.hutool.extra.spring.SpringUtil;
import com.j256.simplemagic.ContentInfo;
import com.j256.simplemagic.ContentInfoUtil;
import org.springframework.core.env.Environment;
import org.springframework.http.MediaType;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Objects;

public class OssFileUtil {

    public static final String FILE_DOWNLOAD_URL = "/system/oss/download/";

    /**
     * 获取文件后缀
     * @param fileName
     * @return
     */
    public static String getFileExtension(String fileName) {
        int lastIndexOfDot = fileName.lastIndexOf(".");
        if (lastIndexOfDot == -1) {
            // 如果文件名没有扩展名，返回空字符串
            return "";
        }
        return fileName.substring(lastIndexOfDot + 1);
    }

    /**
     * 获取文件上传路径
     * @param extension
     * @param fileMd5
     * @return
     */
    public static String getFileUploadPath(String extension, String fileMd5) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String absolutePath = sdf.format(new Date()).replace("-", "/");
        return absolutePath + '/' + getMd5FileName(fileMd5, extension);
    }

    public static String getMd5FileName(String fileMd5, String extension) {
        return fileMd5 + "." + extension;
    }

    /**
     * 获取minio中的mime类型
     * @param extension
     * @return
     */
    public static String getMimeType(String extension) {
        if (Objects.isNull(extension)){
            extension = "";
        }
        ContentInfo extensionMatch = ContentInfoUtil.findExtensionMatch(extension);
        String mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE;  // 通用mimeType，字节流
        if (Objects.nonNull(extensionMatch)){
            mimeType = extensionMatch.getMimeType();
        }
        return mimeType;

    }

    /**
     * 获取文件下载链接
     * @param fileId
     * @param fileId
     * @return
     */
    public static String getFileDownloadUrl(Long fileId) {
        Environment environment = SpringUtil.getBean(Environment.class);
        return environment.getProperty("url.backend") + FILE_DOWNLOAD_URL + fileId;
    }
}
