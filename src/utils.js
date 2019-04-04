import React, {
  Component,
  createContext,
  useContext,
  useMemo,
  useEffect
} from "react"
import Case from "case"
import { isEqual } from "./compare"

export const DslContext = createContext()

export const SlotContext = createContext()

export const toArr = arr => (Array.isArray(arr) ? arr : arr ? [arr] : [])

export const has = (source, target) => {
  return toArr(source).indexOf(target) > -1
}

export const isFn = val => typeof val === "function"

const renderChild = child => (isFn(child) ? undefined : child)

export const createRelationComponent = type => {
  return props => {
    const {
      config,
      getItemByType,
      notify,
      timer,
      type: parentType,
      path
    } = useContext(DslContext)
    const cache = useMemo(() => {
      return {}
    }, [])
    useEffect(
      () => () => {
        clearTimeout(timer.id)
        timer.id = setTimeout(() => {
          notify()
        })
      },
      []
    )
    useEffect(() => {
      if (!isEqual(cache.props, props, (_, key) => key !== "children")) {
        cache.props = { ...props }
        clearTimeout(timer.id)
        timer.id = setTimeout(() => {
          notify()
        })
      }
    })
    const parentItem = getItemByType(parentType)
    const nodeItem = getItemByType(type)
    const nodeProps = props
    if (!cache.props) {
      cache.props = nodeProps
    }
    if (parentItem && has(parentItem.areas, type)) {
      config.areas = config.areas || {}
      const key = Case.snake(type)
      const node = {
        type: type,
        props: nodeProps,
        areas: {},
        elements: [],
        path: path.concat(key)
      }
      config.areas[key] = node
      if (nodeItem.visitor) {
        nodeItem.visitor(node)
        return
      }

      return (
        <DslContext.Provider
          value={{
            config: node,
            getItemByType,
            type,
            notify,
            timer,
            path: node.path
          }}
        >
          {renderChild(props.children)}
        </DslContext.Provider>
      )
    } else if (parentItem && has(parentItem.elements, type)) {
      config.elements = config.elements || []

      const node = {
        type: type,
        props: nodeProps,
        areas: {},
        elements: [],
        path: path.concat(config.elements.length)
      }
      config.elements = config.elements.concat(node)

      if (nodeItem.visitor) {
        nodeItem.visitor(cache.node)
        return
      }

      return (
        <DslContext.Provider
          value={{
            config: node,
            getItemByType,
            type,
            notify,
            timer,
            path: node.path
          }}
        >
          {renderChild(props.children)}
        </DslContext.Provider>
      )
    } else {
      const node = {
        type: type,
        props: nodeProps,
        areas: {},
        elements: [],
        path: []
      }
      return (
        <DslContext.Provider
          value={{
            config: node,
            getItemByType,
            type,
            notify,
            timer,
            path: []
          }}
        >
          {renderChild(props.children)}
        </DslContext.Provider>
      )
    }
  }
}
