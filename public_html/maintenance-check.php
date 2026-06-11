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
define('MAINTENANCE_MODE', true); // Set to false to disable maintenance mode
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
        // Allow API requests to continue (for async operations)
        $request_uri = $_SERVER['REQUEST_URI'];
        $allowed_paths = array('/api/', '/space_ai.php', '/seeb_wood_ai.php', '/.well-known/');
        
        $is_api_request = false;
        foreach ($allowed_paths as $path) {
            if (strpos($request_uri, $path) !== false) {
                $is_api_request = true;
                break;
            }
        }
        
        if (!$is_api_request) {
            // Check if file exists, otherwise show maintenance
            $requested_file = __DIR__ . parse_url($request_uri, PHP_URL_PATH);
            
            if (!is_file($requested_file) || $request_uri === '/' || $request_uri === '/index.php') {
                include MAINTENANCE_PAGE;
                exit;
            }
        }
    }
}

// Call the function
check_maintenance_mode();
?>
