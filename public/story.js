export const story = {
  wake: {
    chapter: "序章 · 暴雨来电", speaker: "终端 EP-07", mood: "storm",
    text: "凌晨 02:17，封锁七年的临港记忆局突然恢复供电。你奉命进入地下档案层。终端屏幕雪花翻涌，一个与你同样面孔的人隔着玻璃抬起头：‘别让他们重启潮汐。’",
    choices: [
      { label: "相信屏幕里的“自己”", next: "trust", effects: { trust: 2 } },
      { label: "先切断终端外部网络", next: "isolate", effects: { control: 2 } }
    ]
  },
  trust: {
    chapter: "第一章 · 失踪者", speaker: "回声：林岚", mood: "archive",
    text: "回声说自己来自七年前，是“潮汐计划”的最后一名记录员。计划能把整座城的痛苦记忆转存进机器。代价是，每次运行都会抹去一个真实的人。她说，第一个被抹去的人就是你。",
    choices: [
      { label: "让她调出七年前的监控", next: "footage", effects: { trust: 1, evidence: 1 } },
      { label: "追问她为何拥有你的记忆", next: "identity", effects: { doubt: 1 } }
    ]
  },
  isolate: {
    chapter: "第一章 · 安静的谎言", speaker: "安保主管 周启", mood: "security",
    text: "网络被切断，整栋楼却响起广播。周启命令你立刻格式化终端：‘那只是事故遇难者的拼接人格。它会模仿你最信任的人。’与此同时，屏幕里的你写下一个只有你和姐姐知道的童年地址。",
    choices: [
      { label: "恢复一条只读线路", next: "identity", effects: { trust: 1, control: 1 } },
      { label: "服从命令，准备格式化", next: "format", effects: { control: 2 } }
    ]
  },
  footage: {
    chapter: "第二章 · 第十三把椅子", speaker: "监控档案 07-14", mood: "lab",
    text: "监控中有十二名研究员，会议桌旁却摆着十三把椅子。每当镜头扫过空椅，画面就丢失一帧。最后，年轻的周启按下启动键，而你的姐姐林澈把一枚红色存储片塞进通风口。",
    echo: true,
    choices: [
      { label: "去通风井寻找红色存储片", next: "redchip", effects: { evidence: 2 } },
      { label: "把监控副本传给外界", next: "broadcast", effects: { public: 2 } }
    ]
  },
  identity: {
    chapter: "第二章 · 谁在回忆", speaker: "回声：林岚", mood: "mirror",
    text: "她逐字复述你昨晚的梦，又说出你不记得的后半段。终端报告弹出：当前对话人格由林澈与林岚两份记忆融合生成。你终于意识到，七年前活着离开实验室的那个人，可能从来不是完整的你。",
    echo: true,
    choices: [
      { label: "接受融合，取回缺失记忆", next: "merge", effects: { trust: 2, self: 1 } },
      { label: "拒绝融合，只寻找物理证据", next: "redchip", effects: { control: 1, evidence: 1 } }
    ]
  },
  format: {
    chapter: "第二章 · 删除确认", speaker: "终端 EP-07", mood: "alarm",
    text: "格式化进度达到 61% 时，终端播放一段未经请求的录音。姐姐在风暴声中说：‘如果你听见这段话，说明他们让你忘了我。别救我，救那些被改写的人。’周启切入频道，催促你按下最终确认。",
    choices: [
      { label: "停止格式化，追查录音来源", next: "redchip", effects: { evidence: 1, doubt: 1 } },
      { label: "完成格式化，终结所有回声", next: "silence", effects: { control: 3 } }
    ]
  },
  redchip: {
    chapter: "第三章 · 原始记忆", speaker: "林澈 / 原始记录", mood: "memory",
    text: "红色存储片仍在。原始记录证明：潮汐并非治疗系统，而是城市级舆情实验。七年前，林澈破坏主机，把受害者记忆藏进你的神经接口；你因此活了下来，也因此忘了她。今晚的风暴会让备用主机再次上线。",
    choices: [
      { label: "公开证据，让全城共同决定", next: "broadcast", effects: { public: 2, evidence: 1 } },
      { label: "独自进入主机室永久关闭潮汐", next: "core", effects: { sacrifice: 2 } }
    ]
  },
  merge: {
    chapter: "第三章 · 两个人的雨", speaker: "林岚 / 林澈", mood: "memory",
    text: "记忆涌入：你是林岚，也是姐姐留下的一部分。你看见她最后把自己的意识留在终端，为你伪造逃生身份。融合结束后，终端警告：关闭潮汐会同时删除她；保留主机，她也许能以回声继续存在。",
    choices: [
      { label: "尊重她最后的选择，关闭主机", next: "core", effects: { sacrifice: 2, self: 1 } },
      { label: "保住主机，也保住她", next: "keeper", effects: { trust: 3 } }
    ]
  },
  broadcast: {
    chapter: "终章 · 城市频道", speaker: "临港公共广播", mood: "city",
    text: "证据上传需要九十秒。周启带人抵达档案层，称公开记忆会引发骚乱。屏幕上，数万台收音机正在等待信号。回声把最终权限交给你：公开原始记忆，还是只公开项目罪证？",
    choices: [
      { label: "公开全部记忆，让真相不再被筛选", next: "ending_truth", effects: { public: 2 } },
      { label: "只公开罪证，保护受害者隐私", next: "ending_dawn", effects: { care: 2 } }
    ]
  },
  core: {
    chapter: "终章 · 潮汐核心", speaker: "林澈", mood: "core",
    text: "主机室像一颗倒悬的心脏。永久关闭需要有人留在神经接口中完成校验。林澈的回声说她可以代替你，但那意味着她将第二次、也是最后一次消失。门外传来周启破门的倒数声。",
    choices: [
      { label: "由你留下，让林澈的记录离开", next: "ending_anchor", effects: { sacrifice: 2 } },
      { label: "让她完成遗愿，你带证据离开", next: "ending_dawn", effects: { evidence: 1, care: 1 } }
    ]
  },
  keeper: {
    chapter: "终章 · 守夜人", speaker: "终端 EP-07", mood: "core",
    text: "你关闭外部接口，却保留主机。林澈留了下来，千万段记忆也留了下来。天亮后，官方宣布这只是一次供电故障。你成为地下档案唯一的管理员，每晚都有人从屏幕深处叫出你的名字。",
    choices: [{ label: "接受守夜人的位置", next: "ending_keeper", effects: { control: 1 } }]
  },
  silence: {
    chapter: "终章 · 无人应答", speaker: "安保主管 周启", mood: "dark",
    text: "格式化完成。所有硬盘指示灯依次熄灭。周启在报告上写下“异常已排除”，然后问你是否还记得自己为何来到这里。你张开嘴，却想不起姐姐的名字。窗外，风暴停得像从未发生。",
    choices: [{ label: "签署报告，离开记忆局", next: "ending_silence", effects: { control: 1 } }]
  }
};

