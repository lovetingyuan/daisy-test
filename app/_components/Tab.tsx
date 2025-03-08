'use client'

import { createElement, useEffect, useRef, useState } from 'react'

export default function Tab(props: {
  id: string
  title: string
  defaultActive?: boolean
  children?: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component?: React.ComponentType<any>
}) {
  const [active, setActive] = useState(!!props.defaultActive)
  useEffect(() => {
    if (window.location.hash) {
      setActive(window.location.hash === `#${props.id}`)
    }
    const handleHashChange = () => {
      setActive(window.location.hash === `#${props.id}`)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [props.id])

  const children = useRef<React.ReactNode>(props.children)
  if (active && !children.current && props.Component) {
    children.current = createElement(props.Component)
  }

  return (
    <>
      <a
        role="tab"
        href={`#${props.id}`}
        className={`tab flex-grow ${active ? 'tab-active font-bold' : ''}`}
        style={{
          height: '50px',
        }}
      >
        {props.title}
      </a>
      <div
        className={'tab-content overflow-auto bg-base-100 border-base-300 p-2 sm:p-6'}
        style={{
          height: `80vh`,
          contain: 'strict',
        }}
      >
        {children.current}
      </div>
    </>
  )
}
