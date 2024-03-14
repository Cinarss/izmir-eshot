function searchBus() {
    var busNumber = document.getElementById("searchInput").value.trim();
    var busResultsDiv = document.getElementById("busResults");
    busResultsDiv.innerHTML = "";

    // CSV dosyasından otobüs numarasına göre durakları ara
    fetch("otobusler.csv")
        .then(response => response.text())
        .then(data => {
            var lines = data.split("\n");
            for (var i = 1; i < lines.length; i++) {
                var row = lines[i].split(";");
                if (row.length >= 2) {
                    var busNo = row[0].trim();
                    var busStops = row[2].split("-");
                    if (busNo === busNumber) {
                        // Durakları listeleme
                        fetch("duraklar.csv")
                            .then(response => response.text())
                            .then(data => {
                                var stopLines = data.split("\n");
                                var stopList = document.createElement("ul"); // <ul> elementi oluştur
                                stopList.classList.add("mt-4"); // Bootstrap class'ını ekle
                                for (var j = 1; j < stopLines.length; j++) {
                                    var stopRow = stopLines[j].split(";");
                                    if (stopRow.length >= 5) {
                                        var stopId = stopRow[0].trim();
                                        var stopName = stopRow[1].trim();
                                        var stopHats = stopRow[4].split("-");
                                        if (stopHats.includes(busNumber)) {
                                            var stopItem = document.createElement("li");
                                            var stopLink = document.createElement("a"); // <a> elementi oluştur
                                            stopLink.href = `duraga-yaklasan.html?stopId=${stopId}`; // Link oluştur, ancak tıklama işlevini atama
                                            stopLink.textContent = stopName;
                                            stopLink.onclick = function() {
                                                getBusApproachingInfo(stopId);
                                            };
                                            stopItem.appendChild(stopLink); // <a> elementini <li> içine ekle
                                            stopList.appendChild(stopItem);
                                        }
                                    }
                                }
                                busResultsDiv.appendChild(stopList); // Oluşturulan <ul> elementini sonuçlar alanına ekle
                            })
                            .catch(error => {
                                console.error('Hata:', error);
                            });
                        return; // İşlemi sonlandır
                    }
                }
            }
            // Eşleşme bulunamadığında uyarı mesajı göster
            var noResult = document.createElement("p");
            noResult.textContent = "Bu otobüs numarasına ait bilgi bulunamadı.";
            busResultsDiv.appendChild(noResult);
        })
        .catch(error => {
            console.error('Hata:', error);
        });
}
