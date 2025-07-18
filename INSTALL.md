# RunCat Cinnamon Applet Installation

This is a native Cinnamon applet that shows CPU usage with an animated cat.

## Installation

1. **Copy the applet to your Cinnamon applets directory:**
   ```bash
   mkdir -p ~/.local/share/cinnamon/applets/runcat@gabriele
   cp -r applet.js metadata.json settings-schema.json icons ~/.local/share/cinnamon/applets/runcat@gabriele/
   ```

2. **Restart Cinnamon or reload applets:**
   - Press `Alt + F2`, type `r`, and press Enter
   - Or log out and log back in

3. **Add the applet to your panel:**
   - Right-click on your panel
   - Select "Applets"
   - Find "RunCat" in the list
   - Click the "+" button to add it

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