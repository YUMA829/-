const urlParams = new URLSearchParams(window.location.search);
const points = urlParams.get('points-display');
const rank = urlParams.get('rank');

// ポイントと順位を表示
document.getElementById('points-display').textContent = `現在のポイント: ${points || '不明'}`;
document.getElementById('rank').textContent = `現在の順位: ${rank || '不明'}`;

document.addEventListener('DOMContentLoaded', () => {
  // URL パラメータからポイントとミッションを取得
  const urlParams = new URLSearchParams(window.location.search);
  const points = urlParams.get('points');
  const missions = JSON.parse(urlParams.get('missions') || '{}');

  // ポイントを表示
  if (points) {
    document.getElementById('points-display').textContent = `現在のポイント: ${points}`;
  }

  // ミッションを更新
  if (missions.login) {
    const loginMission = document.getElementById('mission-login');
    loginMission.querySelector('.checkmark').style.display = 'inline'; // チェックマークを表示
    loginMission.style.color = 'green'; // 達成済みを強調
  }
});
