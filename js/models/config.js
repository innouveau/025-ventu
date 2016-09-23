function Config(app) {
    this.app = app;
    this.card = {
        horizontalShift: 0, // horizontal shift card relative to container
            selectedPosition: ''
    };
    this.shade = {
        active: false,
            selected: {
            y: 160, // distance shade form stack
                width: 0.6,
                height: 0.16
        },
        normal: {
            width: 0.22,
                height: 0.26
        }
    };
    this.stack = {
        offset: 4, // pixels vertical offset inside stack
            verticalPosition :0
    };
    this.zoom = 0.2; // factor of magnification of stack
    this.swipe = 0;
    this.sizes = {
        card: {
            width: 0,
            height: 0
        }
    };
}