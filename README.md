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

mq_public 请参考 [jm-config-mq] (https://github.com/jm-root/jm-config-mq)

mqtt MQTT 服务器Uri

mq Redis 服务器Uri

disableMQTT 是否禁止 jm-config-mqtt 插件, 默认不禁止, 支持配置变化时消息通知

disableMQ 是否禁止 jm-config-mq 插件, 默认不禁止, 支持配置变化时消息通知
