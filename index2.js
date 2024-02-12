$(document).ready(() => {
    // Hide city name form group, add city button, and city name label initially
    $('#cityNameFormGroup, #addCityBtn, #cityNameLabel').hide();
  
    // County select change event listener
    $('#countySelect').change(() => {
      const selectedCounty = $('#countySelect').val();
  
      if (selectedCounty) {
        // Show city name form group, add city button, and city name label
        $('#cityNameFormGroup, #addCityBtn, #cityNameLabel').show();
  
        // AJAX request to get cities
        $.ajax({
          url: 'csvBeolvas.php',
          method: 'POST',
          data: { county: selectedCounty },
          dataType: 'json',
          success: response => {
            if (response.cities.length > 0) {
              let cityList = '<div class="city-list">';
              response.cities.forEach(city => {
                cityList += `<div class="city">${city}</div><div class="delete-container"><a href="#" class="btn btn-danger deleteBtn">Delete</a></div>`;
              });
              cityList += '</div>';
              $('#cityList').html(cityList).show();
  
              // Delete button click event listener
              $('.deleteBtn').click(e => {
                e.preventDefault();
                const cityName = $(e.target).closest('.city').text().trim();
                console.log(`Delete button clicked for city: ${cityName}`);
  
                // AJAX request to delete city
                $.ajax({
                  url: 'csvBeolvas.php',
                  method: 'POST',
                  data: { county: selectedCounty, deleteCity: cityName },
                  dataType: 'json',
                  success: response => {
                    if (response.success) {
                      // Remove city from list
                      $(e.target).closest('.city').remove();
                    } else {
                      alert('Error deleting city.');
                    }
                  }
                });
              });
            } else {
              $('#cityList').hide();
            }
  
            // Display county image
            $('#countyImageContainer').html(`<img src="${response.countyImage}">`).show();
          }
        });
      } else {
        // Hide city name form group, add city button, and city name label
        $('#cityNameFormGroup, #addCityBtn, #cityNameLabel').hide();
  
        // Hide city list and county image
        $('#cityList, #countyImageContainer').hide();
      }
    });
  
    // Add city button click event listener
    $('#addCityBtn').click(() => {
      const selectedCounty = $('#countySelect').val();
      const cityName = $('#cityName').val();
  
      // AJAX request to add city
      $.ajax({
        url: 'csvBeolvas.php',
        method: 'POST',
        data: { county: selectedCounty, cityName },
        dataType: 'json',
        success: response => {
          if (response.success) {
            // Add city to list
            const newCity = `<div class="city">${cityName}</div><div class="delete-container"><a href="#" class="btn btn-danger deleteBtn">Delete</a></div>`;
            $('#cityList').append(newCity);
          } else {
            alert('Error adding city.');
          }
        }
      });
    });
  });