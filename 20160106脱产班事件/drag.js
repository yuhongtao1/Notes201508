function down(e) {//给它一个事件标识符："selfDargStart";其实就是事件类型
	this.x = this.offsetLeft;
	this.y = this.offsetTop;
	this.mx = e.pageX;
	this.my = e.pageY;
	if(this.setCapture) {
		this.setCapture();
		on(this,"mousemove",move);
		on(this,"mouseup",up);
	}else {
		this.MOVE = move.bind(this);
		this.UP = up.bind(this);
		on(document,"mousemove",this.MOVE);
		on(document,"mouseup",this.UP);
	}
	
	e.preventDefault();
	//通知:就是去指定的数组里按顺序执行相关的方法
	selfRun.call(this,"selfDragStart",e);
}
	
function move(e){//给它一个事件标识符叫"selfDragging"
	this.style.left=this.x+(e.pageX-this.mx)+"px";
	this.style.top=this.y+(e.pageY-this.my)+"px";	
	selfRun.call(this,"selfDragging",e);
}

function up(e){//给它一个事件标识符叫："selfDragEnd"/
	if(this.releaseCapture){
		this.releaseCapture();
		off(this,"mousemove",move);
		off(this,"mousedown",down)
	}else{
	
		off(document,"mousemove",this.MOVE);
		off(document,"mouseup",this.UP);
		}
		selfRun.call(this,"selfDragEnd",e);
		
}
//清除动画防止动画积累
function clearEffect(){
	window.clearTimeout(this.dropTimer);
	window.clearTimeout(this.flyTimer);	
}
//得到fly的速度 这次鼠标位置-上一次鼠标的位置
function getSpeed(e){
	if(!this.prevPosi){
		//没有上一次速度
		this.prevPosi=e.pageX;
	}else{
		//有上次位置
		//让速度等于这一次位置-上一次的位置
		this.speed=e.pageX-this.prevPosi;
		//把现在的位置给上一次的位置
		this.prevPosi=e.pageX;
	}
}

//计算速度的算法：单位时间内运动的距离越长，则飞出去的速度越快
//关键是“单位时间”从那儿来？一个固定长度的时间段
	function fly(){
	//获取边界值
		var maxRight=document.documentElement.clientWidth-this.offsetWidth;
		//如果当前的位置大于了边界值
		if(this.offsetLeft+this.speed>=maxRight){
			//就让它的位置变为边界值
			this.style.left=maxRight+"px";
			this.speed*=-1;//让它回来
		}else if(this.offsetLeft+this.speed<=0){
			this.style.left=0;
			this.speed*=-1;
		}else{
			//当前左坐标等于当前位置加速度
			this.style.left=this.offsetLeft+this.speed+"px";
		}
		//让速度衰减不然会成为永动机
		this.speed*=.97;
		//停止的条件 如果速度小于0.5让动画停止
		if(Math.abs(this.speed)>=0.5){
			//实现动画用定时器的方法中this都是指向windon所以用processThis
			this.flyTimer=window.setTimeout(processThis(this,fly),15);
		}
		
	}


function drop(){
	//用一个标识flag来判断停止的条件
	if(!this.dropSpeed){
		//如果没有速度就给它一个速度
		this.dropSpeed=9;
		this.flag=0
	}else{
		//如果有速度每次加9
		this.dropSpeed+=9;
	}
	//让速度衰减一点
	this.dropSpeed*=.97;
	//判断边界值
	var maxBottom=document.documentElement.clientHeight-this.offsetHeight;
	if(this.offsetTop+this.dropSpeed>=maxBottom){
		//过了边界就让它回来并且挺在边界的位置
		this.style.top=maxBottom+"px";
		this.dropSpeed*=-1;
		this.flag++;
	}else{
		this.style.top=this.offsetTop+this.dropSpeed+"px";
		this.flag=0;
	}
	if(this.flag<2){
		//用定时器驱动
		this.dropTimer=window.setTimeout(processThis(this,drop),15);
	}
	
}
