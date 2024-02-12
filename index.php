<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>View Records</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <link rel="stylesheet" href="index2.css">
</head>
<body>
<div class="container">
    <div class="card mt-5">
        <div class="card-body">
            <form id="countyForm" class="county-form">
                <div class="form-group">
                    <label for="countySelect">Válasszon megyét:</label>
                    <select id="countySelect" name="county" class="form-control">
                        <option value="">Válasszon megyét...</option>
                        <?php
                        // Adatbázis kapcsolat létrehozása
                        $con=mysqli_connect("localhost","root","","zip_codes");
                        if(!$con) { die("Connection Error"); }

                        // Megyék lekérdezése az adatbázisból
                        $query = "SELECT DISTINCT County FROM zip_codes";
                        $result = mysqli_query($con, $query);

                        // Mezők feldolgozása és megjelenítése a legördülő menüben
                        while($row = mysqli_fetch_assoc($result)) {
                            echo '<option value="'.$row['County'].'">'.$row['County'].'</option>';
                        }
                        ?>
                    </select>
                </div>
                <div id="countyImageContainer"></div> 
                <div id="cityList"></div>
                <div class="form-group" id="cityNameFormGroup" style="display:none;">
                    <label for="cityName" id="cityNameLabel">Település neve:</label>
                    <input type="text" id="cityName" name="cityName" class="form-control">
                </div>
                <div class="form-group">
                    <label for="searchInput" class="sr-only">Search</label>
                    <input type="text" id="searchInput" class="form-control" placeholder="Search by ZIP code or name">
                </div>
                <button type="button" id="searchBtn" class="btn btn-primary">Search</button>
                <div id="searchResults"></div>
                <div class="delete-container">
                    <a href="#" class="btn btn-danger deleteBtn">Delete</a>
                </div>
                <button type="button" id="addCityBtn" class="btn btn-primary" style="display:none;">Hozzáadás</button>
            </form>
            
            
        </div>
    </div>
</div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="index2.js"></script>
</body>
</html>
