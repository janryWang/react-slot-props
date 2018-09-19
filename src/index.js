import React, { Component } from "react"
import { createRelationComponent, DslContext, toArr, isFn } from "./utils"
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

        getter.render = (path, render) => {
            const slot = get(slots, path)
            if (isSlot(slot)) {
                if (slot.props && isFn(slot.props.children)) {
                    return isFn(render)
                        ? render(slot.props.children)
                        : slot.props.children()
                }
            } else if (Array.isArray(slot)) {
                const childrens = slot.map((item, key) => {
                    if (
                        isSlot(slot) &&
                        slot.props &&
                        isFn(item.props.children)
                    ) {
                        return isFn(render)
                            ? render(item.props.children)
                            : item.props.children()
                    }
                })
                return React.createElement(React.Fragment, {}, ...childrens)
            }
        }

        return getter
    }
    class SlotComponent extends Component {
        static displayName = ROOT_TYPE

        render() {
            const { forwardRef, slots, children, ...others } = this.props
            const config = slots || {}
            return (
                <React.Fragment>
                    <DslContext.Provider
                        value={{
                            type: ROOT_TYPE,
                            getItemByType,
                            config
                        }}
                    >
                        {children}
                    </DslContext.Provider>
                    <Target
                        {...others}
                        ref={forwardRef}
                        slot={createSlotGetter(config)}
                    />
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

export default createSlotComponents
