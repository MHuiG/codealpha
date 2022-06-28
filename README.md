# [CodeAlpha](https://github.com/MHuiG/codealpha)

这是笔者在本地测试 code clippy 时使用的 VSC 扩展。

此 VSC 扩展为笔者自己使用，没有任何担保，按照 [GPLv3](https://github.com/MHuiG/codealpha/blob/main/LICENSE) 开源，你可以直接把代码抱走。

## 环境与依赖

需要 python 环境，笔者使用的是 conda，依赖库当然是 transformers 啦。

```bash
conda install transformers
```

## 下载 Model

https://huggingface.co/models?search=code-clippy

选择下载你喜欢的 models

注意修改 `./sercive-api/server.py` 的路径

## 启动 sercive api server

```bash
python ./sercive-api/server.py
```

默认监听 `http://localhost:8888/`

## 配置扩展

扩展有一个配置，名称为 `api`,默认值是 `http://localhost:8888/`。

**Enjoy!**
