#!/bin/bash

# RunCat Cinnamon Applet Test Installation Script

UUID="runcat@gabriele"
APPLET_DIR="$HOME/.local/share/cinnamon/applets/$UUID"

echo "=== RunCat Cinnamon Applet Installation ==="
echo

# Check if Cinnamon is running
if ! pgrep -x "cinnamon" > /dev/null; then
    echo "Warning: Cinnamon doesn't appear to be running."
    echo "This script is designed for Cinnamon desktop environment."
    echo
fi

# Check if libgtop is available
echo "Checking for libgtop..."
if dpkg -l | grep -q libgtop; then
    echo "✓ libgtop is installed"
else
    echo "⚠ libgtop might not be installed. Install with:"
    echo "  sudo apt install libgtop-2.0-11 gir1.2-gtop-2.0"
fi
echo

# Create applet directory
echo "Creating applet directory..."
mkdir -p "$APPLET_DIR"

# Copy files
echo "Copying applet files..."
cp applet.js "$APPLET_DIR/"
cp metadata.json "$APPLET_DIR/"
cp settings-schema.json "$APPLET_DIR/"
cp -r icons "$APPLET_DIR/"

# Verify installation
echo "Verifying installation..."
if [[ -f "$APPLET_DIR/applet.js" ]] && [[ -f "$APPLET_DIR/metadata.json" ]] && [[ -f "$APPLET_DIR/settings-schema.json" ]] && [[ -d "$APPLET_DIR/icons" ]]; then
    echo "✓ All files copied successfully"
else
    echo "✗ Some files may be missing"
    exit 1
fi

# Check icon files
ACTIVE_ICONS=$(find "$APPLET_DIR/icons/runcat/active" -name "*.svg" | wc -l)
IDLE_ICONS=$(find "$APPLET_DIR/icons/runcat/idle" -name "*.svg" | wc -l)

echo "✓ Found $ACTIVE_ICONS active sprites and $IDLE_ICONS idle sprites"

echo
echo "=== Installation Complete ==="
echo
echo "Next steps:"
echo "1. Restart Cinnamon: Press Alt+F2, type 'r', press Enter"
echo "2. Add applet to panel: Right-click panel → Applets → Find 'RunCat' → Add"
echo "3. Configure settings: Right-click the applet → Settings"
echo
echo "If you encounter issues, check the logs:"
echo "  journalctl -f | grep -i runcat"
echo 