"use strict";
class UniverseViewControls{
	constructor(driver){
		this.driver = driver;
	}
	
	onmousedown(mouse){
		var mouseX = mouse.x - this.driver.renderer.horizontalOffset;
		var mouseY = mouse.y - this.driver.renderer.verticalOffset;
		if(mouse.which === 1){
			this.driver.player.pressingLeftClick = true;
			this.driver.player.timeWhenLeftMouseWasPressed = Date.now();
			if(mouse.shiftKey){
				this.driver.player.pressingLeftClickPlusShift = true;
			}
	   }else if(mouse.which === 3){
			this.driver.player.pressingRightClick = true;
	   }
		this.setPlayerMouse(mouseX, mouseY);
	}
	
	onmouseup(mouse){
	   if(mouse.which === 1){
			this.driver.player.pressingLeftClick = false;
			this.driver.player.pressingLeftClickPlusShift = false;
	   }else if(mouse.which === 3){
			this.driver.player.pressingRightClick = false;
	   }
	}
	
	onclick(mouse){
		var msHeld = (Date.now() - this.driver.player.timeWhenLeftMouseWasPressed);
		if(msHeld < 1000){
		
			var mouseX = mouse.x - this.driver.renderer.horizontalOffset;
			var mouseY = mouse.y - this.driver.renderer.verticalOffset;
			
			var controlClicked = false;
			
			if(this.driver.clickControls !== undefined && this.driver.clickControls != null){
				for (var i = 0; i < this.driver.clickControls.length; i++) {
					controlClicked = this.driver.clickControls[i].clicked(mouseX,mouseY);
					
					if(controlClicked){
						this.driver.clickControls[i].doClick();
						break;
					}
				}
			}
			
			if(controlClicked === false){
				this.setPlayerMouse(mouseX, mouseY);
				window.console.log(this.driver.round(this.driver.player.mouseX), this.driver.round(this.driver.player.mouseY));
			}
			
		}else{
			//window.console.log('click did not count', msHeld);
		}
		this.driver.player.timeWhenLeftMouseWasPressed = null;
	}
	
	ondblclick(mouse){

	}
	
	oncontextmenu(mouse){
		mouse.preventDefault();
	}
	
	onmousemove(mouse){
		this.driver.player.mouseX = mouse.x - this.driver.player.horizontalOffset;
		this.driver.player.mouseY = mouse.y - this.driver.player.verticalOffset;
	}
	
	onkeydown(event){
		window.console.log(event.keyCode);
		if(event.keyCode === 68)	//d
			this.driver.player.pressingRight = true;
		else if(event.keyCode === 83)	//s
			this.driver.player.pressingDown = true;
		else if(event.keyCode === 65) //a
			this.driver.player.pressingLeft = true;
		else if(event.keyCode === 87) // w
			this.driver.player.pressingUp = true;
		else if(event.keyCode === 81) // q
			this.driver.player.strafingLeft = true;
		else if(event.keyCode === 69) // e
			this.driver.player.strafingRight = true;
		else if(event.keyCode === 80) //p
			this.driver.player.paused = !this.driver.player.paused;
		else if(event.keyCode === 70){ //f
			this.driver.player.firstPerson = !this.driver.player.firstPerson;
		}else if(event.keyCode === 88){ //x
			if(this.driver.previousScale !== undefined && this.driver.previousScale !== null){
				this.driver.renderer.scale=this.driver.previousScale;
				this.driver.previousScale = null;
			}else{
				this.driver.previousScale=this.driver.renderer.scale;
				this.driver.renderer.scale=this.driver.renderer.startScale;
			}
			
		}else if(event.keyCode === 74){ //j
			this.driver.player.x=0;
			this.driver.player.y=0;
		}else if(event.keyCode === 76){ //l
			if(this.driver.player.spaceMovement){
				this.driver.doWarpClick();
			}else{
				this.driver.doThrusterClick();
			}
		} else if(event.keyCode === 77){ //m
			this.driver.preRender = !this.driver.preRender;
		} else if(event.keyCode === 107){ //+
			var scaler = .1;
			var scale = this.driver.renderer.scale;
			if(scale < .0000001){
				scaler = .00000001;
			}else if(scale < .000001){
				scaler = .0000001;
			}else if(scale < .00001){
				scaler = .000001;
			}else if(scale < .0001){
				scaler = .00001;
			}else if(scale < .001){
				scaler = .0001;
			}else if(scale < .01){
				scaler = .001;
			}else if(scale < .1){
				scaler = .01;
			}
			this.driver.renderer.scale = scale + scaler;
			
			var minimumScale = .00000001;
			if(this.driver.renderer.scale < minimumScale){
				this.driver.renderer.scale = minimumScale;
			}
		} else if(event.keyCode === 109){ //-
			var scaler = .1;
			var scale = this.driver.renderer.scale;
			if(scale <= .0000001){
				scaler = .00000001;
			}else if(scale <= .000001){
				scaler = .0000001;
			}else if(scale <= .00001){
				scaler = .000001;
			}else if(scale <= .0001){
				scaler = .00001;
			}else if(scale <= .001){
				scaler = .0001;
			}else if(scale <= .01){
				scaler = .001;
			}else if(scale <= .1){
				scaler = .01;
			}
			this.driver.renderer.scale = scale - scaler;
			
			var minimumScale = .00000001;
			if(this.driver.renderer.scale < minimumScale){
				this.driver.renderer.scale = minimumScale;
			}
		}
	}
	
