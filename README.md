<img height="165" src="src/resources/se.kolesnikov.runcat.svg" alt="RunCat for Cinnamon Logo" align="right" />

# RunCat for Cinnamon

**A native Cinnamon applet that shows CPU usage with an animated cat**

![RunCat Demo](assets/runcat-header.gif)

The cat tells you the CPU usage by running speed! This Cinnamon applet displays an animated cat in your panel whose running speed indicates your system's CPU usage in real-time.

## 🐱 Features

- **Animated Cat**: The cat runs faster when your CPU usage is higher
- **Real-time Monitoring**: Updates every 3 seconds with accurate CPU statistics
- **Configurable Settings**:
  - Idle threshold: Set when the cat should stop running
  - Display options: Show character only, percentage only, or both
  - Speed inversion: Make the cat run slower when CPU usage is higher
  - Custom system monitor command
- **Native Cinnamon Integration**: Built using Cinnamon's applet API
- **Lightweight**: Minimal resource usage
- **Easy Installation**: One-click installation script

## 🚀 Installation

### Quick Install
```bash
git clone https://github.com/g-antimateria/cinnamon-runcat.git
cd cinnamon-runcat
./install.sh
```

### Manual Install
```bash
mkdir -p ~/.local/share/cinnamon/applets/runcat@gabriele
cp -r applet.js metadata.json settings-schema.json icons ~/.local/share/cinnamon/applets/runcat@gabriele/
```

### After Installation
1. **Restart Cinnamon**: `cinnamon --replace &`
2. **Add to Panel**: Right-click panel → Applets → Find "RunCat" → Add
3. **Configure**: Right-click the applet → Settings

## 🖥️ Compatibility

- **Cinnamon**: 4.0 or higher
- **Linux**: Any distribution with Cinnamon
- **Dependencies**: libgtop (usually pre-installed)

## ⚙️ Settings

Access settings by right-clicking the applet:

- **Idle Threshold**: CPU usage percentage below which the cat stops running
- **Display Items**: Choose to show the cat, CPU percentage, or both
- **Invert Speed**: Make the cat run slower when CPU usage is higher
- **Custom System Monitor**: Set a custom command for opening system monitor

## 🔧 Technical Details

- **CPU Monitoring**: Uses `libgtop` with fallback to `/proc/stat`
- **Animation**: 5-frame running animation, 1-frame idle
- **Performance**: Minimal CPU overhead, updates every 3 seconds
- **Memory**: Lightweight implementation

## 🎨 Original Extension

This applet is inspired by the excellent RunCat concept:
- **Original Idea**: RunCat by [win0err](https://github.com/win0err)
- **Original Repository**: https://github.com/win0err/gnome-runcat
- **License**: Same as original (check LICENSE file)

## 📝 Changes from Original

- **Cinnamon Native**: Rewritten using Cinnamon's applet API
- **Simplified Architecture**: Single JavaScript file instead of TypeScript modules
- **Enhanced Error Handling**: Better fallback mechanisms
- **Installation**: Standard Cinnamon applet installation process

## 🐛 Troubleshooting

### Applet Not Appearing
1. Check if files are in the correct location
2. Restart Cinnamon: `cinnamon --replace &`
3. Check system logs: `journalctl -f | grep -i runcat`

### Missing Dependencies
Install libgtop if not available:
```bash
sudo apt install libgtop-2.0-11 gir1.2-gtop-2.0
```

### Permission Issues
Ensure the applet directory has correct permissions:
```bash
chmod -R 755 ~/.local/share/cinnamon/applets/runcat@gabriele/
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📜 License

This project maintains the same license as the original RunCat project. See the LICENSE file for details.

## 🙏 Credits

- **Original RunCat Concept**: [win0err/runcat](https://github.com/win0err/gnome-runcat)
- **Cinnamon Implementation**: Native Cinnamon applet development
- **Cat Sprites**: Adapted from the original RunCat project

---

*If you enjoy this applet, please consider starring the repository and checking out the original RunCat project!*
