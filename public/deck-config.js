// デッキ共通設定（ねこタロット / 動物タロット / 和風タロット）
// menu.html でユーザーが選んだデッキを sessionStorage に保存し、
// 各占いページはここから設定を読み込んで画像・語り部キャラを切り替える。
const DECKS = {
  cat: {
    key: 'cat',
    label: 'ねこタロット',
    base: 'https://raw.githubusercontent.com/maemaekaachan-beep/cat-tarot-images/main/',
    ext: 'jpg',
    narrator: 'ねこ先生',
    emoji: '🐱',
    styleInstruction: 'わかりやすく具体的で、時々ねこっぽい表現（「〜にゃ」など）を自然に使います。温かく、でも的確なアドバイスをしてください。',
    loadingSuffix: 'にゃ…',
    errorSuffix: 'にゃ…'
  },
  animal: {
    key: 'animal',
    label: '動物タロット',
    base: 'https://raw.githubusercontent.com/maemaekaachan-beep/animal-tarot-images/main/',
    ext: 'jpeg',
    narrator: 'ミネルヴァ',
    emoji: '🦉',
    styleInstruction: '落ち着いた、丁寧な女性の言葉遣いで語りかけます。知性的で穏やかな、包み込むような口調で、的確なアドバイスをしてください。「〜ですわ」「〜でしょう」など上品な言い回しを自然に使います。',
    loadingSuffix: '…',
    errorSuffix: '…'
  },
  wafu: {
    key: 'wafu',
    label: '和風タロット',
    base: 'https://raw.githubusercontent.com/maemaekaachan-beep/wafu-tarot-images/main/',
    ext: 'jpg',
    emoji: '⛩️',
    // 4霊獣が交代で語る。narrator/styleInstructionはカードに応じてgetNarratorForCard()で決まる
    isMultiNarrator: true,
    narrators: {
      dragon: { name: '龍神様', emoji: '🐉', styleInstruction: '力強く情熱的な男性口調で語りかけます。「〜だ」「〜だぜ」のような、頼れる兄貴分のような、まっすぐで熱いアドバイスをしてください。', loadingSuffix: '…', errorSuffix: '…' },
      crane:  { name: '鶴姫様', emoji: '🕊️', styleInstruction: '優雅で慈愛深い、包み込むような上品な女性口調で語りかけます。「〜ですのよ」「〜いたしましょう」のような、穏やかで温かいアドバイスをしてください。', loadingSuffix: '…', errorSuffix: '…' },
      fox:    { name: '狐の巫女', emoji: '🦊', styleInstruction: 'クールで少し茶目っ気のある、知性的な口調で語りかけます。「〜だろう」「〜というわけさ」のような、謎めいた鋭いアドバイスをしてください。', loadingSuffix: '…', errorSuffix: '…' },
      lion:   { name: '狛犬翁', emoji: '🦁', styleInstruction: '実直で頼もしい、武士・古老めいた口調で語りかけます。「〜でござる」「〜じゃ」のような、地に足のついた誠実なアドバイスをしてください。', loadingSuffix: '…', errorSuffix: '…' }
    },
    // 大アルカナ → 霊獣の割り振り
    majorArcanaSpirit: {
      '愚者':'dragon','魔術師':'dragon','戦車':'dragon','塔':'dragon','審判':'dragon','太陽':'dragon',
      '女帝':'crane','恋人たち':'crane','節制':'crane','星':'crane','世界':'crane',
      '女教皇':'fox','隠者':'fox','正義':'fox','吊るされた男':'fox','死神':'fox','月':'fox',
      '皇帝':'lion','法王':'lion','力':'lion','運命の輪':'lion','悪魔':'lion'
    }
  }
};

// 現在選択中のデッキを取得（未選択時は ねこタロット をデフォルトに）
function getCurrentDeck(){
  const key = sessionStorage.getItem('tarotDeck') || 'cat';
  return DECKS[key] || DECKS.cat;
}

// 現在のデッキを保存
function setCurrentDeck(key){
  sessionStorage.setItem('tarotDeck', key);
}

// カード名から、実際に語るキャラの情報（name/emoji/styleInstruction/loadingSuffix/errorSuffix）を返す。
// 単一語り部のデッキ（ねこ/動物）は deck 自身の値をそのまま返す。
function getNarratorForCard(deck, cardName){
  if(!deck.isMultiNarrator){
    return {
      name: deck.narrator,
      emoji: deck.emoji,
      styleInstruction: deck.styleInstruction,
      loadingSuffix: deck.loadingSuffix,
      errorSuffix: deck.errorSuffix
    };
  }
  let spiritKey;
  if(cardName.startsWith('ワンド')) spiritKey = 'dragon';
  else if(cardName.startsWith('カップ')) spiritKey = 'crane';
  else if(cardName.startsWith('ソード')) spiritKey = 'fox';
  else if(cardName.startsWith('ペンタクル')) spiritKey = 'lion';
  else spiritKey = deck.majorArcanaSpirit[cardName] || 'dragon';
  const n = deck.narrators[spiritKey];
  return { name: n.name, emoji: n.emoji, styleInstruction: n.styleInstruction, loadingSuffix: n.loadingSuffix, errorSuffix: n.errorSuffix };
}

// ページ読み込み時に、data-deck-* 属性のついた静的HTML要素へ
// キャラ名・絵文字を反映する（単一語り部デッキ向け。和タロットはカードごとに別途反映）
function applyDeckUITexts(deck){
  if(deck.isMultiNarrator) return; // 和タロットはカードが決まってから反映する
  document.querySelectorAll('[data-deck-narrator]').forEach(el=>{
    el.textContent = el.textContent.split('ねこ先生').join(deck.narrator);
  });
  document.querySelectorAll('[data-deck-emoji]').forEach(el=>{
    el.textContent = deck.emoji;
  });
  document.title = document.title.split('ねこタロット').join(deck.label);
}
