/**
 * External dependencies
 */
import config from 'config';

const { shopper, createSimpleProduct } = require( '@woocommerce/e2e-utils' );

/**
 * Internal dependencies
 */

import { shopperWCP, takeScreenshot } from '../../../utils';

import {
	fillCardDetails,
	clearCardDetails,
	setupProductCheckout,
	confirmCardAuthentication,
} from '../../../utils/payments';

describe( 'Successful purchase', () => {
	beforeAll( async () => {
		await page.goto( config.get( 'url' ), { waitUntil: 'networkidle0' } );
		await createSimpleProduct();
		await setupProductCheckout(
			config.get( 'addresses.customer.billing' )
		);
	} );

	afterEach( async () => {
		// Clear card details for the next test
		await clearCardDetails();
	} );

	afterAll( async () => {
		await shopperWCP.logout();
	} );

	it( 'using a basic card', async () => {
		const card = config.get( 'cards.basic' );
		await fillCardDetails( page, card );
		await shopper.placeOrder();
		await expect( page ).toMatch( 'Order received' );
	} );

	// eslint-disable-next-line jest/no-test-prefixes
	xit( 'using a 3DS card and account signup', async () => {
		await setupProductCheckout( {
			...config.get( 'addresses.customer.billing' ),
			...config.get( 'users.guest' ),
		} );
		await shopperWCP.toggleCreateAccount();
		const card = config.get( 'cards.3ds' );
		await fillCardDetails( page, card );
		await takeScreenshot( 'shopper-checkout-purchase_filled-card-details' );
		await expect( page ).toClick( '#place_order' );
		await confirmCardAuthentication( page, '3DS' );
		await takeScreenshot( 'shopper-checkout-purchase_authenticating' );
		await page.waitForNavigation( {
			waitUntil: 'networkidle0',
		} );
		await expect( page ).toMatch( 'Order received' );
		await takeScreenshot( 'shopper-checkout-purchase_order-received' );
	} );
} );
