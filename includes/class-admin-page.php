<?php

if ( ! defined( 'ABSPATH' ) ) exit;

class QRG_Admin_Page {

    public function __construct() {
        add_action( 'admin_menu', [ $this, 'menu' ] );
    }

    public function menu() {
        add_menu_page(
            'QR Generator',
            'QR Generator',
            'manage_options',
            'qr-generator',
            [ $this, 'render' ],
            'dashicons-qrcode',
            25
        );
    }

    public function render() {

        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        ?>
        <div class="wrap qrg-wrap">
            <h1>QR Generator</h1>

            <div class="qrg-container">

                <!-- LEFT PANEL -->
                <div class="qrg-left">
                    <div class="qrg-accordion">

                        <div class="qrg-section">Choose Content</div>
                        <div class="qrg-section">Set Colors</div>
                        <div class="qrg-section">Add Center Content</div>
                        <div class="qrg-section">Custom Design</div>

                    </div>
                </div>

                <!-- RIGHT PANEL -->
                <div class="qrg-right">
                    <div id="qrg-preview"></div>

                    <div class="qrg-actions">
                        <button class="button button-primary">Download PNG</button>
                        <button class="button">SVG</button>
                        <button class="button">JPEG</button>
                    </div>
                </div>

            </div>
        </div>
        <?php
    }
}