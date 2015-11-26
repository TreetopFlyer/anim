var Time = {};
Time.Create = function(inInterval)
{
	var obj = {};
	obj.Interval = inInterval;
	obj.Timer = false;
	obj.Jobs = [];
	obj.Update = function()
	{
		var i, current;
		for(i=0; i<obj.Jobs.length; i++)
		{
			current = obj.Jobs[i];
			if(current.Job(current.Time) == false)
			{
				obj.Jobs.splice(i, 1);
				i--;
			}
			current.Time++;
		}
		if(obj.Jobs.length == 0)
			clearInterval(obj.Timer);
	};
	obj.Add = function(inJob)
	{
		obj.Jobs.push({Job:inJob, Time:0});
		if(!obj.Timer)
			obj.Timer = setInterval(obj.Update, obj.Interval);
	};
	return obj;
};
Time.Default = Time.Create(10);
