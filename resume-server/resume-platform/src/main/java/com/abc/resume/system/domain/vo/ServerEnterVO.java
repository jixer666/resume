package com.abc.resume.system.domain.vo;

import com.abc.resume.core.base.BaseDescItem;
import com.abc.resume.game.domain.vo.LineupVO;
import com.abc.resume.game.domain.vo.PlayerInfoVO;
import lombok.Data;

import java.util.List;

@Data
public class ServerEnterVO extends PlayerInfoVO {

    private Boolean isNew;

    private List<BaseDescItem> professionList;

    private List<LineupVO> lineupList;

}