	onkeyup(event){
		if(event.keyCode === 68)	//d
			this.driver.player.pressingRight = false;
		else if(event.keyCode === 83)	//s
			this.driver.player.pressingDown = false;
		else if(event.keyCode === 65) //a
			this.driver.player.pressingLeft = false;
		else if(event.keyCode === 87) // w
			this.driver.player.pressingUp = false;
		else if(event.keyCode === 81) // q
			this.driver.player.strafingLeft = false;
		else if(event.keyCode === 69) // e
			this.driver.player.strafingRight = false;
	}
	
	onwheel(mouse){
		
		mouse.preventDefault();

		this.driver.previousScale = null;
		var zoomingIn = (mouse.shiftKey !== true && mouse.deltaY<0) || (mouse.shiftKey && mouse.deltaX<0);
		
		var sampleValue = mouse.shiftKey !== true ? this.driver.renderer.scale : this.driver.player.baseSpeed;

		var scaler = .1;
		
		if(zoomingIn){
			if(sampleValue < .0000001){
				scaler = .00000001;
			}else if(sampleValue < .000001){
				scaler = .0000001;
			}else if(sampleValue < .00001){
				scaler = .000001;
			}else if(sampleValue < .0001){
				scaler = .00001;
			}else if(sampleValue < .001){
				scaler = .0001;
			}else if(sampleValue < .01){
				scaler = .001;
			}else if(sampleValue < .1){
				scaler = .01;
			}
		}else{
			if(sampleValue <= .0000001){
				scaler = .00000001;
			}else if(sampleValue <= .000001){
				scaler = .0000001;
			}else if(sampleValue <= .00001){
				scaler = .000001;
			}else if(sampleValue <= .0001){
				scaler = .00001;
			}else if(sampleValue <= .001){
				scaler = .0001;
			}else if(sampleValue <= .01){
				scaler = .001;
			}else if(sampleValue <= .1){
				scaler = .01;
			}
		}
		
		
		if(mouse.shiftKey){
			scaler = scaler*10*frimScaler;
			if(mouse.deltaX<0){
				this.driver.player.baseSpeed += scaler;
			}else if(mouse.deltaX>0){
				this.driver.player.baseSpeed -= scaler;
			}
			
			if(this.driver.player.baseSpeed < 1){
				this.driver.player.baseSpeed = 1;
			}
			
			this.driver.player.baseSpeed = this.driver.round(this.driver.player.baseSpeed,1);
		}else{
			if(mouse.deltaY<0){
				this.driver.renderer.scale += scaler;
			}else if(mouse.deltaY>0){
				this.driver.renderer.scale -= scaler;
			}
			
			var minimumScale = .00000001;
			if(this.driver.renderer.scale < minimumScale){
				this.driver.renderer.scale = minimumScale;
			}
			
			this.driver.renderer.scale = this.driver.round(this.driver.renderer.scale,8);
		}
	}
	
	
	//UTILITIES
	setPlayerMouse(mouseX, mouseY){
		var fixedViewPlayerMouseX = ((mouseX-this.driver.renderer.centerX)/this.driver.renderer.scale/this.driver.renderer.viewPortScaler + this.driver.player.x);
		var fixedViewPlayerMouseY = ((-mouseY+this.driver.renderer.centerY)/this.driver.renderer.scale/this.driver.renderer.viewPortScaler + this.driver.player.y);
		
		if(this.driver.player.firstPerson){
			
			var dx = fixedViewPlayerMouseX - this.driver.player.x;
			var dy = fixedViewPlayerMouseY - this.driver.player.y;
			var d = Math.sqrt(dx*dx+dy*dy);
			window.console.log('distance', d);
			
			var viewAngleToEntity = Math.atan2(mouseX-this.driver.renderer.centerX,(-mouseY+this.driver.renderer.centerY));
			
			//window.console.log('viewAngleToEntity', radiansToDegrees(viewAngleToEntity), 'this.driver.player.angle', this.driver.player.angle);
			
			var fixedViewMouseAngle = ((Math.PI / 180)*(this.driver.player.angle-90)) + viewAngleToEntity;
			
			
			this.driver.player.mouseX = (d * Math.sin(fixedViewMouseAngle) + (this.driver.player.x));
			this.driver.player.mouseY = (d * Math.cos(fixedViewMouseAngle) + (this.driver.player.y));
			
			
		}else{
			this.driver.player.mouseX = fixedViewPlayerMouseX;
			this.driver.player.mouseY = fixedViewPlayerMouseY;
		}
	}
}


