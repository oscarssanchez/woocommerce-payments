/**
 * External dependencies
 */
const { merchant } = require( '@woocommerce/e2e-utils' );

/**
 * Internal dependencies
 */
import { merchantWCP, takeScreenshot, blockAssets } from '../../utils';

describe( 'Admin deposits', () => {
	beforeAll( async () => {
		blockAssets();
		await merchant.login();
	} );

	it( 'page should load without any errors', async () => {
		await merchantWCP.openDeposits();
		await expect( page ).toMatchElement( 'h2', {
			text: 'Deposit history',
		} );
		await takeScreenshot( 'merchant-admin-deposits' );
	} );
} );
