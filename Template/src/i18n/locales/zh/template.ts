export default {
  template: {
    pageTitle: "模板示例工作台",
    pageDescription: "遵循高对比度、Card 包裹与 i18n 规范的起步页面。",
    search: {
      title: "查询条件",
      description: "使用留白+Card 边界，主操作采用深色按钮，保持网格对齐。",
      keyword: "关键字",
      status: "状态",
      owner: "负责人",
      updatedAt: "更新时间",
    },
    table: {
      title: "示例任务列表",
      columns: {
        name: "名称",
        status: "状态",
        owner: "负责人",
        updatedAt: "更新时间",
        priority: "优先级",
      },
      actions: {
        view: "查看详情",
        edit: "编辑",
      },
      empty: "暂无数据，请先新建记录。",
    },
    badge: {
      draft: "草稿",
      inProgress: "进行中",
      completed: "已完成",
      blocked: "阻塞",
    },
    toast: {
      search: "已应用筛选条件",
      reset: "已清空筛选条件",
    },
  },
}

