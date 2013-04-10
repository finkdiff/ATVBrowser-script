if(!document.getElementByTagName)
{
	atv.Document.prototype.getElementById = function(id)
	{
		var elements = this.evaluateXPath("//*[@id='" + id + "']", this);
		return(elements && elements.length > 0) ? elements[0] : undefined;
	};

	atv.Element.prototype.getElementsByTagName = function(name)
	{
		return this.ownerDocument.evaluateXPath("descendant::" + name, this);
	};

	atv.Element.prototype.getElementByTagName = function(name)
	{
		var elements = this.getElementsByTagName(name);
		return(elements && elements.length > 0) ? elements[0] : undefined;
	};
}

function loadDoc(doc, event)
{
	if(event) event.success(doc);
	else atv.loadXML(doc);
}

function loadPage(url, event)
{
	var req = new XMLHttpRequest();
	req.onreadystatechange = function()
	{
		try
		{
			if(req.readyState == 4)
			{
				loadDoc((req.status == 200) ? ((url.indexOf('.xml') != -1) ? req.responseXML : makeMedia(url, req.responseText)) : makeError('状态错误：' + req.status, url), event);
			}
		}
		catch(e)
		{
			req.abort();
			loadDoc(makeError(e, url), event);
		}
	}
	req.open('GET', url, true);
	req.send();
}

function loadItem(event)
{
	var id = event.navigationItemId;
	var item = document.getElementById(id);
	var url = item.getElementByTagName('url').textContent;
	loadPage(url, event);
}