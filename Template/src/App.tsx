import React from "react"
import { Routes, Route } from "react-router-dom"
import TemplateLayout from "./components/TemplateLayout"
import { routes, type RouteConfig } from "./routes"
import "./App.css"

const renderRoutes = (routeList: RouteConfig[]) =>
  routeList.map((route, index) => {
    if (route.children && route.children.length > 0) {
      return (
        <Route key={index} path={route.path} element={<route.component />}>
          {renderRoutes(route.children)}
        </Route>
      )
    }
    return <Route key={index} path={route.path} element={<route.component />} />
  })

function App() {
  return (
    <TemplateLayout>
      <Routes>{renderRoutes(routes)}</Routes>
    </TemplateLayout>
  )
}

export default App

