define(function(require) {


    'use strict';


    var Toolset = require('./Toolset');
    var shapeIndex = 0;


    function Line(config) {

        shapeIndex += 1;
        this.id = 'line_' + shapeIndex;

        this.box1 = config.box1;
        this.box2 = config.box2;

        this.width = config.width;
        this.color = config.color;
        this.outlineWidth = config.outlineWidth;
        this.outlineColor = config.outlineColor;
        this.zoom = config.zoom || 1;

        this.path = null;
        this.coords = {
            src: {x: null, y: null},
            dst: {x: null, y: null},
        }

    }


    Line.prototype.drawBackground = function (ctx){

        if (Toolset.isOverlappingRect(this.box1, this.box2)) return;

        var isHorizontal = true;

        if (Toolset.isAtRight(this.box1, this.box2)) {

            this.coords.src.x = this.box1.x + this.box1.width;
            this.coords.src.y = this.box1.y + this.box1.height / 2;
            this.coords.dst.x = this.box2.x;
            this.coords.dst.y = this.box2.y + this.box2.height / 2;

        } else if (Toolset.isAtRight(this.box2, this.box1)) {

            this.coords.src.x = this.box2.x + this.box2.width;
            this.coords.src.y = this.box2.y + this.box2.height / 2;
            this.coords.dst.x = this.box1.x;
            this.coords.dst.y = this.box1.y + this.box1.height / 2;

        } else if (Toolset.isAtBelow(this.box1, this.box2)) {

            this.coords.src.x = this.box1.x + this.box1.width / 2;
            this.coords.src.y = this.box1.y + this.box1.height;
            this.coords.dst.x = this.box2.x + this.box2.width / 2;
            this.coords.dst.y = this.box2.y;
            isHorizontal = false;

        } else if (Toolset.isAtBelow(this.box2, this.box1)) {

            this.coords.src.x = this.box2.x + this.box2.width / 2;
            this.coords.src.y = this.box2.y + this.box2.height;
            this.coords.dst.x = this.box1.x + this.box1.width / 2;
            this.coords.dst.y = this.box1.y;
            isHorizontal = false;

        }

        var x1 = this.coords.src.x * this.zoom;
        var y1 = this.coords.src.y * this.zoom;
        var x2 = this.coords.dst.x * this.zoom;
        var y2 = this.coords.dst.y * this.zoom;

        this.path = new Path2D();
        this.path.moveTo(x1, y1);
        if (isHorizontal) {
            var xmid = x1 + (x2 -x1) / 2;
            this.path.bezierCurveTo(xmid, y1, xmid, y2, x2, y2);
        } else {
            var ymid = y1 + (y2 - y1) / 2;
            this.path.bezierCurveTo(x1, ymid, x2, ymid, x2, y2);
        }

        ctx.strokeStyle = this.outlineColor;
        ctx.lineWidth = (this.width + this.outlineWidth * 2) * this.zoom;
        ctx.stroke(this.path);

        Toolset.circle(ctx, x1, y1, (this.width + this.outlineWidth) * this.zoom, null, this.width * this.zoom, this.outlineColor);
        Toolset.circle(ctx, x2, y2, (this.width + this.outlineWidth) * this.zoom, null, this.width * this.zoom, this.outlineColor);

    }


    Line.prototype.drawForeground = function (ctx){

        if (Toolset.isOverlappingRect(this.box1, this.box2)) return;

        var x1 = this.coords.src.x * this.zoom;
        var y1 = this.coords.src.y * this.zoom;
        var x2 = this.coords.dst.x * this.zoom;
        var y2 = this.coords.dst.y * this.zoom;

        var lineWidth = this.width * this.zoom;

        ctx.strokeStyle = this.color;
        ctx.lineWidth = lineWidth;
        ctx.stroke(this.path);

        Toolset.circle(ctx, x1, y1, lineWidth, this.outlineColor, lineWidth, this.color);
        Toolset.circle(ctx, x2, y2, lineWidth, this.outlineColor, lineWidth, this.color);

    }


    Line.prototype.setZoom = function (zoom) {

        this.zoom = zoom;

    }


    Line.prototype.toJSON = function toJSON() {

        return {
            src: this.box1.id,
            dst: this.box2.id,
        }

    }

    return Line;

});
