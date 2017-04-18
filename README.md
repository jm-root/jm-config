# jm-config

config server using jm-server

## use:

```javascript
var s = require('jm-config')();
```

## run:

```javascript
npm start
```

## 配置参数

基本配置 请参考 [jm-server] (https://github.com/jm-root/jm-server)

mq Redis 服务器Uri

disableMQ 是否禁止 jm-config-mq 插件, 默认不禁止, 支持配置变化时消息通知

