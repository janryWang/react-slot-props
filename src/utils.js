import React, { Component } from "react"
import createContext from "create-react-context"
import Case from "case"

export const DslContext = createContext()

export const SlotContext = createContext()

export const toArr = arr => (Array.isArray(arr) ? arr : arr ? [arr] : [])

export const has = (source, target) => {
    return toArr(source).indexOf(target) > -1
}

export const isFn = val => typeof val === "function"

const renderChild = child => (isFn(child) ? undefined : child)

export const createRelationComponent = type => {
    return class RelationNode extends Component {
        static displayName = type
        render() {
            return (
                <DslContext.Consumer>
                    {({ config, getItemByType, type: parentType }) => {
                        const parentItem = getItemByType(parentType)
                        const nodeItem = getItemByType(type)
                        const nodeProps = this.props
                        if (parentItem && has(parentItem.areas, type)) {
                            config.areas = config.areas || {}
                            config.areas[Case.snake(type)] = {
                                type: type,
                                props: nodeProps,
                                areas: {},
                                elements: []
                            }

                            const configItem = config.areas[Case.snake(type)]

                            if (nodeItem.visitor) {
                                nodeItem.visitor(this, configItem)
                                return
                            }

                            return (
                                <DslContext.Provider
                                    value={{
                                        config: configItem,
                                        getItemByType,
                                        type
                                    }}
                                >
                                    {renderChild(this.props.children)}
                                </DslContext.Provider>
                            )
                        } else if (
                            parentItem &&
                            has(parentItem.elements, type)
                        ) {
                            config.elements = config.elements || []
                            config.elements = config.elements.concat({
                                type: type,
                                props: nodeProps,
                                areas: {},
                                elements: []
                            })

                            const configItem =
                                config.elements[config.elements.length - 1]

                            if (nodeItem.visitor) {
                                nodeItem.visitor(this, configItem)
                                return
                            }

                            return (
                                <DslContext.Provider
                                    value={{
                                        config: configItem,
                                        getItemByType,
                                        type
                                    }}
                                >
                                    {renderChild(this.props.children)}
                                </DslContext.Provider>
                            )
                        } else {
                            return (
                                <DslContext.Provider
                                    value={{
                                        config: {
                                            type: type,
                                            props: nodeProps,
                                            areas: {},
                                            elements: []
                                        },
                                        getItemByType,
                                        type
                                    }}
                                >
                                    {renderChild(this.props.children)}
                                </DslContext.Provider>
                            )
                        }
                    }}
                </DslContext.Consumer>
            )
        }
    }
}
