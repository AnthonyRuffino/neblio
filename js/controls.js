"use strict";
class ControlsBinder{
	
	static bind(driver, document){
		document.onmousedown = function(mouse){
			driver.controls.onmousedown(mouse);
		}

		document.onmouseup = function(mouse){
		   driver.controls.onmouseup(mouse);
		}

		document.onclick = function(mouse){
			driver.controls.onclick(mouse);
		}

		document.ondblclick = function(mouse){
			driver.controls.ondblclick(mouse);
		}

		document.oncontextmenu = function(mouse){
			driver.controls.oncontextmenu(mouse);
		}

		document.onmousemove = function(mouse){
			driver.controls.onmousemove(mouse);
		}

		document.onkeydown = function(event){
			//window.console.log(event.keyCode);
			driver.controls.onkeydown(event);
		}

		document.onkeyup = function(event){
			driver.controls.onkeyup(event);
		}

		document.onwheel = function(mouse){
			driver.controls.onwheel(mouse);
		}
	}
}



class ScaledControl{
	constructor(driver, id,doClick,x,y,width,height,image,doHighlight,highlightColor){
		this.driver = driver;
		this.id=id;
		this.doClick=doClick;
		this.x=x;
		this.y=y;
		this.width=width;
		this.height=height===undefined || height===null ? width : height;
		this.image=image;
		this.doHighlight=doHighlight;
		this.isCircle=height===undefined || height===null;
		this.highlightColor = highlightColor;
	}
	
	draw(){
		if(this.isCircle){
			var bounds = this.getBounds();
			this.driver.renderer.drawImage(true,this.image,bounds.centerX,bounds.centerY,bounds.smallerDimention*this.width,bounds.smallerDimention*this.width,null,true);
		}else{
			this.driver.renderer.drawImage(true,this.image,this.driver.renderer.width*this.x,this.driver.renderer.height*this.y,this.driver.renderer.width*this.width,this.driver.renderer.height*this.height,null,false);
		}
		
		if(this.doHighlight !== undefined && this.doHighlight !== null && this.doHighlight() === true){
			this.highlightColor = this.highlightColor===undefined || this.highlightColor===null ? 'red' : this.highlightColor;
			
			if(this.isCircle){
				var bounds = this.getBounds();
				this.driver.renderer.drawCircle(true,bounds.centerX,bounds.centerY,bounds.smallerDimention*(this.width/2),null,null,3*this.driver.renderer.viewPortScaler, this.highlightColor);
			}else{
				this.driver.renderer.drawRectangle(true,this.driver.renderer.width*this.x,this.driver.renderer.height*this.y,this.driver.renderer.width*this.width,this.driver.renderer.height*this.height,null,null,3*this.driver.renderer.viewPortScaler, this.highlightColor);
			}
		}
	}
	
	clicked(mouseX,mouseY){
		var bounds = this.getBounds();
		var isClicked = false;
		if(this.isCircle){
			var dx = bounds.centerX - mouseX;
			var dy = bounds.centerY - mouseY;
			var distance =Math.sqrt(dx*dx+dy*dy);
			isClicked = distance <= bounds.smallerDimention*(this.width/2);
		}else{
			isClicked = mouseX>=bounds.leftBound && mouseX<=bounds.rightBound&&mouseY>=bounds.upperBound&&mouseY<=bounds.lowerBound;
		}
		
		return isClicked;
	}
	
	getBounds(){
		var bounds = {};
		bounds.smallerDimention = this.driver.renderer.height < this.driver.renderer.width ? this.driver.renderer.height : this.driver.renderer.width;
		bounds.leftBound = this.driver.renderer.width*this.x;
		bounds.rightBound = bounds.leftBound+this.driver.renderer.width*this.width;
		bounds.upperBound = this.driver.renderer.height*this.y;
		bounds.lowerBound = bounds.upperBound+this.driver.renderer.height*this.height;
		bounds.centerX=this.driver.renderer.width*this.x+((this.driver.renderer.width*this.width)/2);
		if(this.isCircle){
			bounds.centerY=this.driver.renderer.height*this.y+((bounds.smallerDimention*this.width)/2);
		}else{
			bounds.centerY=this.driver.renderer.height*this.y+((this.driver.renderer.height*this.height)/2);
		}
		
		return bounds;
	}
}
