package com.abc.resume.system.service.impl;

import com.abc.resume.core.base.BaseDescItem;
import com.abc.resume.core.base.BaseService;
import com.abc.resume.enums.ExceptionEnum;
import com.abc.resume.game.domain.entity.Player;
import com.abc.resume.game.domain.entity.Profile;
import com.abc.resume.game.domain.enums.LineupSourceType;
import com.abc.resume.game.domain.enums.ProfessionEnum;
import com.abc.resume.game.domain.enums.ProfileSourceTypeEnum;
import com.abc.resume.game.domain.vo.LineupVO;
import com.abc.resume.game.domain.vo.PlayerVO;
import com.abc.resume.game.domain.vo.ProfileVO;
import com.abc.resume.game.service.LineupService;
import com.abc.resume.game.service.PlayerService;
import com.abc.resume.game.service.ProfileService;
import com.abc.resume.system.domain.entity.Server;
import com.abc.resume.system.domain.vo.ServerEnterVO;
import com.abc.resume.system.domain.vo.ServerListVO;
import com.abc.resume.system.domain.vo.ServerVO;
import com.abc.resume.system.mapper.ServerMapper;
import com.abc.resume.system.service.ServerService;
import com.abc.resume.system.service.UserService;
import com.abc.resume.util.AssertUtils;
import com.abc.resume.util.BeanUtils;
import com.abc.resume.util.SpringUtils;
import com.google.common.collect.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ServerServiceImpl extends BaseService implements ServerService {

    @Autowired
    private ServerMapper serverMapper;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private PlayerService playerService;

    @Autowired
    private LineupService lineupService;

    @Override
    public List<Server> getServerListByUid(Long uid) {
        if (Objects.isNull(uid)) {
            return Lists.newArrayList();
        }
        return Collections.emptyList();
    }

    @Override
    public ServerListVO getServerList() {
        ServerListVO result = new ServerListVO();
        List<Server> serverList = serverMapper.selectServerList();
        result.setServerList(BeanUtils.copyToList(serverList, ServerVO.class));
        return result;
    }

    @Override
    public Server getServerById(Long serverId) {
        AssertUtils.isNotEmpty(serverId, ExceptionEnum.PARAM_EXCEPTION);
        return serverMapper.selectServerByServerId(serverId);
    }

    @Override
    public ServerEnterVO enterServer(Long userId, Long serverId) {
        AssertUtils.isNotEmpty(userId, ExceptionEnum.PARAM_EXCEPTION);
        AssertUtils.isNotEmpty(serverId, ExceptionEnum.PARAM_EXCEPTION);
        ServerEnterVO result = new ServerEnterVO();
        // 查询是否是新用户
        Player player = playerService.getPlayerByUidAndServerId(userId, serverId);
        boolean isNew = Objects.isNull(player);
        result.setIsNew(isNew);
        if (isNew) {
            result.setProfessionList(Arrays.stream(ProfessionEnum.values()).map(item -> new BaseDescItem(item.getType(), item.getDesc())).collect(Collectors.toList()));
            return result;
        }
        // 更新用户最近一次登录
        UserService userService = SpringUtils.getBean(UserService.class);
        userService.updateUserLastServer(userId, serverId);
        Profile profile = profileService.getProfileBySourceIdAndServerIdAndType(player.getPid(), serverId, ProfileSourceTypeEnum.PLAYER.getType());
        // 同步档案缓存
        // RedisUtils.hmset(CacheConstants.getFinalKey(CacheConstants.PLAYER_PROFILE, player.getPid()), BeanUtils.beanToMap(profile));
        // 填充参数
        fillServerEnterVOParams(result, profile, player);
        return result;
    }

    private void fillServerEnterVOParams(ServerEnterVO result, Profile profile, Player player) {
        result.setPlayer(BeanUtils.copyProperties(player, PlayerVO.class));
        result.setProfile(BeanUtils.copyProperties(profile, ProfileVO.class));
        // 阵容列表
        List<LineupVO> lineupList = lineupService.getLineupVOListBySourceIdAndType(profile.getSourceId(), LineupSourceType.PLAYER.getType());
        result.setLineupList(lineupList);
    }
}
