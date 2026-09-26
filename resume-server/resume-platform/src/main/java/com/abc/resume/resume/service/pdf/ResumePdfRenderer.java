package com.abc.resume.resume.service.pdf;

import com.abc.resume.core.exception.GlobalException;
import com.abc.resume.enums.ExceptionEnum;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.options.LoadState;
import com.microsoft.playwright.options.Margin;
import com.microsoft.playwright.options.WaitUntilState;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * 简历 PDF 渲染器：无头浏览器打开 H5 导出预览页，再按 A4 打印成 PDF。
 * <p>
 * 不在 Java 侧重写渲染逻辑 —— 简历物料有近两百套皮肤（Vue SFC + scoped SCSS），
 * 后端无法复用；所以让浏览器去跑前端已有的预览页，所见即所得。
 */
@Slf4j
@Component
public class ResumePdfRenderer {

    @Value("${resume.system.export.preview-url}")
    private String previewUrl;

    @Value("${resume.system.export.timeout}")
    private double timeout;

    @Autowired
    @Qualifier("commonTaskExecutor")
    private ThreadPoolTaskExecutor threadPoolTaskExecutor;

    /**
     * A4 纸宽（px）
     */
    private static final int VIEWPORT_WIDTH = 794;
    /**
     * A4 纸高（px）
     */
    private static final int VIEWPORT_HEIGHT = 1123;
    /**
     * 简历渲染完成的标志：ResumeRender 的根节点，数据没到位时不会出现
     */
    private static final String RESUME_SELECTOR = ".rs-page";
    private Playwright playwright;
    private Browser browser;


    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        threadPoolTaskExecutor.execute(() -> {
            playwright = Playwright.create();
            browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true));
            log.info("简历导出浏览器初始化完成");
        });
    }

    /**
     * 把简历打印成 PDF。
     * <p>
     * Playwright 的对象不是线程安全的，且单个 Chromium 实例渲染大文档很吃资源，
     * 所以这里串行化导出 —— 简历导出是低频操作，排队比并发崩掉划算。
     *
     * @param id    简历主键
     * @param token 当前请求的 JWT（H5 预览页拿它自取详情）
     * @return PDF 字节流
     */
    public synchronized byte[] render(Long id, String token) {
        Page page = null;
        try {
            page = newPage(id, token);
            return page.pdf(new Page.PdfOptions()
                    .setFormat("A4")
                    // 主题色块、左右栏底色都是背景，不打印就只剩黑白文字
                    .setPrintBackground(true)
                    // 预览页自身已按 A4 宽排版，页边距再留白会把内容挤窄
                    .setMargin(new Margin().setTop("0").setRight("0").setBottom("0").setLeft("0")));
        } catch (Exception e) {
            log.error("简历导出 PDF 失败, id={}", id, e);
            throw new GlobalException(ExceptionEnum.BIZ_EXCEPTION.getCode(), "简历导出失败");
        } finally {
            if (page != null) {
                page.context().close();
            }
        }
    }

    /**
     * 开一个干净的浏览器上下文打开导出预览页，等简历真正渲染出来。
     * <p>
     * 每次导出都新开 context：预览页要把 URL 里的 token 写进 storage，
     * 复用上下文会把上一份简历的登录态和缓存带过来。
     */
    private Page newPage(Long id, String token) {
        Page page = browser.newContext(new Browser.NewContextOptions()
                        .setViewportSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT))
                .newPage();
        page.setDefaultTimeout(timeout);
        page.setDefaultNavigationTimeout(timeout);
        page.navigate(buildUrl(id, token), new Page.NavigateOptions().setWaitUntil(WaitUntilState.LOAD));
        // 简历详情是进页面后异步拉的，navigate 返回不代表内容已渲染
        page.waitForSelector(RESUME_SELECTOR);
        // 等字体、图片等静态资源收尾，否则 PDF 里可能缺字或少图
        page.waitForLoadState(LoadState.NETWORKIDLE);
        return page;
    }

    private String buildUrl(Long id, String token) {
        String separator = previewUrl.contains("?") ? "&" : "?";
        return previewUrl + separator + "id=" + id + "&token=" + urlEncode(token);
    }

    /**
     * token 是 JWT，含 `.` / `-` / `_` 等安全字符，编码只为兜底
     */
    private String urlEncode(String value) {
        try {
            return URLEncoder.encode(value, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            return value;
        }
    }

    @PreDestroy
    public void destroy() {
        if (browser != null) {
            browser.close();
            browser = null;
        }
        if (playwright != null) {
            playwright.close();
            playwright = null;
        }
    }
}
