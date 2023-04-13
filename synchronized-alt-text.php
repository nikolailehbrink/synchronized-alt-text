<?php

/**
 * Plugin Name: Synchronized Alt Text
 * Plugin URI: https://www.example.com
 * Description: Synchronizes the alt text from the media library with the images in Gutenberg editor, without overwriting manually added alt texts.
 * Version: 1.0
 * Author: Nikolai Lehbrink
 * Author URI: nikolailehbr.ink
 */

function synchronized_alt_text_enqueue_scripts($hook)
{
    if ('post.php' !== $hook && 'post-new.php' !== $hook) {
        return;
    }

    wp_enqueue_script(
        'synchronized-alt-text',
        plugin_dir_url(__FILE__) . 'synchronized-alt-text.js',
        array('wp-blocks', 'wp-dom-ready', 'wp-edit-post'),
        filemtime(plugin_dir_path(__FILE__) . 'synchronized-alt-text.js'),
        true
    );
}
add_action('admin_enqueue_scripts', 'synchronized_alt_text_enqueue_scripts');
