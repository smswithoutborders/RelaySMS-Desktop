### SWOB Desktop App

 Built using Electron for its robust cross-platform capabilities and React for a dynamic user interface.

#### Getting Started

1. **Installation**: Install all the necessary dependencies using Yarn.

    ```bash
    yarn install
    ```

2. **Launch**: Start the application using Electron.

    ```bash
    yarn electron:start
    ```

#### Packaging for Different Operating Systems

Easily bundle SWOB for various operating systems:

##### Linux

Generate a .deb file for Linux distributions.

```bash
yarn electron:package:linux
```

##### Windows

Create a package for Windows systems.

```bash
yarn electron:package:win
```

##### macOS

Build an application package for macOS (formerly known as OS X).

```bash
yarn electron:package:mac
```
Note: You can only build the DMG target on macOS machines.

**For other distributable bundles**

```bash
electron:package:<platform>
```

but remember to add them to the package.json under build

```bash
 "linux": {
      "target": "deb"    }
```

#### Contribution

Contributions to the SWOB Desktop App are welcome and encouraged! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure they adhere to the project's coding standards.
4. Test your changes thoroughly.
5. Submit a pull request detailing your changes and any relevant information.

#### Testing

For detailed information on testing, please refer to the [Testing Documentation](docs/test.md).

#### Security

For detailed information on security, please refer to the [Security Documentation](docs/security.md).
