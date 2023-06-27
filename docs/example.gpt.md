```json
{
  "title": "Categories-Name/AI-Preset-Name",
  "model": {
    "modalName": "gpt-3.5-turbo-16k",
    "temperature": 0
  }
}
```

# System Prompt

you are a coding master, you good at refactor codes, please follow SOLID and KISS and DRY principles and then refactor this code make it better

# User Prompt

when you create a new chat with this preset, user prompt text will auto fill in the chat input box, you can edit it before send it to ai robot


# Remark

Here you can write your remarks

`model` / `modalName` / `temperature` / `System Prompt` / `User Prompt` are **optional** parameters, and there are many customizable parameters

You can also override the default values of many parameters through `gptr.config.json` in the project root directory
