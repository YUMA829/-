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
      const response = await fetch("https://script.google.com/macros/s/AKfycbx7JBecuBb4fRvq9SEBx38Noxogqo8M6_FNw83JCXevBsTdskIqfmfe5CANtRiGw7zYCA/exec", {
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
