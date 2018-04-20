var schema = {
  type: 'object',
  properties: {
    robots: {
      type: 'array',
      minItems: 10,
      maxItems: 1000,
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            unique: true,
            minimum: 1,
            maximum: 2000
          },
          name: {
            type: 'string',
            faker: 'name.firstName'
          },
          configuration: {
            type: 'object',
            properties: {
              hasSentience: {
                type: 'boolean',
                pattern: 'random.boolean'
              },
              hasWheels: {
                type: 'boolean',
                faker: 'random.boolean'
              },
              hasTracks: {
                type: 'boolean',
                faker: 'random.boolean'
              },
              numberOfRotors: {
                type: 'integer',
                minimum: 1,
                maximum: 5
              },
              colour: {
                type: 'string',
                pattern: 'red|blue|yellow|black|white'
              }
            },
            required: [
              'hasSentience',
              'hasWheels',
              'hasTracks',
              'numberOfRotors',
              'colour'
            ]
          },
          statuses: {
            type: 'array',
            minItems: 0,
            maxItems: 4,
            items: {
              type: 'string',
              pattern: 'on fire|rusty|loose screws|paint scratched'
            },
            uniqueItems: true
          }
        },
        required: ['id', 'name', 'configuration', 'statuses']
      }
    }
  },
  required: ['robots']
}

module.exports = schema
