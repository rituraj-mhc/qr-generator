<?php

if ( ! defined( 'ABSPATH' ) ) exit;

class QRG_Enqueue {

    public function __construct() {
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue' ] );
    }

    public function enqueue( $hook ) {

        // Load only on our plugin page (we’ll define slug soon)
        if ( $hook !== 'toplevel_page_qr-generator' ) {
            return;
        }

        // CSS
        wp_enqueue_style(
            'qrg-admin-css',
            QRG_URL . 'assets/css/admin.css',
            [],
            '1.0.0'
        );

        // QR Library (local)
        wp_enqueue_script(
            'qrg-qr-lib',
            QRG_URL . 'assets/lib/qr-code-styling.js',
            [],
            '1.5.0',
            true
        );

        // Main JS
        wp_enqueue_script(
            'qrg-admin-js',
            QRG_URL . 'assets/js/admin.js',
            [ 'qrg-qr-lib' ],
            '1.0.0',
            true
        );

        // Pass data to JS
        wp_localize_script( 'qrg-admin-js', 'qrgData', [
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'nonce'    => wp_create_nonce( 'qrg_nonce' ),
            'assets_url' => QRG_URL . 'assets/',
        ]);
    }
}