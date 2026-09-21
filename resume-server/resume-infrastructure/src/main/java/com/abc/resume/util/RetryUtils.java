package com.abc.resume.util;

import lombok.extern.slf4j.Slf4j;

import java.util.function.Supplier;

@Slf4j
public class RetryUtils {

    /**
     * 对可能失败的操作进行重试
     * @param maxAttempts 最大重试次数
     * @param delayBetweenAttempts 重试之间的延迟时间（毫秒）
     * @param operation 需要执行的操作，它是一个Supplier<T>，可以返回操作结果
     * @param <T> 操作返回的结果类型
     * @return 操作的返回值
     * @throws Exception 如果重试次数耗尽后仍然失败，则抛出异常
     */
    public static <T> T retryOnFailure(Supplier<T> operation, int maxAttempts, long delayBetweenAttempts) {
        int attempt = 0;
        while (true) {
            try {
                // 尝试执行操作
                return operation.get();
            } catch (Exception e) {
                log.error("重试工具类执行失败，原因：{}，重试次数：{}", e.getMessage(), attempt, e);
                if (++attempt >= maxAttempts) throw e; // 如果超过最大尝试次数，抛出异常
                try {
                    Thread.sleep(delayBetweenAttempts); // 等待一段时间后再次尝试
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Retry operation interrupted", ie);
                }
            }
        }
    }

    /**
     * 为没有返回值的操作提供重试功能的重载方法
     * @param maxAttempts 最大重试次数
     * @param delayBetweenAttempts 重试之间的延迟时间（毫秒）
     * @param operation 需要执行的操作，它是一个Runnable
     */
    public static void retryOnFailure(Runnable operation, int maxAttempts, long delayBetweenAttempts) {
        retryOnFailure(() -> {
            operation.run();
            return null; // 对于Runnable，没有返回值，因此返回null
        }, maxAttempts, delayBetweenAttempts);
    }
}
