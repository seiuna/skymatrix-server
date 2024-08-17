
### `POST: /admin/generate` `admin.generation` 用于生成激活码/和邀请码 

#### 生成激活码 必须提供payload
```json
{
  "type":"code",
  "count":114514,
  "payload":{
    "permissions":[
      "irc.receive",
      "irc.send"
    ]
  }
}
```
#### 生成邀请码 不需要提供payload
```json
{
  "type":"invite",
  "count":114514
}
```
