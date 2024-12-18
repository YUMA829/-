document.getElementById("registrationForm").addEventListener("submit", function(event) {
    const name = document.getElementById("name").value;
    const nickname = document.getElementById("nickname").value;
    const campus = document.getElementById("campus").value;

    console.log("送信データ:", { name, nickname, campus });
  });



