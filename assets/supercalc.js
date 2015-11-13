// This program is written by Pan. Tsiros on December 2002 sc@tsiros.net
// for updates look at www.tsiros.net/supercalc.htm
// 
var _isNS = (navigator.appName == "Netscape" && parseInt(navigator.appVersion) >= 4);
var _fN = new Array()
var _lines = new Array()
var _units = new Array()
var _params = new Array()
var _right=1
var _left=0
var _myexception = new Error("my error")
var _message="no message"
var _report

_text=document.getElementById("__s1")  //document.myform.__s1
_answer=document.getElementById("results")

var _epi = String.fromCharCode(183)

var _roots = String.fromCharCode(8730)
var _sums=String.fromCharCode(931)
var _prods=String.fromCharCode(928)
var _adds=String.fromCharCode(9668)
var _psi=String.fromCharCode(968)
var _xi=String.fromCharCode(967)
var _phi=String.fromCharCode(966)
var _lB=String.fromCharCode(171)
var _rB=String.fromCharCode(187)

var _cr = _isNS?"\n":"\r\n"

//these are the default functions and variables
// the structure is obvious. Dont forget the last zero (count the recursions)
var ohm

_fN=[["asin",["x"],"_trig(x,3)*((Math.deg)?180/pi:1)",0],
["acos",["x"],"_trig(x,4)*((Math.deg)?180/pi:1)",0],
["atan",["x"],"_trig(x,5)*((Math.deg)?180/pi:1)",0],
["log",["x"],"_logar(x,10)",0],
["ln",["x"],"_trig(x,6)",0],
["sin",["x"],"_trig(x*((Math.deg)?pi/180:1),0)",0],
["cos",["x"],"_trig(x*((Math.deg)?pi/180:1),1)",0],
["tan",["x"],"_trig(x*((Math.deg)?pi/180:1),2)",0],
["pi",[],"Math.PI",0],
["log",["x","y"],"_logar(x,y)",0],
["if",["x","y","z"],"_if2(x,y,z)",0],
["row",["x","y"],"_Row(x,y)",0],
["max",["x"],"_Max(x)",0],
["min",["x"],"_Min(x)",0],
["srt",["x"],"_Sort(x)",0],
["c2r",["x"],"_C2R(x)",0],
["col",["x","y"],"_Col(x,y)",0],
["ran",[],"Math.random()",0],
["poly",["x","y"],_sums+"(y*(x^y)'[y,0,Length(y)-1])",0],
["integral",["f(x)","a","b"],_sums+"f([b,a]~300)*(b-a)/300",0],
["Length",["x"],"_len(x)",0],
["Sn",["x"],_roots+"("+_sums+"((x-Mean(x))^2)/_len(x))",0],
["Sn_1",["x"],_roots+"("+_sums+"((x-Mean(x))^2)/(_len(x)-1))",0],
["Mean",["x"],_sums+"(x)/_len(x)",0],
["rb",["x"],"_RBrackets(x)",0],
["element",["x","y"],"Element(x,y)",0],
["floor",["x"],"Math.floor(x)",0],
["round",["x"],"Math.round(x)",0],
["mp",["p","r","y"],"(1+1/((1+r/1200)^(y*12)-1))*r/1200*p",0],
["e",[],"2.7182818284590452353602",0]]

//here you can add your own functions

_defaultfunctions=_fN.length

function digit(x,i)
{
	var x=x.toString()
	i=(x.length-1-i<0)?0:x.length-1-i
	return x.charAt(i)
}
function Element(_x,_y)
{
	_x=_eval(_x)
	_y=_eval(_y)
	return _x[_y-1]
}
function sign(x)
{
	if(x>=0) return 1
	else return -1
}
function _len(_x)
{
	return _eval(_x).length
}

_fStack=new Array()
_fStack[0]='Math.sin('
_fStack[1]='Math.cos('
_fStack[2]='Math.tan('
_fStack[3]='Math.asin('
_fStack[4]='Math.acos('
_fStack[5]='Math.atan('
_fStack[6]='Math.log('
_fStack[7]='Math.abs('

_nameslength=26

function _trig(_x,_stackf)
{
	_x=_eval(_x)
	var res=new Array(),i
	if (typeof(_x)=='object')
	{
		for(i=0;i<_x.length;++i)
		res[i]=_trig(_x[i],_stackf)
		return res
	}
	else
		return eval(_fStack[_stackf]+_x+")")
}

function _Ran()
{
	return Math.random(1)
}

var newf=new Array()
var fnames=new Array()

function _ef(fname,values,fbody,par,stack,i)
{
	if(newf[fname]==null)
	{
		newf[fname]=new Array()
		newf[fname][0]=values
		st="fnames['"+fname+"']"
		fbody=_replacefunctions(fbody)
		var _re=new RegExp("_"+fname+stack,"g")
		fbody=fbody.replace(_re,st)  
		var _re=new RegExp("_"+_fN[i][1][0]+stack,"g")
		fbody=fbody.replace(_re,"p")  

		newf[fname][1]=_restorequotes(fbody)
		newf[fname][2]=newf[fname][1]
		if(par=="")
		{
			par=fname
			_fN[i][6]=null
			str='new Function("p","i","value","if (_fN[i][6]==null) {_fN[i][10]=value;_fN[i][7]=p;_fN[i][6]=true; return value};newf[\''+fname+'\'][1]=_rall(_fN[i][7],_fN[i][10],newf[\''+fname+'\'][2].toString());return _fN[i][10]=eval(newf[\''+fname+'\'][1])")'
		}
		else
		//str='new Function("p","p=eval(p); if (newf[\''+fname+'\'][0][p]!=null) return newf[\''+fname+'\'][0][p];newf[\''+fname+'\'][1]=_rall(\'p\',p,newf[\''+fname+'\'][2].toString());return newf[\''+fname+'\'][0][p]=eval(newf[\''+fname+'\'][1])")'
		str='new Function("p","try {p=eval(p)}catch (_er){p=_eval(_replacefunctions(p))}; if (newf[\''+fname+'\'][0][p]!=null) return newf[\''+fname+'\'][0][p];newf[\''+fname+'\'][1]=_rall(\'p\',p,newf[\''+fname+'\'][2].toString());return newf[\''+fname+'\'][0][p]=eval(newf[\''+fname+'\'][1])")'
		eval('fnames[fname]='+str)
	}
	return fnames[fname](par,i,values)
}

//here are two functions that will be called from the calculator

function StdDev(_ar)
{
	var _x=0,_temp=0,_i
	for(_i=0;_i<_ar.length;++_i)
		_x=_x+_ar[_i]
	_x=_x/_ar.length 
	for(_i=0;_i<_ar.length;++_i)
		_temp=_temp+Math.pow(_ar[_i]-_x,2) 
	_temp=Math.pow(_temp/(_ar.length-1),1/2)
	return (_temp)
}

