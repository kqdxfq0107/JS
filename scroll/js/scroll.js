var out=document.getElementById("out");
var text=document.getElementById("text");
var content=document.getElementById("content");
var right=document.getElementById("right");
var up=document.getElementById("up");
var down=document.getElementById("down");
var slider=document.getElementById("slider");
//计算滑块定位top的最小值和最大值
var minTop=up.offsetHeight;
var maxTop=right.clientHeight-slider.offsetHeight-down.offsetHeight;


//拖拽滑块，内容跟着滚动
slider.onmousedown=function(ev){
	slider.style.background='dodgerblue';
	var disY=ev.clientY-slider.offsetTop;
	
	document.onmousemove=function(ev){
		var t=ev.clientY-disY;
		scale(t);
	}
	document.onmouseup=function(){
		slider.style.background='lightskyblue';
		document.onmousemove=null;
	}
	//阻止事件冒泡，使得按下right中的slider时不执行right.onmousedown的事件
	ev.cancelBubble=true;			
	return false;
}


//滚动滚轮，内容以及滑块跟着滚动
out.onmousewheel=function(ev){
	var t=slider.offsetTop;
	var step=8;
	t=ev.wheelDelta<0?t+step:t-step;
	scale(t);
}


//滑块区域被按下，滑块的中心滚动到鼠标按下的位置
right.onmousedown=function(ev){
	var timer;
	var step=8;
	timer=setInterval(function(){
		var t=slider.offsetTop;
		var aimTop=ev.clientY-right.offsetTop-0.5*slider.offsetHeight;		//slider.top的目标终点
		
		if(t<aimTop){
			t+=step;
			t=t>aimTop?aimTop:t;
		}else if(t>aimTop){
			t-=step;
			t=t<aimTop?aimTop:t;
		}else{
			clearInterval(timer);
		}
		scale(t);
	},16);
	
	right.onmouseup=function(){
		clearInterval(timer);
	}
	return false;
}


//给上下箭头添加mousedown事件
up.onmousedown=function(ev){
	arrow(up,ev);
	return false;
}
down.onmousedown=function(ev){
	arrow(down,ev);
	return false;
}

function arrow(obj,event){
	obj.style.background='orangered';
	var timer;
	var step=2;
	
	timer=setInterval(function(){
		var t=slider.offsetTop;
		t=obj==up?t-step:t+step;
		scale(t);
	},32);

	//按住上下箭头后若鼠标移出obj则停止移动，鼠标再次移入obj时再次移动			
	obj.onmouseleave=function(){
		clearInterval(timer);
	}
	obj.onmouseenter=function(){
		timer=setInterval(function(){
			var t=slider.offsetTop;
			t=obj==up?t-step:t+step;
			scale(t);
		},32);
	}

	document.onmouseup=function(){
		clearInterval(timer);
		obj.onmouseenter=null;
		obj.style.background='indianred';
	}
	event.cancelBubble=true;		//点击上下箭头时需要阻止事件冒泡
}


function scale(t){
		t=t>maxTop?maxTop:t;
		t=t<minTop?minTop:t;
		
		//算scale时一定要减去up.offsetHeight!!!
		var scale=(t-up.offsetHeight)/(maxTop-up.offsetHeight);	
		content.style.top=scale*(text.clientHeight-content.offsetHeight)+'px';
		slider.style.top=t+'px';
}