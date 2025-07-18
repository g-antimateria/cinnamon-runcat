# Installation Guide

This guide will help you install the RunCat applet on your Cinnamon desktop.

## Automated Installation (Recommended)

The easiest way to install the applet is to use the provided script.

1.  **Open a terminal** in the project directory.
2.  **Make the script executable**:
    ```bash
    chmod +x install.sh
    ```
3.  **Run the script**:
    ```bash
    ./install.sh
    ```
4.  **Reload Cinnamon**: Right-click on your panel, select "Troubleshoot", and then "Restart Cinnamon".
5.  **Add the applet**: Right-click on your panel, select "Applets", find "RunCat", and click the "+" button to add it.

## Manual Installation

If you prefer to install the applet manually, follow these steps:

1.  **Define the UUID**: The applet's UUID is `runcat-cinnamon@port`.
2.  **Create the directory**:
    ```bash
    mkdir -p ~/.local/share/cinnamon/applets/runcat-cinnamon@port
    ```
3.  **Copy the files**: Copy `applet.js`, `metadata.json`, `stylesheet.css`, and the `icons` directory into the folder you just created.
4.  **Reload Cinnamon**: As mentioned above, restart Cinnamon through the "Troubleshoot" menu.
5.  **Add the applet** to your panel via the "Applets" menu.

## Viewing Logs

If you encounter issues, you can view the applet's logs by checking the `~/.cinnamon/glass.log` file or by running the following command in a terminal:
```bash
journalctl -f -o cat /usr/bin/cinnamon | grep -i runcat
```

## Features

- **Animated Cat**: Shows a running cat whose speed indicates CPU usage
- **CPU Monitoring**: Updates every 3 seconds
- **Configurable Settings**:
  - Idle threshold: CPU usage below which the cat stops running
  - Display options: Show character only, percentage only, or both
  - Invert speed: Make the cat run slower when CPU usage is higher
  - Custom system monitor command
- **Context Menu**: Right-click to open system monitor or settings

## Requirements

- Cinnamon 4.0 or higher
- `libgtop` library (usually pre-installed)

## Troubleshooting

If the applet doesn't work:

1. **Check if libgtop is installed:**
   ```bash
   dpkg -l | grep libgtop
   ```
   If not installed:
   ```bash
   sudo apt install libgtop-2.0-11 gir1.2-gtop-2.0
   ```

2. **Check the applet directory structure:**
   ```
   ~/.local/share/cinnamon/applets/runcat@gabriele/
   ├── applet.js
   ├── metadata.json
   ├── settings-schema.json
   └── icons/
       └── runcat/
           ├── active/
           │   ├── sprite-0-symbolic.svg
           │   ├── sprite-1-symbolic.svg
           │   ├── sprite-2-symbolic.svg
           │   ├── sprite-3-symbolic.svg
           │   └── sprite-4-symbolic.svg
           └── idle/
               └── sprite-0-symbolic.svg
   ```

3. **Check the system logs:**
   ```bash
   journalctl -f | grep -i runcat
   ```

## Original Extension

This applet is inspired by the original RunCat concept:
- Original Repository: https://github.com/win0err/gnome-runcat
- Original Author: win0err

## License

This applet maintains the same license as the original RunCat project. 