// code by Tsiros Pan.
// don't try to understand nothing
function fitpoly(e,b)
{
	var c=new Array(),a=new Array(),d=new Array()
	e=eval(e)
	var n = 1+b,e=[[0,0]].concat(e),ns=e.length-1,i,m,ii,j
	for(i=0;i<=n+1;i++)
	{
		a[i]=new Array();
		d[i]=new Array();
		c[i]=0
		for(j=0;j<=n+1;++j)
		{
			a[i][j]=0
			d[i][j]=0
		}
	}
	var m,n

	for(m=1;m <= n;m++)
		for(i=1;i<= m;i++) 
		{
			j = m - i + 1; 
			for(ii=1;ii <= ns;ii++)
			a[i][j] = a[i][j] + Math.pow(e[ii][0], m-1)
		}  
		
	for(i=1;i<= n;++i)
		for(ii=1;ii<=ns;++ii)
			a[i][n+1] = a[i][n+1] +e[ii][1]*Math.pow(e[ii][0],i-1) 
	for(m = n+2 ; m <= 2*n ; ++m)
		for(i = m-n; i<= n;++i)
		{
			j= m -i 
			for(ii=1; ii<=ns;++ii)
			a[i][j] = a[i][j] + Math.pow(e[ii][0],m-2) // coefficients of system
		}

	// mission impossible
	// calculate all the determinants of the system
	for(m=2; m<=n ; ++m)
	{
		for(i=m;i<=n;++i)
		for(j=m-1;j<=n+1;++j)
			d[i][j] = [a[i][j] * a[m-1][m-1] , a[i][m-1]]
		for(i=m;i<=n;++i)
		for(j=m-1;j<=n+1;++j)
		{
			a[i][j] = d[i][j][0]-d[i][j][1]*a[m-1][j] 
			if(Math.abs(a[i][j])<1.E-10) a[i][j]=0  // i have to add this line
		}
	}
	// now the coefficients of equation (not exactly)

	for(i=n;i>=1;--i)
	{
		c[i-1] = a[i][n+1]
		if (i!=n)
		for(j=n; j>=i+1;--j)
			c[i-1] = c[i-1] -a[i][j] * c[j-1]
		if(a[i][i]!=0)
			c[i-1]=c[i-1] / a[i][i]
		else
			c[i-1]=0
		if(Math.abs(c[i-1])<Math.pow(10,-ns))
			c[i-1]=0
	}

	c.length=n
	return c
}

function _restabs(_line)
{
	_line=_line.replace(/\_abs\{/g,"|")
	_line=_line.replace(/}/g,"|")
	return _line
}

function _replabs(_line)
{
	_reg=/[a-zA-Z0-9_\)\}\!\.\]_][ ]{0,1}[|]/
	var _count=0,_pos,_w,_what
	while ((_pos=_line.indexOf(_what=_line.match(_reg)))!=-1)
	{
		_count++
		_w=String(_what).length-1
		_line=_line.substring(0,_pos)+String(_what).substring(0,_w)+"}"+_line.substring(_pos+1+_w)
	}

	while (_line.indexOf("|")!=-1)
	{
		_count--
		_line=_line.replace("|","\_abs\{")
	}
	if (_count)
	{
		_message="problem with absolute"
		throw _myexception
	}
	return _line
}
function _radio()
{
	if (document.getElementById("__c1").checked)
	_docalc(false) 
	document.getElementById("__s1").focus()
}


function _checkbox()
{
	document.getElementById("__s1").focus()
}
function _keypressed(_evnt)
{
	_ch=(_isNS?_evnt.which:_evnt.keyCode)
	if(!_isNS)
	switch (_ch)
	{
	case 42:_ch=183;
				break;
	case 17:_ch=9730
				break;
	case 20:_ch=931
				break;
	case 21:_ch=928
				break;
	case 28:_ch=9668
				break;
	}
	if(!_isNS) _evnt.keyCode=_ch

	if (document.getElementById("__c1").checked)
	if (_ch==13)
		_docalc(false) 
}

function _clearmem()
{
	if ((_fN.length==_defaultfunctions)&&(_text.value==""))
		_answer.value="already clear"
	else
	{_text.value=""
		_fN.length=_defaultfunctions
		_answer.value="calculator cleared"
	}
	document.getElementById("__s1").focus()
	_gv.length=0
}

function _findfirstname(_aline,_frompos)
{
	var _name
	var _isf=false
	var _pos=_frompos
	var _tmp=_aline.substring(_pos)
	var _re=/(\b[a-zA-Z])\w*(\.){0,1}\w*/
	var _token=_re.exec(_tmp)
	if(_token)
	{
		_name=_token[0]
		_pos=_pos+_token.index

		if (_tmp.charAt(_token.index+_name.length)=='(')
			_isf=true
		return [_name,_pos,_isf]
	}
	else
		return ["",-1,_isf]
}

function _priority(_ch)
{
	_symb= "."+_phi+_prods+_sums+"'!"+_roots+"^*/%~+-"+_adds+"`=#><@$;"+_xi+",?:"+'"'
	_prior="8766665433332211111111110000"
	if (_symb.indexOf(_ch)!=-1)
		return(_prior.charAt(_symb.indexOf(_ch)))
	else
		if(_ch>=String.fromCharCode(935))
			return 0
		else
			return 8
}

function _readentity(_tmp,_pos,_dir)
{
var _level=0,_entity="",_ch="",_checkCh=_tmp.charAt(_pos)
var _i

for(_i=_pos+(_dir?+1:-1);;(_dir?++_i:--_i))
{ 
 _ch=_tmp.charAt(_i)
 if (
		((_priority(_ch)<=_priority(_checkCh))&&(_level==0))
		||
		(_ch=="")
	)
{
	return _entity
}
 if((((_ch=="(")||(_ch=="{")||(_ch=="[")) && (_dir?(++_level,0):_level--==0))
	||
	(((_ch==")")||(_ch=="}")||(_ch=="]")) && (_dir?(_level--==0):(++_level,0)))
	) 
	{
	return _entity
	}
	else 
	_entity=(_dir?"":_ch)+_entity+(_dir?_ch:"")
}
}

function _prod(_x)
{
var i,s=1
_x=eval(_x)
if(typeof(_x)=='number')
 {
 _message=_x+ ' is not list'
 throw _myexception
 }
for(i=0;i<_x.length;++i)
 s=_op(s,_x[i],2)
return s 

}

function _sum(_x)
{
_x=eval(_x)
var i,s=0
if(typeof(_x)=='number')
{
_message=_x+ ' is not list'
throw _myexception
}
for(i=0;i<_x.length;++i)
 s=_op(s,_x[i],0)
return s 
}

function _abs(_x)
{
return _trig(_x,7)
}

function _logar(_x,_y)
{
var res=new Array(),i
switch (_combi(_x,_y))
{
case 1:return Math.log(_x)/Math.log(_y)
case 2:for(i=0;i<_x.length;++i)
	res[i]=_logar(_x[i],_y)
	return res
case 3:for(i=0;i<_y.length;++i)
	res[i]=_logar(_x,_y[i])
	return res
case 4:for(i=0;i<_x.length;++i)
	res[i]=_logar(_x[i],_y[i])
	return res
}
}

var _sign=['>','<','==','<=','>=','!=']

function _logic(_x,_y,_select)
{
_x=eval(_x)
_y=eval(_y)
var res=new Array(),i
if ((typeof(_x)=='object')&&(typeof(_y)=='object'))
{
for(i=0;i<_x.length;++i)
res[i]=_logic(_x[i],_y[i],_select)
return res
}
else
return eval(_x+_sign[_select]+_y )
}

function _Sort(_x)
{
var i,j,_tmp
for(i=0;i<_x.length-1;++i)
for(j=i+1;j<_x.length;++j)
if (_x[i]>_x[j])
{
_tmp=_x[j]
_x[j]=_x[i]
_x[i]=_tmp
}
return _x 
}

