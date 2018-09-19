import React, { Component } from "react"
import { createRelationComponent, DslContext, toArr, isFn } from "./utils"
import get from "lodash.get"
const findRootType = relations =>
    (toArr(relations).find(v => v.root) || {}).type

export const createSlotComponents = (Target, relations) => {
    const RelationsMap = {}
    const ROOT_TYPE =
        Target.displayName || findRootType(relations) || "SlotComponent"
    const getItemByType = type => RelationsMap[type]
    const createSlotGetter = slots => (path, getter) => {
        return isFn(getter) ? getter(get(slots, path)) : get(slots, path)
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
