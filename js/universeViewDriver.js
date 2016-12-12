"use strict";

class GameDriver {
    constructor(numberOfEnemies, renderer, angleChangeSpeed,log, alert, isDebug, EntityClass, PlayerClass, ScaledControlClass) {
    	this._gameStartTime = Date.now();
    	
    	this.numberOfEnemies = numberOfEnemies;
        this._controls = null;
        this._renderer = renderer;
        this._angleChangeSpeed = angleChangeSpeed;
        this.log = log;
        this.alert = alert;
        this.isDebug = isDebug;


        this.EntityClass = EntityClass;
        this.PlayerClass = PlayerClass;
        this.ScaledControlClass = ScaledControlClass;

        this._gameEngine = null;

        this.speedOfLight = 4479900;
        
        
        
        //constructor(driver,id,x,y,width,height,angle,movementSpeed,img)
        this._player = new this.PlayerClass(this, 'player', 0, 0, 160, 80, 90, 30);


        //SUN
        var sunRadius = 200000;
        var sunImage = {};
        sunImage.img = new Image();
        sunImage.img.src = 'img/sun2.png';
        //constructor(driver,type,id,x,y,width,height,angle,movementSpeed,shape,fillStyle,lineWidth,strokeStyle,image)
        this.sun = new this.EntityClass(this, 'star', 'sun', 0, 0, sunRadius, sunRadius, 0, 0, 'circle', null, 20, 'red', sunImage);
        this.sunAtmosphere = new this.EntityClass(this, 'star', 'sunAtmosphere', 0, 0, sunRadius / 2, sunRadius / 2, 0, 0, 'circle', null, 2000, 'orange', null);


        //BOB
        var bobImage = {};
        bobImage.img = new Image();
        bobImage.img.src = 'img/bob.png';
        this.bob = new this.EntityClass(this, 'person', 'bob', sunRadius * 2, 0, sunRadius / 10, sunRadius / 10, 0, 0, 'circle', null, 20, 'red', bobImage);


        //EARTH
        var earthImage = {};
        earthImage.img = new Image();
        earthImage.img.src = 'img/earth.png';
        this.earth = new this.EntityClass(this, 'planet', 'earth', 0, 9600000, sunRadius / 10, sunRadius / 10, 0, 0, 'circle', null, 20, 'green', earthImage);


        
        //CONTROLS
        var _this = this;
        var isPlayerSpaceMovement = function() {
            return _this._player.spaceMovement;
        }
        var isPlayerNotSpaceMovement = function() {
            return !_this._player.spaceMovement;
        }
        
        var doThrusterClick = function() {
        	_this._player.spaceMovement = true;
        }
        
        var doWarpClick = function() {
        	_this._player.vx = 0;
        	_this._player.vy = 0;
        	_this._player.spaceMovement = false;
        }
        
        //THRUSTER CONTROL
        var thrusterImage = {};
        thrusterImage.img = new Image();
        thrusterImage.img.src = 'img/icon-thruster.png';
        this.thrusterControl = new this.ScaledControlClass(this, 'thrusterControl', doThrusterClick, .95, .80, (1 / 24), .05, thrusterImage, isPlayerSpaceMovement);


        //WARP CONTROL
        var warpImage = {};
        warpImage.img = new Image();
        warpImage.img.src = 'img/icon-warp.png';
        this.warpControl = new this.ScaledControlClass(this, 'warpControl', doWarpClick, .90, .80, (1 / 24), .05, warpImage, isPlayerNotSpaceMovement);


        //CIRCLE CONTROLL
        var circleImage = {};
        circleImage.img = new Image();
        circleImage.img.src = 'img/circle.png';
        this.circleControl = new this.ScaledControlClass(this, 'circleControl', doThrusterClick, .70, .80, (1 / 24), null, circleImage, isPlayerSpaceMovement);

        
        
        
        
        //CLICK CONTROLS
        this._clickControls = [];
        this._clickControls.push(this.thrusterControl);
        this._clickControls.push(this.warpControl);
        this._clickControls.push(this.circleControl);
        //END CLICK CONTROLS


        //enemies
        this.enemies = {};
        for (var i = 1; i <= this.numberOfEnemies; i++) {
            var enemyX = Math.random() * 1000 * (Math.random() > .5 ? -1 : 1);
            var enemyY = Math.random() * 1000 * (Math.random() > .5 ? -1 : 1);
            var enemyW = (Math.random() * 25) + 5;
            var enemyH = (Math.random() * 25) + 5;
            var enemyShape = Math.random() > .5 ? 'circle' : 'rectangle';
            var lineWidth = 3;
            this.enemies['enemy' + i] = new this.EntityClass(this, 'enemy', 'enemy' + i, enemyX, enemyY, enemyW, enemyShape === 'circle' ? enemyW : enemyH, 15, 10, enemyShape, this.getRandomColor(), lineWidth, this.getRandomColor(), null);
        }
    }

