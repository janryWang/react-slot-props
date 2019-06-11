import React, { Component } from "react"
import {
  createRelationComponent,
  DslContext,
  toArr,
  isFn,
  SlotContext
} from "./utils"
import get from "lodash.get"

const findRootType = relations =>
  (toArr(relations).find(v => v.root) || {}).type

const isSlot = val =>
  val && (val.type && (val.areas || val.elements || val.props))

export const createSlotComponents = (Target, relations) => {
  const RelationsMap = {}
  const ROOT_TYPE =
    Target.displayName || findRootType(relations) || "SlotComponent"
  const getItemByType = type => RelationsMap[type]
  const createSlotGetter = slots => {
    const getter = (path, getter) => {
      return isFn(getter) ? getter(get(slots, path)) : get(slots, path)
    }

    getter.has = path => {
      const slot = get(slots, path)
      return isSlot(slot) ? true : Array.isArray(slot) && isSlot(slot[0])
    }

    getter.render = (path, render, otherwise) => {
      const slot = get(slots, path)
      if (isSlot(slot)) {
        if (slot.props) {
          if (isFn(slot.props.children)) {
            return isFn(render)
              ? render(slot.props.children, slot.props, slot.type)
              : slot.props.children()
          } else {
            return isFn(render)
              ? render(() => slot.props.children, slot.props, slot.type)
              : slot.props.children
          }
        }
      } else if (Array.isArray(slot)) {
        const childrens = slot.map((item, key) => {
          if (isSlot(item)) {
            if (item.props) {
              if (isFn(item.props.children)) {
                return isFn(render)
                  ? render(item.props.children, item.props, item.type, key)
                  : item.props.children(key)
              } else {
                return isFn(render)
                  ? render(
                      () => item.props.children,
                      item.props,
                      item.type,
                      key
                    )
                  : item.props.children
              }
            }
          }
        })
        return React.createElement(React.Fragment, {}, ...childrens)
      } else {
        if (isFn(otherwise)) {
          return otherwise()
        }
      }
    }

    return getter
  }
  class SlotComponent extends Component {
    static displayName = ROOT_TYPE

    notify = () => {
      if (this.unmounted) return
      this.forceUpdate()
    }

    componentWillUnmount() {
      this.unmounted = true
    }

    componentDidMount() {
      this.unmounted = false
    }

    timer = {}

    render() {
      const { forwardRef, slots, children, ...others } = this.props
      const config = slots || {}
      return (
        <React.Fragment>
          <template>
            <DslContext.Provider
              value={{
                type: ROOT_TYPE,
                getItemByType,
                config,
                timer: this.timer,
                notify: this.notify,
                path: []
              }}
            >
              {children}
            </DslContext.Provider>
          </template>
          {(() => {
            const slot = createSlotGetter(config)
            return (
              <SlotContext.Provider value={slot}>
                <Target {...others} ref={forwardRef} slot={slot} />
              </SlotContext.Provider>
            )
          })()}
        </React.Fragment>
      )
    }
  }

  const Wrapper = React.forwardRef((props, ref) => {
    return <SlotComponent {...props} forwardRef={ref} />
  })

  toArr(relations).forEach(item => {
    if (item && item.type) {
      RelationsMap[item.type] = RelationsMap[item.type] || item
      if (item.type !== ROOT_TYPE) {
        Wrapper[item.type] = createRelationComponent(item.type)
      }
    }
  })

  return Wrapper
}

export const slotable = () => Target => props => (
  <SlotContext.Consumer>
    {slot => <Target {...props} slot={slot} />}
  </SlotContext.Consumer>
)

export default createSlotComponents
