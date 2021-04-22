export default {
  type: "object",
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    credentials: { type: 'string' }
  },
  required: ['username', 'email', 'credentials']
} as const;
