<?php
/**
 * Class WC_Payments_Email_New_Receipt file
 *
 * @package WooCommerce\Emails
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WC_Payments_Email_New_Receipt' ) ) :

	/**
	 * New Receipt Email.
	 *
	 * An email sent to the customer when a new order is paid for.
	 *
	 * @class       WC_Payments_Email_New_Receipt
	 * @version     2.0.0
	 * @package     WooCommerce\Classes\Emails??
	 * @extends     WC_Email
	 */
	class WC_Payments_Email_New_Receipt extends WC_Email {

		/**
		 * Merchant settings
		 *
		 * @var array
		 */
		public $merchant_settings = [];

		/**
		 * Charge
		 *
		 * @var array
		 */
		public $charge = [];

		/**
		 * Constructor.
		 */
		public function __construct() {
			$this->id             = 'new_receipt';
			$this->customer_email = true;
			$this->title          = __( 'New receipt', 'woocommerce-payments' );
			$this->description    = __( 'New receipt emails are sent to customers when a new order is paid for.', 'woocommerce-payments' );
			$this->template_base  = WCPAY_ABSPATH . 'templates/';
			$this->template_html  = 'emails/customer-new-receipt.php';
			$this->template_plain = 'emails/plain/customer-new-receipt.php';
			$this->placeholders   = [
				'{order_date}'   => '',
				'{order_number}' => '',
				// TODO add receipt identifier?
			];
			// Content hooks.
			add_action( 'woocommerce_payments_email_receipt_store_details', [ $this, 'store_details' ], 10, 1 );
			add_action( 'woocommerce_payments_email_receipt_compliance_details', [ $this, 'compliance_details' ], 10, 1 );

			// Triggers for this email.
			add_action( 'woocommerce_payments_new_receipt_notification', [ $this, 'trigger' ], 10, 3 );

			// Call parent constructor.
			parent::__construct();
		}

		/**
		 * Get email subject.
		 *
		 * @since  3.1.0
		 * @return string
		 */
		public function get_default_subject() {
			return __( 'Your {site_title} Receipt', 'woocommerce-payments' );
		}

		/**
		 * Get email heading.
		 *
		 * @since  3.1.0
		 * @return string
		 */
		public function get_default_heading() {
			return __( 'Your receipt for order: #{order_number}', 'woocommerce-payments' );
		}

		/**
		 * Trigger the sending of this email.
		 *
		 * @param int   $order_id The order ID.
		 * @param array $merchant_settings The merchant settings.
		 * @param array $charge The charge.
		 */
		public function trigger( $order_id, $merchant_settings, $charge ) {
			$this->setup_locale();

			$order = wc_get_order( $order_id );

			if ( is_a( $order, 'WC_Order' ) ) {
				$this->object                         = $order;
				$this->recipient                      = $this->object->get_billing_email();
				$this->placeholders['{order_date}']   = wc_format_datetime( $this->object->get_date_created() );
				$this->placeholders['{order_number}'] = $this->object->get_order_number();

				$email_already_sent = $order->get_meta( '_new_receipt_email_sent' );
			}

			if ( $merchant_settings ) {
				$this->merchant_settings = $merchant_settings;
			}

			if ( $charge ) {
				$this->charge = $charge;
			}

			/**
			 * Controls if new order emails can be resend multiple times.
			 *
			 * @since 5.0.0
			 * @param bool $allows Defaults to false.
			 */
			if ( 'true' === $email_already_sent && ! apply_filters( 'woocommerce_new_order_email_allows_resend', false ) ) {
				return;
			}

			if ( $this->is_enabled() && $this->get_recipient() ) {
				$this->send( $this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments() );

				$order->update_meta_data( '_new_receipt_email_sent', 'true' );
				$order->save();
			}

			$this->restore_locale();
		}

		/**
		 * Get content html.
		 *
		 * @return string
		 */
		public function get_content_html() {
			return wc_get_template_html(
				$this->template_html,
				[
					'order'              => $this->object,
					'merchant_settings'  => $this->merchant_settings,
					'charge'             => $this->charge,
					'email_heading'      => $this->get_heading(),
					'additional_content' => $this->get_additional_content(),
					'sent_to_admin'      => true,
					'plain_text'         => false,
					'email'              => $this,
				],
				'',
				WCPAY_ABSPATH . 'templates/'
			);
		}

		/**
		 * Get content plain.
		 *
		 * @return string
		 */
		public function get_content_plain() {
			return wc_get_template_html(
				$this->template_plain,
				[
					'order'              => $this->object,
					'email_heading'      => $this->get_heading(),
					'additional_content' => $this->get_additional_content(),
					'sent_to_admin'      => true,
					'plain_text'         => true,
					'email'              => $this,
				]
			);
		}

		/**
		 * Get store details content html
		 *
		 * @param array $settings The settings.
		 * @return void
		 */
		public function store_details( $settings ) {
			// TODO plain text.
			wc_get_template(
				'emails/email-store-details.php',
				[
					'business_name'   => $settings['business_name'],
					'support_address' => $settings['support_info']['address'],
					'support_phone'   => $settings['support_info']['phone'],
					'support_email'   => $settings['support_info']['email'],
				],
				'',
				WCPAY_ABSPATH . 'templates/'
			);
		}

		/**
		 * Get compliance data content html
		 *
		 * @param array $charge The charge.
		 * @return void
		 */
		public function compliance_details( $charge ) {
			wc_get_template(
				'emails/email-compliance-details.php',
				[
					'payment_method_details' => $charge['payment_method_details']['card_present'],
					'receipt'                => $charge['payment_method_details']['card_present']['receipt'],
				],
				'',
				WCPAY_ABSPATH . 'templates/'
			);
		}

		/**
		 * Default content to show below main email content.
		 *
		 * @since 3.7.0
		 * @return string
		 */
		public function get_default_additional_content() {
			return __( 'Thanks for using {site_url}!', 'woocommerce-payments' );
		}

	}

endif;

return new WC_Payments_Email_New_Receipt();
