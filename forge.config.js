module.exports = {
  packagerConfig: {
    // Other packager configurations if needed
  },
  makers: [
    {
      name: "@electron-forge/maker-deb",
      config: {
        options: {
          icon: path.resolve(__dirname, "public/icon.png"),
        },
      },
    },
    // Other makers configurations if needed
  ],
};
