package com.abc.resume.core.page;

import cn.hutool.core.convert.Convert;
import com.abc.resume.util.ServletUtils;

public class TableSupport {
    /**
     * 当前记录起始索引
     */
    public static final String PAGE_NUM = "pageNum";

    /**
     * 每页显示记录数
     */
    public static final String PAGE_SIZE = "pageSize";

    /**
     * 排序列
     */
    public static final String ORDER_BY_COLUMN = "orderByColumn";

    /**
     * 排序的方向 "desc" 或者 "asc".
     */
    public static final String IS_ASC = "isAsc";

    /**
     * 分页参数合理化
     */
    public static final String REASONABLE = "reasonable";

    /**
     * 封装分页对象
     */
    public static PageDTO getPageDTO() {
        PageDTO page = new PageDTO();
        page.setPageNum(Convert.toInt(ServletUtils.getParameter(PAGE_NUM), 1));
        page.setPageSize(Convert.toInt(ServletUtils.getParameter(PAGE_SIZE), 1000));
        page.setOrderByColumn(ServletUtils.getParameter(ORDER_BY_COLUMN));
        page.setIsAsc(ServletUtils.getParameter(IS_ASC));
        page.setReasonable(ServletUtils.getParameterToBool(REASONABLE));
        return page;
    }

    public static PageDTO buildPageRequest() {
        return getPageDTO();
    }
}
