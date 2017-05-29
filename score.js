var url = "https://jsonblob.com/api/jsonBlob/ca5a0db5-43aa-11e7-ae4c-9d6acfc1248e";
var editURL = "https://jsonblob.com/ca5a0db5-43aa-11e7-ae4c-9d6acfc1248e";

function getScores(callback) {
    return loadJSON(url, callback);
}

function saveScore(name, time) {
    getScores(function(res) {
        var scores = res.scores;
        var d = new Date();
        var date = format10(d.getDate()) + "/" + format10(d.getMonth()) + "/" + d.getFullYear() + " at " + format10(d.getHours()) + ":" + format10(d.getMinutes());
        scores.push({
            "name": name,
            "time": time,
            "date": date
        });
        httpPut(url, JSON.stringify({
          "scores": scores
        }));
    });
}

function reinitScores() {
  httpPut(url, JSON.stringify({
    "scores": []
  }));
}

function httpPut(u, data) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', u);
    xhr.setRequestHeader('Content-Type', "application/json");
    xhr.send(data);
}

function formatTime(sec) {
    var secs = sec % 60;
    var mins = floor(sec / 60);
    return (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs);
}

function format10(n) {
  return (n >= 10 ? n : "0" + n);
}
