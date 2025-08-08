#!/bin/bash
## https://qiita.com/KazuhisaFujita/items/47569aeed685d37bc286
ollama list | tail -n +2 | awk '{print $1}' | xargs -n1 ollama pull
