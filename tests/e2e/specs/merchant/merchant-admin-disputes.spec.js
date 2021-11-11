/**
 * External dependencies
 */
const { merchant } = require( '@woocommerce/e2e-utils' );

/**
 * Internal dependencies
 */
import { merchantWCP, blockAssets } from '../../utils';

describe( 'Admin disputes', () => {
	beforeAll( async () => {
		blockAssets();
		await merchant.login();
	} );

	it( 'page should load without any errors', async () => {
		await merchantWCP.openDisputes();
		await expect( page ).toMatchElement( 'h2', { text: 'Disputes' } );
	} );
} );
