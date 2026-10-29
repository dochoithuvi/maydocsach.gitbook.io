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
const DEFAULT_JAILBREAK_URL =
    'https://dochoithuvi.github.io/maydocsach.gitbook.io/jailbreak-wizard/';

const ALLOWED_SOURCE_ROOTS = [
    '/maydocsach.gitbook.io/wizard',
    '/maydocsach.gitbook.io/jailbreak-wizard',
];

function getAllowedSourceRoot(pathname: string): string | undefined {
    return ALLOWED_SOURCE_ROOTS.find(
        (root) => pathname === root || pathname.startsWith(root + '/'),
    );
}

function isAllowedWizardUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return (
            parsed.protocol === 'https:' &&
            parsed.hostname === 'dochoithuvi.github.io' &&
            getAllowedSourceRoot(parsed.pathname) !== undefined
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

    const routes = [
        {
            slug: 'wizard',
            upstreamRoot: '/maydocsach.gitbook.io/wizard',
        },
        {
            slug: 'jailbreak-wizard',
            upstreamRoot: '/maydocsach.gitbook.io/jailbreak-wizard',
        },
    ];

    const route = routes.find(({ slug }) => {
        const prefix = basePath + '/' + slug;
        return (
            requestURL.pathname === prefix ||
            requestURL.pathname.startsWith(prefix + '/')
        );
    });

    if (!route) {
        return new Response('Not found', { status: 404 });
    }

    const routePrefix = basePath + '/' + route.slug;
    const suffix = requestURL.pathname.slice(routePrefix.length) || '/';
    const upstreamPath = route.upstreamRoot + suffix;
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

function buildWebframeUrl(configuredURL: string, context: RuntimeContext): string {
    const upstreamURL = new URL(configuredURL);
    const sourceRoot =
        getAllowedSourceRoot(upstreamURL.pathname) ??
        '/maydocsach.gitbook.io/wizard';
    const routeName = sourceRoot.endsWith('/jailbreak-wizard')
        ? 'jailbreak-wizard'
        : 'wizard';
    const suffix = upstreamURL.pathname.slice(sourceRoot.length) || '/';

    const publicContentBase =
        context.environment.integration.urls.publicContentEndpoint.replace(
            /\/$/,
            '',
        );
    const webframeURL = new URL(
        publicContentBase + '/' + routeName + suffix,
    );

    webframeURL.searchParams.set('source', upstreamURL.toString());
    webframeURL.searchParams.set(
        'v',
        String(context.environment.integration.version),
    );
    webframeURL.searchParams.set('embed', 'gitbook');
    return webframeURL.toString();
}

const embedBlock = createComponent<EmbedProps>({
    componentId: 'embed',

    async action(element, action) {
        switch (action.action) {
            case '@link.unfurl': {
                const url = action.url;

                if (typeof url !== 'string' || !isAllowedWizardUrl(url) ||
                    !new URL(url).pathname.startsWith('/maydocsach.gitbook.io/wizard')) {
                    return element;
                }

                return { props: { url } };
            }
            default:
                return element;
        }
    },

    async render(element, context) {
        const configuredURL =
            typeof element.props.url === 'string' &&
            isAllowedWizardUrl(element.props.url) &&
            new URL(element.props.url).pathname.startsWith('/maydocsach.gitbook.io/wizard')
                ? element.props.url
                : DEFAULT_WIZARD_URL;

        return (
            <block>
                <webframe source={{ url: buildWebframeUrl(configuredURL, context) }} />
            </block>
        );
    },
});

const jailbreakBlock = createComponent<EmbedProps>({
    componentId: 'jailbreak',

    async action(element, action) {
        if (action.action === '@link.unfurl') {
            const url = action.url;
            if (typeof url === 'string' && isAllowedWizardUrl(url) &&
                new URL(url).pathname.startsWith('/maydocsach.gitbook.io/jailbreak-wizard')) {
                return { props: { url } };
            }
        }
        return element;
    },

    async render(_element, context) {
        // This block is intentionally pinned to the jailbreak-specific URL.
        // It cannot silently fall back to the e-reader recommendation Wizard.
        return (
            <block>
                <webframe source={{ url: buildWebframeUrl(DEFAULT_JAILBREAK_URL, context) }} />
            </block>
        );
    },
});

export default createIntegration({
    fetch: handleFetchEvent,
    components: [embedBlock, jailbreakBlock],
});