    //GETTERS AND SETTERS
    get clickControls(){
    	return this._clickControls;
    }
    get angleChangeSpeed(){
    	return this._angleChangeSpeed;
    }
    
    get gameStartTime(){
    	return this._gameStartTime;
    }
    
    get gameEngine() {
        return this._gameEngine;
    }

    set gameEngine(gameEngine) {
        this._gameEngine = gameEngine;
    }
    
    get controls(){
    	return this._controls;
    }
    
    set controls(controls){
    	this._controls = controls;
    }
    
    get player(){
    	return this._player;
    }
    
    get renderer(){
    	return this._renderer;
    }
    //END GETTERS AND SETTERS



    render() {
        this.bob.draw();
        this.sun.draw();
        this.earth.draw();
        this.sunAtmosphere.draw();
        this._player.draw();

        if (this._renderer.scale >= .01) {
            for (var i = 1; i <= this.numberOfEnemies; i++) {
                this.enemies['enemy' + i].draw(renderer);
            }
        }

        for (var i = 0; i < this._clickControls.length; i++) {
            this._clickControls[i].draw();
        }

        this._renderer.ctx.save();
        var textSize = 35;
        this._renderer.ctx.font = (textSize * this._renderer.viewPortScaler) + 'pt Calibri';
        this._renderer.ctx.fillStyle = 'white';
        this._renderer.ctx.fillText('player(x,y): (' + this.round(this._player.x) + "," + this.round(this._player.y) + ")", 0, (textSize * 1) * this._renderer.viewPortScaler);
        this._renderer.ctx.fillText('player angle: ' + this.round(this._player.angle), 0, (textSize * 2) * this._renderer.viewPortScaler);
        this._renderer.ctx.fillText('scale: ' + this._renderer.scale, 0, (textSize * 3) * this._renderer.viewPortScaler);
        this._renderer.ctx.fillText('base accelleration: ' + this.round(this._player.baseSpeed), 0, (textSize * 4) * this._renderer.viewPortScaler);
        this._renderer.ctx.fillText('current accelleration: ' + this.round(this._player.movementSpeed), 0, (textSize * 5) * this._renderer.viewPortScaler);
        this._renderer.ctx.fillText('current speed: ' + this._player.vectorSpeed / this.speedOfLight + 'c', 0, (textSize * 6) * this._renderer.viewPortScaler);
        this._renderer.ctx.fillText('vx: ' + this.round((this._player.vx / this.speedOfLight), 4) + 'c - vy:' + this.round((this._player.vy / this.speedOfLight), 4) + 'c', 0, (textSize * 7) * this._renderer.viewPortScaler);
        var fps = this._gameEngine !== null ? this._gameEngine.fps : 0;
        this._renderer.ctx.fillText('fps: ' + this.round(fps, 0), 0, (textSize * 8) * this._renderer.viewPortScaler);
        var speedSnapshot = this._gameEngine !== null ? this._gameEngine.speedSnapshot : 0;
        this._renderer.ctx.fillText('speedSnapshot: ' + this.round(speedSnapshot, 0) + ' units/sec', 0, (textSize * 9) * this._renderer.viewPortScaler);
        this._renderer.ctx.fillText('elapsedTime: ' + this.round((Date.now() - this.gameStartTime) / 1000, 2) + ' sec', 0, (textSize * 10) * this._renderer.viewPortScaler);

        this._renderer.ctx.restore();
    }

    update() {
        this.bob.updatePosition();
        this.sun.updatePosition();
        this.earth.updatePosition();
        this.sunAtmosphere.updatePosition();
        this._player.updatePosition();

        var doDraw = this._renderer.scale >= .01;
        for (var i = 1; i <= this.numberOfEnemies; i++) {
            this.enemies['enemy' + i].updatePosition();
            this.enemies['enemy' + i].doDraw = doDraw;
        }
    }



    //BEGIN CONTROLS
    doThrusterClick() {
        this._player.spaceMovement = true;
    }
    
    doWarpClick() {
        this._player.vx = 0;
        this._player.vy = 0;
        this._player.spaceMovement = false;
    }
    
    doCircleClick() {
        this._player.vx = 0;
        this._player.vy = 0;
        this._player.spaceMovement = false;
    }
    //END CONTROLS




    //UTILITY METHODS
    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    round(num, sigDigits) {
        if (sigDigits === undefined || sigDigits === null) {
            sigDigits = 2;
        }

        var powerOfTen = Math.pow(10, sigDigits);
        var inversePowerOfTen = sigDigits === 0 ? 0 : Math.pow(10, (-100 * sigDigits));

        return Math.round((num + inversePowerOfTen) * powerOfTen) / powerOfTen;
    }
    
    degreesToRadians(angle){
		return this._renderer.degreesToRadians(angle);
	}

	radiansToDegrees(angle){
		return this._renderer.radiansToDegrees(angle);
	}

}