import {
    createComponent,
    createIntegration,
    FetchEventCallback,
    RuntimeContext,
} from '@gitbook/runtime';

type EmbedProps = {
    url?: string;
};

const DEFAULT_WIZARD_URL =
    'https://dochoithuvi.github.io/maydocsach.gitbook.io/wizard/';

function isAllowedWizardUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return (
            parsed.protocol === 'https:' &&
            parsed.hostname === 'dochoithuvi.github.io' &&
            parsed.pathname.startsWith('/maydocsach.gitbook.io/wizard')
        );
    } catch {
        return false;
    }
}

const handleFetchEvent: FetchEventCallback<RuntimeContext> = async (request, context) => {
    const { environment } = context;

    const publicContentEndpoint = new URL(
        environment.integration.urls.publicContentEndpoint,
    );
    const requestURL = new URL(request.url);
    const basePath = publicContentEndpoint.pathname.replace(/\/$/, '');
    const wizardPrefix = basePath + '/wizard';

    if (!requestURL.pathname.startsWith(wizardPrefix)) {
        return new Response('Not found', { status: 404 });
    }

    const suffix = requestURL.pathname.slice(wizardPrefix.length);
    const upstreamPath =
        '/maydocsach.gitbook.io/wizard' + (suffix || '/');
    const upstreamURL = new URL(
        'https://dochoithuvi.github.io' + upstreamPath,
    );
    upstreamURL.search = requestURL.search;

    try {
        const upstream = await fetch(upstreamURL.toString());
        const headers = new Headers();
        const contentType = upstream.headers.get('content-type');

        if (contentType) {
            headers.set('Content-Type', contentType);
        }

        headers.set('Cache-Control', 'public, max-age=60, s-maxage=300');

        return new Response(upstream.body, {
            status: upstream.status,
            statusText: upstream.statusText,
            headers,
        });
    } catch {
        return new Response('Wizard source unavailable', { status: 502 });
    }
};

const embedBlock = createComponent<EmbedProps>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const url = action.url;

                if (typeof url !== 'string' || !isAllowedWizardUrl(url)) {
                    return element;
                }

                return {
                    props: {
                        url,
                    },
                };
            }

            default:
                return element;
        }
    },

    async render(element, context) {
        const configuredURL =
            typeof element.props.url === 'string' &&
            isAllowedWizardUrl(element.props.url)
                ? element.props.url
                : DEFAULT_WIZARD_URL;

        const upstreamURL = new URL(configuredURL);

        const webframeURL = new URL(
            context.environment.integration.urls.publicContentEndpoint +
                '/wizard/',
        );

        // Keep the configured Wizard URL available for future compatibility.
        webframeURL.searchParams.set('source', upstreamURL.toString());
        webframeURL.searchParams.set(
            'v',
            String(context.environment.integration.version),
        );
        webframeURL.searchParams.set('embed', 'gitbook');

        return (
            <block>
                <webframe
                    source={{ url: webframeURL.toString() }}
                    aspectRatio={1}
                />
            </block>
        );
    },
});

export default createIntegration({
    fetch: handleFetchEvent,
    components: [embedBlock],
});
