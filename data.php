<?php
header('Content-Type: application/json');

$page = isset($_GET['page']) ? $_GET['page'] : 0;

echo file_get_contents('https://www.epicgames.com/fortnite/competitive/api/leaderboard/persistent/' . $_GET ['season'] . '/undefined?page=' . $page);
