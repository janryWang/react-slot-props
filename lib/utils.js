"use strict";

exports.__esModule = true;
exports.createRelationComponent = exports.isFn = exports.has = exports.toArr = exports.SlotContext = exports.DslContext = void 0;

var _react = _interopRequireWildcard(require("react"));

var _createReactContext = _interopRequireDefault(require("create-react-context"));

var _case = _interopRequireDefault(require("case"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DslContext = (0, _createReactContext.default)();
exports.DslContext = DslContext;
var SlotContext = (0, _createReactContext.default)();
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
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(RelationNode, _Component);

    function RelationNode() {
      return _Component.apply(this, arguments) || this;
    }

    var _proto = RelationNode.prototype;

    _proto.render = function render() {
      var _this = this;

      return _react.default.createElement(DslContext.Consumer, null, function (_ref) {
        var config = _ref.config,
            getItemByType = _ref.getItemByType,
            parentType = _ref.type;
        var parentItem = getItemByType(parentType);
        var nodeItem = getItemByType(type);
        var nodeProps = _this.props;

        if (parentItem && has(parentItem.areas, type)) {
          config.areas = config.areas || {};
          config.areas[_case.default.snake(type)] = {
            type: type,
            props: nodeProps,
            areas: {},
            elements: []
          };

          var configItem = config.areas[_case.default.snake(type)];

          if (nodeItem.visitor) {
            nodeItem.visitor(_this, configItem);
            return;
          }

          return _react.default.createElement(DslContext.Provider, {
            value: {
              config: configItem,
              getItemByType: getItemByType,
              type: type
            }
          }, renderChild(_this.props.children));
        } else if (parentItem && has(parentItem.elements, type)) {
          config.elements = config.elements || [];
          config.elements = config.elements.concat({
            type: type,
            props: nodeProps,
            areas: {},
            elements: []
          });
          var _configItem = config.elements[config.elements.length - 1];

          if (nodeItem.visitor) {
            nodeItem.visitor(_this, _configItem);
            return;
          }

          return _react.default.createElement(DslContext.Provider, {
            value: {
              config: _configItem,
              getItemByType: getItemByType,
              type: type
            }
          }, renderChild(_this.props.children));
        } else {
          return _react.default.createElement(DslContext.Provider, {
            value: {
              config: {
                type: type,
                props: nodeProps,
                areas: {},
                elements: []
              },
              getItemByType: getItemByType,
              type: type
            }
          }, renderChild(_this.props.children));
        }
      });
    };

    return RelationNode;
  }(_react.Component), _defineProperty(_class, "displayName", type), _temp;
};

exports.createRelationComponent = createRelationComponent;