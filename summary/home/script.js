const urlParams = new URLSearchParams(window.location.search);
const points = urlParams.get('points');
const rank = urlParams.get('rank');

// ポイントと順位を表示
document.getElementById('points').textContent = `現在のポイント: ${points || '不明'}`;
document.getElementById('rank').textContent = `現在の順位: ${rank || '不明'}`;