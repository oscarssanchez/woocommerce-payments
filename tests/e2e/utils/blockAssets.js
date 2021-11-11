const RESOURCE_TYPES_TO_BLOCK = [ 'image', 'font', 'media', 'other' ];

export function blockAssets() {
	page.setRequestInterception( true );
	page.on( 'request', ( req ) => {
		if ( RESOURCE_TYPES_TO_BLOCK.includes( req.resourceType() ) ) {
			req.abort();
		} else {
			req.continue();
		}
	} );
}
