<?php
/**
 * Plugin Name: QR Generator
 * Description: Admin-only QR Code Generator with styling and center content options.
 * Version: 1.0.0
 * Author: Your Name
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define constants
define( 'QRG_PATH', plugin_dir_path( __FILE__ ) );
define( 'QRG_URL', plugin_dir_url( __FILE__ ) );

// Includes
require_once QRG_PATH . 'includes/class-enqueue.php';
require_once QRG_PATH . 'includes/class-admin-page.php';

// Init
add_action( 'plugins_loaded', function() {
    new QRG_Enqueue();
    new QRG_Admin_Page();
});