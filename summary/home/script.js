const urlParams = new URLSearchParams(window.location.search);
const points = urlParams.get('points');
const rank = urlParams.get('rank');

// ポイントと順位を表示
document.getElementById('points').textContent = ` ${points || '不明'}`;
document.getElementById('rank').textContent = `現在${rank || '不明'}位`;

document.getElementById("updatePointsButton").addEventListener("click", function() {
  const button = this;
  const name = "ユーザー名"; // サーバーから取得するように改善する必要があります
  const nickname = "ニックネーム"; // 同上
  const campus = "キャンパス名"; // 同上

  // ボタンを押したらサーバーにリクエストを送る
  fetch("https://script.google.com/macros/s/AKfycbxS2jNKA8i1L_LzI8MDAFpv498u82TFIFr1XV_yljCgFlhNngsac61_RvYRZ2cpoCgWbw/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=updatePoints&name=${encodeURIComponent(name)}&nickname=${encodeURIComponent(nickname)}&campus=${encodeURIComponent(campus)}`
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("HTTPエラー: " + response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.success) {
        // ポイント更新成功
        button.disabled = true; // ボタンを無効化
        document.getElementById("checkMark").style.display = "inline"; // チェックマークを表示
        document.getElementById("statusMessage").innerText = `ポイントが${data.points}になりました！`;
      } else {
        // 更新失敗
        document.getElementById("statusMessage").innerText = data.message || "ポイント更新に失敗しました。";
      }
    })
    .catch(error => {
      console.error("エラーが発生しました:", error);
      document.getElementById("statusMessage").innerText = "エラーが発生しました: " + error.message;
    });
});


