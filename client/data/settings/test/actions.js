/**
 * External dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { apiFetch } from '@wordpress/data-controls';
import { findIndex } from 'lodash';

/**
 * Internal dependencies
 */
import { saveSettings, updateIsSavingSettings } from '../actions';

jest.mock( '@wordpress/data' );
jest.mock( '@wordpress/data-controls' );

describe( 'Settings actions tests', () => {
	describe( 'saveSettings()', () => {
		beforeEach( () => {
			const noticesDispatch = {
				createSuccessNotice: jest.fn(),
				createErrorNotice: jest.fn(),
			};

			apiFetch.mockImplementation( () => {} );
			dispatch.mockImplementation( ( storeName ) => {
				if ( 'core/notices' === storeName ) {
					return noticesDispatch;
				}

				return {};
			} );
			select.mockImplementation( () => ( {
				getSettings: jest.fn(),
			} ) );
		} );

		test( 'makes POST request with settings', () => {
			const settingsMock = {
				/* eslint-disable camelcase */
				enabled_payment_method_ids: [ 'foo', 'bar' ],
				is_wcpay_enabled: true,
				/* eslint-enable camelcase */
			};

			select.mockReturnValue( {
				getSettings: () => settingsMock,
			} );

			apiFetch.mockReturnValue( 'api response' );

			const yielded = [ ...saveSettings() ];

			expect( apiFetch ).toHaveBeenCalledWith( {
				method: 'post',
				path: '/wc/v3/payments/settings',
				data: settingsMock,
			} );
			expect( yielded ).toContainEqual( 'api response' );
		} );

		test( 'before saving sets isSaving to true, and after - to false', () => {
			apiFetch.mockReturnValue( 'api request' );

			const yielded = [ ...saveSettings() ];

			const apiRequestIndex = yielded.indexOf( 'api request' );

			const isSavingStartIndex = findIndex(
				yielded,
				updateIsSavingSettings( true )
			);

			const isSavingEndIndex = findIndex(
				yielded,
				updateIsSavingSettings( false )
			);

			expect( apiRequestIndex ).not.toEqual( -1 );
			expect( isSavingStartIndex ).toBeLessThan( apiRequestIndex );
			expect( isSavingEndIndex ).toBeGreaterThan( apiRequestIndex );
		} );

		test( 'displays success notice after saving', () => {
			// eslint-disable-next-line no-unused-expressions
			[ ...saveSettings() ];

			expect(
				dispatch( 'core/notices' ).createSuccessNotice
			).toHaveBeenCalledWith( 'Settings saved.' );
		} );

		test( 'displays error notice if error is thrown', () => {
			const saveGenerator = saveSettings();

			apiFetch.mockImplementation( () => {
				saveGenerator.throw( 'Some error' );
			} );

			// eslint-disable-next-line no-unused-expressions
			[ ...saveGenerator ];

			expect(
				dispatch( 'core/notices' ).createErrorNotice
			).toHaveBeenCalledWith( 'Error saving settings.' );
			expect(
				dispatch( 'core/notices' ).createSuccessNotice
			).not.toHaveBeenCalled();
		} );

		test( 'after throwing error, isSaving is reset', () => {
			const saveGenerator = saveSettings();

			apiFetch.mockImplementation( () => {
				saveGenerator.throw( 'Some error' );
			} );

			const yielded = [ ...saveGenerator ];

			expect(
				dispatch( 'core/notices' ).createErrorNotice
			).toHaveBeenCalled();
			expect( yielded ).toContainEqual( updateIsSavingSettings( false ) );
		} );
	} );
} );
