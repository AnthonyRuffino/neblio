"use strict";
class Entity{
	constructor(driver,type,id,x,y,width,height,angle,movementSpeed,shape,fillStyle,lineWidth,strokeStyle,image){
		this.driver=driver;
		this.type=type;
		this.id=id;
		this._x=x;
		this._y=y;
		this.width=width;
		this.height=height;
		this._angle=angle;
		this.movementSpeed=movementSpeed;
		this.shape=shape;
		this.fillStyle=fillStyle;
		this.strokeStyle=strokeStyle;
		this.lineWidth=lineWidth;
		this.image=image;
		this.baseLineWidth=lineWidth;
		this.baseWidth=width;
		this.baseHeight=height;
		this.baseSpeed=movementSpeed;
		
		
		
		if(this.image === undefined || this.image === null){
			var shapeImage = {};
			
			var shape_canvas = this.driver.renderer.document.createElement('canvas');
			
			var canvasWidth  = (this.shape==='circle' ? this.width*2 : this.width ) + this.lineWidth;
			var canvasHeight = (this.shape==='circle' ? this.height*2 : this.height) + this.lineWidth;
			
			shape_canvas.width = canvasWidth+1;
			shape_canvas.height = canvasHeight+1;
			var shape_context = shape_canvas.getContext('2d');
			
			if(this.shape==='circle'){
				//drawCircleFromContext(context, beginPath, x, y,radius,rotationAngle,fillStyle,lineWidth,strokeStyle,startAngle,endAngle, fillGap);
				this.driver.renderer.drawCircleFromContext(shape_context, true, canvasWidth/2, canvasWidth/2,this.width,null,this.fillStyle,this.lineWidth,this.strokeStyle);
				
				
			}else if(this.shape==='rectangle'){
				this.driver.renderer.drawRectangleFromContext(shape_context,true, this.lineWidth/2, this.lineWidth/2,this.width,this.height,null,this.fillStyle,this.lineWidth,this.strokeStyle);
				
				this.imageHeight = canvasHeight;
				this.imageWidth = canvasWidth;
			}
			
			this.baseImageHeight = this.imageHeight = canvasHeight;
			this.baseImageWidth = this.imageWidth = canvasWidth;
				
			shapeImage.img = shape_canvas;
			this.image = shapeImage;
		}
		
	}
	
	
	get angle(){
		return this._angle;
	}
	
	get x(){
		return this._x;
	}
	
	set x(x){
		this._x = x;
	}
	
	get y(){
		return this._y;
	}
	
	set y(y){
		this._y = y;
	}
	
	
	
	updatePosition(){
		
		var minimumScale = .00000001;
		if(this.driver.renderer.scale < minimumScale){
			this.driver.renderer.scale = minimumScale;
		}
		
		var scaler = this.driver.renderer.scale*this.driver.renderer.viewPortScaler;
		
		this.lineWidth = this.baseLineWidth*scaler;
		this.width = this.baseWidth*scaler;
		this.height = this.baseHeight*scaler;
		
		if(this.imageHeight !== undefined){
			this.imageHeight = this.baseImageHeight*scaler;
		}
		if(this.imageWidth !== undefined){
			this.imageWidth = this.baseImageWidth*scaler;
		}
	}
	
	draw(){
		
		var renderer = this.driver.renderer;
	
		var doDraw = this.doDraw === undefined || this.doDraw === null || this.doDraw === true;
	
		if(doDraw){
			var x = this._x - this.driver.player.x;
			var y = this._y - this.driver.player.y;
			var angle = this._angle;
			
			if(this.driver.player.firstPerson){
				var firstPersonOrientation = this.calculateFirstPersonOrientation();
				x = firstPersonOrientation.x;
				y = firstPersonOrientation.y;
				angle = firstPersonOrientation.angle;
			}
			
			var fill = this.fillStyle !== undefined && this.fillStyle !== null;
			
			if((this.driver.preRender || this.baseImageHeight === undefined) && (this.image !== undefined && this.image !== null)){
				var imageHeight = this.imageHeight !== undefined ?  this.imageHeight : this.height;
				var imageWidth = this.imageWidth !== undefined ?  this.imageWidth : this.width;
				this.driver.renderer.drawRealImage(true,this.image,x,y,imageWidth,imageHeight,angle,this.shape === 'circle');
			}else if(this.shape === 'circle'){
				this.driver.renderer.drawRealCircle(true,x,y,this.width,null,this.fillStyle,this.lineWidth,this.strokeStyle);
			}else if(this.shape === 'rectangle'){
				this.driver.renderer.drawRealRectangle(true,x,y,this.width,this.height,angle,this.fillStyle,this.lineWidth,this.strokeStyle);
			}
		}
		
	}
	
	
	//UTILS
	