function _C2R(_x)
{
_x=_eval(_x)
var i,j,res=new Array()
if(typeof(_x[1])=='object')
for(j=0;j<_x[1].length;++j)
{
temp=new Array()
for(i=0;i<_x.length;++i)
temp[i]=_x[i][j]
res[res.length]=temp
}
else
for(j=0;j<_x.length;++j)
{
res[res.length]=[_x[j]]
} 
return res 
}

function _Max(_x)
{
_x=_eval(_x)
var _i,_tmp=_x[0]
for(_i=1;_i<_x.length;++_i)
if (_tmp<_x[_i])
_tmp=_x[_i]
return _tmp 
}
function _Min(_x,_which)
{
_x=_eval(_x)

if(_which>=0)
{
var _i,_j=0,_tmp=_x[0]
for(_i=1;_i<_x.length;++_i)
 if (_tmp[_which]>_x[_i][_which])
 {
 _tmp=_x[_i]
 _j=_i
 }
return _tmp

}
else
{
var _i,_j=0,_tmp=_x[0]
for(_i=1;_i<_x.length;++_i)
 if (_tmp>_x[_i])
 {
 _tmp=_x[_i]
 _j=_i
 }
return _tmp
}
}


function _combi(_x,_y)
{
if ((typeof(_x)=='number')&&(typeof(_y)=='number'))
 return 1
if ((typeof(_x)=='object')&&(typeof(_y)=='number'))
 return 2
if ((typeof(_x)=='number')&&(typeof(_y)=='object'))
 return 3
if ((typeof(_x)=='object')&&(typeof(_y)=='object'))
 return 4 
if ((typeof(_x)=='string')||(typeof(_y)=='string'))
 return 5
if ((typeof(_x)=='boolean')&&(typeof(_y)=='number'))
 return 6
if ((typeof(_x)=='number')&&(typeof(_y)=='boolean'))
 return 7
if ((typeof(_x)=='boolean')&&(typeof(_y)=='boolean'))
 return 8
}

var _signoper=['+','-','*','/','%']

function _op(_x,_y,_select)
{
_x=_eval(_x)
_y=_eval(_y)
var res=new Array()
var i
switch (_combi(_x,_y))
{
case 1:
		return _eval('('+_x+')'+_signoper[_select]+'('+_y+')')
break;
case 2:for(i=0;i<_x.length;++i)
		res[i]=_op(_x[i],_y,_select)
		return res
case 3:for(i=0;i<_y.length;++i)
		res[i]=_op(_x,_y[i],_select)
		return res
case 4:
	var max=_x.length
	if(_x.length<_y.length)
	max=_y.length
	for(i=0;i<max;++i)
	if(_y.length==1)
	res[i]=_op(_x[i],_y[0],_select)
	else
	res[i]=_op(_x[i],_y[i],_select)
	return res
case 6:if(_x) return _y
		else return _x
case 7:if(_y) return _x
		else return _y
case 8:return _x&&_y
default:alert(here)	
}
}

function _exp(_x,_y)
{
_x=eval(_x)
_y=eval(_y)
var res=new Array(),i
switch (_combi(_x,_y))
{
case 1:return Math.pow(_x,_y)
case 2:for(i=0;i<_x.length;++i)
	res[i]=_exp(_x[i],_y)
	return res
case 3:for(i=0;i<_y.length;++i)
	res[i]=_exp(_x,_y[i])
	return res
case 4:for(i=0;i<_x.length;++i)
	res[i]=_exp(_x[i],_y[i])
	return res
}
}

function _divide(_x,_y)
{
_x=_eval(_x)
_y=_eval(_y)
var i,res = new Array(),step=(_x[1]-_x[0])/_y
for(i=0;i<_y;++i)
res[i]=_x[0]+step/2+i*step
return res
}



function _fac(_x)
{
_x=eval(_x)
var res = new Array(),i
if (typeof(_x)=='object')
{
for(i=0;i<_x.length;++i)
res[i]=_fac(_x[i])
return res
}
if(_x<0)
{
_message="factorial of negative"
throw _myexception
}
if (_x-Math.round(_x))
{
_message="factorial of not integer"
throw _myexception
}
if (_x==0)
return 1
else 
return _x*_fac(_x-1)
}

function _Row(_x,_y)
{ 
_x=eval(_x)
return _x[_y] 
}

function _Col(_x,_y)
{
_x=eval(_x)
var res=new Array(),i
for(i=0;i<_x.length;++i)
 res[i]=_x[i][_y]
return res 

}
var _addStack=0
var _gvAdd=new Array()
function _Ladd(x,y,stack)
{
var i

if(!_gvAdd[stack])
{
_gvAdd[stack]=new Array()
if(x["f"])
//if(x[0])
_gvAdd[stack]=x
else
if(x.toString())
_gvAdd[stack]=_gvAdd[stack].concat(x)
}
if(typeof(y)=='number')
_gvAdd[stack][_gvAdd[stack].length]=y
else
_gvAdd[stack]=_gvAdd[stack].concat(y)
return _gvAdd[stack]
}


function _if2(_x,_y,_z)
{
_x=eval(_x)
_y=eval(_y)
_z=eval(_z)
var res=new Array(),i
if (typeof(_x)=='object')
{
for(i=0;i<_x.length;++i)
res[i]=_if2(_x[i],_y[i],_z[i])
return res 
}
else
{
if (_x)
return _y
else
return _z
}
}



_operation=["_rng","_add","_sub","_mul","_div","_exp","_fac","_exp","_sum","_prod","_modul","_divide","_gr","_le","_leq","_geq","_uneq","_eq","_Ladd","_Ladd","_Map"]
_oper=_phi+"+-*/^!"+_roots+_sums+_prods+"%~><$@;"+_xi+"`"+_adds+"'"

function _rng(_x,_y)
{
var _tmp=[],_i
for(_i=_x;_i<=_y;++_i)
_tmp[_tmp.length]=_i
return _tmp
}
function _rall(_old,_new,_where)
{
var _re=new RegExp("\\b"+_old+"\\b","g")
var tmp=_where.toString().replace(_re,_new)
return tmp
}
_ev=true
function _eval(_x)
{
var _i
_ev=true
if(typeof(_x)=='object')
try
{
for(_i=0;_i<_x.length;++_i)
_x[_i]=eval(_x[_i])
return _x
}
catch (_er)
{
_ev=false
return _x
}
else
try
{
return eval(_x)
}
catch (_er)
{
_ev=false
return _x
}
}
function _restorequotes(_str)
{
var rightstr=_str
var leftstr=''
var re=new RegExp(_psi+"\\d+")

var token=re.exec(rightstr)
while (token)
{
var _thenum=token[0].split(_psi)[1]

var _reg=new RegExp(_psi+_thenum,"g")

leftstr=leftstr+rightstr.substring(0,token.index)
rightstr=rightstr.substring(token.index+token[0].length)
if ((countquotes(rightstr)==0)&&(countquotes(leftstr)==0))
{
	leftstr=leftstr+'"'
    rightstr=rightstr.replace(_reg,'"')
}
	else
	leftstr=leftstr+token[0]
token=re.exec(rightstr)
}
return leftstr+rightstr
}

var stackmap
var _b=new Array()
var _x=new Array()

