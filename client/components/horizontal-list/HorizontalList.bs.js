// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var React = require("react");
var StyleScss = require("./style.scss");
var Components = require("@woocommerce/components");

var List = {};

function _style(prim) {
  return StyleScss.style(prim);
}

function HorizontalList(Props) {
  var itemsOpt = Props.items;
  var items = itemsOpt !== undefined ? itemsOpt : [];
  return React.createElement(Components.List, {
              items: items,
              className: "woocommerce-list--horizontal"
            });
}

var make = HorizontalList;

var $$default = HorizontalList;

exports.List = List;
exports._style = _style;
exports.make = make;
exports.$$default = $$default;
exports.default = $$default;
exports.__esModule = true;
/* react Not a pure module */
