#!/bin/bash

# Define the UUID and the installation directory
UUID="runcat-cinnamon@port"
INSTALL_DIR="$HOME/.local/share/cinnamon/applets/$UUID"

# Create the installation directory if it doesn't exist
mkdir -p "$INSTALL_DIR"

# Copy the applet files
cp -r ./icons "$INSTALL_DIR/"
cp ./applet.js "$INSTALL_DIR/"
cp ./metadata.json "$INSTALL_DIR/"
cp ./stylesheet.css "$INSTALL_DIR/"

# Update the UUID in metadata.json
sed -i "s/\"uuid\": .*/\"uuid\": \"$UUID\",/" "$INSTALL_DIR/metadata.json"

echo "RunCat applet installed successfully in $INSTALL_DIR"
echo ""
echo "To enable the applet, open 'Applets' from your Cinnamon menu, find 'RunCat', and add it to the panel."
echo "To see logs, you can check ~/.cinnamon/glass.log or run: journalctl -f -o cat /usr/bin/cinnamon"
echo ""
echo "If you make changes, you may need to restart Cinnamon for them to take effect."
echo "You can do this by right-clicking the panel -> Troubleshoot -> Restart Cinnamon." 