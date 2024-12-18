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
const crownImage = document.getElementById('crownImage'); // 王冠画像要素

if (pointsElement) {
  pointsElement.textContent = ` ${points || '不明'}`;
}
if (rankElement) {
  rankElement.textContent = `現在${rank || '不明'}位`;
}

// 順位に応じて王冠の画像を表示
function displayCrown(rank) {
  if (!crownImage) return;

  // 1位から3位: 金の王冠 / 4位以下: 銅の王冠
  if (rank >= 1 && rank <= 3) {
    crownImage.src = "crowns/Gold_crown.png"; // 金の王冠画像
    crownImage.style.display = "inline";
  } else if (rank > 3) {
    crownImage.src = "crowns/王冠銅.png"; // 銅の王冠画像
    crownImage.style.display = "inline";
  } else {
    crownImage.style.display = "none"; // ランク不明時は非表示
  }
}

// rankが有効な場合、王冠を表示
if (rank) {
  displayCrown(parseInt(rank, 10));
} else {
  console.error("順位が不明です。");
}






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

  // セッションストレージから現在のアカウントを取得
  const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    if (statusMessage) {
      statusMessage.innerText = "ログイン情報が見つかりません。";
    }
    button.disabled = true; // ログイン情報がない場合はボタンを無効化
    return;
  }

  const { name } = loggedInUser; // アカウントの識別に `name` を使用
  const today = getFormattedDate(new Date());

  // ローカルストレージからアカウントごとの押下日を取得
  const accountData = JSON.parse(localStorage.getItem(`account_${name}`)) || {};
  const lastPressedDate = accountData.lastPressedDate;

  // ボタンの状態を確認して設定
  if (lastPressedDate === today) {
    button.disabled = true;
    if (statusMessage) {
      statusMessage.innerText = "☑︎";
    }
  } else {
    button.disabled = false; // 日付が変わった場合はリセット
    if (statusMessage) {
      statusMessage.innerText = "◻︎";
    }
  }

  // ボタンクリックイベント
  button.addEventListener("click", async function () {
    button.disabled = true; // ボタンを無効化
    if (statusMessage) {
      statusMessage.innerText = "更新中...";
    }

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbz7kgAYDkio0Bp5ae3JOF3w_UZ2lhGeDREwlMjSA3bwIUZbCTaPh_RMKNoAzADztIttow/exec", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `action=updatePoints&name=${encodeURIComponent(name)}&nickname=${encodeURIComponent(loggedInUser.nickname)}&campus=${encodeURIComponent(loggedInUser.campus)}`
      });

      if (!response.ok) {
        throw new Error(`HTTPエラー: ${response.status}`);
      }

      const data = await response.json();
      console.log("サーバー応答:", data);

      if (data.success) {
        if (statusMessage) {
          statusMessage.innerText = `☑︎`;
        }
        // 押下日をアカウントごとに保存
        localStorage.setItem(`account_${name}`, JSON.stringify({ lastPressedDate: today }));
      } else {
        if (statusMessage) {
          statusMessage.innerText = data.message || "ポイント更新に失敗しました。";
        }
        button.disabled = false; // エラー時は再有効化
      }
    } catch (error) {
      console.error("エラーが発生しました:", error.message);
      if (statusMessage) {
        statusMessage.innerText = `エラーが発生しました: ${error.message}`;
      }
      button.disabled = false; // エラー時は再有効化
    }
  });
});
