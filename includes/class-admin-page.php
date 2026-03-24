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
            'dashicons-admin-site',
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

                        <!-- 1. CONTENT -->
                        <div class="qrg-item active">
                            <div class="qrg-header">
                                <span class="qrg-title">Choose Content</span>
                                <span class="qrg-toggle">+</span>
                            </div>
                            <div class="qrg-body">

                                <div class="qrg-field">
                                    <label>Type</label>
                                    <select id="qrg-type">
                                        <option value="url">URL</option>
                                        <option value="text">Text</option>
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                    </select>
                                </div>

                                <div class="qrg-field qrg-type-field" data-type="url">
                                    <label>URL</label>
                                    <input type="text" id="qrg-url" placeholder="https://example.com">
                                </div>

                                <div class="qrg-field qrg-type-field" data-type="text" style="display:none;">
                                    <label>Text</label>
                                    <textarea id="qrg-text"></textarea>
                                </div>

                                <div class="qrg-field qrg-type-field" data-type="email" style="display:none;">

                                    <label>Email</label>
                                    <input type="email" id="qrg-email">
                                
                                    <label>Subject</label>
                                    <input type="text" id="qrg-email-subject">
                                
                                    <label>Message</label>
                                    <textarea id="qrg-email-body"></textarea>
                                
                                </div>

                                <div class="qrg-field qrg-type-field" data-type="phone" style="display:none;">
                                    <label>Phone</label>
                                    <input type="text" id="qrg-phone">
                                </div>

                            </div>
                        </div>

                        <!-- 2. COLORS -->
                        <div class="qrg-item">
                            <div class="qrg-header">
                                <span class="qrg-title">Set Colors</span>
                                <span class="qrg-toggle">+</span>
                            </div>
                            <div class="qrg-body">

                                <!-- TABS -->
                                <div class="qrg-tabs">
                                    <button class="qrg-tab active" data-tab="bg">Background</button>
                                    <button class="qrg-tab" data-tab="fg">Foreground</button>
                                </div>
                            
                                <!-- TAB CONTENT -->
                            
                                <!-- BACKGROUND TAB -->
                                <div class="qrg-tab-content active" data-content="bg">
                                    <div class="qrg-field">
                                        <label>Background Color</label>
                                        <input type="color" id="qrg-bg" value="#ffffff">
                                    </div>
                                </div>
                            
                                <!-- FOREGROUND TAB -->
                                <div class="qrg-tab-content" data-content="fg">
                            
                                    <div class="qrg-fg-grid">
                            
                                        <!-- DOTS COLUMN -->
                                        <div class="qrg-fg-col">
                            
                                            <h4>Dots Color</h4>
                            
                                            <label>
                                                <input type="radio" name="qrg-dots-mode" value="solid">
                                                Solid
                                            </label>
                            
                                            <label>
                                                <input type="radio" name="qrg-dots-mode" value="gradient" checked>
                                                Gradient
                                            </label>
                            
                                            <!-- SOLID -->
                                            <div class="qrg-dots-solid" style="display:none;">
                                                <input type="color" id="qrg-dots-color" value="#000000">
                                            </div>
                            
                                            <!-- GRADIENT -->
                                            <div class="qrg-dots-gradient">
                                                <label>Color 1</label>
                                                <input type="color" id="qrg-grad-1" value="#ff0000">
                            
                                                <label>Color 2</label>
                                                <input type="color" id="qrg-grad-2" value="#0000ff">
                            
                                                <label>Direction</label>
                                                <select id="qrg-grad-dir">
                                                    <option value="0">Top → Bottom</option>
                                                    <option value="90">Left → Right</option>
                                                    <option value="45">Diagonal</option>
                                                </select>
                                            </div>
                            
                                        </div>
                            
                                        <!-- EYE COLUMN -->
                                        <div class="qrg-fg-col">
                            
                                            <h4>Eye Color</h4>
                            
                                            <label>
                                                <input type="radio" name="qrg-eye-mode" value="same" checked>
                                                Same as dots
                                            </label>
                            
                                            <label>
                                                <input type="radio" name="qrg-eye-mode" value="custom">
                                                Custom
                                            </label>
                            
                                            <div class="qrg-eye-custom" style="display:none;">
                                                <input type="color" id="qrg-eye-color" value="#000000">
                                            </div>
                            
                                        </div>
                            
                                    </div>
                            
                                </div>
                            
                            </div>
                        </div>

                        <!-- 3. CENTER CONTENT -->
                        <div class="qrg-item">
                            <div class="qrg-header">
                                <span class="qrg-title">Add Center Content</span>
                                <span class="qrg-toggle">+</span>
                            </div>
                            <div class="qrg-body">

                                <div class="qrg-field">
                                    <label><input type="radio" name="qrg-center" value="none" checked> None</label><br>
                                    <label><input type="radio" name="qrg-center" value="logo"> Logo</label><br>
                                    <label><input type="radio" name="qrg-center" value="text"> Text</label><br>
                                    <label><input type="radio" name="qrg-center" value="icon"> Icons</label>
                                </div>

                                <div class="qrg-field qrg-center-logo" style="display:none;">
                                    <label>Upload Logo</label>
                                    <input type="file" id="qrg-logo">
                                </div>

                                <div class="qrg-field qrg-center-text" style="display:none;">
                                    <label>Text</label>
                                    <input type="text" id="qrg-center-text">
                                </div>

                                <div class="qrg-field qrg-center-icons" style="display:none;">
                                    <label>Select Icon</label>
                                    <div class="qrg-icon-grid">
                                        <div class="qrg-icon" data-icon="instagram">
                                            <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/icons/instagram.svg'; ?>" alt="Instagram">
                                        </div>

                                        <div class="qrg-icon" data-icon="facebook">
                                            <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/icons/facebook.svg'; ?>" alt="Facebook">
                                        </div>

                                        <div class="qrg-icon" data-icon="twitter">
                                            <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/icons/twitter.svg'; ?>" alt="Twitter">
                                        </div>

                                        <div class="qrg-icon" data-icon="whatsapp">
                                            <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/icons/whatsapp.svg'; ?>" alt="WhatsApp">
                                        </div>
                                        <div class="qrg-icon" data-icon="youtube">
                                            <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/icons/youtube.svg'; ?>" alt="YouTube">
                                        </div>
                                        <div class="qrg-icon" data-icon="linkedin">
                                            <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/icons/linkedin.svg'; ?>" alt="LinkedIn">
                                        </div>
                                        <div class="qrg-icon" data-icon="telegram">
                                            <img src="<?php echo plugin_dir_url(dirname(__FILE__)) . 'assets/icons/telegram.svg'; ?>" alt="Telegram">
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- 4. DESIGN -->
                        <div class="qrg-item">
                            <div class="qrg-header">
                                <span class="qrg-title">Custom Design</span>
                                <span class="qrg-toggle">+</span>
                            </div>
                            <div class="qrg-body">
                                <p>Coming next…</p>
                            </div>
                        </div>

                    </div>

                </div>

                <!-- RIGHT PANEL -->
                <div class="qrg-right">

                    <div id="qrg-preview"></div>

                    <div class="qrg-size">
                        <label>Size: <span id="qrg-size-val">300</span>px</label>
                        <input type="range" id="qrg-size" min="200" max="1000" value="300">
                    </div>

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