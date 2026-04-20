"hasCompletedOnboarding": true,

https://bailian.console.aliyun.com

setx ANTHROPIC_API_KEY   "sk-b2e9da3835e547ad82e6db0ac3d6259f"
setx ANTHROPIC_BASE_URL "https://dashscope.aliyuncs.com/apps/anthropic"
setx ANTHROPIC_MODEL "glm-5"

验证-cmd:
echo %ANTHROPIC_BASE_URL%
echo %ANTHROPIC_API_KEY%
echo %ANTHROPIC_MODEL%
验证-pwd:
$env:ANTHROPIC_BASE_URL
$env:ANTHROPIC_API_KEY
$env:ANTHROPIC_MODEL