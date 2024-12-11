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
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("updatePointsButton");
  const statusMessage = document.getElementById("statusMessage");

  // 日付フォーマット関数 (YYYY-MM-DD)
  function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // 前回の押下日を取得
  const lastPressedDate = localStorage.getItem("lastPressedDate");
  const today = getFormattedDate(new Date());

  // ボタンの状態を確認して設定
  if (lastPressedDate === today) {
    button.disabled = true;
    if (statusMessage) {
      statusMessage.innerText = "ボタンは明日再度有効になります。";
    }
  } else {
    button.disabled = false; // リセット
    if (statusMessage) {
      statusMessage.innerText = "更新ボタンを押してください。";
    }
  }

  // ボタンクリックイベント
  button.addEventListener("click", async function () {
    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
      if (statusMessage) {
        statusMessage.innerText = "ログイン情報が見つかりません。再度ログインしてください。";
      }
      return;
    }

    const { name, nickname, campus } = loggedInUser;
    button.disabled = true; // ボタンを無効化

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
        if (statusMessage) {
          statusMessage.innerText = `ポイントが${data.points}になりました！更新完了`;
        }
        localStorage.setItem("lastPressedDate", today); // 押下日を保存
      } else {
        if (statusMessage) {
          statusMessage.innerText = data.message || "ポイント更新に失敗しました。";
        }
        button.disabled = false; // エラー時は再度有効化
      }
    } catch (error) {
      console.error("エラーが発生しました:", error.message);
      if (statusMessage) {
        statusMessage.innerText = `エラーが発生しました: ${error.message}`;
      }
      button.disabled = false; // エラー時は再度有効化
    }
  });
});
