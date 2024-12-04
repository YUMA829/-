const urlParams = new URLSearchParams(window.location.search);
const points = urlParams.get('points');
const rank = urlParams.get('rank');

// ポイントと順位を表示
document.getElementById('points').textContent = ` ${points || '不明'}`;
document.getElementById('rank').textContent = `現在${rank || '不明'}位`;

document.getElementById("updatePointsButton").addEventListener("click", function() {
  const button = this;
  const name = "ユーザー名"; // ログイン時に取得するユーザー名
  const nickname = "ニックネーム"; // ログイン時に取得するニックネーム
  const campus = "キャンパス名"; // ログイン時に取得するキャンパス

  // ボタンを押したらサーバーにリクエストを送る
  fetch("https://script.google.com/macros/s/AKfycbzb5C5cmOsbl0q3GeCPdfkDpvTP18WkIenIY1s0lNFQUG_BkGt7_Cv93YzE6kwuWx4cdg/exec", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=updatePoints&name=${encodeURIComponent(name)}&nickname=${encodeURIComponent(nickname)}&campus=${encodeURIComponent(campus)}`
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // ポイント更新成功
      button.disabled = true; // ボタンを無効化
      document.getElementById("checkMark").style.display = "inline"; // チェックマークを表示
      document.getElementById("statusMessage").innerText = `ポイントが${data.points}になりました！`;
    } else {
      // 更新失敗
      document.getElementById("statusMessage").innerText = "ポイント更新に失敗しました。";
    }
  })
  .catch(error => {
    console.error("エラーが発生しました:", error);
    document.getElementById("statusMessage").innerText = "エラーが発生しました。";
  });
});


