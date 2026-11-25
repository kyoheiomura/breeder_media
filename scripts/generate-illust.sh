#!/bin/bash
# フッターに置くイラストを AI（Codex 組み込みの image_gen）で作る。作り直すときは FORCE=1
set -u
cd "$(dirname "$0")/.."
OUT=public/images/top/friends.png
mkdir -p artifacts/photos public/images/top
if [ -f "$OUT" ] && [ "${FORCE:-0}" != "1" ]; then echo "あり: $OUT"; exit 0; fi
codex exec --sandbox workspace-write --skip-git-repo-check --cd "$PWD" "Codex 組み込みの image_gen ツール（gpt-image-2）を直接呼んで画像を1枚作ってください。
API キーも Python/Node スクリプトも不要です。

プロンプト: 'Cute flat vector illustration, Japanese kawaii editorial style with simple rounded shapes and soft thick outlines. Five pets sitting side by side in a row facing the viewer, evenly spaced, cut off at the chest by the bottom edge of the image, parents and babies together: a red miniature dachshund mother, a tiny dachshund puppy, a golden retriever, a small golden retriever puppy, and a cream-and-gray ragdoll cat with blue eyes. Each has a simple happy face with dot eyes. Limited palette: soft peach #f7ad8c, soft yellow #ffe45e, apricot, cream, warm gray, pale pink cheeks. Pure white background, no text, no logos, no speech bubbles, no shadows on the background, wide composition with empty white space above the heads.'
サイズ: 1536x1024
保存先: $OUT" > artifacts/photos/friends.log 2>&1
# 上の余白を切り落として、下の 1536x576 だけにする（components/Footer.tsx の大きさと合わせる）
python3 -c "from PIL import Image; im=Image.open('$OUT'); im.crop((0, im.height-576, im.width, im.height)).save('$OUT')"
file "$OUT"
