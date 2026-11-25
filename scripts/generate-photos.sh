#!/bin/bash
# ダミー期間用の写真を AI（Codex 組み込みの image_gen / gpt-image-2）で生成する。
# 人の顔は作らない（作り物の質感が出るため）。犬・猫、手元、育つ場所の様子だけ。
#   bash scripts/generate-photos.sh          … まだ無い写真だけ作る
#   FORCE=1 bash scripts/generate-photos.sh  … すべて作り直す
set -u
cd "$(dirname "$0")/.."
mkdir -p public/images/breeder public/images/interview public/images/top
LOG_DIR=artifacts/photos
mkdir -p "$LOG_DIR"

STYLE="Photorealistic editorial photograph for a Japanese lifestyle magazine about small, careful dog and cat breeders. NO human faces visible (people cropped at the shoulders or out of frame), no text, no logos, no brand marks, no watermark. The animals look healthy, clean, calm and relaxed, never caged, crowded or distressed. Japan, a tidy home-like place where animals are raised, warm soft daylight from a window, pale wood floor, cream and soft peach blankets, natural slightly desaturated warm colors, shallow depth of field, quiet gentle atmosphere."

gen() { # gen <公開するパス（.jpg）> <サイズ> <プロンプト>
  if [ -f "$1" ] && [ "${FORCE:-0}" != "1" ]; then echo "あり: $1"; return; fi
  local raw="$LOG_DIR/$(basename "${1%.jpg}").png"
  codex exec --sandbox workspace-write --skip-git-repo-check --cd "$PWD" "Codex 組み込みの image_gen ツール（gpt-image-2）を直接呼んで画像を1枚作ってください。
API キーも Python/Node スクリプトも不要です。

プロンプト: '$3'
サイズ: $2
保存先: $raw" > "$LOG_DIR/$(basename "$1").log" 2>&1
  sips -s format jpeg -s formatOptions 86 "$raw" --out "$1" > /dev/null && file "$1"
}

B=public/images/breeder
I=public/images/interview
# ブリーダーの写真（縦 4:5。カードと記事の冒頭）
gen $B/mihon-haruka.jpg 1024x1280 "A woman in a beige cardigan sitting on the wooden floor of a Japanese living room, an adult red smooth-haired miniature dachshund mother lying against her knee while two eight-week-old dachshund puppies play on a cream blanket in front of them, her hand resting on the mother dog's back, the woman cropped at the shoulders so her face is out of frame. $STYLE" &
gen $B/kari-daichi.jpg 1024x1280 "A man in an olive work jacket kneeling on the grass of a fenced exercise yard, an adult golden retriever leaning calmly against his side and a fluffy golden retriever puppy held in his arms, blurred mountains and a wooden kennel building in the background, the man cropped at the shoulders so his face is out of frame. $STYLE" &
gen $B/hinagata-aya.jpg 1024x1280 "A woman in a soft gray sweater sitting on a sofa by a sunny window with an adult blue-eyed seal point ragdoll cat relaxed on her lap and a small ragdoll kitten climbing onto her forearm, a cat tower softly blurred behind, the woman cropped at the shoulders so her face is out of frame. $STYLE" &
wait
# トップの写真と、取材記事の本文に入れる写真（育つ場所・記録・子犬や子猫）
gen public/images/top/talk.jpg 1536x1024 "A breeder and a visiting couple sitting on floor cushions around a low wooden table in a Japanese living room, an adult miniature dachshund calmly sniffing the visitor's open hand, a notebook and tea cups on the table, all people seen from the side and cropped at the shoulders so faces are out of frame. $STYLE" &
gen $I/mihon-haruka-room.jpg 1536x1024 "A corner of a Japanese living room with a low open puppy playpen on washable mats, a red miniature dachshund mother lying inside with three sleeping puppies beside her on a cream blanket, a few soft toys, a sofa and a bookshelf nearby showing it is a family home, nobody in frame, wide shot. $STYLE" &
gen $I/mihon-haruka-note.jpg 1536x1024 "A small digital kitchen scale on a wooden table with a tiny dachshund puppy sitting in a shallow basket on top of it, beside an open notebook with handwritten-style rows of numbers that are not readable and a pen, a hand at the edge of the frame steadying the basket, no face in frame. $STYLE" &
wait
gen $I/kari-daichi-yard.jpg 1536x1024 "A wide fenced grassy exercise yard next to a clean wooden kennel building in the Japanese countryside, three adult golden retrievers, one running, one lying in the shade, one drinking from a water bowl, mountains in the distance, nobody in frame, wide shot. $STYLE" &
gen $I/kari-daichi-puppies.jpg 1536x1024 "Five seven-week-old golden retriever puppies exploring an indoor play area with different floor surfaces, a wooden board, a rubber mat and a patch of artificial grass, a low wobble board and a cardboard tunnel, one puppy looking at the camera, a person's rubber boots just visible at the edge of the frame. $STYLE" &
gen $I/hinagata-aya-room.jpg 1536x1024 "A bright clean room in a Japanese house set up for cats, a tall cat tower, scratching posts, a window perch with a sheer curtain, two adult ragdoll cats lounging, one on the perch and one on the floor, a neat row of food bowls, nobody in frame, wide shot. $STYLE" &
wait
gen $I/hinagata-aya-kittens.jpg 1536x1024 "Three ten-week-old ragdoll kittens with blue eyes playing with a feather wand toy on a pale wood floor, one kitten reaching up with a paw, the hand holding the toy just out of focus at the edge of the frame. $STYLE" &
wait
# トップの最初の画面の、アーチ形の窓に入れる写真（縦 4:5。人は写さない。上が丸く切り抜かれるので、主役は中央から下に置く）
gen public/images/top/hero-mother.jpg 1024x1280 "A calm red long-haired miniature dachshund mother lying on a cream blanket with three tiny three-week-old puppies sleeping snuggled against her belly, she is gently looking down at them, the animals in the center and lower part of the frame with soft blurred room above, nobody in frame. $STYLE" &
gen public/images/top/hero-kittens.jpg 1024x1280 "Two fluffy eight-week-old ragdoll kittens with blue eyes sitting close together inside a round wicker basket lined with a soft peach blanket, one resting its chin on the other, their adult mother cat softly blurred in the background, the kittens in the center and lower part of the frame, nobody in frame. $STYLE" &
gen public/images/top/hero-outside.jpg 1024x1280 "A fluffy eight-week-old golden retriever puppy taking careful first steps on green grass in a fenced garden, its adult golden retriever mother walking right beside it and looking down at the puppy, warm morning light, the animals in the center and lower part of the frame with soft blurred trees above, nobody in frame. $STYLE" &
wait
echo "完了。public/images/ を確認してください。"
