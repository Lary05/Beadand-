<?php
// Adatbázis kapcsolat létrehozása
$con = new mysqli("localhost", "root", "", "zip_codes");
if ($con->connect_error) { 
    die("Connection Error: " . $con->connect_error); 
}

// Funkciók kezelése
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Ha a kiválasztott megye értéke érkezik a POST kéréssel
    if (isset($_POST['county'])) {
        $selectedCounty = $_POST['county'];
        
        // Megye településeinek lekérdezése az adatbázisból
        $query = "SELECT City FROM zip_codes WHERE County = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("s", $selectedCounty);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Megye címéről elérési út lekérdezése
        $countyImage = "pictures/{$selectedCounty}.jpg"; // feltételezve, hogy a címerek JPG formátumban vannak a pictures mappában
        
        // Adatok összegyűjtése tömbbe
        $data = array();
        while ($row = $result->fetch_assoc()) {
            $data[] = $row['City'];
        }
        
        // Adatok és megye címerének JSON formátumba alakítása és visszaküldése
        echo json_encode(array('cities' => $data, 'countyImage' => $countyImage));
    }

    // Törlés funkció
    if (isset($_POST['deleteCity'])) {
        $cityNameToDelete = $_POST['deleteCity'];
        $query = "DELETE FROM zip_codes WHERE City = ?";
        $stmt = $con->prepare($query);
        $stmt->bind_param("s", $cityNameToDelete);
        $result = $stmt->execute();

        if ($result) {
            echo json_encode(array('success' => true));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Hiba a város törlése közben.'));
        }
        exit; // Fontos: kilépés a scriptből a válasz elküldése után
    }

    // Hozzáadás funkció
    if (isset($_POST['county']) && isset($_POST['cityName'])) {
        $selectedCounty = $_POST['county'];
        $cityName = $_POST['cityName'];

        // Település hozzáadása az adatbázishoz
        $query = "INSERT INTO zip_codes (County, City) VALUES (?, ?)";
        $stmt = $con->prepare($query);
        $stmt->bind_param("ss", $selectedCounty, $cityName);
        $result = $stmt->execute();

        if ($result) {
            echo json_encode(array('success' => true));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Hiba a település hozzáadása közben.'));
        }
        exit; // Fontos: kilépés a scriptből a válasz elküldése után
    }
}