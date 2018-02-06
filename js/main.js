(function(){
    var canvas, stage;
    var boxes, connectors;

    var mouseTarget;  // the display object currently under the mouse, or being dragged
    var dragStarted;  // indicates whether we are currently in a drag operation
    var offset;
    var update = true;

    function init() {
        // create stage and point it to the canvas:
        canvas = document.getElementById("canvas");
        stage = new createjs.Stage(canvas);

        // enable touch interactions if supported on the current device:
        createjs.Touch.enable(stage);

        // enabled mouse over / out events
        stage.enableMouseOver(10);
        stage.mouseMoveOutside = true;  // keep tracking the mouse even when it leaves the canvas


        boxes = new createjs.Container();
        connectors = new createjs.Container();

        stage.addChild(connectors, boxes);

        boxes.addChild.apply(boxes, createBoxes());
        connectors.addChild.apply(connectors, createConnectors(boxes.children));

        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = 60;
        createjs.Ticker.addEventListener("tick", tick);
    }

    function createBox() {

        var box = new createjs.Container();

        /*
         * Create the rounded rectangle
         */
        var rect = new createjs.Shape();
        rect.cursor = "pointer";

        var w = (160 - 80 * Math.random()) | 0;
        var h = (w / 2) | 0;

        rect.regX = w / 2 | 0;
        rect.regY = h / 2 | 0;
        rect.name = 'rect';

        var g = rect.graphics;
        g.setStrokeStyle(4, "round");
        g.beginStroke("#595e59");
        g.beginFill("#ffffff");
        g.drawRoundRect(0, 0, w, h, 7);
        g.setStrokeStyle(1);
        g.beginStroke("#595e59");
        g.arc(8.5, 8.5, 4, Math.PI, Math.PI * 1.5);
        g.moveTo(w * 0.14 | 0, 4.5).lineTo(8.5, 4.5);
        g.moveTo(4.5, h * 0.4 | 0).lineTo(4.5, 8.5);

        /*
         * Create dot on left
         */
        var dot1 = new createjs.Shape();
        dot1.x = rect.x - w / 2 | 0;
        dot1.y = rect.y;
        dot1.name = 'dot1';

        var g = dot1.graphics;
        g.setStrokeStyle(4);
        g.beginStroke("#595e59");
        g.beginFill("#ffffff");
        g.drawCircle(0, 0, 6);

        /*
         * Create dot on right
         */
        var dot2 = new createjs.Shape();
        dot2.x = rect.x + w / 2 | 0;
        dot2.y = rect.y;
        dot2.name = 'dot2';

        var g = dot2.graphics;
        g.setStrokeStyle(4);
        g.beginStroke("#595e59");
        g.beginFill("#ffffff");
        g.drawCircle(0, 0, 6);

        // Finalize
        box.x = stage.canvas.width * Math.random() | 0;
        box.y = stage.canvas.height * Math.random() | 0;
        box.addChild(rect, dot1, dot2);
        dot1.visible = dot2.visible = false;

        return box;
    }

    function createBoxes(container) {

        var boxes = [];

        for (var i=0; i<4; i++) {

            var box = createBox();
            boxes.push(box);

            box.on("mousedown", function (evt) {
                this.parent.addChild(this);
                this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
            });

            // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
            box.on("pressmove", function (evt) {
                this.x = evt.stageX + this.offset.x;
                this.y = evt.stageY + this.offset.y;
                redrawConnectors();
            });

            box.on("rollover", function (evt) {
                this.scale = this.originalScale * 1.2;
            });

            box.on("rollout", function (evt) {
                this.scale = this.originalScale;
            });
        }

        return boxes;
    }

    function createConnector(box1, box2) {
        var connector = new createjs.Shape();
        var g = connector.graphics;
        g.setStrokeStyle(4);
        g.beginStroke("#ff0000");

        g.moveTo(box1.x, box1.y);
        g.lineTo(box2.x, box2.y);

        connector.boxes = [box1, box2]

        return connector;
    }

    function redrawConnectors() {
        var now = +new Date;

        function hideUnlessUpdated(el) {
            console.log(el.redrawnAt, now, el.redrawnAt == now);
            if (el.redrawnAt != now) {
                el.visible = false;
                el.redrawnAt = now;
            }
        }

        function show(el) {
            el.visible = true;
            el.redrawnAt = now;
        }

        connectors.children.forEach(function(connector){
            var box1 = connector.boxes[0];
            var box2 = connector.boxes[1];
            var elLeft, elRight;

            if (box1.x > box2.x) {
                elLeft = box2;
                elRight = box1;
            } else {
                elLeft = box1;
                elRight = box2;
            }

            var dotLeft = elLeft.getChildByName('dot2');
            var dotRight = elRight.getChildByName('dot1');
            show(dotLeft);
            show(dotRight);
            hideUnlessUpdated(elLeft.getChildByName('dot1'));
            hideUnlessUpdated(elRight.getChildByName('dot2'));

            var g = connector.graphics;
            g.clear();
            g.setStrokeStyle(4);
            g.beginStroke("#595e59");

            g.moveTo(elLeft.x + dotLeft.x, elLeft.y + dotLeft.y);
            g.lineTo(elRight.x + dotRight.x, elRight.y + dotRight.y);
        });
    }

    function createConnectors(boxes) {
        var conn1 = createConnector(boxes[0], boxes[1]);
        var conn2 = createConnector(boxes[0], boxes[3]);
        var conn3 = createConnector(boxes[1], boxes[3]);
        var conn4 = createConnector(boxes[2], boxes[3]);
        var conn5 = createConnector(boxes[0], boxes[2]);
        return [conn1, conn2, conn3, conn4, conn5];
    }

    function tick(event) {
        stage.update(event);
    }

    init();

})();
