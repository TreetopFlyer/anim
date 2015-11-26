var Seeker = {};
Seeker.Instances = [];
Seeker.Roots = [];
Seeker.Style = {};
Seeker.Style.Linear = function(inContext)
{
	if(inContext.Value.Dist >= 0)
	{
		if(inContext.Value.Dist > inContext.Value.Speed)
		{
			inContext.Value.Actual += inContext.Value.Speed;
		}
		else
		{
			inContext.Value.Actual = inContext.Value.Goal;
		}
	}
	else
	{
		if(inContext.Value.Dist < -inContext.Value.Speed)
		{
			inContext.Value.Actual -= inContext.Value.Speed;
		}
		else
		{
			inContext.Value.Actual = inContext.Value.Goal;
		}
	}
}
Seeker.Style.Asymptotic = function(inContext)
{
	inContext.Value.Actual += inContext.Value.Dist/inContext.Value.Speed;
};
Seeker.Style.Spring = function(inContext)
{
	inContext.Value.Delta = inContext.Value.Delta*inContext.Value.Speed + inContext.Value.Dist*inContext.Value.Friction;
	inContext.Value.Actual += inContext.Value.Delta;
};
Seeker.Connect = function(inChild, inParent)
{
	inChild.Parent = inParent;
	inParent.Children.push(inChild);
};
Seeker.Create = function()
{
	var obj = {};

	obj.Update = function()
	{
		var i;
	
		obj.Value.Dist = obj.Value.Goal - obj.Value.Actual;
		if(Math.abs(obj.Value.Dist) >= obj.Value.Threshold)
		{
			
			obj.Style(obj);
			obj.UserUpdate(obj);
		}
		
		for(i=0; i<obj.Children.length; i++)
		{
			obj.Children[i].Value.Goal = obj.Value.Actual;
			obj.Children[i].Update();
		}
	};
	obj.UserUpdate = function(inContext){};
	obj.Style = Seeker.Style.Asymptotic;
	
	obj.Parent = false;
	obj.Children = new Array();
	
	var defaultValue = 0;
	if(arguments.length == 1)
		defaultValue = arguments[0];
	
	obj.Value = {};	
	obj.Value.Actual = defaultValue;
	obj.Value.Goal = defaultValue;	
	obj.Value.Dist = 0;	
	obj.Value.Delta = 0;
	obj.Value.Friction = 0.1;
	obj.Value.Speed = 5;
	obj.Value.Threshold = 0.1;
	
	Seeker.Instances.push(obj);
	
	return obj;
	
};
Seeker.UpdateAll = function()
{
	var i;
	for(i=0; i<Seeker.Roots.length; i++)
		Seeker.Roots[i].Update();
};
Seeker.Prune = function()
{
	// this method removes dependent Seekers from the main update routine
	Seeker.Roots = new Array();
	var i;
	for(i=0; i<Seeker.Instances.length; i++)
	{
		if(!Seeker.Instances[i].Parent)
			Seeker.Roots.push(Seeker.Instances[i]);
	};
};
Seeker.DOM = function(inJQ)
{
	var obj = {};
	
	obj.JQ = inJQ;
	
	if(obj.JQ.css("position") == "static")
		obj.JQ.css({position:"relative"});
	
	obj.Width = Seeker.Create(obj.JQ.width());
	obj.Height = Seeker.Create(obj.JQ.height());
	obj.X = Seeker.Create(0);
	obj.Y = Seeker.Create(0);
	obj.Opacity = Seeker.Create(1);
	
	obj.Update = function()
	{
		obj.JQ.css({
			width:obj.Width.Value.Actual+"px",
			height:obj.Height.Value.Actual+"px",
			left:obj.X.Value.Actual+"px",
			top:obj.Y.Value.Actual+"px",
			opacity:obj.Opacity.Value.Actual
		});
	};
	
	obj.Width.UserUpdate = obj.Update;
	obj.Height.UserUpdate = obj.Update;
	obj.X.UserUpdate = obj.Update;
	obj.Y.UserUpdate = obj.Update;
	obj.Opacity.UserUpdate = obj.Update;
	
	return obj;
};
