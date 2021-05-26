<?php
/**
 * Class Invalid_Default_Currency_Exception
 *
 * @package WooCommerce\Payments
 */

namespace WCPay\Multi_Currency\Exceptions;

defined( 'ABSPATH' ) || exit;

/**
 * Exception for throwing an error when the store's currency cannot
 * to be used with WooCommerce Payments Multi-Currency.
 */
class Invalid_Default_Currency_Exception extends \Exception {
	/**
	 * Constructor, uses the $currency parameter to build the error message.
	 *
	 * @param string $currency The store's currency to be used in the error message.
	 */
	public function __construct( string $currency ) {
		parent::__construct(
			sprintf(
				/* translators: %1 : The store's currency code */
				__( 'The store\'s default currency (%1$s) cannot be used with WooCommerce Payments Multi-Currency.', 'woocommerce-payments' ),
				$currency
			)
		);
	}
}
