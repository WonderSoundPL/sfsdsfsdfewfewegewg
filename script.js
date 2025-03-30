// Pobieranie danych z localStorage (jeśli istnieją)
let artists = JSON.parse(localStorage.getItem("artists")) || [];
let songs = JSON.parse(localStorage.getItem("songs")) || [];

// Funkcja zapisująca dane do localStorage
function saveToLocalStorage() {
    localStorage.setItem("artists", JSON.stringify(artists));
    localStorage.setItem("songs", JSON.stringify(songs));
}

// Funkcja do odświeżenia listy artystów
function updateArtists() {
    let artistList = document.getElementById("artist-list");
    if (!artistList) return;
    artistList.innerHTML = "";

    artists.forEach(artist => {
        let li = document.createElement("li");
        let link = document.createElement("a");
        link.href = `artist.html?name=${encodeURIComponent(artist.name)}`;
        link.textContent = artist.name;
        li.appendChild(link);
        artistList.appendChild(li);
    });
}

// Funkcja do odświeżenia listy piosenek na Global 100
function updateRanking() {
    let rankings = [...songs].sort((a, b) => b.totalStreams - a.totalStreams).slice(0, 10);
    let rankingList = document.getElementById("global-ranking");
    if (!rankingList) return;
    rankingList.innerHTML = "";

    rankings.forEach((song, index) => {
        let li = document.createElement("li");
        li.textContent = `#${index + 1} - ${song.title} (${song.artist}) - 🔥 ${song.totalStreams.toLocaleString()} odtworzeń`;
        rankingList.appendChild(li);
    });
}

// Funkcja do aktualizacji rankingów krajowych
function updateCountryRankings() {
    let rankingList = document.getElementById("country-rankings");
    rankingList.innerHTML = "";

    let countries = ["USA", "Polska", "UK", "Japonia", "Korea Płd.", "Chiny", "Niemcy"];
    countries.forEach(country => {
        let countrySongs = [...songs].sort((a, b) => b.countryStreams[country] - a.countryStreams[country]).slice(0, 5);

        let li = document.createElement("li");
        li.innerHTML = `<strong>${country}</strong>:<br> ${countrySongs.map(song => `${song.title} (${song.artist}) - ${song.countryStreams[country].toLocaleString()} odtw.`).join("<br>")}`;
        rankingList.appendChild(li);
    });
}

// Funkcja do dodawania artysty
document.getElementById("add-artist-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let artistName = document.getElementById("artist-name").value;

    artists.push({ name: artistName });
    saveToLocalStorage();
    updateArtists();  // Odśwież listę artystów
    alert(`Dodano artystę: ${artistName}`);
    document.getElementById("add-artist-form").reset();
});

// Funkcja do dodawania piosenki
document.getElementById("add-song-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let songTitle = document.getElementById("song-title").value;
    let songArtist = document.getElementById("song-artist").value;

    let songData = {
        title: songTitle,
        artist: songArtist,
        totalStreams: Math.floor(Math.random() * 10000000),
        countryStreams: {}
    };

    let remainingStreams = songData.totalStreams;
    let countries = ["USA", "Polska", "UK", "Japonia", "Korea Płd.", "Chiny", "Niemcy"];
    countries.forEach((country, index) => {
        let countryShare = index === countries.length - 1 ? remainingStreams : Math.floor(Math.random() * remainingStreams / 2);
        songData.countryStreams[country] = countryShare;
        remainingStreams -= countryShare;
    });

    songs.push(songData);
    saveToLocalStorage();
    updateRanking();  // Odśwież ranking piosenek
    alert(`Dodano piosenkę: ${songTitle}`);
    document.getElementById("add-song-form").reset();
});

// Aktualizacja danych co 2 minuty
setInterval(() => {
    songs.forEach(song => {
        song.totalStreams += Math.floor(Math.random() * 10000);  // Symulacja wzrostu odtworzeń
        saveToLocalStorage();
        updateRanking();  // Odśwież ranking
    });
}, 120000);  // 120000ms = 2min

// Zaktualizowanie listy po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    updateArtists();
    updateRanking();
    updateCountryRankings();
});
