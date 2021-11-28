// env-based configs
export const {
  abc
} = {
  // command: `npm run build`
  production: {
    abc: 'xyz',
  },

  // command: `npm run start`
  development: {
    abc: 'xyz',
  },
}[ process.env.BUILD_MODE ]
