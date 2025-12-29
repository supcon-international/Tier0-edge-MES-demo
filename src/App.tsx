import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import "./App.css";
import {type RouteConfig, routes} from './routes/index.tsx'

// 递归渲染路由和子路由
const renderRoutes = (routeList: RouteConfig[]) => {
  return routeList.map((route, index) => {
    if (route.children && route.children.length > 0) {
      return (
        <Route key={index} path={route.path} element={<route.component />}>
          {renderRoutes(route.children)}
        </Route>
      )
    }
    return (
      <Route key={index} path={route.path} element={<route.component />} />
    )
  })
}

function App() {
  return (
    <Layout>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </Layout>
  );
}

export default App;
