/**
 * External dependencies
 */
import * as React from 'react';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getConfig } from 'utils/checkout';
import wooPayButtonSrc from './buy-now.png';

interface apiResponse {
	url: Location;
}

interface wcpayApi {
	initWooPay: () => Promise< apiResponse >;
}

interface wooPayButtonProps {
	isStatic?: boolean;
	api: wcpayApi;
}

const WooPay = ( { isStatic, api }: wooPayButtonProps ) => {
	const [ isLoading, setIsLoading ] = useState( false );

	const image = <img src={ wooPayButtonSrc } alt="Buy now with WooPay" />;

	if ( isStatic ) {
		return image;
	}

	const onClick = () => {
		setIsLoading( true );
		api.initWooPay().then( ( response ) => {
			window.location = response.url;
			setIsLoading( false );
		} );
	};

	return (
		<button
			onClick={ onClick }
			type="button"
			style={ {
				padding: 0,
			} }
			disabled={ isLoading }
		>
			{ image }
		</button>
	);
};

interface expressPaymentMethod {
	name: string;
	content: JSX.Element;
	edit: JSX.Element;
	canMakePayment: boolean | Promise< boolean > | ( () => boolean );
	paymentMethodId: string;
	supports: {
		features: string[];
	};
}

export const wooPayPaymentMethod = (
	api: wcpayApi
): expressPaymentMethod => ( {
	name: 'woopay',
	content: <WooPay api={ api } />,
	edit: <WooPay isStatic={ true } api={ api } />,
	canMakePayment: () => true,
	paymentMethodId: 'woocommerce_payments',
	supports: {
		features: getConfig( 'features' ),
	},
} );
