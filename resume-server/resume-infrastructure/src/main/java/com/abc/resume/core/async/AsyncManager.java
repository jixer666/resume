package com.abc.resume.core.async;

import com.abc.resume.util.SpringUtils;
import com.abc.resume.util.ThreadUtils;

import java.util.TimerTask;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 异步任务管理器
 *
 * @author LiJunXi
 */
public class AsyncManager {
    /**
     * 操作延迟10毫秒
     */
    private final int OPERATE_DELAY_TIME = 10;

    /**
     * 异步操作任务调度线程池
     */
    private ScheduledExecutorService executor = SpringUtils.getBean("scheduledExecutorService");

    /**
     * 单例模式
     */
    private AsyncManager() {
    }

    private static AsyncManager me = new AsyncManager();

    public static AsyncManager me() {
        return me;
    }

    /**
     * 执行延迟任务
     *
     * @param task 任务
     */
    public void execute(TimerTask task) {
        executor.schedule(task, OPERATE_DELAY_TIME, TimeUnit.MILLISECONDS);
    }

    /**
     * 执行延迟任务（自定义延迟时间）
     *
     * @param task 任务
     * @param delay 延迟时间
     * @param unit 时间单位
     */
    public void execute(TimerTask task, long delay, TimeUnit unit) {
        executor.schedule(task, delay, unit);
    }

    /**
     * 执行固定延迟的周期性任务（每次执行完成后延迟指定时间再执行下一次）
     *
     * @param task 任务
     * @param initialDelay 首次执行延迟时间
     * @param delay 每次执行完成后的延迟时间
     * @param unit 时间单位
     */
    public void scheduleWithFixedDelay(TimerTask task, long initialDelay, long delay, TimeUnit unit) {
        executor.scheduleWithFixedDelay(task, initialDelay, delay, unit);
    }

    /**
     * 执行固定频率的周期性任务（按固定频率执行，不受任务执行时间影响）
     *
     * @param task 任务
     * @param initialDelay 首次执行延迟时间
     * @param period 执行周期
     * @param unit 时间单位
     */
    public void scheduleAtFixedRate(TimerTask task, long initialDelay, long period, TimeUnit unit) {
        executor.scheduleAtFixedRate(task, initialDelay, period, unit);
    }

    /**
     * 执行固定延迟的周期性任务（使用默认延迟10毫秒）
     *
     * @param task 任务
     * @param period 执行周期
     * @param unit 时间单位
     */
    public void scheduleWithFixedDelay(TimerTask task, long period, TimeUnit unit) {
        executor.scheduleWithFixedDelay(task, OPERATE_DELAY_TIME, period, unit);
    }

    /**
     * 执行固定频率的周期性任务（使用默认延迟10毫秒）
     *
     * @param task 任务
     * @param period 执行周期
     * @param unit 时间单位
     */
    public void scheduleAtFixedRate(TimerTask task, long period, TimeUnit unit) {
        executor.scheduleAtFixedRate(task, OPERATE_DELAY_TIME, period, unit);
    }

    /**
     * 取消任务
     *
     * @param task 要取消的任务
     * @param mayInterruptIfRunning 是否中断正在运行的任务
     * @return 是否取消成功
     */
    public boolean cancelTask(TimerTask task, boolean mayInterruptIfRunning) {
        // TimerTask 的 cancel 方法
        return task.cancel();
    }

    /**
     * 停止任务线程池
     */
    public void shutdown() {
        ThreadUtils.shutdownAndAwaitTermination(executor);
    }
}