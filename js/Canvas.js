define(function(require){


    'use strict';


    var Box = require('./Box');
    var _ = require('./lodash.min');


    function Canvas(width, height, backgroundColor, parentEl) {

        // Create canvas element and append to parent

        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.canvas.style.backgroundColor = backgroundColor;

        if (parentEl) {
            parentEl.append(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');
        this.shapes = {};
        this.zoom = 1;

        this.canvas.addEventListener('mousewheel', this.mouseWheelHandler.bind(this));
        this.canvas.addEventListener('mousedown', this.mouseDownHandler.bind(this));
        this.canvas.addEventListener('mousemove', this.mouseMoveHandler.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseUpHandler.bind(this));

        this.draggedShape = null;
        this.draggedPoint = null;

    }


    Canvas.prototype.addShape = function addShape(shape) {

        this.shapes[shape.id] = shape;

    }


    Canvas.prototype.mouseWheelHandler = function mouseWheelHandler(e) {

        var e = window.event || e; // old IE support
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

        if (delta > 0) {
            this.setZoom(this.zoom * 1.15);
        } else {
            this.setZoom(this.zoom / 1.15);
        }

        e.preventDefault();

    }


    Canvas.prototype.mouseDownHandler = function mouseDownHandler(e) {

        _.each(this.shapes, (function(shape, id){

            if (shape instanceof Box) {
                if (this.ctx.isPointInPath(shape.path, e.offsetX, e.offsetY)) {

                    this.draggedShape = shape;
                    this.draggedPoint = {x: e.offsetX, y: e.offsetY};
                    this.draggedShape.isHighlighted = true;

                    if (this.draggedShape.hasListener('mousedown')) {
                        shape.triggerEvent('mousedown', e);
                    }

                    this.draw();

                }
            }

        }).bind(this));

    }


    Canvas.prototype.mouseMoveHandler = function mouseMoveHandler(e) {

        if (!this.draggedShape) return;

        this.draggedShape.x += (e.offsetX  - this.draggedPoint.x) / this.zoom;
        this.draggedShape.y += (e.offsetY - this.draggedPoint.y) / this.zoom;
        this.draggedPoint = {x: e.offsetX, y: e.offsetY};

        this.draw();

    }


    Canvas.prototype.mouseUpHandler = function mouseUpHandler(e) {

        if (!this.draggedShape) return;

        if (this.draggedShape.hasListener('mouseup')) {
            this.draggedShape.triggerEvent('mouseup', e);
        }
        this.draggedShape.isHighlighted = false;

        this.draggedShape = null;
        this.draggedPoint = null;

        this.draw();

    }


    Canvas.prototype.draw = function draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        _.each(this.shapes, (function (shape) {
            shape.drawBackground(this.ctx);
        }).bind(this));

        _.each(this.shapes, (function (shape) {
            shape.drawForeground(this.ctx);
            console.log(shape);
        }).bind(this));

    };


    Canvas.prototype.setZoom = function setZoom(amount) {

        this.zoom = amount;

        _.each(this.shapes, (function (shape) {
            shape.setZoom(amount);
        }).bind(this));

        this.draw();

    }


    return Canvas;

});
