<?php
/**
 * Maintenance Mode Checker
 * Place this at the top of your main index.php or create it as a separate access gate
 * 
 * Usage:
 * 1. Include this file at the very beginning of your index.php
 * 2. Set MAINTENANCE_MODE to true when you want to show the maintenance page
 * 3. Whitelist admin IPs if needed
 */

// Configuration
define('MAINTENANCE_MODE', false); // Set to false to disable maintenance mode
define('MAINTENANCE_PAGE', __DIR__ . '/maintenance.html');

// Admin IPs that can bypass maintenance mode (empty array to disable)
$admin_ips = array(
    // '192.168.1.1',  // Your IP here
    // '127.0.0.1'
);

function is_admin_ip() {
    global $admin_ips;
    
    if (empty($admin_ips)) {
        return false;
    }
    
    $client_ip = $_SERVER['REMOTE_ADDR'];
    
    // Check for forwarded IPs (if behind proxy)
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $forwarded_ips = array_map('trim', explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']));
        $client_ip = $forwarded_ips[0];
    }
    
    return in_array($client_ip, $admin_ips);
}

function check_maintenance_mode() {
    if (MAINTENANCE_MODE && !is_admin_ip()) {
        $request_uri = $_SERVER['REQUEST_URI'];
        
        // ONLY show maintenance for online store paths
        $store_paths = array(
            '/shop/',
            '/tienda/',
            '/store/',
            '/marketplace/',
            '/cart/',
            '/checkout/',
            '/producto/',
            '/product/',
            '/catalogo/',
            '/catalog/',
            '/pedidos/',
            '/orders/',
            '/mi-cuenta/',
            '/my-account/'
        );
        
        $is_store_page = false;
        foreach ($store_paths as $path) {
            if (strpos($request_uri, $path) === 0) {
                $is_store_page = true;
                break;
            }
        }
        
        // Only show maintenance if it's a store page
        if ($is_store_page && file_exists(MAINTENANCE_PAGE)) {
            http_response_code(503);
            include MAINTENANCE_PAGE;
            exit;
        }
    }
}

// Call the function
check_maintenance_mode();
?>
