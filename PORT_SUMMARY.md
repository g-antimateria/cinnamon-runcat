# RunCat GNOME to Cinnamon Port Summary

## What Was Accomplished

The GNOME Shell RunCat extension has been successfully ported to work as a Cinnamon applet. The core functionality has been preserved while adapting the code to use Cinnamon's APIs.

## Files Created

### Core Applet Files
- `applet.js` - Main applet implementation (replaces `extension.ts` and `indicator.ts`)
- `metadata.json` - Cinnamon applet metadata (adapted from GNOME version)
- `settings-schema.json` - Cinnamon settings schema (replaces GSettings schema)

### Support Files
- `icons/runcat/active/` - 5 running cat sprites (copied from original)
- `icons/runcat/idle/` - 1 idle cat sprite (copied from original)
- `INSTALL.md` - Installation instructions
- `test-install.sh` - Automated installation script

## Key Changes Made

### 1. API Translations
- **GNOME**: `Main.panel.addToStatusArea()` → **Cinnamon**: Automatic panel integration
- **GNOME**: `St.Icon({ icon_name: '...' })` → **Cinnamon**: `this.set_applet_icon_path()`
- **GNOME**: `PanelMenu.Button` → **Cinnamon**: `Applet.IconApplet`
- **GNOME**: GSettings → **Cinnamon**: `Settings.AppletSettings`

### 2. CPU Monitoring
- Preserved the original GTop-based CPU monitoring
- Added fallback to `/proc/stat` reading if GTop is unavailable
- Maintained the same 3-second monitoring interval

### 3. Animation Logic
- Ported the animation speed calculation formula: `f(x) = 25 / sqrt(x*100 + 30) - 2`
- Preserved 5-frame active animation and 1-frame idle animation
- Maintained speed inversion feature

### 4. Settings Integration
- All original settings preserved:
  - Idle threshold
  - Display items (character/percentage options)
  - Speed inversion
  - Custom system monitor command
- Adapted to use Cinnamon's settings schema format

### 5. Menu System
- Recreated context menu with "Open System Monitor" and "Settings" options
- Integrated with Cinnamon's applet settings system

## Features Preserved

✅ **Animated Cat**: 5-frame running animation based on CPU usage  
✅ **CPU Monitoring**: Real-time CPU usage tracking  
✅ **Configurable Idle Threshold**: Cat stops running below threshold  
✅ **Display Options**: Show character, percentage, or both  
✅ **Speed Inversion**: Cat runs slower when CPU usage is higher  
✅ **Custom System Monitor**: Configurable system monitor command  
✅ **Tooltip**: Shows CPU percentage on hover  
✅ **Context Menu**: Right-click menu with options  

## Technical Implementation

### CPU Monitoring
- Uses `GTop.glibtop_get_cpu()` for accurate CPU statistics
- Fallback to `/proc/stat` parsing if GTop unavailable
- Calculates utilization as `(active_delta) / (total_delta)`

### Animation System
- Uses `Mainloop.timeout_add()` for scheduling
- Dynamic animation intervals based on CPU usage
- Cycles through sprite array with wraparound

### Settings Management
- Binds settings to applet properties using `Settings.AppletSettings`
- Automatic UI updates when settings change
- Validation and dependency handling

## Installation

Run the included test script:
```bash
./test-install.sh
```

Or install manually:
```bash
mkdir -p ~/.local/share/cinnamon/applets/runcat@gabriele
cp -r applet.js metadata.json settings-schema.json icons ~/.local/share/cinnamon/applets/runcat@gabriele/
```

## Compatibility

- **Cinnamon**: 4.0+ (tested compatibility range)
- **Dependencies**: libgtop (usually pre-installed)
- **Platforms**: Linux (same as original extension)

## Differences from Original

### Simplified Architecture
- Single `applet.js` file instead of multiple TypeScript files
- No build process required (direct JavaScript)
- Integrated settings handling

### Enhanced Error Handling
- Graceful fallback if GTop unavailable
- Better error logging for debugging
- Safer file operations

### Installation Process
- Standard Cinnamon applet installation
- No compilation required
- Included automated installation script

## Future Enhancements

Potential improvements for future versions:
- Additional animation themes
- More CPU visualization options
- Network usage monitoring
- Memory usage integration
- Custom icon support 