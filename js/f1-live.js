
document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("f1LiveStandings");
  if (!container) return;

  var PRIMARY_URL = "https://api.jolpi.ca/ergast/f1/current/driverstandings/";
  var FALLBACK_URL = "https://api.jolpi.ca/ergast/f1/2026/driverstandings/";

  fetch(PRIMARY_URL)
    .then(function (response) {
      if (!response.ok) throw new Error("Primary endpoint failed");
      return response.json();
    })
    .catch(function () {
      // "current" alias can occasionally lag right at a season boundary —
      // fall back to an explicit season so the table still loads.
      return fetch(FALLBACK_URL).then(function (response) {
        if (!response.ok) throw new Error("Fallback endpoint failed");
        return response.json();
      });
    })
    .then(function (data) {
      var lists = data.MRData.StandingsTable.StandingsLists;
      if (!lists || !lists.length) throw new Error("No standings available yet");
      var standings = lists[0].DriverStandings.slice(0, 10);
      renderStandings(standings, lists[0].season, lists[0].round);
    })
    .catch(function () {
      container.innerHTML =
        '<p class="section-sub">Наразі не вдалося завантажити актуальну турнірну таблицю ' +
        '(потрібне підключення до інтернету). Перевірте офіційний залік на ' +
        '<a href="https://www.formula1.com/en/results.html" target="_blank" rel="noopener noreferrer" style="color:var(--c-red)">formula1.com</a>.</p>';
    });

  function renderStandings(standings, season, round) {
    var rows = standings
      .map(function (row) {
        var driver = row.Driver.givenName + " " + row.Driver.familyName;
        var team = row.Constructors && row.Constructors[0] ? row.Constructors[0].name : "";
        return (
          "<tr>" +
          "<td>" + row.position + "</td>" +
          "<td>" + driver + "</td>" +
          "<td>" + team + "</td>" +
          "<td>" + row.points + "</td>" +
          "</tr>"
        );
      })
      .join("");

    container.innerHTML =
      '<p class="section-sub" style="margin-bottom:18px;">Дані завантажені автоматично через публічне API ' +
      "(сезон " + season + ", після " + round + "-го етапу).</p>" +
      '<div style="overflow-x:auto;">' +
      '<table class="f1-standings-table">' +
      "<thead><tr><th>#</th><th>Пілот</th><th>Команда</th><th>Очки</th></tr></thead>" +
      "<tbody>" + rows + "</tbody>" +
      "</table></div>";
  }
});
