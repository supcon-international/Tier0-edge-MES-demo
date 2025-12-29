# supOS-CE Web 项目部署指南

本指南详细说明了如何将 AMS/MES 应用前端部署到 supOS-CE 环境。项目支持三种部署模式，您可以根据需求选择其中一种，并遵循其完整的部署流程。

---

## 模式一：多模块部署 (multi)

此模式构建一个包含所有模块的镜像，每个模块在不同的路径下提供服务 (例如 `/mes-app-all/equipment`, `/mes-app-all/order`)。这是最全面的部署方式。

### 第 1 步：构建并导出镜像

```bash
# 构建多模块镜像 (multi 是默认模式，可省略 --build-arg)
docker build -t mes-app-multi:latest .

# 导出镜像为 tar 文件
docker save -o mes-app-multi-latest.tar mes-app-multi:latest
```

### 第 2 步：Portainer 部署

1.  **导入镜像**:
    -   进入 Portainer -> **Images** -> **Import**。
    -   上传 `mes-app-multi-latest.tar`。

2.  **部署容器**:
    -   进入 **Containers** -> **Add container**。
    -   **Name**: `mes-app-all`
    -   **Image**: `mes-app-multi:latest`
    -   **Network**: 选择 `supos_default_network`。
    -   点击 **Deploy the container**。

### 第 3 步：Konga (路由网关) 配置

1.  登录 Konga，进入 **Services**，点击 **ADD NEW SERVICE** (如果已有 `mes-app-all` 服务，则编辑它)。
    -   **Name**: `mes-app-all`
    -   **Protocol**: `http`
    -   **Host**: `mes-app-all` (与 Portainer 中的容器名一致)
    -   **Port**: `80`
    -   点击 **SUBMIT**。

2.  点击刚创建的服务，进入详情页，选择 **Routes** 标签页，点击 **ADD ROUTE** (或编辑现有路由)。
    -   **Name**: `mes-app-all`
    -   **Protocols**: `http`, `https`
    -   **Paths**: `/mes-app-all`
    -   **Strip Path**: `No` (关键配置：必须为 No，Nginx 才能正确匹配路径)
    -   **Preserve Host**: `Yes`
    -   点击 **SUBMIT**。

### 第 4 步：Keycloak (认证授权) 配置

1.  登录 Keycloak，选择 **Realm**: `supos`。
2.  导航到 **Clients** -> **supos** -> **Authorization** 标签页 -> **Resources** 标签页。
3.  找到并编辑 `supos-default` 资源 (或创建一个新资源)。
4.  在 **URIs** 字段中，添加 `mes-app-all/*` 来允许访问所有子模块。
5.  点击 **Save**。

### 第 5 步：supOS 菜单配置

为每个子模块创建独立的菜单入口。

1.  登录 supOS，进入 **系统管理** -> **菜单配置**。
2.  选择你的应用空间 (App Space)，点击 **+** 添加菜单。

**菜单配置示例 (以“工艺路线”为例):**
-   **Menu Name**: 工艺路线
-   **Menu Source**: Route Acquisition (路由获取)
-   **Route**: `mes-app-all` (对应 Konga 中 Service 的名字)
-   **Menu URL**: `/mes-app-all/productList/`
-   **Description**: 产品工艺路线配置
-   **urlType**：外部地址

**为其他模块重复此过程，只需更改 `Menu Name` 和 `Menu URL`**:
-   **设备管理**: `/mes-app-all/equipment/`
-   **订单管理**: `/mes-app-all/order/`
-   **物料管理**: `/mes-app-all/material/`
-   ... (根据 `src/pages` 目录下的模块路径配置)

---

## 模式二：单模块部署 (single)

此模式用于构建和部署单个业务模块，适用于独立测试、灰度发布或对现有 `multi` 模式中的某个模块进行热修复。

### 场景 A：独立部署

将单个模块（如“设备管理”）部署为一个独立的应用。

#### 第 1 步：构建并导出镜像

```bash
# 构建“设备管理”模块的独立镜像，并指定其访问路径为 /mes-app-equipment
docker build --build-arg BUILD_MODE=single --build-arg MODULE_NAME=equipment --build-arg BASE_PATH=/mes-app-equipment -t mes-app-single-equipment:latest .

# 导出镜像
docker save -o mes-app-single-equipment-latest.tar mes-app-single-equipment:latest
```

#### 第 2 步：Portainer 部署

1.  **导入镜像**: 上传 `mes-app-single-equipment-latest.tar`。
2.  **部署容器**:
    -   **Name**: `mes-app-equipment`
    -   **Image**: `mes-app-single-equipment:latest`
    -   **Network**: `supos_default_network`

#### 第 3 步：Konga (路由网关) 配置

1.  **添加 Service**:
    -   **Name**: `mes-app-equipment`
    -   **Host**: `mes-app-equipment` (容器名)
2.  **添加 Route**:
    -   **Name**: `mes-app-equipment`
    -   **Paths**: `/mes-app-equipment`
    -   **Strip Path**: `No`

#### 第 4 步：Keycloak (认证授权) 配置

1.  在 **Clients** -> **supos** -> **Authorization** -> **Resources** -> `supos-default` 中。
2.  向 **URIs** 添加 `/mes-app-equipment/*`。

#### 第 5 步：supOS 菜单配置

