// URLパラメータから必要な情報を取得
const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
const nickname = urlParams.get('nickname');
const campus = urlParams.get('campus');
const points = urlParams.get('points');
const rank = urlParams.get('rank');

// ログイン情報がすべて存在する場合のみセッションストレージに保存
if (name && nickname && campus) {
  sessionStorage.setItem('loggedInUser', JSON.stringify({ name, nickname, campus }));
  console.log('セッションストレージに保存:', { name, nickname, campus });
} else {
  console.error('ログイン情報が不足しています:', { name, nickname, campus });
}

// ポイントと順位を画面に表示
const pointsElement = document.getElementById('points');
const rankElement = document.getElementById('rank');

if (pointsElement) {
  pointsElement.textContent = ` ${points || '不明'}`;
}
if (rankElement) {
  rankElement.textContent = `現在${rank || '不明'}位`;
}


// 更新ボタンのクリックイベントを設定
document.getElementById("updatePointsButton")?.addEventListener("click", async function() {
  const button = this;
  const statusMessage = document.getElementById("statusMessage");
  const checkMark = document.getElementById("checkMark");

  // ボタンを一時的に無効化
  button.disabled = true;

  // セッションストレージからログイン情報を取得
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  if (!loggedInUser) {
    if (statusMessage) {
      statusMessage.innerText = "ログイン情報が見つかりません。再度ログインしてください。";
    }
    button.disabled = false;
    return;
  }

  const { name, nickname, campus } = loggedInUser;

  if (statusMessage) {
    statusMessage.innerText = "更新中...";
  }

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbx7JBecuBb4fRvq9SEBx38Noxogqo8M6_FNw83JCXevBsTdskIqfmfe5CANtRiGw7zYCA/exec", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=updatePoints&name=${encodeURIComponent(name)}&nickname=${encodeURIComponent(nickname)}&campus=${encodeURIComponent(campus)}`
    });
  
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }
  
    const data = await response.json();
    console.log("サーバー応答:", data);

    if (data.success) {
      // 更新成功時の処理
      if (checkMark) {
        checkMark.style.display = "inline"; // チェックマークを表示
      }
      if (statusMessage) {
        statusMessage.innerText = `ポイントが${data.points}になりました！更新完了`;
      }
    } else {
      // 更新失敗時の処理
      if (statusMessage) {
        statusMessage.innerText = data.message || "ポイント更新に失敗しました。";
      }
    }
  } catch (error) {
    // エラー発生時の処理
    console.error("エラーが発生しました:", error.message);
    if (statusMessage) {
      statusMessage.innerText = `エラーが発生しました: ${error.message}`;
    }
  } finally {
    // ボタンを再度有効化
    button.disabled = false;
  }
});
