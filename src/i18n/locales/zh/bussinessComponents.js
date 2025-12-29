// src/components/bussinessComponents下的业务组件国际化

export default {
  materialSelectDialog: {
    title: "选择物料",
    searchPlaceholder: "搜索物料编码、名称或分类...",
    search: "搜索",
    materialCode: "物料编码",
    materialName: "物料名称",
    materialCategory: "物料分类",
    unit: "单位",
    shelfLifeDays: "保质期天数",
    batchManage: "批次管理",
    expiryDateManage: "有效期管理",
    traceabilityRequired: "需要追溯",
    days: "天",
    yes: "是",
    no: "否",
    noData: "暂无数据"
  },
  workOrderSelectDialog: {
    selectWorkOrder: "选择工单",
    searchWorkOrderPlaceholder: "搜索工单编码...",
    search: "搜索",
    workOrderCode: "工单编码",
    materialName: "物料名称",
    status: "状态",
    plannedQuantity: "计划数量",
    completedGoodQty: "合格完成数量",
    receivedQty: "已入库数量",
    availableQty: "可入库数量",
    planCompletionDate: "计划完成日期",
    noAvailableWorkOrders: "暂无可用工单",
    workorderStatus: {
      draft: "草稿",
      released: "已发布",
      inProgress: "进行中",
      paused: "已暂停",
      completed: "已完成",
      cancelled: "已取消"
    }
  }
};