"use strict";

exports.__esModule = true;
exports.createRelationComponent = exports.isFn = exports.has = exports.toArr = exports.SlotContext = exports.DslContext = void 0;

var _react = _interopRequireWildcard(require("react"));

var _case = _interopRequireDefault(require("case"));

var _compare = require("./compare");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var DslContext = (0, _react.createContext)();
exports.DslContext = DslContext;
var SlotContext = (0, _react.createContext)();
exports.SlotContext = SlotContext;

var toArr = function toArr(arr) {
  return Array.isArray(arr) ? arr : arr ? [arr] : [];
};

exports.toArr = toArr;

var has = function has(source, target) {
  return toArr(source).indexOf(target) > -1;
};

exports.has = has;

var isFn = function isFn(val) {
  return typeof val === "function";
};

exports.isFn = isFn;

var renderChild = function renderChild(child) {
  return isFn(child) ? undefined : child;
};

var createRelationComponent = function createRelationComponent(type) {
  return function (props) {
    var _useContext = (0, _react.useContext)(DslContext),
        config = _useContext.config,
        getItemByType = _useContext.getItemByType,
        notify = _useContext.notify,
        timer = _useContext.timer,
        parentType = _useContext.type,
        path = _useContext.path;

    var cache = (0, _react.useMemo)(function () {
      return {};
    }, []);
    (0, _react.useEffect)(function () {
      return function () {
        clearTimeout(timer.id);
        timer.id = setTimeout(function () {
          notify();
        });
      };
    }, []);
    (0, _react.useEffect)(function () {
      if (!(0, _compare.isEqual)(cache.props, props, function (_, key) {
        return key !== "children";
      })) {
        cache.props = _extends({}, props);
        clearTimeout(timer.id);
        timer.id = setTimeout(function () {
          notify();
        });
      }
    });
    var parentItem = getItemByType(parentType);
    var nodeItem = getItemByType(type);
    var nodeProps = props;

    if (!cache.props) {
      cache.props = nodeProps;
    }

    if (parentItem && has(parentItem.areas, type)) {
      config.areas = config.areas || {};

      var key = _case["default"].snake(type);

      var node = {
        type: type,
        props: nodeProps,
        areas: {},
        elements: [],
        path: path.concat(key)
      };
      config.areas[key] = node;

      if (nodeItem.visitor) {
        nodeItem.visitor(node);
        return;
      }

      return _react["default"].createElement(DslContext.Provider, {
        value: {
          config: node,
          getItemByType: getItemByType,
          type: type,
          notify: notify,
          timer: timer,
          path: node.path
        }
      }, renderChild(props.children));
    } else if (parentItem && has(parentItem.elements, type)) {
      config.elements = config.elements || [];
      var _node = {
        type: type,
        props: nodeProps,
        areas: {},
        elements: [],
        path: path.concat(config.elements.length)
      };
      config.elements = config.elements.concat(_node);

      if (nodeItem.visitor) {
        nodeItem.visitor(cache.node);
        return;
      }

      return _react["default"].createElement(DslContext.Provider, {
        value: {
          config: _node,
          getItemByType: getItemByType,
          type: type,
          notify: notify,
          timer: timer,
          path: _node.path
        }
      }, renderChild(props.children));
    } else {
      var _node2 = {
        type: type,
        props: nodeProps,
        areas: {},
        elements: [],
        path: []
      };
      return _react["default"].createElement(DslContext.Provider, {
        value: {
          config: _node2,
          getItemByType: getItemByType,
          type: type,
          notify: notify,
          timer: timer,
          path: []
        }
      }, renderChild(props.children));
    }
  };
};

exports.createRelationComponent = createRelationComponent;