var ar = new Array()
var mainswitch=false
function _Map(_whichfunction,params,stack)
{
++stackmap
var cstackmap=stackmap
var _iii,_i
_b[cstackmap]=new Array()
_x[cstackmap]=new Array()
var a=new Array()
var _tf=new Array()
var str=""
var _a =new Array()
var ohm=String.fromCharCode(937+stack)

function myfor(i)
{

var _st,_en
var ii,a,_step

if((typeof(_a[i][0])=='object')||(_a[i][0].charAt(0)=="["))
{
a=eval(_a[i][0])
for(ii=0;ii<a.length;++ii)
{
	eval(_x[cstackmap][i]+"="+eval(a[ii]))
	if(i<_x[cstackmap].length-1)
	{
	myfor(i+1)

	}
	else
	{
	if(_tf[i])
	_temp[_temp.length]=_eval(str)
	else
	_temp=_eval(str)

	}
}
}
else
{

if(_a[i][2])
_step=eval(_a[i][2])
else
_step=1
_st=eval(_a[i][0])
_en=eval(_a[i][1])+0.000001
for(ii=_st;ii<=_en;ii=ii+_step)
{

	eval(_x[cstackmap][i]+"="+ii)
	if(i<(_x[cstackmap].length-1))
	myfor(i+1)
	else
	{
	if(_tf[i])
	_temp[_temp.length]=_eval(str)
	else
	_temp=_eval(str)

	}
}
}
}

////////////
var _temp=new Array()
var __x,_i,_ii,_v


_v=_whichfunction.split(String.fromCharCode(1300+stack))
_x[cstackmap]=_v[0].split(ohm)

str=_v[_v.length-1]
str=_restorequotes(str)

if(typeof(params)!='object')
{
params=_restorequotes(params)



_b[cstackmap]=new Array()
var _tmp=params.split(ohm+ohm) 

for(_iii=0;_iii<_tmp.length;++_iii)
{
_tf[_iii]=eval(_tmp[_iii].split(String.fromCharCode(1300+stack))[0])
_b[cstackmap][_iii]=_tmp[_iii].split(String.fromCharCode(1300+stack))[1]
}

for(_i=0;_i<_b[cstackmap].length;++_i)
try
{
try
{
var tst=eval(_b[cstackmap][_i])
_a[_i]=new Array()
_a[_i][0]=tst
}
catch(er)
{
_a[_i]=_b[cstackmap][_i].split(ohm)
}
var _vi=0
for(_vi=0;_vi<_a[_i].length;++_vi)
{
if(!a[_i])
a[_i]=new Array()
a[_i][_vi]=_eval(_a[_i][_vi])
if(_vi==0)
if(typeof(a[_i][_vi])=='object')
eval(_x[cstackmap][_i]+"="+a[_i][_vi][0])
else
eval(_x[cstackmap][_i]+"="+a[_i][_vi])
}
}
catch(_er)
{
_a[_i]=new Array()
a[_i] = new Array()
_a[_i][0]=_b[cstackmap][_i]
a[_i][0]=_a[_i][0].join("/").split("/")
}
}
else
{
a[0]=new Array()
a[0][0]=params
}


myfor(0)

--stackmap
return _temp
}

function _RBrackets(_tmp)
{
_tmp=eval(_tmp)
var _newAr=new Array(),_i,_ii
for(_i=0;_i<_tmp.length;++_i)
for(_ii=0;_ii<_tmp[_i].length;++_ii)
	_newAr[_newAr.length]=_tmp[_i][_ii]
return _display(_newAr)
}


var operreg=new RegExp("[+|\\-|*|/|^|!|"+_phi+"|"+_roots+"|"+_sums+"|"+_prods+"|%|~|>|<|$|@|;|"+_xi+"|`|"+_adds+"|']")

var parameters=new Array()

