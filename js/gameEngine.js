"use strict";

class GameEngine {
  constructor(driver, targetTickDelta) {
	  this.driver = driver;
	  this.renderer = driver.renderer;
	  this.window = driver.renderer.window;
	  this.targetTickDelta = targetTickDelta;
	  this.window.requestAnimationFrame = this.window.requestAnimationFrame || function(update){this.window.setTimeout(this.update,16)};
	  this.frameCount=0;
	  this._speedSnapshot = 0;
	  this.lastTickTime = null;
	  this._frimScaler = 0;
	  this.fps = null;
	  this.lastDistanceTimeSnapshot = this.driver.gameStartTime;
	  this.lastX = 0;
	  this.lastY = 0;
  }
  
  get speedSnapshot(){
	  return this._speedSnapshot;
  }
  
  get frimScaler(){
	  return this._frimScaler;
  }
  
  start(){
	  this.frame();
  }
  
  render(){
	  this.driver.render();
  }
  
  
  update(){
		var now = Date.now();
		var tickDelta = (now - (this.lastTickTime == null ? now : this.lastTickTime)); // ms since last frame
		
		
		this._frimScaler = tickDelta/this.targetTickDelta;
		
		if(tickDelta != 0 && (this.fps === null || this.frameCount%12 === 0)){
			this.fps = 1000/tickDelta;
			var distanceTravelled = Math.sqrt(Math.pow(this.lastX-this.driver.player.x,2)+Math.pow(this.lastY-this.driver.player.y,2));
			this._speedSnapshot = (now-this.lastDistanceTimeSnapshot) > 0 ? (1000*distanceTravelled)/(now-this.lastDistanceTimeSnapshot) : 0;
			this.lastX = this.driver.player.x;
			this.lastY = this.driver.player.y;
			this.lastDistanceTimeSnapshot = now;
			
		}
		this.lastTickTime = now;				
		
		this.driver.update();
	}
  
  frame() {
	  this.renderer.ctx.clearRect(0,0,this.renderer.width,this.renderer.height);
	  this.renderer.drawRectangle(true, 0, 0, this.renderer.width, this.renderer.height, "black");
	  this.update();
	  this.render();
	  
	  var _this = this;
	  this.frameCount++;
	  this.window.requestAnimationFrame(function() { _this.frame(); });
  }

}