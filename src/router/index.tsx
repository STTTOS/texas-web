import type { RouteObject } from 'react-router-dom'
import type { FC, LazyExoticComponent } from 'react'

import { lazy } from 'react'
import { join } from 'path-browserify'

import Home from '@/page/home'
import LayoutWeb from '@/layoutWeb'
import LayoutAuth from '@/layoutAuth'
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
    path: '/login',
    title: '登录',
    element: lazy(() => import('@/page/login'))
  },
  {
    element: LayoutWeb,
    children: [
      {
        path: '/',
        element: Home
      },
      {
        element: LayoutAuth,
        children: [
          {
            path: '/announcement/manage',
            title: '公告管理',
            element: lazy(() => import('@/page/announcement/manage'))
          },
          {
            path: '/match/hand-poke-audit',
            title: '手牌审计',
            element: lazy(() => import('@/page/match/handPokeAudit'))
          },
          {
            path: '/match/hand-poke-audit/:userId',
            title: '手牌审计详情',
            element: lazy(() => import('@/page/match/handPokeAudit/detail'))
          },
          {
            path: '/announcement/app-display',
            title: 'App端展示公告',
            element: lazy(() => import('@/page/announcement/appDisplay'))
          },
          {
            path: '/match/ops',
            title: '对局运维',
            element: lazy(() => import('@/page/match/ops'))
          },
          {
            path: '/ops/engine-fatal',
            title: '引擎事故',
            element: lazy(() => import('@/page/ops/engineFatal'))
          },
          {
            path: '/ops/room',
            title: '房间运维',
            element: lazy(() => import('@/page/ops/room'))
          },
          {
            path: '/ops/dashboard',
            title: '看板',
            element: lazy(() => import('@/page/ops/dashboard'))
          },
          {
            path: '/ops/users',
            title: '用户运维',
            element: lazy(() => import('@/page/ops/users'))
          },
          {
            path: '/ops/users/:id',
            title: '用户详情',
            element: lazy(() => import('@/page/ops/users/detail'))
          },
          {
            path: '/system/maintenance',
            title: '维护升级',
            element: lazy(() => import('@/page/system/maintenance'))
          },
          {
            path: '/system/version',
            title: '版本管理',
            element: lazy(() => import('@/page/system/version'))
          }
        ]
      },
      {
        path: '/match',
        title: '对局列表',
        element: lazy(() => import('@/page/match'))
      },
      {
        path: '/match/detail/:id',
        title: '对局详情',
        element: lazy(() => import('@/page/match/detail'))
      },
      {
        path: '/match/error/:id',
        title: '错误详情',
        element: lazy(() => import('@/page/match/error'))
      }
    ]
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
