# 国际化(i18n)使用说明

本项目使用 react-i18next 作为国际化解决方案，支持多语言切换和动态加载语言包。

## 目录结构

```
src/i18n/
├── globals.d.ts      # TypeScript全局类型定义
├── unit.ts          # i18n配置和初始化
└── locales/          # 语言包目录
    ├── en/            # 英文语言包
    │   ├── index.js   # 英文语言包入口
    │   ├── example.js # 示例模块英文词条
    │   ├── components.js # 公共组件英文翻译
    │   └── bussinessComponents.js # 公共业务组件英文翻译
    └── zh/            # 中文语言包
        ├── index.js   # 中文语言包入口
        ├── example.js # 示例模块中文词条
        ├── components.js # 公共组件中文翻译
        └── bussinessComponents.js # 公共业务组件中文翻译
```

## 模块划分

语言包按照业务模块进行划分，每个模块对应一个独立的语言文件：

1. **按功能模块划分**：如 example.js, user.js, dashboard.js 等
2. **公共组件国际化**：公共UI组件的翻译词条放在 components.js 中
3. **公共业务组件国际化**：公共业务组件的翻译词条放在 bussinessComponents.js 中

每个语言文件都包含该模块所需的所有翻译词条，便于维护和管理。

## 词条层级定义

词条采用层级结构，使用点号(.)分隔不同层级：

```javascript
// 示例模块词条结构
{
  // 一级：页面标题
  "example": {
    // 二级：功能区域
    "title": "示例页面",
    "header": {
      // 三级：具体元素
      "title": "示例标题",
      "subtitle": "这是一个示例副标题",
      "buttons": {
        // 四级：按钮文本
        "save": "保存",
        "cancel": "取消",
        "delete": "删除"
      }
    },
    "form": {
      "fields": {
        "name": "名称",
        "description": "描述",
        "status": "状态"
      },
      "validation": {
        "required": "此字段为必填项",
        "minLength": "最少需要{min}个字符",
        "maxLength": "最多允许{max}个字符"
      }
    },
    "table": {
      "columns": {
        "id": "ID",
        "name": "名称",
        "createTime": "创建时间",
        "status": "状态"
      },
      "actions": {
        "edit": "编辑",
        "delete": "删除",
        "view": "查看"
      }
    }
  }
}
```

## 使用实例

### 1. 在组件中使用

```typescript
import { useTranslation } from 'react-i18next';

function ExampleComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      {/* 使用简单词条 */}
      <h1>{t('example.title')}</h1>
      
      {/* 使用层级词条 */}
      <h2>{t('example.header.title')}</h2>
      <p>{t('example.header.subtitle')}</p>
      
      {/* 使用按钮词条 */}
      <button>{t('example.header.buttons.save')}</button>
      <button>{t('example.header.buttons.cancel')}</button>
      
      {/* 使用表单词条 */}
      <label>{t('example.form.fields.name')}</label>
      <input placeholder={t('example.form.fields.name')} />
      
      {/* 使用带参数的词条 */}
      <span>{t('example.form.validation.minLength', { min: 5 })}</span>
    </div>
  );
}
```

### 2. 在Hook中使用

```typescript
import { useTranslation } from 'react-i18next';

function useExampleForm() {
  const { t } = useTranslation();
  
  const validateField = (field: string, value: string) => {
    if (!value) {
      return t('example.form.validation.required');
    }
    
    if (value.length < 5) {
      return t('example.form.validation.minLength', { min: 5 });
    }
    
    return '';
  };
  
  return { validateField };
}
```

## 添加新语言

1. 在 `src/i18n/locales/` 目录下创建新的语言目录，如 `ja` (日语)
2. 复制现有语言文件结构，翻译所有词条
3. 在 `src/i18n/unit.ts` 中添加新语言配置

## 添加新模块

1. 在各语言目录下创建新的模块文件，如 `user.js`
2. 在各语言文件中添加相同的词条结构
3. 在各语言的 `index.js` 中导入并合并新模块

## 最佳实践

1. **保持词条结构一致**：确保所有语言包中的词条结构和层级完全一致
2. **使用有意义的键名**：键名应清晰表达其含义，避免使用缩写
3. **避免硬编码文本**：所有用户可见的文本都应通过i18n系统处理
4. **参数化文本**：对于包含变量的文本，使用参数化方式处理
5. **定期检查**：使用工具检查缺失的翻译和未使用的词条
6. **模块间词条独立**：不要跨模块引用词条，每个模块的词条应保持独立，避免模块间的强耦合