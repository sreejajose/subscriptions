module.exports = {
    client: {
      service: {
        name: 'apollo=subscriptions',
        // URL to the GraphQL API
        url: 'cloudurl/v1/graphql',
      },
      // Files processed by the extension
      includes: [
        'src/**/*.vue',
        'src/**/*.js',
      ],
    },
  }