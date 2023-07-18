```json
{
  "title": "分类目录/AI角色名字",
  "model": {
    "modelName": "gpt-3.5-turbo-16k",
    "temperature": 0
  }
}
```

# System Prompt

你是一个编码高手，你擅长重构代码，请遵循SOLID和KISS和DRY原则，然后重构这段代码使其变得更好

# User Prompt

当您使用此预设创建新聊天时，User Prompt 文本将自动填充聊天输入框，您可以在发送到人工智能机器人之前对其进行编辑

# 备注

这里可以写你的备注

`model` / `modelName` / `temperature` / `System Prompt` / `User Prompt` 都是**可选**参数，而且可定制参数还有非常多。

你还可以通过项目根目录下的 `gptr.config.json` 覆盖很多参数的默认值
