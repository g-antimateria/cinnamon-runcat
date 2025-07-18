const Applet = imports.ui.applet;
const Lang = imports.lang;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const St = imports.gi.St;
const PopupMenu = imports.ui.popupMenu;
const Util = imports.misc.util;
const Settings = imports.ui.settings;
const Mainloop = imports.mainloop;

// Try to import GTop, fall back to manual CPU reading if not available
let GTop;
try {
    GTop = imports.gi.GTop;
} catch (e) {
    GTop = null;
}

const UUID = "runcat@gabriele";

function RunCatApplet(orientation, panel_height, instance_id) {
    this._init(orientation, panel_height, instance_id);
}

RunCatApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,

    _init: function(orientation, panel_height, instance_id) {
        Applet.IconApplet.prototype._init.call(this, orientation, panel_height, instance_id);
        
        this.setAllowedLayout(Applet.AllowedLayout.BOTH);
        
        // Initialize settings
        this.settings = new Settings.AppletSettings(this, UUID, instance_id);
        
        // Bind settings
        this.settings.bind("idle-threshold", "idleThreshold", this._onSettingsChanged);
        this.settings.bind("displaying-items", "displayingItems", this._onSettingsChanged);
        this.settings.bind("invert-speed", "isSpeedInverted", this._onSettingsChanged);
        this.settings.bind("custom-system-monitor-enabled", "useCustomSystemMonitor", this._onSettingsChanged);
        this.settings.bind("custom-system-monitor-command", "customSystemMonitorCommand", this._onSettingsChanged);
        
        // Initialize variables
        this.cpuUsage = 0;
        this.activeSprites = [];
        this.idleSprites = [];
        this.currentSpriteIndex = 0;
        this.isActive = false;
        this.sourceIds = {};
        
        // CPU monitoring variables
        this.prevActive = 0;
        this.prevTotal = 0;
        
        // Keep it simple - no custom layout needed
        this.percentageLabel = null;
        
        // Load sprites
        this._loadSprites();
        
        // Set initial icon
        this._setIcon();
        
        // Setup menu
        this._setupMenu();
        
        // Start monitoring
        this._startMonitoring();
    },

    _loadSprites: function() {
        const appletPath = global.userdatadir + "/applets/" + UUID;
        
        // Load active sprites (sprite-0 through sprite-4)
        this.activeSprites = [];
        for (let i = 0; i < 5; i++) {
            const iconPath = appletPath + "/icons/runcat/active/sprite-" + i + "-symbolic.svg";
            const file = Gio.File.new_for_path(iconPath);
            if (file.query_exists(null)) {
                this.activeSprites.push(iconPath);
            }
        }
        
        // Load idle sprite
        const idleIconPath = appletPath + "/icons/runcat/idle/sprite-0-symbolic.svg";
        const idleFile = Gio.File.new_for_path(idleIconPath);
        if (idleFile.query_exists(null)) {
            this.idleSprites.push(idleIconPath);
        }
        
        // Fallback to system icons if sprites not found
        if (this.activeSprites.length === 0) {
            this.activeSprites = ["system-run-symbolic"];
        }
        if (this.idleSprites.length === 0) {
            this.idleSprites = ["system-run-symbolic"];
        }
    },

    _setIcon: function() {
        let iconPath;
        
        if (this.isActive && this.activeSprites.length > 0) {
            iconPath = this.activeSprites[this.currentSpriteIndex % this.activeSprites.length];
        } else if (this.idleSprites.length > 0) {
            iconPath = this.idleSprites[0];
        } else {
            iconPath = "system-run-symbolic";
        }
        
        // Check if it's a path or icon name
        if (iconPath.includes("/")) {
            this.set_applet_icon_path(iconPath);
        } else {
            this.set_applet_icon_symbolic_name(iconPath);
        }
    },

    _getCPUUsage: function() {
        if (GTop) {
            // Use GTop if available (preferred method)
            const cpu = new GTop.glibtop_cpu();
            GTop.glibtop_get_cpu(cpu);
            
            const active = cpu.user + cpu.sys + cpu.nice;
            const total = cpu.total;
            
            const utilization = (active - this.prevActive) / Math.max((total - this.prevTotal), 1.0);
            
            this.prevActive = active;
            this.prevTotal = total;
            
            return Math.max(0, Math.min(1, utilization));
        } else {
            // Fallback to reading /proc/stat
            try {
                const file = Gio.File.new_for_path('/proc/stat');
                const [success, contents] = file.load_contents(null);
                
                if (success) {
                    const lines = contents.toString().split('\n');
                    const cpuLine = lines[0];
                    const values = cpuLine.split(/\s+/).slice(1).map(Number);
                    
                    const active = values[0] + values[1] + values[2]; // user + nice + sys
                    const total = values.reduce((sum, val) => sum + val, 0);
                    
                    const utilization = (active - this.prevActive) / Math.max((total - this.prevTotal), 1);
                    
                    this.prevActive = active;
                    this.prevTotal = total;
                    
                    return Math.max(0, Math.min(1, utilization));
                }
            } catch (e) {
                global.logError("RunCat: Error reading CPU stats: " + e);
            }
        }
        
        return 0;
    },

    _updateCPUUsage: function() {
        this.cpuUsage = this._getCPUUsage();
        
        // Calculate percentage
        const percentage = Math.round(this.cpuUsage * 100);
        
        // Update tooltip
        this.set_applet_tooltip("CPU: " + percentage + "%");
        
        // Update display based on settings
        this._updateDisplay(percentage);
        
        // Determine if cat should be active
        const threshold = this.idleThreshold / 100;
        this.isActive = this.cpuUsage > threshold;
        
        if (this.isSpeedInverted) {
            this.isActive = true; // Always active when inverted
        }
        
        return true; // Continue the timeout
    },

    _createPercentageLabel: function() {
        if (!this.percentageLabel) {
            // Simple approach - just add a label next to the icon
            this.percentageLabel = new St.Label({ 
                text: "",
                style_class: "applet-label",
                y_align: St.Align.MIDDLE
            });
            this.actor.add_child(this.percentageLabel);
        }
    },

    _updateDisplay: function(percentage) {
        // Create the label if it doesn't exist
        if (!this.percentageLabel) {
            this._createPercentageLabel();
        }
        
        // Handle different display modes - keep it simple
        switch (this.displayingItems) {
            case "character-and-percentage":
                // Show both icon and percentage text
                this.percentageLabel.set_text(" " + percentage + "%");
                this.percentageLabel.visible = true;
                break;
            case "percentage-only":
                // Show only percentage text - hide icon with empty path
                this.percentageLabel.set_text(percentage + "%");
                this.percentageLabel.visible = true;
                this.set_applet_icon_symbolic_name(""); // Hide icon
                break;
            case "character-only":
            default:
                // Show only the cat icon
                if (this.percentageLabel) {
                    this.percentageLabel.set_text("");
                    this.percentageLabel.visible = false;
                }
                // Make sure icon is visible
                this._setIcon();
                break;
        }
    },

    _updateAnimation: function() {
        if (this.isActive) {
            // Calculate animation speed based on CPU usage
            let utilization = this.cpuUsage;
            
            if (this.isSpeedInverted) {
                utilization = 1.0 - utilization;
            }
            
            // Animation formula: f(x) = 25 / sqrt(x*100 + 30) - 2
            const animationCycleSeconds = 25 / Math.sqrt(utilization * 100 + 30) - 2;
            const spriteCount = this.activeSprites.length;
            const intervalMs = Math.max(50, Math.ceil(animationCycleSeconds * 1000 / spriteCount));
            
            // Update sprite index
            this.currentSpriteIndex = (this.currentSpriteIndex + 1) % this.activeSprites.length;
            
            // Update icon
            this._setIcon();
            
            // Schedule next animation frame
            this.sourceIds.animation = Mainloop.timeout_add(intervalMs, Lang.bind(this, this._updateAnimation));
        } else {
            // Reset to idle
            this.currentSpriteIndex = 0;
            this._setIcon();
            
            // Schedule next check
            this.sourceIds.animation = Mainloop.timeout_add(1000, Lang.bind(this, this._updateAnimation));
        }
        
        return false; // Don't repeat this timeout automatically
    },

    _startMonitoring: function() {
        // Initial CPU reading to establish baseline
        this._updateCPUUsage();
        
        // Start CPU monitoring (every 3 seconds)
        this.sourceIds.cpuMonitor = Mainloop.timeout_add(3000, Lang.bind(this, this._updateCPUUsage));
        
        // Start animation
        this._updateAnimation();
    },

    _setupMenu: function() {
        // Add "Open System Monitor" menu item
        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, this.orientation);
        this.menuManager.addMenu(this.menu);
        
        const systemMonitorItem = new PopupMenu.PopupMenuItem("Open System Monitor");
        systemMonitorItem.connect('activate', Lang.bind(this, this._openSystemMonitor));
        this.menu.addMenuItem(systemMonitorItem);
        
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        
        // Add settings menu item
        const settingsItem = new PopupMenu.PopupMenuItem("Settings");
        settingsItem.connect('activate', Lang.bind(this, function() {
            Util.spawnCommandLine("cinnamon-settings applets " + UUID);
        }));
        this.menu.addMenuItem(settingsItem);
    },

    _openSystemMonitor: function() {
        let command = "cinnamon-system-monitor || gnome-system-monitor -r || ksysguard || top";
        
        if (this.useCustomSystemMonitor && this.customSystemMonitorCommand) {
            command = this.customSystemMonitorCommand;
        }
        
        try {
            Util.spawnCommandLine(command);
        } catch (e) {
            global.logError("RunCat: Failed to open system monitor: " + e);
        }
    },

    _onSettingsChanged: function() {
        // Settings have changed, update display
        const percentage = Math.round(this.cpuUsage * 100);
        this._updateDisplay(percentage);
    },

    on_applet_clicked: function() {
        this.menu.toggle();
    },

    destroy: function() {
        // Clean up timers
        if (this.sourceIds.cpuMonitor) {
            Mainloop.source_remove(this.sourceIds.cpuMonitor);
        }
        if (this.sourceIds.animation) {
            Mainloop.source_remove(this.sourceIds.animation);
        }
        
        // Clean up settings
        if (this.settings) {
            this.settings.finalize();
        }
        
        Applet.IconApplet.prototype.destroy.call(this);
    }
};

function main(metadata, orientation, panel_height, instance_id) {
    return new RunCatApplet(orientation, panel_height, instance_id);
} 