function _replacepower(_tmp,st)
{
if(st) ++_stack
var _pos=0,_i,_ch='', _error='',_innerstr,_leftstr,_rightstr,_ii
var _token,_leftentity,_rightentity
var tmptt="",_tt,_t,_iv

while(_token=operreg.exec(_tmp))
{
var _comma=','

_ch=_token[0]
_i=_token.index

if ((_pos=_oper.indexOf(_ch))!=-1)
	{
	_leftentity=_readentity(_tmp,_i,_left)
	_rightentity=_readentity(_tmp,_i,_right)
	_leftstr =_tmp.substr(0,_i-_leftentity.length)
	_rightstr = _tmp.substring(_i+1+_rightentity.length)
	switch (_ch)
	{
	case "+":if (!_leftentity.replace(/ /g,"")) _leftentity=0
			if (!_rightentity) _error='+'
			break;
	case "-":if (!_leftentity.replace(/ /g,"")) _leftentity=0
			if (!_rightentity) _error='-'
			break;
	case "*":if ((!_leftentity)||(!_rightentity)) _error='*'
			break;
	case "/":if ((!_leftentity)||(!_rightentity)) _error='/'
			break;
	case "^":if ((!_leftentity)||(!_rightentity)) _error='^'
		break;
	case "!":if (!_leftentity) _error='!'
			_comma=''
		break;
	case "~":if ((!_leftentity)||(!_rightentity)) _error='~'
			break;
	case "`":
			if ((!_leftentity)||(!_rightentity)) _error="`"
			break;
	case _adds:
			if ((!_leftentity)||(!_rightentity)) _error=_adds
			break;
	case _roots :if (!_leftentity.replace(/ /g,"")) _leftentity=2
					if (!_rightentity) _error=_roots
					_tmp=_leftentity
					_leftentity=_rightentity
					_rightentity=1+'/'+_tmp
    	break; 
    case _phi:if ((!_leftentity)||(!_rightentity)) _error=_adds
			break;

	case _sums : if(!_rightentity) _error = _sums
				_comma=''
				break;
	case _prods : if(!_rightentity) _error = _prods
				_comma=''
				break;
	case "'":if ((!_leftentity)||(!_rightentity)) _error='--'
			else
			{
		var _cstack=_stack
			_t=_getrealparams(_rightentity,1)[0]
			var tmpparams=""			
			if(_getrealparams(_t[0],1)[0]=="")
			{
			_rightentity="("+_rightentity+")"
			_t=_getrealparams(_rightentity,1)[0]
			}

			tmptt=""

				for(_ii=0;_ii<_t.length;++_ii)
				{
				_tt=_getrealparams(_t[_ii],1)[0]


				_tf=0
	var ohm=String.fromCharCode(937+_cstack)		
				if(_t[_ii].charAt(0)=="[") _tf=1
				
			tmpparams=(tmpparams?tmpparams+ohm+ohm:"")+_tf+String.fromCharCode(1300+_cstack)+_tt[1]+(_tt[2]?ohm+_tt[2]+(_tt[3]?ohm+_tt[3]:""):"")		
				if(_leftentity.charAt(0)=='"')
					_leftentity=_leftentity.substring(1)
				if(_tt[0].charAt(0)!="_")
				{
				_leftentity=_rall(_tt[0],"_"+_tt[0]+_cstack,_leftentity)

				for(_iv=_ii+1;_iv<_t.length;++_iv)
				{
					_t[_iv]=_replacepower(_t[_iv],true)
					_t[_iv]=_t[_iv].replace(/"/g,_psi+(_cstack))				
					_t[_iv]=_rall(_tt[0],"_"+_tt[0]+_cstack,_t[_iv])
				}
				_tt[0]="_"+_tt[0]+_cstack
				}
			
				tmptt =(tmptt?tmptt+ohm:"")+_tt[0]
				}
				_leftentity=tmptt+String.fromCharCode(1300+_cstack)+"("+_leftentity+")"
				_leftentity=_leftentity.replace(/"/g,_psi+_cstack)
				
			}
		++_stack
			break;
				
}
if("+-*/%".indexOf(_ch)!=-1)
_innerstr='_op('+_leftentity+','+_rightentity+','+"+-*/%".indexOf(_ch)+')'
else
if(_ch==_phi)
_innerstr='_rng('+_leftentity+','+_rightentity+")"
else
if(("><"+_xi+"$@;").indexOf(_ch)!=-1)
_innerstr='_logic('+_leftentity+','+_rightentity+','+("><"+_xi+"$@;").indexOf(_ch)+')'
else
if(_ch=="'")
{
		_innerstr='_Map("'+_leftentity+'","'+tmpparams+'",'+_cstack+')'
if(countquotes(_leftstr))
_innerstr=_innerstr.replace(/"/g,_psi+(_cstack-1))
}
else
if(_ch==_adds)
{++_addStack
_innerstr='_Ladd('+_leftentity+","+_rightentity+","+_addStack+")"
}
else
_innerstr = _operation[_pos]+"("+_leftentity+_comma+_rightentity+")"
_tmp=_leftstr+_innerstr+_rightstr
_i=_leftstr.length
}
} 
if (_error)
{
_message="problem with operator "+_error
throw _myexception
}
return _tmp
}

function _isafunction(_str)
{
var re=/^[ (]*[_a-zA-Z]\w*\(/
var token=re.exec(_str)
if (token)
return true
else
return false
}

function _isgeneralfunction(_str)
{
var re=/^ *[a-zA-Z]\w*\( *[a-zA-Z]\w* *(\, *[a-zA-Z]\w*)* *\)/
var token=re.exec(_str)
if (token)
return true
else
return false
}


function _splitFunction(_str)
{
var nameOf='',_tmp=''
_nameOf =_str.substring(0,_str.indexOf("("))
_tmp=_getrealparams(_str,_nameOf.length+1)
return [_nameOf,_tmp]
}

var _gv= new Array()
function _calculate()
{

var i 
for(_i=_defaultfunctions;_i<_fN.length;++_i)
if((_fN[_i][1]=='')&&_fN[_i][6])
	{
var _expr=_replacefunctions(_fN[_i][4])
	
_expr=_expr.replace(/{/g,"(")
_expr=_expr.replace(/}/g,")")
_expr=_restall(_expr) 
_message='problem with'
try
{
_gv[_gv.length]=eval(_expr)	
_gv[_gv.length-1]["f"]=true
_fN[_i][4]='_gv['+(_gv.length-1)+']'
}
catch (_er)
{
_fN[_i][4]=_replacepower(_fN[_i][2])
}
}
}


function _SaveFunction(_str,_f)
{

 var _i,_j,_tmp,_paramOf,_nameOf,_bodyOf,_bodyOf2,_exist
if (_f)
{
_tmp=_splitFunction(_str)
_nameOf =_tmp[0] 
_paramOf = _tmp[1][0]

for(_i=0;_i<_paramOf.length;++_i)
for(_j=_i+1;_j<_paramOf.length;++_j)
if(_paramOf[_i]==_paramOf[_j])
{
	_message="same name in parameters"
	throw _myexception
} 
}   
else
{
_nameOf =_str.substring(0,_str.indexOf("="))
_paramOf=[]
}
_j=0
_bodyOf =_str.substring(_str.indexOf("=")+1,_str.length) 
_bodyOf2=_replacepower(_bodyOf)
_bodyOf2=_bodyOf2.replace(/{/g,"(")
_bodyOf2=_bodyOf2.replace(/}/g,")")

_exist = false
for(_i=0;_i<_fN.length;++_i)
if (_fN[_i][0]==_nameOf)
  if (
			((_f) && (_fN[_i][1].length==_paramOf.length)) ||
			((!_f) && (_fN[_i][1].length==0))
			)
		{
		_exist=true
		if(_i>=_defaultfunctions)
		{ 
	
	
		_ttt=_getrealparams(_bodyOf2,0)[0]
		if(_ttt.length>1)
		{
		_ttt[1]=_rall(_nameOf,"_"+_nameOf+_stack,_ttt[1])
		_ttt[1]=_rall(_paramOf[0],"_"+_paramOf[0]+_stack,_ttt[1])
		_ttt[1]=_ttt[1].replace(/"/g,_psi+_stack)
		_tmpnameOf=_nameOf		
		if(!_paramOf[0])
		_nameOf="_"+_nameOf+_stack
		_fN[_i]=[_tmpnameOf,_paramOf,'_ef("'+_nameOf+'",'+_ttt[0]+',"'+_ttt[1]+'","'+(_paramOf[0]?_paramOf[0]:"")+'",'+_stack+','+_i+')',,,_str.substring(_str.indexOf('=')+1)]
//		if(!_paramOf[0])
//		_fN[_i][4]=_ttt[0]
//		else		
		_fN[_i][4]=_fN[_i][2]
		
		++_stack
		}
		else
		_fN[_i]=[_nameOf,_paramOf,_bodyOf,0,_bodyOf2,_str.substring(_str.indexOf('=')+1),true]
		_j=_i
		_answer.value="O.K"
		}
		else
		{
		_message="you can't redefine the default function: "+_nameOf
		throw _myexception
		} 
		}
	if (!_exist) 
	{if(_bodyOf)
	{
	
	
		_ttt=_getrealparams(_bodyOf2,0)[0]
		if(_ttt.length>1)
		{
		_ttt[1]=_rall(_nameOf,"_"+_nameOf+_stack,_ttt[1])
		_ttt[1]=_rall(_paramOf[0],"_"+_paramOf[0]+_stack,_ttt[1])
		_ttt[1]=_ttt[1].replace(/"/g,_psi+_stack)
		_tmpnameOf=_nameOf		
		if(!_paramOf[0])
		_nameOf="_"+_nameOf+_stack
		_fN[_i]=[_tmpnameOf,_paramOf,'_ef("'+_nameOf+'",'+_ttt[0]+',"'+_ttt[1]+'","'+(_paramOf[0]?_paramOf[0]:"")+'",'+_stack+','+_i+')',,,_str.substring(_str.indexOf('=')+1)]
//		if(!_paramOf[0])
//		_fN[_i][4]=_ttt[0]
//		else		
		_fN[_i][4]=_fN[_i][2]
		
		++_stack
		}
		else
		_fN[_fN.length]=[_nameOf,_paramOf,_bodyOf,0,_bodyOf2,_str.substring(_str.indexOf('=')+1),true]
	
		_answer.value="O.K" 
	}
	else
	{
	_message="there is not such a name defined"
	throw _myexception
	}
	}
if(_j&&(!_bodyOf))
{
for(_i=_j;_i<_fN.length-1;++_i)
_fN[_i]=_fN[_i+1]
_fN.length=_fN.length-1
_answer.value='removed the '+(_paramOf.length?'function ':'variable ')+_nameOf
}
}

function _makequal(_line)
{
var _j=0,_startline="",_endline="",_qual=[],_q="",_token
_re=/[a-z|A-Z|0-9|_|!|.|\)|\}|_|\]][ ][a-z|A-Z|0-9|\(]/
_token=_re.exec(_line)
_startline=_line
if(_token!=null)
	{
	_startline=_line.substring(0,_token.index+1) 
	_q=_line.substring(_token.index+2)
	_qual[_j]=_q
	while((_token=_re.exec(_q))!=null)
	{
	++_j
	_qual[_j-1]=_q.substring(0,_token.index+1)
	_qual[_j]=_q.substring(_token.index+2)
	_q=_qual[_j] 
	} 
	}
return [_startline,_qual]
}


function _MakeLines(_tmp)
{
var _check=[],_testline= "",_testlineold="",_unit=[],_j=0,_i=0,_count=0,_reg
while (_tmp.indexOf(" "+_cr)!=-1)
_tmp =_tmp.replace(" "+_cr,_cr)
 
while (_tmp.indexOf(_cr+_cr)!=-1)
_tmp =_tmp.replace(_cr+_cr,_cr)
while (_tmp.indexOf(_cr+' ')!=-1)
_tmp =_tmp.replace(_cr+' ',_cr)

while(
	((_i=_tmp.indexOf(_cr))!=-1)
	||
	((_i=_tmp.length)!=0)
	)
{
	++_count
	_testline= _tmp.substr(0,_i)
	_testlineold=_testline
	while (_testline.charAt(_testline.length-1)==' ')
		_testline= _testline.substring(0,_testline.length-1)
	_testline=_replabs(_testline)
	_check=_checkpar(_testline)
	if (!(_check[4]==0))
	{
	_message="parenthesis at line "+_count
	throw _myexception
	}
	if (_testline.length>0)
	{
	_reg=new RegExp("[a-zA-Z][a-zA-Z0-9_]{0,"+_nameslength+"}\\(","")
	if(
		(_testline.indexOf(_testline.match(_reg))==0)
		&&
		(_testline.indexOf(")=")!=-1)
		) 
		{
		if((_check[0]==1)&&(_check[1]==0))
			{
			_unit=_makequal(_testline)
			_SaveFunction(_unit[0],true)
			_tmp=_tmp.replace(_testlineold,"")
			}
			else
			{
			_message="syntax error at line "+_count
			throw _myexception
			}
		}
		else
		{
		_reg = new RegExp("[a-zA-Z][a-zA-Z0-9_]{0,"+_nameslength+"}=","")
		_token= _reg.exec(_testline)
		if(
			(_token!=null)&&(_token.index==0)
			)
			{
			if((_check[0]==1)&&(_check[1]==0))
			{ 
			_unit=_makequal(_testline)
			_SaveFunction(_unit[0],false)
			_lines[_j]=[_testline.substring(0,_testline.indexOf("=")),true]
			_units[_j]=_unit[1] //(_unit[1]=="")?"8989":_unit[1]
			++_j
			} 
			else
			{
			_message="syntax error at line "+_count
			throw _myexception
			}
			_tmp=_tmp.replace(_testlineold,"")
			}
			else
			{
			_unit=_makequal(_testline)
			_lines[_j]= [_unit[0],false]
			_units[_j]=_unit[1]
			_tmp=_tmp.replace(_testlineold,"")
			++_j
			}
			}
		}
		else
		_tmp=_tmp.replace(_cr,"") 
}
}

function _getrealparams(_expr,_pos)
{
var _ch,_par=new Array(),_level=0,_ch=_expr.charAt(_pos),_p1=_pos,_param="",_paramstr=''
 while(!
		(
		(_level==0)&&
		(')]'.indexOf(_ch)>-1)
		)
		)
{
if ((_ch==",") && (_level==0))
{
_par[_par.length]=_param
_param=""
}
else 
_param=_param + _ch
if (_ch=="(") ++_level
if (_ch==")") --_level
if (_ch=="[") ++_level
if (_ch=="]") --_level
_paramstr=_paramstr+_ch

++_pos
if(_pos>_expr.length)
{
_message='error in parameters'
throw _myexception
}
_ch=_expr.charAt(_pos)
} 
_par[_par.length]=_param
return [_par,_pos-_p1,_paramstr]
}

function _replaceparams(_par,_realpar,_str)
{
var _x,_iii,_ii,_leftstr='',_rightstr='',_position=0,_i=0,_tmp,_realtmp,_therealparams
for(_i=0;_i<_par.length;++_i)
{
_position=0
if (_isgeneralfunction(_par[_i]))
{ 
	if(!_isafunction(_realpar[_i]))
   {
   _message="parameter must be function"
   throw _myexception
   }
 _tmp=_splitFunction(_par[_i])
 _realtmp=_splitFunction(_realpar[_i])
if(_tmp[1][0].length!=_realtmp[1][0].length) 
 {
 _message="not same number of parameters"
 throw _myexception
 }
for(_iii=0;_iii<_tmp[1][0].length;++_iii)
for(_ii=0;_ii<_par.length;++_ii)
if(_tmp[1][0][_iii]==_par[_ii]) 
_realtmp[1]=_tmp[1]
while ((_x=_findfirstname(_str,_position))[1]!=-1)
	{
	if (_x[2])
		{
		_therealparams=_getrealparams(_str,_x[1]+_x[0].length+1)
		if((_x[0]==_tmp[0])&&(_therealparams[0].length==_tmp[1][0].length))
			{
			_str=_str.substring(0,_x[1])+_realtmp[0]+'('+_replaceparams(_tmp[1][0],_realtmp[1][0],_therealparams[2])+
			')'+_str.substring(_x[1]+_x[0].length+_therealparams[2].length+2)
			} 
		_position=_x[1]+_realtmp[0].length+1   
		}
	else
		_position=_x[1]+_x[0].length
	}
}
}
_rightstr=_str
for(_i=0;_i<_par.length;++_i)
{
var _re=new RegExp("(?:(\\W|\\b|\\d))"+_par[_i]+"(?=(\\W|\\b))")

	var _token=_re.exec(_rightstr)
	var re2=/[_a-zA-Z]+\d+/
   var token2=re2.exec(_realpar[_i])
   if(!token2)
	var _tempor=_display(_eval(_replacefunctions(_realpar[_i])))
	else
	var _tempor=_realpar[_i]
	while (_token!=null)
	{
	if(_rightstr.charAt(_token.index+_par[_i].length)!="(")
		{
		_leftstr=_leftstr+_rightstr.substring(0,_token.index+(_token[1]?_token[1].length:0))
		_rightstr=_rightstr.substring(_token.index+_par[_i].length+(_token[1]?_token[1].length:0))
		_leftstr=_leftstr+"("+_tempor+")"
		}
	else
		{ 
		_leftstr=_leftstr+_rightstr.substring(0,_token.index+_par[_i].length+1)
		_rightstr=_rightstr.substring(_token.index+_par[_i].length+1)
		} 
	_token=_re.exec(_rightstr)
}

_rightstr=_leftstr+_rightstr
_leftstr=''
}
return _rightstr
}

function countquotes(_str)
{
var counter = 0
while (_str.indexOf('"')!=-1)
{
++counter
_str=_str.substring(_str.indexOf('"')+1)
}
return counter%2
}


function _replacefunctions(_line)
{
var 
_callcounter=0,
_f,
_position=0,
_redoit,
_ii=0 ,_iii=0,
_paramandlength=[],
_realparams=[],
_counter=0,
_x=[],
_expression='',
_cp,_paramsFN=[],
_leftstr,_rightstr

for(_ii==0;_ii<_fN.length;++_ii)
 _fN[_ii][3]=0
while ((_x=_findfirstname(_line,_position))[1]!=-1)
 {
	_counter=0
	_redoit=false

	for(_ii=0;_ii<_fN.length;++_ii)
	{_cp=-1
	if(_x[0]==_fN[_ii][0])
		{
		if ((_x[2])&&(_fN[_ii][1].length>0))
			{
			_paramandlength= _getrealparams(_line,_x[1]+_x[0].length+1)
			_realparams=_paramandlength[0]
			_paramsFN=_fN[_ii][1]
			if(_realparams.length==_paramsFN.length)
				{
				_cp=_ii
				++_counter
				_callcounter=++_fN[_ii][3]      
				_leftstr=_line.substr(0,_x[1])
				_rightstr=_line.substr(_x[1]+_x[0].length+_paramandlength[1]+2)

				_expression=_fN[_ii][4]
				if(countquotes(_leftstr))
				{
				_expression=_expression.replace(/"/g,_psi+_stack)
				++_stack
				}
				_expression=_replaceparams(_paramsFN,_realparams,_expression)
				}
			}
			else 
			if ((!_x[2])&&(_fN[_ii][1].length==0))
				{
				_cp=_ii
				++_counter
				_callcounter=++_fN[_ii][3]
				_leftstr=_line.substr(0,_x[1])
				
				_rightstr=_line.substr(_x[1]+_x[0].length)
				_expression=_fN[_ii][4]
				
				if(countquotes(_leftstr))
				{
				_expression=_expression.replace(/"/g,_psi+_stack)
				++_stack
				}	
				
				}
		}  
	if(_counter>0)
		{
		_line=_leftstr+'('+_expression+')'+_rightstr
		_redoit=true
		break   
		}
	}
	if (_counter==0) 
		_message ="unknown name "+_x[0]
	if(_callcounter > 40)
		{
		_message="perhaps recursion at function "+_x[0]
		_fN.length=_defaultfunctions
		throw _myexception
		}
if (_redoit)
_position=_x[1]
else
{
_position=_x[1]+_x[0].length+1
if((_cp>-1)&&_fN[_cp][10])
_position=_x[1]+_expression.length
}

}
return _line
}

function _checkpar(_str)
{
var _unacceptable='()(){}[}(}{){]('
var _leftlevel=-1,_rightlevel=0,_countequal=0,_equallevel=-1,_level=0
var _levelabs =new Array(),_listlevel = new Array()
_listlevel[0]=0 
_levelabs[0]=0
var _oldch=" ",_ch,_maxlevel=0,_i
for(_i=0;_i<_str.length;++_i)
{
_ch=_str.charAt(_i)
if (_unacceptable.indexOf(_oldch+_ch)!=-1)
	{
	_message="unacceptable "+_oldch+_ch
	throw _myexception
	}
switch (_ch)
{
case "(":
		++_level
		_levelabs[_level]=0
		_listlevel[_level]=0
		_maxlevel=_level
		break;
case "[":
		++_listlevel[_level]
		break;
case "]":
		--_listlevel[_level]
		if (_listlevel[_level]<0)
			{
			_message="problem with lists"
			throw _myexception
			}
		break; 
case "{":
		++_levelabs[_level]
		break;
case "}":
		--_levelabs[_level]
		if (_levelabs[_level]<0)
			{
			_message="problem with absolute"
			throw _myexception
			}
		break; 
case ")":if(_levelabs[_level]||_listlevel[_level])
           {
			_message="problem with absolute or brackets"
			throw _myexception
			}
			--_level
			if(_level<0) return [_countequal,0,0,0,-1] 
		break;
case "=":
		if(!_level&&(!_levelabs[_level])&&(!_listlevel[_level])) 
			{
			++_countequal
			_equallevel=_level 
			_leftlevel=_maxlevel
			_maxlevel=0
			} 
			else
			{
			_message="problem with ="
			throw _myexception
			}
		break
}
_oldch=_ch
}
for(_i=0;_i<_levelabs.length;++_i) 
if (_levelabs[_i])
	{
	_message="problem with absolute and parenthesis at level "+_i
	throw _myexception
	} 
return [_countequal,_equallevel,_leftlevel,_maxlevel,_level] 
}


function _printfunctions()
{ 
var _tmp=""
 _report=window.open("","newwin")
 _tmp='<html><head></head><bod'
_tmp+='y style="font-family: Arial; font-size: 10pt">'

_tmp+='<br><b><font color="#333333">user defined functions and variables</font></b><br><hr>'
 
 if (_fN.length==_defaultfunctions) _tmp+="<p>NONE</p>"
 for(_ii=_defaultfunctions;_ii<_fN.length;++_ii)
  _tmp+=_fN[_ii][0]+((_fN[_ii][1].length==0)?"":"(")+_fN[_ii][1]+((_fN[_ii][1].length==0)?"=":")=")+_fN[_ii][5]+"<br>"
 _tmp+='<br><b><font color="#333333">results ( angles in '+(Math.deg?"degrees":"radians")+ ")</font></b><br><hr>"
 _tmp+='</bo'
_tmp+='dy></html>'
 _report.document.write(_tmp)
}



// symbols and values for units taken from http://physics.nist.gov/cuu/Units/rules.html"
_L1=[
 ["m","cm","mm","km","mi","miles","yd","in","ft","acre","knot","mach"],
 ["L","gal","bu","bbl"],
 ["J","cal","Btu","erg"],
 ["s","sec","min","h","yr","d","Hz"],
 ["g","kg","lb","t","oz"],
 ["A","C","V","F","S","Wb"],
 ["N","dyn","kgf","lbf","W","hp","kp","kip","ozf"],
 ["dollar","euro"],
 ["Pa","Torr","bar","atm","at","inHg","psi","mmHg"]
 ]
_L2=[
["__LL","m/100","m/1000","1000*m","5280*ft","mi","m/1.0936","2.54*cm","yd/3","4046.8564*m^2","0.514444*m/s","m/s/0.0030154814819282195"],
["1000*cm^3","3.785412*L","35.23907*L","42*gal"],
["N*m","4.19002*J","1055.87*J","J/10000000"],
["__TT","s","s*60","60*min","365*24*h","24*h","1/s"],
["__MM","1000*g","kg/2.2046","1000*kg","0.02834952*kg"],
["__AA","A*s","W/A","C/V","A/V","V*s"],
["g*m/s^2","N/1000000","9.80665*N","4.448222*N","J/s","550*ft*lbf/s","kgf","1000*lbf","0.2780139*N"],
["__DD","0.99*dollar"],
["N/m^2","Pa/0.007501","Pa/0.00001","10132.5*Pa","9806.65*Pa","3386.389*Pa","lbf/in^2","133.3224*Pa"],
] 
 
function _convert(_src)
{
var _i
var _j
var _x
var _coef="1"
var _position=0
var _leftstr=""
var _rightstr=""
var _counter=0
while ((_x=_findfirstname(_src,_position))[1]!=-1)
{
_leftstr=_src.substring(0,_x[1])
_rightstr=_src.substring(_x[1]+_x[0].length)
for(_i=0;_i<_L1.length;++_i)
for(_j=0;_j<_L1[_i].length;++_j)
{
	if(_x[0]==_L1[_i][_j])
	{
	_coef=_coef+"*"+_L2[_i][_j]
	_src=_leftstr+"("+_coef+")"+_rightstr
	break
	}
}
 
if((_x[0]=="__LL")||(_x[0]=="__TT")||(_x[0]=="__MM")||(_x[0]=="__DD")||(_x[0]=="__AA"))
_position=_x[1]+_x[0].length
_coef="1"
if(++_counter>30) 
{
_message="unknown unit "+_x[0]
throw _myexception
}
}
_src=_replacepower(_src)
return _src
}
var __LL
var __TT
var __MM
var __DD
var __AA
function _fortest(_LL)
{
__LL=++_LL
__TT=++_LL
__MM=++_LL
__DD=++_LL
__AA=++_LL
}
function _testdim(_src)
{
if(Math.abs((_fortest(1),eval(_src))-(_fortest(3),eval(_src)))<1E-8)
{
_message="dimensioless units"
throw _myexception
}
}
function _replall(_str)
{
while (_str.indexOf("  ")!=-1)
_str=_str.replace("  "," ")
_reg=/^[ ]*/g
_str=_str.replace(_reg,"")
_reg=/\( */g
_str=_str.replace(_reg,"(")
_reg=/ *\)/g
_str=_str.replace(_reg,")")
_reg=/ *\[ */g
_str=_str.replace(_reg,"[")
_reg=/ *\]/g
_str=_str.replace(_reg,"]")
_reg=/ *\|/g
_str=_str.replace(_reg,"|")
_reg=/ *, */g
_str=_str.replace(_reg,",")
_reg=/ *' */g
_str=_str.replace(_reg,"'")
_str=_str.replace(/ *= */g,"=")
_str=_str.replace(/==/g,_xi)
_str=_str.replace(/>=/g,"@")
_str=_str.replace(/<=/g,"$")
_str=_str.replace(/<>/g,";")
_str=_str.replace(/\.\./g,_phi)


while (_str.indexOf(" "+_roots)!=-1)
_str=_str.replace(" "+_roots,_roots)
while (_str.indexOf(_epi)!=-1)
_str=_str.replace(_epi,"*")

return _str
}

function _restall(_str)
{
var _t=new RegExp(_xi,"g")
_str=_str.replace(_t,"==")
_str=_str.replace(/@/g,">=")
_str=_str.replace(/\$/g,"<=")
_str=_str.replace(/;/g,"!=")
_str=_str.replace(/\*/g,_epi)
 _t=new RegExp(_phi,"g")
_str=_str.replace(_t,"..")


return _str
}

function _display(_a)
{
_a=_eval(_a)
var k,tmp=''
function _displayall(_a)
{
var i
for(i=0;i<_a.length;++i)
{
if (typeof(_a[i])=='object')
{
if (k)
	tmp=tmp+","
tmp=tmp+"["
k=false  
_displayall(_a[i])
tmp=tmp+"]"
}
else
{
tmp=tmp+((k)?",":"")+_a[i]
k=true
}
} 
}
if(typeof(_a)=='object')
{
tmp=tmp+"["
_displayall(_a)
tmp=tmp+"]"
return tmp
}
else
return _a
}


var _stack=0

for(_ii=0;_ii<_fN.length;++_ii)
_fN[_ii][4]=_replacepower(_fN[_ii][2])

var tree=new Array()
var tree2=new Array()

function createtree(_str,level,vname)
{
var i
var _x 
if(_isafunction(_str))
 {
 _x=_splitFunction(_str)
 while(tree2[level]) ++level
 
 tree2[level]=[]
 tree[level]=[vname,_x[0]]
 for(i=0;i<_x[1][0].length;++i)
			{
			if(_isafunction(_x[1][0][i]))
			{
			var _glv="_glv"+level+tree2[level].length
			tree2[level][tree2[level].length]=_glv
			createtree(_x[1][0][i],level,_glv)
			}
			else
			tree2[level][tree2[level].length]=_x[1][0][i]
			}
 }	
}

	
function valueof(_str)
{
var _i
tree = new Array()
tree2= new Array()
createtree(_str,1,"start")
if(tree.length)
{
for(_i=tree2.length-1;_i>0;--_i)
{
		try
		{
		if(tree[_i][1]=="_Map") throw _myexception
		_t1=_replacefunctions(tree[_i][1]+'('+tree2[_i].toString()+')')
		_t2=_eval(_t1)
		_t3=_display(_t2)
//		if(_ev)
//		tree[i][0]=_t3
//		else
		eval(tree[_i][0]+"="+_t3)
		}
		catch(_er)
		{
		return _replacefunctions(_str)
		}
}		
return tree[1][0]
}
else
return _replacefunctions(_str)
}	

function _docalc(_todoc)
{
var _ii
newf=new Array()
fnames=new Array()

stackmap=0
_b=[]
_fortest(1)
var _line=""
var _unit=[]
var _result=""
_lines=[]
_units=[]
_temp=_text.value
document.cookie="v="+_text.value+"; expires=Mon, 31-Mar-2009 08:00:00 GMT"
_message="undefined syntax error"
 
Math.deg=document.getElementById("__r1").checked


try
{
while (_temp.indexOf(" "+_cr)!=-1)
_temp=_temp.replace(" "+_cr,_cr)
while (_temp.indexOf(_cr+_cr)!=-1)
_temp=_temp.replace(_cr+_cr,_cr)


_temp=_replall(_temp)
_MakeLines(_temp)
_calculate()
if (_todoc)
_printfunctions()

for(_ii=0;_ii<_lines.length;++_ii) 
{
_line=_lines[_ii][0]
_lines[_ii][0]=_restall(_lines[_ii][0]) 
_line=_replacepower(_line)
_line=_line.replace(/{/g,"(")
_line=_line.replace(/}/g,")")
_line=_restall(_line) 

try{
_firstunit=""
_lastunit=""
newf=new Array()

_r1=valueof(_line)
_r2=eval(_r1)
_result=_display(_r2)
if((typeof(_result)=='string')&&(_result.indexOf('"')!=-1))
 throw myexception
if (_units[_ii].length>0)
{
_firstunit=_units[_ii][0]
_testdim(_convert(_firstunit))
_lastunit=_firstunit
for(_iii=1;_iii<_units[_ii].length;++_iii)
{
_lastunit=_units[_ii][_iii]
_testdim(_convert(_lastunit))

eval("var _test="+" \"(\"+ _convert(_units[_ii][_iii-1])+\")/(\"+_convert(_units[_ii][_iii])+\")\" ")    
if(
!(
(Math.abs((eval(_test))-(_fortest(2),eval(_test)))<1E-7) &&
(Math.abs((_fortest(3),eval(_test))-(_fortest(4),eval(_test)))<1E-7)
)
)
{
_message="incompatibles units"
throw _myexception
}
_result=_op(_result, eval(_test),2)

}
}
__=_display(_result)
_=_result
if (typeof(_result)=='number')
eval("var _"+(_ii+1)+"="+_result)
else
eval("var _"+(_ii+1)+"="+__)
_answer.value=((_ls=_restabs(_lines[_ii][0]).toString()).substring(0,15))+(_ls.length>15?"...":"")+" "+_firstunit+"= "+__+" "+_lastunit

if (_todoc)
_report.document.write(_ls," ",_firstunit," = ",__," ",_lastunit,"<br>")

}
catch(_er)
{if (_lines[_ii][1])
{
if (_message.indexOf("unknownname")!=-1)
_answer.value="O.K" 
} 
else
_answer.value=_message
}
}
}
catch(_myexception)
{
_answer.value=_message
}
if(!_todoc) 
document.getElementById("__s1").focus()
else
if (_report)
_report.focus()
}

 
function _aS(_p)
{
document.getElementById("__s1").focus()
_text.value=_text.value+String.fromCharCode(_p)
}

function _f1()
{
var _pos,_i,_tmp,_ar
if((_pos=(_tmp=unescape(document.location.toString())).indexOf("?"))>0)
{
var _ar=_tmp.substring(_pos+1).split(":")
_text.value=_ar[0]
for(_i=1;_i<_ar.length;++_i)
_text.value=_text.value+String.fromCharCode(13)+_ar[_i]
_docalc()
}
/*else
if(str=document.cookie)
_text.value=str.substring(str.indexOf("=")+1).replace(/__/g,String.fromCharCode(13))
*/
}
window.onload=_f1
