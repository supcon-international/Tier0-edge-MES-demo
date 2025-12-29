export default {
  template: {
    pageTitle: "Template workspace",
    pageDescription:
      "A starter page that follows the high-contrast, card-first layout and i18n conventions.",
    search: {
      title: "Search",
      description:
        "Use consistent spacing, card boundaries, and dark primary buttons for key actions.",
      keyword: "Keyword",
      status: "Status",
      owner: "Owner",
      updatedAt: "Updated",
    },
    table: {
      title: "Work items",
      columns: {
        name: "Name",
        status: "Status",
        owner: "Owner",
        updatedAt: "Updated at",
        priority: "Priority",
      },
      actions: {
        view: "View detail",
        edit: "Edit",
      },
      empty: "No data yet. Start by creating a record.",
    },
    badge: {
      draft: "Draft",
      inProgress: "In Progress",
      completed: "Completed",
      blocked: "Blocked",
    },
    toast: {
      search: "Filters applied",
      reset: "Filters cleared",
    },
  },
}

