<?php
/**
 * Spark RESO Web API v3 Proxy
 * Carla Christenson — carlacsoldit.com
 * BeachesMLS VOW Feed
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

define('SPARK_TOKEN',    '3oj6cr71pdujwme4zgjestqye');
define('SPARK_BASE_URL', 'https://replication.sparkapi.com/Version/3/Reso/OData');

$action = isset($_GET['action']) ? $_GET['action'] : 'search';

switch ($action) {

    case 'search':
        $filters = [];
        $status = isset($_GET['status']) ? $_GET['status'] : 'active';
        if ($status === 'rent') {
            $filters[] = "StandardStatus eq 'Active' and PropertyType eq 'ResidentialLease'";
        } else {
            $filters[] = "StandardStatus eq 'Active' and PropertyType eq 'Residential'";
        }
        if (!empty($_GET['minprice'])) $filters[] = 'ListPrice ge ' . intval($_GET['minprice']);
        if (!empty($_GET['maxprice'])) $filters[] = 'ListPrice le ' . intval($_GET['maxprice']);
        if (!empty($_GET['minbeds']))  $filters[] = 'BedroomsTotal ge ' . intval($_GET['minbeds']);
        if (!empty($_GET['minbaths'])) $filters[] = 'BathroomsTotalInteger ge ' . intval($_GET['minbaths']);
        if (!empty($_GET['city']))     $filters[] = "City eq '" . sanitize($_GET['city']) . "'";

        $limit  = isset($_GET['limit']) ? intval($_GET['limit']) : 24;
        $skip   = isset($_GET['page'])  ? (intval($_GET['page']) - 1) * $limit : 0;

        $query = http_build_query([
            '$filter'  => implode(' and ', $filters),
            '$orderby' => 'ListPrice desc',
            '$top'     => $limit,
            '$skip'    => $skip,
            '$select'  => 'ListingKey,ListPrice,StandardStatus,PropertyType,BedroomsTotal,BathroomsTotalInteger,City,StateOrProvince,PostalCode,UnparsedAddress,PublicRemarks,Media,LivingArea,LotSizeAcres,YearBuilt',
        ]);
        echo sparkRequest('/Property?' . $query);
        break;

    case 'my_active':
        $query = http_build_query([
            '$filter'  => "StandardStatus eq 'Active' and ListAgentMlsId eq '276500285'",
            '$orderby' => 'ListPrice desc',
            '$top'     => 200,
            '$select'  => 'ListingKey,ListPrice,StandardStatus,PropertyType,BedroomsTotal,BathroomsTotalInteger,City,StateOrProvince,PostalCode,UnparsedAddress,PublicRemarks,Media,LivingArea,LotSizeAcres,YearBuilt',
        ]);
        echo sparkRequest('/Property?' . $query);
        break;

    case 'my_sold':
        $query = http_build_query([
            '$filter'  => "StandardStatus eq 'Closed' and ListAgentMlsId eq '276500285'",
            '$orderby' => 'ClosePrice desc',
            '$top'     => 1000,
            '$select'  => 'ListingKey,ListPrice,ClosePrice,StandardStatus,PropertyType,BedroomsTotal,BathroomsTotalInteger,City,StateOrProvince,PostalCode,UnparsedAddress,PublicRemarks,Media,LivingArea,LotSizeAcres,YearBuilt,CloseDate',
        ]);
        echo sparkRequest('/Property?' . $query);
        break;

    case 'detail':
        if (empty($_GET['id'])) { jsonError('Missing id'); break; }
        echo sparkRequest('/Property(\'' . sanitize($_GET['id']) . '\')');
        break;

    default:
        jsonError('Unknown action');
}

function sparkRequest($endpoint) {
    $url = SPARK_BASE_URL . $endpoint;
    $ch  = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . SPARK_TOKEN,
            'Accept: application/json',
            'X-SparkApi-User-Mode: vow',
        ],
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);
    if ($error)         { return jsonError('cURL: ' . $error); }
    if ($httpCode !== 200) { return jsonError('HTTP ' . $httpCode . ' — ' . substr($response, 0, 200)); }
    return $response;
}

function sanitize($v) {
    return htmlspecialchars(strip_tags(trim($v)), ENT_QUOTES, 'UTF-8');
}

function jsonError($msg) {
    http_response_code(500);
    echo json_encode(['error' => $msg]);
    exit;
}
?>
