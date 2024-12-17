// Hent data asynkront med fetch
async function loadData() {
  try {
      const response = await fetch('albums.json'); // Hent data fra ekstern JSON-fil
      const jsonData = await response.json();      // Parse JSON til JavaScript-objekt

      // Objekt til nye overskriftnavne
      const columnHeaders = {
          id: "ID",                          // Definerer overskrift for album-ID
          albumName: "Album Navn",           // Definerer overskrift for albumnavn
          artistName: "Kunstner Navn",       // Definerer overskrift for kunstnernavn
          artistWebsite: "Kunstner Hjemmeside", // Definerer overskrift for kunstnerens hjemmeside
          productionYear: "Produktionsår",   // Definerer overskrift for produktionsår
          genre: "Genre",                    // Definerer overskrift for genre
          trackList: "Nummerliste"           // Definerer overskrift for nummerliste
      };

      // Funktion til at konvertere sekunder til "minutter:sekunder"
      function formatTime(seconds) {
          const minutes = Math.floor(seconds / 60);  // Udregner antallet af hele minutter
          const remainingSeconds = seconds % 60;     // Finder de resterende sekunder
          return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`; // Formaterer tid som "minutter:sekunder"
      }

      // Find unikke kolonner og undlad de uønskede
      let col = [];                                   // Opretter en tom liste til at gemme kolonnenavne
      for (let i = 0; i < jsonData.length; i++) {     // Løber gennem hvert album i JSON-dataen
          for (let key in jsonData[i]) {              // Løber gennem hver nøgle i et album
              if (key !== "artistWebsite" && key !== "trackList" && col.indexOf(key) === -1) { // Filtrerer uønskede kolonner og kontrollerer for dubletter
                  col.push(key);                      // Tilføjer nøglen til kolonne-listen, hvis den er unik
              }
          }
      }

      // Opret tabel
      const table = document.createElement("table");  // Opretter en tabel
      const thead = table.createTHead();              // Opretter tabelhovedet (thead)
      const tbody = table.createTBody();              // Opretter tabelkroppen (tbody)
      table.setAttribute("id", "json-table");         // Tilføjer et ID til tabellen for styling

      // Opret overskriftsrækken
      let tr = thead.insertRow(-1);                   // Tilføjer en ny række til tabelhovedet
      for (let index = 0; index < col.length; index++) { // Løber gennem kolonne-listen
          let th = document.createElement("th");      // Opretter et tabelhoved-celleelement (th)
          th.innerHTML = columnHeaders[col[index]] || col[index]; // Sætter overskriftens tekst med kolonnenavn eller fallback til nøglen
          tr.appendChild(th);                         // Tilføjer tabelhoved-cellen til rækken
      }
      thead.appendChild(tr);                          // Tilføjer overskriftsrækken til tabelhovedet

      // Opret tabelrækkerne med tooltip til trackList
      for (let i = 0; i < jsonData.length; i++) {     // Løber gennem hvert album i JSON-dataen
          let tr = tbody.insertRow(-1);               // Tilføjer en ny række til tabelkroppen

          for (let j = 0; j < col.length; j++) {      // Løber gennem kolonne-listen
              let tabCell = tr.insertCell(-1);        // Tilføjer en ny celle til rækken
              tabCell.innerHTML = jsonData[i][col[j]]; // Sætter celleindholdet med albumdata
          }

          // Generér HTML for trackList som en skjult div med tid i "minutter:sekunder"
          let trackListHTML = '<div class="track-list">'; // Start HTML for en skjult div, som indeholder sangliste
          jsonData[i].trackList.forEach(track => {         // Løber gennem hvert nummer i album
              const formattedTime = formatTime(track.trackTimeInSeconds); // Konverterer trackTimeInSeconds til minutter og sekunder
              trackListHTML += `<p>${track.trackNumber}. ${track.trackTitle} (${formattedTime})</p>`; // Tilføjer sangnummer, titel og tid til HTML
          });
          trackListHTML += '</div>';                     // Afslutter HTML for sangliste-div

          // Tilføj trackList som en skjult div i rækken
          tr.innerHTML += trackListHTML;                 // Tilføjer sangliste-diven som en del af række-HTML'en
          tr.classList.add("tooltip");                   // Tilføjer klassen "tooltip" til rækken for styling og hover-effekt
      }

      document.querySelector(".json-table-container").appendChild(table); // Tilføjer tabellen til HTML-containeren
  } catch (error) {
      console.error("Fejl ved hentning af data:", error); // Fejlhåndtering
  }
}

// Kald funktionen for at indlæse data
loadData();
