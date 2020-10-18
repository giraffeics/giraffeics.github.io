// clone any object
function clone(obj)
{
	return JSON.parse(JSON.stringify(obj));
}

// replace a key name in an object, return true if it existed
function replaceKey(obj, oldKey, newKey)
{
	if(!obj.hasOwnProperty(oldKey))
	{
		obj[newKey] = null;
		return false;
	}
	else
	{
		var value = obj[oldKey];
		delete obj[oldKey];
		obj[newKey] = value;
		return true;
	}
}