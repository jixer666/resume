package com.abc.resume.core.cache;

import com.abc.resume.util.CollectionUtils;
import com.abc.resume.util.RedisUtils;
import org.springframework.data.util.Pair;

import java.lang.reflect.ParameterizedType;
import java.util.*;
import java.util.stream.Collectors;

public abstract class AbstractRedisStringCache<IN,OUT> implements BatchCache<IN, OUT> {

    private Class<OUT> outClass;

    protected AbstractRedisStringCache() {
        ParameterizedType genericSuperclass = (ParameterizedType) this.getClass().getGenericSuperclass();
        this.outClass = (Class<OUT>) genericSuperclass.getActualTypeArguments()[1];
    }

    @Override
    public OUT get(IN req) {
        return getBatch(Collections.singletonList(req)).get(req);
    }

    @Override
    public Map<IN, OUT> getBatch(List<IN> req) {
        if (CollectionUtils.isEmpty(req)){
            return new HashMap<>();
        }
        // 去掉重复的数据
        req = req.stream().distinct().collect(Collectors.toList());
        // 组装key
        List<String> keys = req.stream().map(this::getKey).collect(Collectors.toList());
        // 批量get
        List<OUT> valueList = RedisUtils.mget(keys, outClass);
        // 计算redis中未存在的数据
        List<IN> loadReqs = new ArrayList<>();
        for (int i = 0; i < valueList.size(); i++) {
            // 当查找Redis中key不存在的时候，value就会为null
            if (Objects.isNull(valueList.get(i))) {
                loadReqs.add(req.get(i));
            }
        }
        // 只保存不存在的数据，将List转为Map保存到Redis
        Map<IN, OUT> load = new HashMap<>();
        if (CollectionUtils.isNotEmpty(loadReqs)) {
            // 批量load，调用具体实现类的方法
            load = load(loadReqs);
            Map<String, OUT> loadMap = load.entrySet().stream()
                    .map(a -> Pair.of(getKey(a.getKey()), a.getValue()))
                    .collect(Collectors.toMap(Pair::getFirst, Pair::getSecond));
            // 将需要保存到map保存进Redis
            RedisUtils.mset(loadMap, getExpireSeconds());
        }
        // 组装最后的结果
        Map<IN, OUT> resultMap = new HashMap<>();
        for (int i = 0; i < req.size(); i++) {
            IN in = req.get(i);
            // 现在之前的列表找，不存在再在找出的Map找
            OUT out = Optional.ofNullable(valueList.get(i))
                    .orElse(load.get(in));
            resultMap.put(in, out);
        }
        return resultMap;
    }

    @Override
    public void delete(IN req) {
        deleteBatch(Collections.singletonList(req));
    }

    @Override
    public void deleteBatch(List<IN> req) {
        List<String> keys = req.stream().map(this::getKey).collect(Collectors.toList());
        RedisUtils.del(keys);
    }

    public Boolean update(IN in, OUT out) {
        return RedisUtils.update(getKey(in), out);
    }

    /**
     * key
     * @param id
     * @return
     */
    protected abstract String getKey(IN id);

    /**
     * 需要保存的列表
     * @param ids @return
     */
    protected abstract Map<IN, OUT> load(List<IN> ids);

    /**
     * 有效时间
     * @return
     */
    protected abstract Long getExpireSeconds();
}