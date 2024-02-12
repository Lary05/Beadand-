$(document).ready(function(){
    // Település neve input mező, hozzáadás gomb és Település neve felirat alapértelmezetten elrejtése
    $('#cityNameFormGroup, #addCityBtn, #cityNameLabel').hide();

    // Megyék legördülő menü változásának eseménykezelője
    $('#countySelect').change(function(){
        var selectedCounty = $(this).val();
        
        // Ellenőrzés, hogy van-e választás a megyék menüben
        if(selectedCounty) {
            // Település neve input mező, hozzáadás gomb és Település neve felirat megjelenítése
            $('#cityNameFormGroup, #addCityBtn, #cityNameLabel').show();
            
            $.ajax({
                url: 'csvBeolvas.php',
                method: 'POST',
                data: {county: selectedCounty},
                dataType: 'json',
                success: function(response){
                    if(response.cities.length > 0){
                        var cityList = '<div class="city-list">'; // Kezdő div
                        response.cities.forEach(function(city){
                            cityList += '<div class="city">' + city + '</div>' + '<div class="delete-container"><a href="#" class="btn btn-danger deleteBtn">Delete</a></div>'; // Települések kiírása és törlés gombok elhelyezése
                        });
                        cityList += '</div>'; // Záró div
                        $('#cityList').html(cityList); // Települések div-einek hozzáadása a cityList div-hez
                        $('#cityList').show(); 
                        
                        // Törlés gombok eseménykezelőjének hozzáadása
                        $('.deleteBtn').click(function(e) {
                            e.preventDefault(); // Az alapértelmezett művelet megakadályozása
                            var cityName = $(this).closest('.city').text().trim(); // A gomb szülő div-jében található település nevének kinyerése
                            console.log('Törlés gomb lenyomva a következő városra: ' + cityName);
                            // Törlési kérés küldése a szerver felé
                            $.ajax({
                                url: 'csvBeolvas.php',
                                method: 'POST',
                                data: {county: selectedCounty, deleteCity: cityName},
                                dataType: 'json',
                                success: function(response) {
                                    if (response.success) {
                                        // Sikeres törlés esetén frissítsük a városlistát
                                        $(this).closest('.city').remove();
                                    } else {
                                        alert('Hiba a város törlése közben.');
                                    }
                                }.bind(this) // Az aktuális kontextus megtartása a sikeres törlés eseménykezelőjében
                            });
                        });
                    } else {
                        $('#cityList').hide(); 
                    }
                    
                    // Megye címerének megjelenítése
                    $('#countyImageContainer').html('<img src="' + response.countyImage + '">');
                    $('#countyImageContainer').show(); // countyImageContainer div megjelenítése
                }
            });
        } else {
            // Ha nincs választás a megyék menüben, elrejtjük a Település neve input mezőt, a Hozzáadás gombot és a Település neve feliratot is
            $('#cityNameFormGroup, #addCityBtn, #cityNameLabel').hide();
            
            // Ha nincs választás a megyék menüben, elrejtjük a település listát és a megye címerének tartalmát is
            $('#cityList, #countyImageContainer').hide(); 
        }
    });

    // Település hozzáadás gomb eseménykezelője
    $('#addCityBtn').click(function(){
        var selectedCounty = $('#countySelect').val();
        var cityName = $('#cityName').val();
        
        $.ajax({
            url: 'csvBeolvas.php',
            method: 'POST',
            data: {county: selectedCounty, cityName: cityName},
            dataType: 'json',
            success: function(response){
                if (response.success) {
                    // Sikeres hozzáadás esetén frissítjük a városlistát
                    var newCity = '<div class="city">' + cityName + '</div>' + '<div class="delete-container"><a href="#" class="btn btn-danger deleteBtn">Delete</a></div>';
                    $('#cityList').append(newCity);
                } else {
                    alert('Hiba a település hozzáadása közben.');
                }
            }
        });
    });
});
