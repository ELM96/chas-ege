escapeFromIframe();

$('#zadaniya').html('');
for(var i=1;i<=nabor.nZad;i++){
	document.getElementById('zadaniya').innerHTML+='<tr><td><label for="cB'+i+'" >'+nabor.prefix+i+'</label></td>'+
	'<td><input type="text" class="kolvo" value="1" id="cB'+i+'" data-jstorage-id="pech-cB'+i+'"></td></tr>';
}

$('#gotov').hide();
var vr1=svinta?100:200;
var vr2=svinta?100:1500;

var startxt='';
window.vopr.txt='';
var stardate=new Date().getTime();
var novdate;
var intervPole;
var nV=1;
var nZ=1;
var aZ=[];
var iZ=[];
var aV;
var strVopr='';
var strOtv='';

function vse1(){
	for(var i=1;i<=nabor.nZad;i++)
		$('#cB'+i).val(1);
	$('#cV').val(1);
}

function vse0(){
	for(var i=1;i<=nabor.nZad;i++)
		$('#cB'+i).val(0);
	$('#cV').val(1);
}

function zapusk(){
	$.jStorage.sohrData()
	nV=1*$('#cV').val();
	aV=nV;
	for(var i=1;i<=nabor.nZad;i++)
		aZ[i]=1*($('#cB'+i).val());
	cacheKat();
	kZ=aZ.sum()*aV;
	if(!kZ){
		alert('Ни одно задание не выбрано.');
		return;
	}
	iZ=aZ.slice();
	nZ=0;
	$('#panel').html('Тесты составляются, подождите...');
	$('#gotov').show();
	zadan();
}

function razrstr(){
	var d2=document.createElement('div');
	d2.innerHTML='<hr class="pbb"/><div class="d"></div>';
	d2.className='d d2';
	document.getElementById('rez').appendChild(d2);

}

function testGotov(){
	$('#gotov').hide();
	allCanvasToBackgroundImage();
	alert('Тесты составлены.\nТеперь Вы можете распечатать их с помощью Вашего браузера.');
}

function udalPanel(){
	$('#panel').remove();
	$('#menucenter').remove();
	$('#inf').remove();
}

function konecSozd(){
	strOtv='<hr class="pbb"/><h2>Ответы</h2>'+strOtv;
	$('#otv').html(strOtv);
	MathJax.Hub.Typeset('rez',testGotov);
	udalPanel();
	$("hr:first").remove();
	$("hr:first").remove();
	document.body.style.backgroundColor="#FFF";
	if(!bGecko)
		razrstr();
	$('body').append('<script>udalPanel()</script>');			
}

function vNachaloVarianta(){
	nV--;
	nZ=0;
	strOtv+='</table>';
	zadan();
}

function zadan(){
	if(nZ==1+1*nabor.nZad){
		vNachaloVarianta();
		return;
	}else if (nZ==0){
		if(!nV){
			konecSozd();
			return;
		}else{
			iZ=aZ.slice();
			stardate=novdate;
			novdate=new Date().getTime();
			strVopr='<div class="d"><h2>Вариант №'+novdate+'</h2></div>';

			if(!bGecko && aV!=nV)
				razrstr();

			var din=document.createElement('div');
			din.innerHTML=strVopr;
			din.class='d d4';
			document.getElementById('rez').appendChild(din);
			strOtv+='<table class="normtabl tablpech"><tr><th colspan="3">';
			strOtv+='Ответы к варианту<br/>№'+novdate+'</th></tr>';
			nZ=1;
			zadan();
			return;
		}
	}else{
		if(iZ[nZ]==0){
			nZ++;
			zadan();
		}else{
			iZ[nZ]--;
			zagr(nabor.adres+nabor.prefix+nZ+'/main.js');
			vopr.podg();
			intervPole=setTimeout("zagr(nabor.adres+nabor.prefix+nZ+'/'+nomer+'.js');",vr1);
			intervPole=setTimeout('obnov();',vr1+vr2);
		}
		return;
	}
}
function obnov(){
	if((window.vopr.txt!=0)&&(startxt!=window.vopr.txt)){
		clearInterval(intervPole);
		if(!sootvKat()){
			iZ[nZ]++;
			zadan();
			return;
		}
		starttxt=window.vopr.txt;
		strVopr='<br/><div class="d"><div class="b">'+nabor.prefix+nZ+(aZ[nZ]==1?'':'-'+(aZ[nZ]-iZ[nZ]))+'</div>'+window.vopr.txt+'</div>';
		var din=document.createElement('div');
		din.innerHTML=strVopr;
		din.class='d d3';
		din.width="100%";
		document.getElementById('rez').appendChild(din);
		strOtv+='<tr><td>'+novdate+'</td><td>'+nabor.prefix+nZ+(aZ[nZ]==1?'':'-'+(aZ[nZ]-iZ[nZ]))+'</td><td>'+window.vopr.ver.join('; ')+'</td></tr>';
		try{
			window.vopr.dey();
		}catch(e){}
		var sdel=aZ.sum()*(aV-nV+1)-iZ.sum();
		var w=sdel/kZ;
		$('.tx').text((100*w).toFixedLess(1).dopdo(' ',4)+'%');
		$('#pr1').width($('#pr0').width()*w);
		var v=(vr1+vr2)*(kZ-sdel)/1000;
		$('#vrem').text(sdel+' из '+kZ+' '+v.toDvoet());
		zadan();
	}else{
		setTimeout("zagr('nabor.adres+nabor.prefix+"+nZ+"+'/'+nomer+'.js');",vr1);
		intervPole=setTimeout('obnov();',vr1+vr2);		
	}
}

galkiKat('#galki_kat','pech');