1.  添加一个新菜单。
2.  **配置如下**:
    -   **Menu Name**: 设备管理 (独立)
    -   **Route**: `mes-app-equipment` (Konga Service Name)
    -   **Menu URL**: `/mes-app-equipment/`
    -   **urlType**: 外部地址

---

### 场景 B：热修复部署

使用单模块镜像覆盖 `multi` 模式中的某个模块，实现热修复。例如，使用新的“设备管理”模块替换 `mes-app-all` 中的 `/mes-app-all/equipment` 路径。

#### 第 1 步：构建并导出镜像

**关键**: `BASE_PATH` 必须设为根目录 `/` 以配合 Konga 的 `Strip Path`。

```bash
# 构建用于热修复的“设备管理”模块镜像
docker build --build-arg BUILD_MODE=single --build-arg MODULE_NAME=equipment --build-arg BASE_PATH=/ -t mes-app-equipment-hotfix:latest .

# 导出镜像
docker save -o mes-app-equipment-hotfix-latest.tar mes-app-equipment-hotfix:latest
```

#### 第 2 步：Portainer 部署

1.  **导入镜像**: 上传 `mes-app-equipment-hotfix-latest.tar`。
2.  **部署容器**:
    -   **Name**: `mes-app-equipment-hotfix`
    -   **Image**: `mes-app-equipment-hotfix:latest`
    -   **Network**: `supos_default_network`

#### 第 3 步：Konga (路由网关) 配置

此配置会劫持（覆盖）发往旧模块的流量。

1.  **添加 Service**:
    -   **Name**: `mes-app-equipment-hotfix`
    -   **Host**: `mes-app-equipment-hotfix` (容器名)
2.  **添加 Route**:
    -   **Name**: `mes-app-equipment-hotfix`
    -   **Paths**: `/mes-app-all/equipment` (精确匹配要被替换的旧路径)
    -   **Strip Path**: `Yes` (关键配置：Konga会剥离路径前缀，将 `/` 请求转发给新容器)

#### 第 4 步：Keycloak (认证授权) 配置

无需更改。因为 `multi` 模式部署时已经添加了 `/mes-app-all/*` 规则，该规则同样适用于此热修复路径。

#### 第 5 步：supOS 菜单配置

无需更改。用户点击原有的“设备管理”菜单 (`/mes-app-all/equipment/`) 时，Konga 会自动将请求路由到新的热修复容器。

---

## 模式三：单体应用部署 (spa)

此模式构建一个包含所有功能的单体 SPA 应用，所有功能在同一个页面内通过前端路由切换。

### 第 1 步：构建并导出镜像

```bash
# 构建SPA镜像，并指定其访问路径为 /ams-spa
docker build --build-arg BUILD_MODE=spa --build-arg BASE_PATH=/ams-spa -t ams-spa:latest .

# 导出镜像
docker save -o ams-spa-latest.tar ams-spa:latest
```

### 第 2 步：Portainer 部署

1.  **导入镜像**:
  - 进入 Portainer -> **Local** -> **Images** -> **Import**。
  - 上传 `ams-spa-latest.tar`（如果已存在同名镜像，可以先删除（其实默认会覆盖））
2.  **部署容器**:
    - 进入 Portainer ->  **Local** -> **Containers** -> **Add container**（如果已经存在已部署的镜像，需要先选中后Remove）
    -   **Name**: `ams-spa`(建议保持与原服务名一致以便替换，或者新建)
    -   **Image**: `ams-spa:latest`
    -   **Network ports**: 映射端口 (例如 `32793:80`)。
    -   **Network**: `supos_default_network`(Advanced container settings -> Network 选择supos_default_network)
    -   点击 **Deploy the container**。

### 第 3 步：Konga (路由网关) 配置

1.  **添加或编辑Service**:(找到之前的 `ams-spa` 服务 (如果没创建过则点击 **ADD NEW SERVICE** 创建)。)
    -   **Name**: `ams-spa`
    -   **Protocol**: `http`
    -   **Host**: `ams-spa` (容器名)
    -   **Port**: `80`
    -   **Path**: `/` (保持默认)
    -   点击 **SUBMIT**。
2.  **添加或编辑Route**:(在上一步的Service中选择点击 **ADD ROUTE** 新建或者编辑现有的路由)
    -   **Name**: `ams-spa`
    -   **Protocols**:(默认) `http`, `https`
    -   **Paths**: `/ams-spa/` <-- **关键修改** -->
    -   **Strip Path**: `No`(必须为 No，否则 Nginx 接收到的路径会丢失 `/ams-spa` 前缀，导致匹配失败)
    -   **Preserve Host**: `Yes`
    -   点击 **SUBMIT**。

### 第 4 步：Keycloak (认证授权) 配置

1.  在 **Clients** -> **supos** -> **Authorization** -> **Resources** -> `supos-default` 中。
2.  向 **URIs** 添加 `/ams-spa/*`。

### 第 5 步：supOS 菜单配置

为整个 SPA 应用创建一个主入口菜单。

1.  **配置如下**:
    -   **Menu Name**: MES 应用 (SPA)
    -   **Route**: `ams-spa` (Konga Service Name)
    -   **Menu URL**: `/ams-spa/`
    -   **Open with**: Open Current Page(平台内部打开)、Open New Page(默认，平台外部（新页面）打开)

应用内部的导航由其自身的前端路由负责。
