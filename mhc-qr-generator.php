<?php
/**
 * Plugin Name: MHC QR Generator
 * Description: Admin-only QR Code Generator with styling and center content options.
 * Version: 1.0.0
 * Author: myheartcreative
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

add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'qrg_action_links' );

function qrg_action_links( $links ) {

    $dashboard_link = '<a href="' . admin_url( 'admin.php?page=qr-generator' ) . '">Dashboard</a>';

    array_unshift( $links, $dashboard_link );

    return $links;
}