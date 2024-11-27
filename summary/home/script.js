    // URLクエリパラメータからポイントを取得
    const urlParams = new URLSearchParams(window.location.search);
    const points = urlParams.get('points');

    // ポイントを画面に表示
    if (points !== null) {
      document.getElementById('points').textContent = `${points} ポイント`;
    } else {
      document.getElementById('points').textContent = 'ポイント情報が見つかりません。';
    }