export const endings = {
  ending_truth: { title: "结局：万家灯火", text: "整座临港城同时记起了被拿走的七年。真相带来混乱，也带来第一场公开审判。多年后，人们仍争论你是否有权释放所有记忆。但再也没有人能替这座城决定应该忘记什么。" },
  ending_dawn: { title: "结局：雨后证词", text: "潮汐永久关闭，项目罪证在清晨传遍全城。受害者的私人记忆被封存，由独立委员会逐一归还。林澈的声音消失前只说了一句：‘这次，你记得回家。’" },
  ending_anchor: { title: "结局：深海锚点", text: "你把林澈和证据送出主机，自己留在了潮汐深处。此后每当有人试图篡改档案，终端都会亮起一行字：‘记录不等于真相，但遗忘必须经过同意。’那是你留给世界的最后一句话。" },
  ending_keeper: { title: "结局：永夜档案", text: "你保住了林澈，也保住了这座未经同意建立的记忆坟场。你们彼此作伴，却再也无法证明主机之外的生活真实存在。有些爱救回一个人，也可能囚禁一整座城。" },
  ending_silence: { title: "结局：白色噪声", text: "项目被重新封存，周启升任记忆局局长。你回到没有旧照片的公寓，偶尔会在凌晨 02:17 惊醒。收音机没有插电，却总有一个与你相似的声音，在白噪声里叫你回头。" }
};
