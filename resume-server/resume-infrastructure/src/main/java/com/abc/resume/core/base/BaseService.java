package com.abc.resume.core.base;

import com.abc.resume.core.page.PageResult;
import com.abc.resume.util.PageUtils;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageInfo;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.function.Function;

public class BaseService {

    public <T, OUT> Page<OUT> pageList2CustomList(List<T> pageList, Function<List<T>, List<OUT>> processor) {
        List<OUT> result = processor.apply(pageList);
        Page<OUT> page = new Page<>();
        page.addAll(result);
        page.setTotal(((Page) pageList).getTotal());
        return page;
    }

    protected void startPage() {
        PageUtils.startPage();
    }

    public PageResult buildPageResult(List<?> list) {
        return PageResult.builder()
                .list(list)
                .total(new PageInfo(list).getTotal())
                .build();
    }

    public ResponseEntity<byte[]> download(byte[] fileData, String filename) {
        HttpHeaders headers = new HttpHeaders();
        ContentDisposition contentDisposition = ContentDisposition.builder("attachment")
                .filename(filename, StandardCharsets.UTF_8)
                .build();
        headers.setContentDisposition(contentDisposition);
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(fileData.length)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileData);
    }
}
