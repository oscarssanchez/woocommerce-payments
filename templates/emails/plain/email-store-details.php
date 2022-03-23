<?php
/**
 * TODO
 *
 * @see https://docs.woocommerce.com/document/template-structure/
 * @package WooCommerce\Templates\Emails
 * @version 3.7.0
 */

defined( 'ABSPATH' ) || exit;

echo "==========\n\n";

echo esc_html( $business_name ) . "\n\n";

echo "==========\n\n";

if ( ! empty( $support_address ) ) {
	echo esc_html( $support_address['line1'] ) . "\n";
	echo esc_html( $support_address['line2'] ) . "\n";
	echo esc_html( implode( ' ', [ $support_address['city'], $support_address['state'], $support_address['postal_code'], $support_address['country'] ] ) ) . "\n";
	echo esc_html( implode( ' ', [ $support_phone, $support_email ] ) ) . "\n";
	echo esc_html( gmdate( 'Y-m-d H:iA' ) ) . "\n";
}
