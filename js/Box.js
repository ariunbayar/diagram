define(function(require) {


    'use strict';


    var Toolset = require('./Toolset');
    var boxIndex = 0;


    function Box(config) {

        this.events = {};

        boxIndex += 1;
        this.id = 'box_' + boxIndex;

        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.height = config.height;
        this.radius = config.radius;
        this.fillColor = config.fillColor;
        this.highlightColor = config.highlightColor;
        this.borderWidth = config.borderWidth;
        this.borderColor = config.borderColor;
        this.outlineWidth = config.outlineWidth;
        this.outlineColor = config.outlineColor;
        this.zoom = config.zoom || 1;

        this.color = config.color;
        this.fontWeight = config.fontWeight || 700;
        this.fontFamily = config.fontFamily;
        this.fontSize = config.fontSize;
        this.lineHeight = config.fontSize * (config.lineHeight || 1.618);
        this.text = config.text || '';
        this.padding = config.padding || 10;

        this.isHighlighted = false;

        var z = this.zoom;
        var d = this.borderWidth / 2 + this.outlineWidth;

        this.path = Toolset.rectRounded((this.x - d) * z, (this.y - d) * z, (this.width + d * 2) * z, (this.height + d * 2) * z, (this.radius + d) * z);

    }

    Box.prototype.drawBackground = function drawBackground(ctx) {

        var z = this.zoom;
        var d = this.borderWidth / 2 + this.outlineWidth;
        this.path = Toolset.rectRounded((this.x - d) * z, (this.y - d) * z, (this.width + d * 2) * z, (this.height + d * 2) * z, (this.radius + d) * z);

        ctx.fillStyle = this.outlineColor;
        ctx.fill(this.path);

    }

    Box.prototype.drawForeground = function drawForeground(ctx) {

        var z = this.zoom;

        var p = Toolset.rectRounded(this.x * z, this.y * z, this.width * z, this.height * z, this.radius * z);

        ctx.fillStyle = this.isHighlighted ? this.highlightColor : this.fillColor;
        ctx.fill(p);

        ctx.lineWidth = this.borderWidth * z;
        ctx.strokeStyle = this.borderColor;
        ctx.stroke(p);

        var font = this.fontWeight + ' ' + (this.fontSize * z) + 'px "' + this.fontFamily + '"';
        var padding = this.padding;
        var x = this.x + this.padding;
        var y = this.y + this.padding;
        var width = this.width - this.padding * 2;

        Toolset.text(ctx, this.text, x * z, y * z, this.color, font, width * z, this.lineHeight * z);
    }

    Box.prototype.setZoom = function setZoom(zoom) {

        this.zoom = zoom;

    }

    Box.prototype.hasListener = function hasListener(eventName) {

        return eventName in this.events;

    }

    Box.prototype.addEventListener = function addEventListener(eventName, callback) {

        this.events[eventName] = callback.bind(this);

    }

    Box.prototype.removeEventListener = function removeEventListener(eventName) {

        delete this.events[eventName];

    }

    Box.prototype.triggerEvent = function triggerEvent(eventName, e) {

        this.events[eventName](e);

    }

    Box.prototype.toJSON = function toJSON() {

        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            text: this.text,
        }

    }

    return Box;

});
