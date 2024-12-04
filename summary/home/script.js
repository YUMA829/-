// URLパラメータからポイントと順位を取得（元のコード + 修正）
const urlParams = new URLSearchParams(window.location.search);
const points = urlParams.get('points');
const rank = urlParams.get('rank');

// ポイントと順位を表示（元のコード + 修正）
const pointsElement = document.getElementById('points');
const rankElement = document.getElementById('rank');

if (pointsElement) {
  pointsElement.textContent = ` ${points || '不明'}`;
}
if (rankElement) {
  rankElement.textContent = `現在${rank || '不明'}位`;
}

// ボタンイベントの設定（元のコード + 修正）
document.getElementById("updatePointsButton")?.addEventListener("click", async function() {
  const button = this;
  const statusMessage = document.getElementById("statusMessage");
  const checkMark = document.getElementById("checkMark");

  // ボタンを一時的に無効化（修正部分）
  button.disabled = true;

  // サーバーから動的に取得するべきデータ（仮データで代用）
  const name = "ユーザー名"; // サーバーから取得する想定（元のコードのまま）
  const nickname = "ニックネーム"; // サーバーから取得する想定（元のコードのまま）
  const campus = "キャンパス名"; // サーバーから取得する想定（元のコードのまま）

  // エラーハンドリングのための初期化（修正部分）
  if (statusMessage) {
    statusMessage.innerText = "更新中...";
  }

  try {
    // サーバーリクエスト送信（元のコード + 修正）
    const response = await fetch("https://script.google.com/macros/s/AKfycbzDeDBlqvNCrxDgso94md8t6KzGQlUx2z3FVybsiRVOKB3Lpd_kPkhrkgLKks8FOfCoUQ/exec", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=updatePoints&name=${encodeURIComponent(name)}&nickname=${encodeURIComponent(nickname)}&campus=${encodeURIComponent(campus)}`
    });

    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const data = await response.json();

    // サーバーからの応答に基づく処理（元のコード + 修正）
    if (data.success) {
      if (checkMark) {
        checkMark.style.display = "inline"; // チェックマークを表示
      }
      if (statusMessage) {
        statusMessage.innerText = `ポイントが${data.points}になりました！`;
      }
    } else {
      if (statusMessage) {
        statusMessage.innerText = data.message || "ポイント更新に失敗しました。";
      }
    }
  } catch (error) {
    // エラー発生時の処理（修正部分）
    console.error("エラーが発生しました:", error);
    if (statusMessage) {
      statusMessage.innerText = `エラーが発生しました: ${error.message}`;
    }
  } finally {
    // 応答完了後、ボタンの状態を復元（修正部分）
    button.disabled = false;
  }
});


