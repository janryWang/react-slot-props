"use strict";

exports.__esModule = true;
exports.default = exports.createSlotComponents = void 0;

var _react = _interopRequireWildcard(require("react"));

var _utils = require("./utils");

var _lodash = _interopRequireDefault(require("lodash.get"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var findRootType = function findRootType(relations) {
  return ((0, _utils.toArr)(relations).find(function (v) {
    return v.root;
  }) || {}).type;
};

var isSlot = function isSlot(val) {
  return val && val.type && (val.areas || val.elements || val.props);
};

var createSlotComponents = function createSlotComponents(Target, relations) {
  var RelationsMap = {};
  var ROOT_TYPE = Target.displayName || findRootType(relations) || 'SlotComponent';

  var getItemByType = function getItemByType(type) {
    return RelationsMap[type];
  };

  var createSlotGetter = function createSlotGetter(slots) {
    var getter = function getter(path, _getter) {
      return (0, _utils.isFn)(_getter) ? _getter((0, _lodash.default)(slots, path)) : (0, _lodash.default)(slots, path);
    };

    getter.render = function (path, render) {
      var slot = (0, _lodash.default)(slots, path);

      if (isSlot(slot)) {
        if (slot.props && (0, _utils.isFn)(slot.props.children)) {
          return (0, _utils.isFn)(render) ? render(slot.props.children) : slot.props.children();
        }
      } else if (Array.isArray(slot)) {
        var childrens = slot.map(function (item, key) {
          if (isSlot(slot) && slot.props && (0, _utils.isFn)(item.props.children)) {
            return (0, _utils.isFn)(render) ? render(item.props.children) : item.props.children();
          }
        });
        return _react.default.createElement.apply(_react.default, [_react.default.Fragment, {}].concat(childrens));
      }
    };

    return getter;
  };

  var SlotComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(SlotComponent, _Component);

    function SlotComponent() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = SlotComponent.prototype;

    _proto.render = function render() {
      var _this$props = this.props,
          forwardRef = _this$props.forwardRef,
          slots = _this$props.slots,
          children = _this$props.children,
          others = _objectWithoutPropertiesLoose(_this$props, ["forwardRef", "slots", "children"]);

      var config = slots || {};
      return _react.default.createElement(_react.default.Fragment, null, _react.default.createElement(_utils.DslContext.Provider, {
        value: {
          type: ROOT_TYPE,
          getItemByType: getItemByType,
          config: config
        }
      }, children), _react.default.createElement(Target, _extends({}, others, {
        ref: forwardRef,
        slot: createSlotGetter(config)
      })));
    };

    return SlotComponent;
  }(_react.Component);

  _defineProperty(SlotComponent, "displayName", ROOT_TYPE);

  var Wrapper = _react.default.forwardRef(function (props, ref) {
    return _react.default.createElement(SlotComponent, _extends({}, props, {
      forwardRef: ref
    }));
  });

  (0, _utils.toArr)(relations).forEach(function (item) {
    if (item && item.type) {
      RelationsMap[item.type] = RelationsMap[item.type] || item;

      if (item.type !== ROOT_TYPE) {
        Wrapper[item.type] = (0, _utils.createRelationComponent)(item.type);
      }
    }
  });
  return Wrapper;
};

exports.createSlotComponents = createSlotComponents;
var _default = createSlotComponents;
exports.default = _default;