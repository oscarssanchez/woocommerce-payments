<?php
/**
 * TODO
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates\Emails
 * @version 3.7.0
 */

defined( 'ABSPATH' ) || exit;

echo esc_html( sprintf( "%s:\t%s", __( 'Payment Method', 'woocommerce-payments' ), sprintf( '%s - %s', ucfirst( $payment_method_details['brand'] ), $payment_method_details['last4'] ) ) ) . "\n";

echo esc_html( sprintf( "%s:\t%s", __( 'Application Name', 'woocommerce-payments' ), ucfirst( $receipt['application_preferred_name'] ) ) ) . "\n";

echo esc_html( sprintf( "%s:\t%s", __( 'AID', 'woocommerce-payments' ), ucfirst( $receipt['dedicated_file_name'] ) ) ) . "\n";

echo esc_html( sprintf( "%s:\t%s", __( 'Account Type', 'woocommerce-payments' ), ucfirst( $receipt['account_type'] ) ) ) . "\n";