	calculateFirstPersonOrientation(){
		
		var x1 = null;
		var y1 = null;
		var angle1 = null;// Entity view angle from the player's view Y-Axis

		var dx = this._x - this.driver.player.x;
		var dy = this._y - this.driver.player.y;

		var d = Math.sqrt(dx*dx+dy*dy);
		
		var realAngleToEntity = Math.atan2(dx,dy);
		var viewAngleToEntity = realAngleToEntity - this.driver.degreesToRadians(this.driver.player.angle - 90);
		var entityToPlayerXaxisAngle = this.driver.degreesToRadians(90) - viewAngleToEntity;
		
		x1 = Math.cos(entityToPlayerXaxisAngle)*d;
		y1 = Math.sin(entityToPlayerXaxisAngle)*d;
		
		if(this._angle !== undefined && this._angle !== null){
			angle1 = this._angle - (this.driver.player.angle - 90);
		}
		
		return {x:x1,y:y1,angle:angle1};
	}
	
	calculateMovementData(angle, speed, reverse){
		var angleInRadians = this.driver.degreesToRadians(angle);
		var sinOfAngle = Math.sin(angleInRadians);
		var cosOfAngle = Math.cos(angleInRadians);
		
		if(this._spaceMovement){
			var vxTemp = this.vx;
			var vyTemp = this.vy;
			
			if(reverse){
				this.vy -= speed * sinOfAngle;
				this.vx += speed * cosOfAngle;
			}else{
				this.vy += speed * sinOfAngle;
				this.vx -= speed * cosOfAngle;
			}
			
			this.vectorSpeed = Math.sqrt(Math.pow(this.vx,2) + Math.pow(this.vy,2));
			
			if(this.vectorSpeed >= this.driver.speedOfLight){
				this.vx = vxTemp;
				this.vy = vyTemp;
				this.calculateMovementData(angle,speed/8,reverse);
			}
			
		}else{
			speed = speed * this.driver.gameEngine.frimScaler;
			
			if(reverse){
				this._y -= speed * sinOfAngle;
				this._x += speed * cosOfAngle;
			}else{
				this._y += speed * sinOfAngle;
				this._x -= speed * cosOfAngle;
			}
		}
	}
	
	getDistance(entity){	// return distance (number)
		var dx = this._x - entity.x;
		var dy = this._y - entity.y;
		return Math.sqrt(dx*dx+dy*dy);
	}

}

class Player extends Entity{
	constructor(driver,id,x,y,width,height,angle,movementSpeed,img){
		var playerImage = {};
		
		if(img === undefined || img === null){
			playerImage.orientation = 180;
			playerImage.img = new Image();
			playerImage.img.src = 'img/blueships1.png';
		}else{
			playerImage = img;
		}

		//constructor(driver,type,id,x,y,width,height,angle,movementSpeed,shape,fillStyle,lineWidth,strokeStyle,image)
		super(driver,'player',id,x,y,width,height,angle,movementSpeed,'rectangle','red','green',null,playerImage);
		
		this.startAngle = angle;
		this.lastRightTurnTime = null;
		this.lastLeftTurnTime = null;
		this._spaceMovement = true;
		this.vectorSpeed = 0;
		
		this.heightToWidthRatio = height/width;
		
		if(this.vx === undefined || this.vx === null){
			this.vx = 0;
		}
		
		if(this.vy === undefined || this.vy === null){
			this.vy = 0;
		}
		
		this.firstPerson = true;
		this.pressingLeftClick = false;
		this.pressingLeftClickPlusShift = false;
		this.pressingRightClick = false;
		this.pressingDown = false;
		this.pressingUp = false;
		this.pressingLeft = false;
		this.pressingRight = false;
		this.strafingLeft = false;
		this.strafingRight = false;
		this.timeWhenLeftMouseWasPressed = null;
		this.paued = false;
		this.mouseX = null;
		this.mouseY = null;
	}
	
	get spaceMovement(){
		return this._spaceMovement;
	}
	
	set spaceMovement(spaceMovement){
		this._spaceMovement = spaceMovement;
	}
	
	draw(){
		
		var playerAngle = this._angle;
		if(this.firstPerson){
			playerAngle = this.startAngle;
		}
		
		var widthToDraw = this.width;
		var heightToDraw = this.height;
		
		if(widthToDraw < 30*this.driver.renderer.viewPortScaler){
			widthToDraw = 30*this.driver.renderer.viewPortScaler;
			heightToDraw = widthToDraw*this.heightToWidthRatio;
		}
		
		this.driver.renderer.drawRealImage(true,this.image,0,0,widthToDraw,heightToDraw,playerAngle);
		this.driver.renderer.drawRealCircle(true,0,0,1,null,'red');
	}
	
	
	
