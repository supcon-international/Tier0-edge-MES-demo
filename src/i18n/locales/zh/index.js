// Chinese translations index - aggregated from modules
import components from "./components.js";
import bussinessComponents from "./bussinessComponents.js";
import system from "./system.js";
import example from "./example.js"; // 导入示例模块中文翻译
import unit from "./unit.js"; // 导入计量单位模块中文翻译

export default {
  ...components,
  ...bussinessComponents,
  ...system,
  ...example, // 添加示例模块中文翻译
  ...unit, // 添加计量单位模块中文翻译
};