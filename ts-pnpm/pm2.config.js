module.exports = {
  apps: [
    {
      name: 'medsync-client',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