	updatePosition(){
		super.updatePosition();
		
		// this.movementSpeed = this.baseSpeed*(scale/3);
		// this.movementSpeed = this.driver.round(this.movementSpeed*(1/scale),1);
		// this.movementSpeed = this.driver.round((this.baseSpeed*(scale/3))*(1/scale),1);
		
		var speed = 0;
		
		if(!this.driver.player.spaceMovement){
			this.movementSpeed = this.baseSpeed/(this.driver.renderer.scale*10);
			this.movementSpeed = this.movementSpeed > 0 ? this.movementSpeed : .01;
		}else{
			this.movementSpeed = this.baseSpeed/10;
		}
		
		var strafing = false;
		var movingForwardOrBackWard = false;
		
		if((this.pressingDown && this.pressingUp !== true) || (this.pressingUp && this.pressingDown !== true)){
			movingForwardOrBackWard = true;
		}
		
	
		if(this.pressingRightClick && (this.pressingRight || this.pressingLeft)){
			strafing = true;
			var angleOfMotion = 0;
			if(this.pressingRight && this.pressingLeft !== true){
				angleOfMotion -= 90;
			}else if(this.pressingLeft && this.pressingRight !== true){
				angleOfMotion += 90;
			}
			if(angleOfMotion !== 0){
				speed = this.movementSpeed;
				if(this.pressingDown){
					speed = speed/2;
				}
				if(movingForwardOrBackWard){
					speed = Math.sqrt(Math.pow(speed,2)/2);
				}
				this.calculateMovementData(this._angle - angleOfMotion, speed, false);
			}
		}else if(this.pressingRightClick){
			var difMidAccordingToMouseX = (this.driver.renderer.width/2) - this.mouseX;
			var difMidAccordingToMouseY = (this.driver.renderer.height/2) - this.mouseY;	
			if(this.mouseX >= (this.driver.renderer.width/2) && this.mouseY < (this.driver.renderer.height/2)){
				this._angle = 90 - this.driver.radiansToDegrees(Math.atan(difMidAccordingToMouseX/difMidAccordingToMouseY));
			}else if(this.mouseX >= (this.driver.renderer.width/2) && this.mouseY > (this.driver.renderer.height/2)){
				this._angle = 270 - this.driver.radiansToDegrees(Math.atan(difMidAccordingToMouseX/difMidAccordingToMouseY));
			}else if(this.mouseY >= (this.driver.renderer.height/2) && this.mouseX < (this.driver.renderer.width/2)){
				this._angle = 270 - this.driver.radiansToDegrees(Math.atan(difMidAccordingToMouseX/difMidAccordingToMouseY));
			}
			else if(this.mouseY <= (this.driver.renderer.height/2) && this.mouseX < (this.driver.renderer.width/2)){
				this._angle = 90-this.driver.radiansToDegrees(Math.atan(difMidAccordingToMouseX/difMidAccordingToMouseY));
			}
		
		}else {
			if(this.pressingRight && this.pressingLeft !== true){
				if(this.lastRightTurnTime == null){
					this.lastRightTurnTime = Date.now();
				}
				if(true || Date.now() - this.lastRightTurnTime > 50){
					this._angle += (this.driver.angleChangeSpeed*this.driver.gameEngine.frimScaler);
					this.lastRightTurnTime = Date.now();
				}
			}else if(this.pressingLeft && this.pressingRight !== true){
				if(this.lastLeftTurnTime == null){
					this.lastLeftTurnTime = Date.now();
				}
				if(true || Date.now() - this.lastLeftTurnTime > 50){
					this._angle -= (this.driver.angleChangeSpeed*this.driver.gameEngine.frimScaler);
					this.lastLeftTurnTime = Date.now();
				}
			}
		}
		
		
		if(strafing === false && (this.strafingLeft || this.strafingRight)){
			var angleOfMotion = 0;
			if(this.strafingRight && this.strafingLeft !== true){
				angleOfMotion -= 90;
			}else if(this.strafingLeft && this.strafingRight !== true){
				angleOfMotion += 90;
			}
			if(angleOfMotion !== 0){
				strafing = true;
				speed = this.movementSpeed;
				if(this.pressingDown){
					speed = speed/2;
				}
				if(movingForwardOrBackWard){
					speed = Math.sqrt(Math.pow(speed,2)/2);
				}
				this.calculateMovementData(this._angle - angleOfMotion, speed, false);
			}
		}
		
		
		if(this._angle >= 360){
			this._angle = this._angle - 360;
		}else if(this._angle < 0){
			this._angle = 360 + this._angle;
		}else{
			this._angle = this.driver.round(this._angle,0)
		}

		if(this.pressingDown && this.pressingUp !== true){
			speed = this.movementSpeed/2;
			if(strafing){
				speed = Math.sqrt(Math.pow(speed,2)/2);
			}
			this.calculateMovementData(this._angle, speed, true);
		}else if(this.pressingUp && this.pressingDown !== true){
			speed = this.movementSpeed;
			if(strafing){
				speed = Math.sqrt(Math.pow(speed,2)/2);
			}
			this.calculateMovementData(this._angle, speed, false);
		}
		
		this._y += (this.vy*this.driver.gameEngine.frimScaler);
		this._x += (this.vx*this.driver.gameEngine.frimScaler);
			
		if(!this._spaceMovement){			
			this.vectorSpeed = speed > 0 ? this.driver.round(this.driver.player.movementSpeed) : 0;
		}
	}
}