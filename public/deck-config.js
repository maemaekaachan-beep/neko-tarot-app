// デッキ共通設定（ねこタロット / 動物タロット）
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
    // AIプロンプトに差し込む語り口の指示
    styleInstruction: 'わかりやすく具体的で、時々ねこっぽい表現（「〜にゃ」など）を自然に使います。温かく、でも的確なアドバイスをしてください。',
    // カード解釈中のローディング表示・エラー表示の語尾
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

// ページ読み込み時に、data-deck-* 属性のついた静的HTML要素へ
// キャラ名・絵文字を反映する
function applyDeckUITexts(deck){
  document.querySelectorAll('[data-deck-narrator]').forEach(el=>{
    el.textContent = el.textContent.split('ねこ先生').join(deck.narrator);
  });
  document.querySelectorAll('[data-deck-emoji]').forEach(el=>{
    el.textContent = deck.emoji;
  });
  document.title = document.title.split('ねこタロット').join(deck.label);
}
