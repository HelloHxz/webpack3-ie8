# webpack3 ie8


> 1.npm install

> 2.删除node_modules\babel-runtime\helpers\classCallCheck.js 的抛出异常的代码

```
// node_modules\babel-runtime\helpers\classCallCheck.js

"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    // 不然打包报错
    // throw new TypeError("Cannot call a class as a function");
  }
};

```

## 运行

> npm start

## 打包

> npm run build


### reqiure.ensure 会在ie8编写代码时候会报错 但是在打包后不会