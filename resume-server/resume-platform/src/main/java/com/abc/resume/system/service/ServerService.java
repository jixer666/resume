package com.abc.resume.system.service;

import com.abc.resume.system.domain.entity.Server;
import com.abc.resume.system.domain.vo.ServerEnterVO;
import com.abc.resume.system.domain.vo.ServerListVO;

import java.util.List;

public interface ServerService {

    List<Server> getServerListByUid(Long uid);

    ServerListVO getServerList();

    Server getServerById(Long serverId);

    ServerEnterVO enterServer(Long userId, Long serverId);
}
