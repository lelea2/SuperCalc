	var arrArea = ["Square", "Rectangle", "Paralellogram", "Trapezoid", "Circle", "Ellipse", "Triangle"];
	arrArea.sort();
	var fArea = new Array();
	fArea['Square'] = "side^2";
	fArea['Rectangle'] = "width*height";
	fArea['Trapezoid'] = "1/2*height*(base1+base2)";
	fArea['Paralellogram'] = "base*height";
	fArea['Circle'] = "pi*radius^2";
	fArea['Ellipse'] = "pi*radius1*radius2";
	fArea['Triangle'] = "1/2*base*height";

	var arrVolume = ["Rect.Prism", "Cylinder", "Cone", "Pyramid", "Sphere", "Ellipsoid"];
	arrVolume.sort();
	var fVolume = new Array();
	fVolume["Rect.Prism"] = "width*length*height"; 
	fVolume["Cylinder"] = "pi*radius^2*height";
	fVolume["Cone"] = "1/3*pi*radius^2*height";
	fVolume["Sphere"] = "4/3*pi*radius^3";
	fVolume["Ellipsoid"] = "4/3*pi *radius1*radius2*radius3";
	fVolume["Pyramid"] = "1/3*base*height";
	
	var arrProb = ["Permutation", "Combination", "Binomial", "Geometric"]; //"Mean","Pop.Std", "Sam.Std", 
	arrProb.sort();
	var fProb = new Array();
	fProb["Permutation"] = "n!/(n-r)!";
	fProb["Combination"] = "n!/(r!*(n-r)!)";
	//zProb["Mean"] = "Mean(data)"; 
	//zProb["Pop.Std"] = "Sn($data)";
	//zProb["Sam.Std"] = "Sn_1($data)";
	fProb["Binomial"] = "n!/(x!*(n-x)!)*p^x*(1-p)^(n-x)";
	fProb["Geometric"] = "p*(1-p)^(x-1)";
	
	var arrFin = ["pmt","pv","fv","ppv","ffv"];
	arrFin.sort();
	var fFin = new Array();
	fFin["pmt"] = "loan* (interest / (1-((1+interest)^(-periods))))"; //new formula //fixed already
	fFin["pv"] = "pmt * ((1 - (( 1+rate ) ^ ( -periods ))) / rate)";
	fFin["fv"] = "pmt * (((( 1+rate) ^ periods) - 1) / rate)";
	fFin["ppv"] = "pmt * ((1 -((1 + rate) ^(-periods))) / rate) + balloon / ((1 + rate) ^ periods)";
	fFin["ffv"] = "pmt * (((1+rate) ^ periods) / rate ) - 1 + down * (( 1 + rate) ^ periods)";
	var dFin = new Array();
	dFin["pmt"] = "Mortgage Payment";
	dFin["pv"] = "Present Value";
	dFin["fv"] = "Future Value";
	dFin["ffv"] = "Future value with down payment";
	dFin["ppv"] = "Present value with balloon payment";
	
	displayDefault("area",arrArea,'#arealist');
	displayDefault("volume",arrVolume,'#volumelist');
	displayDefault("prob", arrProb, '#problist');
	displayDefault("finance",arrFin, '#finlist');
	function displayDefault(option,arr,list)
	{
		var prefix = option;
		for(i=0; i<arr.length; i++)
		{
			$(list).append('<li><table width="100%"><tr><td style="width:5%;font-weight:bold; color:white">'+(i+1)+'. '+'</td>'+
							'<td style="width: 75%;font-weight:bold; color:white">'+arr[i]+'</td>'+
							'<td width= "10%; text-align:center;padding:5px"><a href="#'+prefix+'" style="text-decoration:none">'+
							'<input type="image" name="'+prefix+'_'+arr[i]+'" style="width:40px;height:40px" '+
							'src="image_view.jpg" title="view" onClick="viewFormula($(this));return false;" value="View"/>'+
							'</a></td>'+'<td width="10%; text-align:center"><a href="#cal" style="text-decoration:none">'+
							'<input type="image" id="'+prefix+'_'+arr[i]+'" style="width:40px;height:40px" ' +
							'src="image_calculator.jpg" title="calculate" ontouchend="formCalc($(this));return false;" value="Calc"/></a></td>'+
							'<td width= "10%; text-align:center;padding:5px"><a href="#'+prefix+'" style="text-decoration:none">'+
							'<input type="image" name="'+prefix+'_'+arr[i]+'" style="width:40px;height:40px" '+
							'src="image_question.jpg" title="view" onClick="desFormula($(this));return false;" value="Des"/></a></td></tr></table></li>');
		}
	}
	
	
	var arrName = sortingInfo(); // array contains the name of all formulas available; arrName: global variable
	displayList(arrName);
	var editName = "";// global variable for edit
	var editFormula =""; //--
	var embedded_func = ""; // for embedded function to be calculated
	function sortingInfo() //This function returns the array list of available formula names
	{
		var arrName = new Array(); 
		var formnames = iappthat.getData("namelist"); // string of all names of formula
		
		if (formnames != "")
		{
			arrName = (String(formnames)).split(",");
			return arrName.sort();
		}
		return arrName;
	}
	function displayList(arr)
	{
		for(i=0; i<arr.length; i++)
			$('#myfunclist').append('<li id="li'+i+'"><table><tr id="row'+i+'"><td style="font-weight:bold; color:white; padding:5px">'+(i+1)+'. '+'</td>'+
						'<td style="font-weight:bold; color:white"><a href="#build" id="'+i+'" ontouchend="showTool($(this));">'+arr[i]+'</a></td></tr></table>'+
						'<table id="tb'+i+'" style="float:right"><tr>'+
						'<td style="padding:2px"><a href="#build" style="text-decoration:none">'+
						'<input type="image" name="func_'+arr[i]+'" style="height:40px;width:40px;float:right" onClick="viewFormula($(this));" value="View" '+
						'src="image_view.jpg"/>'+
						'</a></td><td style="padding:2px"><a href="#cal" style="text-decoration:none">'+
						'<input type="image" id="func_'+arr[i]+'" style="height:40px;width:40px;float:right" ontouchend="formCalc($(this));return false;" '+
						'value="Calc" src="image_calculator.jpg"/></a>'+
						'</td><td style="padding:2px"><a href="#newform" style="text-decoration:none">'+
						'<input type="image" name="'+arr[i]+'" style="float:right;width:40px;height:40px" '+
						'src="image_edit.jpg" ontouchend="editData($(this));return false;" value="Edit"></a>'+
						'</td><td style="padding:2px"><input type="image" id="'+arr[i]+'" style="float:right;width:40px;height:40px" '+
						'src="image_delete.jpeg" ontouchend="deleteData($(this));return false;" value="Del">'+
						'</td><td style="padding:2px"><a href="#build" style="text-decoration:none">'+
						'<input type="image" name="func_'+arr[i]+'" style="height:40px;width:40px;float:right" onClick="desFormula($(this));" value="Des" '+
						'src="image_question.jpg"/></a></td></tr></table></li>');
		for(j=0; j<arr.length; j++)
			$('#tb'+j).hide();
	}
	
	function desFormula (key)
	{
		var keyname = (key.attr('name')).split("_");
		var des = iappthat.getData('$'+keyname[1]);
		if(keyname[0] == "finance")
			iappthat.msgBox("iAppCalc", dFin[keyname[1]]);
		else if (keyname[0] == "func") // From My Functions Library
		{
			if (des != '')
				iappthat.msgBox ('iAppCalc',des);
			else
				iappthat.msgBox ('iAppCalc','n/a');
		}
		else
			iappthat.msgBox ("iAppCalc", "n/a");
	}
	function showTool(key)
	{
		if($('#tb'+key.attr('id')).is(':visible'))
			$('#tb'+key.attr('id')).hide();
		else
			$('#tb'+key.attr('id')).show();
		for (i=0; i<arrName.length;i++)
			if(i!=key.attr('id'))
				$('#tb'+i).hide();
	}
	
	function saveData(option)
	{
		var newname = jQuery.trim($('#name').val());
		var newformula = $('#formula').val();
		var newdes = $('#description').val();
		if (newname.length == 0 || newformula.length == 0)
			iappthat.showMeMessage("iAppCalc","Name and formula fields should not be empty.");
		else
		{
			if (iappthat.getData(newname) !='') // Can't be stored formula with the same exitsing name
				iappthat.showMeMessage("iAppCalc","Formula with this name already exist.");	
			else
			{
				if($('#error').is(':visible'))	
					iappthat.showMeMessage("iAppCalc","Name should not contain special character.");
				else
				{
					if (option == 2) // for saving editData
					{
						iappthat.deleteData(editName);
						iappthat.deleteData('$'+editName);
						var k = -1;
						for (i =0; i<arrName.length; i++)
						{
							if(arrName[i] == editName)
							{
								k=i;
								i = arrName.length;
							}
						}
						arrName.splice(k,1);
						$('#row'+(k+1)).remove(); //remove entries in table
						editName = "";
						editFormula = "";
					}
					removeDisplay(); //remove the exisiting displaying list
					arrName[arrName.length] = newname; // add new name into array
					arrName = arrName.sort(); //sorting array again in alphabet order
					iappthat.saveData("namelist", arrName.toString());
					iappthat.saveData(newname, newformula); // save new formula with new name
					iappthat.saveData('$'+newname, newdes);
					displayList(arrName);
					iappthat.msgBox('iAppCalc',newname+ ' is saved!');
					jQT.goTo('#build');
				}
			}
		}
	}
	function removeDisplay()
	{
		for(i=0; i<arrName.length; i++)
			$('#li'+i).remove();
	}
	
	
	function editData(key)
	{
		$('#save').hide();
		$('#saveEdit').show();
		$('#error').hide();
		$('#name').attr('value', key.attr('name'));
		$('#description').attr('value',iappthat.getData('$'+key.attr('name')));
		$('#formula').attr('value', iappthat.getData(key.attr('name')));
		editName = key.attr('name');
		editFormula = iappthat.getData(key.attr('name'));
	}
	
	function saveEdit()
	{
		/*var str = "Are you sure to change this formula?";
		if (window.confirm(str))
		{*/
			var newname = jQuery.trim($('#name').attr('value'));
			if(newname == editName)
			{
				iappthat.saveData(editName, $('#formula').attr('value')); // just change the info 
				iappthat.saveData('$'+editName, $('#description').attr('value'));
				iappthat.msgBox('iAppCalc',editName+ ' is saved!');
				jQT.goTo('#build');
			}
			else //newName is different
				saveData(2);
		//}
	}
	
	function deleteData(key)
	{
		jConfirm('Are you sure to delete?', 'iAppCalc', function(r) {
			if (r)
				deleteAct (key);
		});
	}
	
	function deleteAct (key)
	{
		var k = -1;
		for (i =0; i<arrName.length; i++)
		{
			if(arrName[i] == key.attr('id'))
			{
				k=i;
				i = arrName.length;
			}
		}
		removeDisplay();
		arrName.splice(k,1);
		displayList(arrName);
		iappthat.saveData("namelist", arrName.toString());//namelist changed
		iappthat.deleteData(key.attr('id')); //delete formula with this name
	}
	
	function normalForm()
	{
		$('#normal').hide();
		$('#f1').show();
		$('#__s1').attr('value', "");
		$('#answer').attr('value',"");
		$('#f2').hide();
		$('#saveCalc').show();
	}
	
	function saveCalc()
	{
		$('#formula').attr('value', $('#__s1').attr('value'));
		$('#name').attr('value','');
		$('#description').attr('value','');
		$('#save').show();
		$('#saveEdit').hide();
	}
	function viewFormula(key)
	{
		var keyname = (key.attr('name')).split("_");
		if(keyname[0] =="area")
			iappthat.showMeMessage("iAppCalc","Area of "+keyname[1]+"=\n" +fArea[keyname[1]]);
		else if (keyname[0] == "volume")
			iappthat.showMeMessage("iAppCalc","Volume of "+keyname[1]+"=\n" + fVolume[keyname[1]]);
		else if(keyname[0] == "prob")
			iappthat.showMeMessage("iAppCalc",keyname[1]+"=\n"+fProb[keyname[1]]);
		else if(keyname[0] == "finance")
			iappthat.showMeMessage("iAppCalc", keyname[1]+"=\n"+fFin[keyname[1]]);
		else if (keyname[0] == "func") // From My Functions Library
			iappthat.showMeMessage("iAppCalc",keyname[1]+"=\n" + iappthat.getData(keyname[1]));
	}
	
	function formCalc(key)
	{
		var keyid = (key.attr('id')).split("_");
		var formula = "";
		if(keyid[0] == "area")
			formula = fArea[keyid[1]];
		else if(keyid[0] == "volume")
			formula = fVolume[keyid[1]];
		else if (keyid[0] == "prob")
			formula = fProb[keyid[1]];
		else if (keyid[0] == "finance")
			formula = fFin[keyid[1]];
		else if(keyid[0] == "func")
		{
			var tempform = String(iappthat.getData(keyid[1]));
			if(tempform.indexOf('=') != -1)
			{
				var temparr = (tempform).split('='); 
				formula =temparr[1];
			}
			else
				formula = tempform;
		}
		displayFormCalc (keyid[1],formula);
		
	}
	function displayFormCalc (name, formula)
	{
		$('#my_fillin').empty();
		$('#my_form').empty();
		$('#f1').hide();
		$('#f2').show();
		$('#normal').show();
		_clearmem(); // remove everything from previous calculation	
		$('#answer').attr('value',"");
		$('#results').attr('value',"");
		if (name != "")
			$('#saveCalc').hide();
		else
			$('#saveCalc').show();	
		$('#s1val').attr('value', formula); 
		var temp = getVariable(formula);
		$('#my_form').append('<a href="#cal" style="text-decoration:none;font-size:16px;color:yellow"><input type="image" name="'+name+'='+formula+'"'+
	                         ' style="vertical-align:middle;width:40px;height:40px" src="image_view.jpg" title="view" onClick="displayForm($(this));" value="View"/>'+'View Formula</a>');
		$('#my_fillin').append('<tr><td colspan=3 style="font-size:14px;font-style:italic; color:yellow">Please fill in data</td></tr>');
		for (j=temp.length-1; j>=0; j--)
			$('#my_fillin').append('<tr><td id="'+j+'" style="color:yellow; font-size:20px">'+temp[j]+'</td><td style="font-size:20px; color:yellow">=</td>'+
					'<td><input type="number" style="width:100%; background-color:white;overflow:auto;color:black; font-size:24px" id="'+temp[j]+'" value=""/></td></tr>');
	}
	
	function displayForm (key)
	{
		iappthat.msgBox("iAppCalc", key.attr('name'));
	}
	function getVariable (str)
	{
		embedded_func = "";
		$('#__s1').attr('value',str);
		_docalc(false);
		var temp = new Array();
		k = 0;
		while(($('#results').val()).indexOf('unknown name') != -1)
		{
			var arr = ($('#results').val()).split(" ");
			if (arr[arr.length-1].indexOf('my_') != -1 && iappthat.getData(arr[arr.length-1].substring(3,arr[arr.length-1].length)) != '')
			{
				$('#__s1').attr('value',arr[arr.length-1]+'='+iappthat.getData(arr[arr.length-1].substring(3,arr[arr.length-1].length))+'\r\n'+$('#__s1').val());
				embedded_func += arr[arr.length-1] +'='+iappthat.getData(arr[arr.length-1].substring(3,arr[arr.length-1].length))+'\r\n';
			}
			else
			{
				temp[k] = arr[arr.length-1];
				$('#__s1').attr('value',temp[k]+'=0'+'\r\n'+$('#__s1').val());	
				k++;
			}
			_docalc(false);		
		}
		return temp;
	}
	
	function newPage()
	{
		$('#formula').attr('value','');
		$('#name').attr('value','');
		$('#description').attr('value','');
	}
	
	function clearCM()
	{
		_clearmem();
		$('#answer').val("");
		if($('#f2').is(':visible'))
		{		
			var rowCount = $('#my_fillin tr').length; // number of variables
			for (i=0; i<rowCount; i++)
			{
				var x = $('#'+i).text();
				$('#'+x).attr('value', ""); //all variable fields empty again
			}
		}
	}
	
	function doCalculate() //Calculate formula
	{
		if($('#f2').is(':visible'))
		{
			var rowcount = $('#my_fillin tr').length-1; //first row for intro 
			$('#__s1').attr('value', embedded_func+$('#s1val').val());
			for (i=0; i<rowcount; i++)
			{
				var x = $('#'+i).text();
				var str = x + '=' + $('#'+x).val();
				$('#__s1').attr ('value', str + '\n' + $('#__s1').val());
			}
		}
		$('#__c1').attr('checked', true);
		_docalc(false);
		if(($('#results').val()).indexOf("=") != -1)
		{
			var arrResult = ($('#results').val()).split("=");
			$('#answer').val(arrResult[arrResult.length-1]);
		}
		else 
		{
			if ($('#f1').is(':visible'))
			{
				var formula = $('#__s1').val();
				displayFormCalc ("",formula);
				$('#__s1').val(formula);
			}
			else
				$('#answer').val ($('#results').val());
		}
	}
	
	function validateName(event)
	{
		$('#error').hide();
		var iChars = " *|,\":<>[]{}`\';()@&$#%"; // special characters.
		var character = String.fromCharCode(event.charCode);
		if(iChars.indexOf(character) != -1)
			$('#error').show();
		else
		{
			var str = document.getElementById('name').value;
			for (i=0; i<str.length; i++)
			if(iChars.indexOf(str.charAt(i))!=-1)
				$('#error').show();
		}
	}
	
	/*function showExample(key)
	{
		if($('#'+key.attr('name')).is(':visible'))
			$('#'+key.attr('name')).hide();
		else
			$('#'+key.attr('name')).show();	
	}*/
	
	var splashpage = 
	{
		// Splash Page script- http://www.dynamicdrive.com/
		// Splash Page Script Activation (1=enabled, 0=completely disabled!)
		splashenabled: 1,

		//1) URL to file on your server to display as the splashpage
		splashpageurl: "image_splash.jpg",

		//2) Enable frequency control? (1=yes, 0=no)
		enablefrequency: 0,

		//3) display freqency: "sessiononly" or "x days" (string value). Only applicable if 3) above is enabled
		displayfrequency: "sessiononly",

		//4) HTML for the header bar portion of the Splash Page
		// Make sure to create a link that calls "javascript:splashpage.closeit()")
		// An IE bug means you should not right align any image within the bar, but instead use "position:absolute" and the "right" attribute
		defineheader: '<img src="image_splash.jpg" class="center" style="background: black;">',
		//defineheader: '<div style="padding: 5px; color: white; font: bold 16px Verdana; background: black url(blockdefault.gif) center center repeat-x;">'
		//	+ '<a style="position:absolute; top: 2px; right: 5px" href="javascript:splashpage.closeit()" title="Skip to Content">'
		//	+ '<img src="skip.gif" border="0" width="114px" height="23px" /></a>Bought to you by Google Image...</div>',
		
		//5) cookie setting: ["cookie_name", "cookie_path"]
		cookiename: ["splashpagecookie", "path=/"],

		//6) Auto hide Splash Page after x seconds (Integer value, 0=no)?
		autohidetimer: 2,

		////No need to edit beyond here//////////////////////////////////
		launch:false,
		browserdetectstr: (window.opera&&window.getSelection) || (!window.opera && window.XMLHttpRequest), 
		output:function()
		{
			document.write('<div id="slashpage" style="position: absolute; z-index: 100; color: white; background-color:black">')
			document.write(this.defineheader) 
			document.write('<iframe name="splashpage-iframe" src="about:blank" style="margin:0; padding:0; width:100%; height: 100%"></iframe>')
			document.write('<br /> </div>')
			this.splashpageref=document.getElementById("slashpage")
			this.splashiframeref=window.frames["splashpage-iframe"]
			this.splashiframeref.location.replace(this.splashpageurl)
			this.standardbody=(document.compatMode=="CSS1Compat")? document.documentElement : document.body
			if (!/safari/i.test(navigator.userAgent)) 
				this.standardbody.style.overflow="hidden"
			this.splashpageref.style.left=0
			this.splashpageref.style.top=0
			this.splashpageref.style.width="100%"
			this.splashpageref.style.height="100%"
			this.moveuptimer=setInterval("window.scrollTo(0,0)", 50)
		},
		closeit:function()
		{
			clearInterval(this.moveuptimer)
			this.splashpageref.style.display="none"
			this.splashiframeref.location.replace("about:blank")
			this.standardbody.style.overflow="auto"
		},
		init:function()
		{
			if (this.enablefrequency==1){ 
				if (/sessiononly/i.test(this.displayfrequency)){ 
					if (this.getCookie(this.cookiename[0]+"_s")==null){ 
						this.setCookie(this.cookiename[0]+"_s", "loaded")
						this.launch=true
					}
				}
				else if (/day/i.test(this.displayfrequency)){ 
					if (this.getCookie(this.cookiename[0])==null || parseInt(this.getCookie(this.cookiename[0]))!=parseInt(this.displayfrequency)){ 
						this.setCookie(this.cookiename[0], parseInt(this.displayfrequency), parseInt(this.displayfrequency))
						this.launch=true
					} 
				}
			}
			else 
				this.launch=true
			if (this.launch){
				this.output()
				if (parseInt(this.autohidetimer)>0)
					setTimeout("splashpage.closeit()", parseInt(this.autohidetimer)*1000)
			}
		},
		getCookie:function(Name)
		{
			var re=new RegExp(Name+"=[^;]+", "i"); 
			if (document.cookie.match(re)) 
				return document.cookie.match(re)[0].split("=")[1] 
			return null
		},
		setCookie:function(name, value, days)
		{
			var expireDate = new Date()
			if (typeof days!="undefined")
			{ 
				var expstring=expireDate.setDate(expireDate.getDate()+parseInt(days))
				document.cookie = name+"="+value+"; expires="+expireDate.toGMTString()+"; "+splashpage.cookiename[1] 
			}
			else 
				document.cookie = name+"="+value+"; "+splashpage.cookiename[1] 
		}
	}
	if (splashpage.browserdetectstr && splashpage.splashenabled==1)
		splashpage.init();
		
	$(document).ready(function() {
		$('#hiddenimg').hide();
		$('#__c1').hide();
		$('#__r1').hide();
		$('#__r2').hide();
		$('#error').hide();
		$('#results').hide();
		$('#f2').hide();
		$('#saveEdit').hide();
		$('#normal').hide();
		$('#save').show();
		
		/*var arrEx = ["ex1", "ex2", "ex3"];
		for (i=0; i<arrEx.length; i++)
			$('#'+arrEx[i]).hide();*/
	
		$('#__s1').focus(function(){
			$('#__c1').attr('checked', false);
		});
		$('#create').click(function(){
			$('#name').attr('value',"");
			$('#formula').attr('value',"");
			$('#save').show();
			$('#saveEdit').hide();
			$('#error').hide();
		});
		$('#calculator').click(function(){
			$('#answer').attr('value',"");
			$('#f2').hide();
			$('#f1').show();
			$('#__s1').attr('value',"");
		});
	});