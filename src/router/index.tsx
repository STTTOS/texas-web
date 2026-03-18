import type { RouteObject } from 'react-router-dom'
import type { FC, LazyExoticComponent } from 'react'

import { lazy } from 'react'
import { join } from 'path-browserify'

import Home from '@/page/home'
import withTitleAndRedirect from '@/Hoc/withTitleAndRedirect'

export interface MyRoute
  extends Omit<RouteObject, 'children' | 'element' | 'index'> {
  element?: LazyExoticComponent<() => JSX.Element> | FC
  title?: string
  children?: MyRoute[]
  redirect?: string
}
// const a = lazy(() => import('@/layout'))
/**
 * 路由配置
 * @see http://react-guide.github.io/react-router-cn/docs/guides/basics/RouteConfiguration.html
 */
const routers: MyRoute[] = [
  {
    path: '/403',
    element: lazy(() => import('@/page/403'))
  },
  {
    path: '/404',
    element: lazy(() => import('@/page/404'))
  },
  {
    path: '/500',
    element: lazy(() => import('@/page/500'))
  },
  {
    path: '/',
    element: Home
  },
  {
    path: '/rules',
    title: '游戏规则',
    element: lazy(() => import('@/page/rules'))
  },
  {
    path: '/user-agreement',
    title: '用户协议',
    element: lazy(() => import('@/page/user-agreement'))
  },
  {
    path: '/privacy-policy',
    title: '隐私协议',
    element: lazy(() => import('@/page/privacy-policy'))
  },
  {
    path: '/analysis/match',
    title: '对局列表',
    element: lazy(() => import('@/page/analysis'))
  },
  {
    path: '/analysis/match/detail/:id',
    title: '对局详情',
    element: lazy(() => import('@/page/analysis/detail'))
  },
  {
    path: '/analysis/match/error/:id',
    title: '错误详情',
    element: lazy(() => import('@/page/analysis/error'))
  },
  {
    path: '*',
    redirect: '/'
  }
]

function format(routers: MyRoute[], basePath = ''): RouteObject[] {
  const result = routers.map(
    ({ path, children, element, redirect, title, ...rest }) => {
      const nextPath = join(basePath, path || '')

      // 如果element不存在, 则将子元素铺平
      if (!element && children) {
        return children.map((item) => ({
          ...item,
          // 组合父级route path & 子路由path
          path: join(path || '', item.path || ''),
          element: withTitleAndRedirect({ basePath: nextPath, ...item }),
          children: item.children && format(item.children, nextPath)
        }))
      }

      return {
        ...rest,
        path,
        children: children && format(children, nextPath),
        element: withTitleAndRedirect({
          title,
          basePath,
          redirect,
          element
        })
      }
    }
  )
  return result.flat(5)
}
export default format(routers)
