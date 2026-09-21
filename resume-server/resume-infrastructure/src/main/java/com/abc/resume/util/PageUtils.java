package com.abc.resume.util;

import com.abc.resume.core.page.PageDTO;
import com.abc.resume.core.page.TableSupport;
import com.github.pagehelper.PageHelper;

public class PageUtils extends PageHelper {

    /**
     * 设置请求分页数据
     */
    public static void startPage() {
        PageDTO pageDomain = TableSupport.buildPageRequest();
        Integer pageNum = pageDomain.getPageNum();
        Integer pageSize = pageDomain.getPageSize();
        String orderBy = SqlUtil.escapeOrderBySql(pageDomain.getOrderBy());
        Boolean reasonable = pageDomain.getReasonable();
        PageHelper.startPage(pageNum, pageSize, orderBy).setReasonable(reasonable);
    }

    /**
     * 清理分页的线程变量
     */
    public static void clearPage() {
        PageHelper.clearPage();
    }
}
