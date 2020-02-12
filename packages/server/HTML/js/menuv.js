let run = false;
let index = 1;
let length = 0;
let backs = [];
let backindex = 0;
let infomenu = {};
let exitmenu = '';
let exitmenu_callback = '';
let backmenu_callback = '';
let exit = true;
let locked_menuv = false;
let sizeItem = 32;
function refinfo(i) {
		index = i;
		exit = true;
		//расфокусить активный input
		if($('.menuv .item.active').data('input')!=undefined){
				$('.menuv .item.active .input input').blur();
		}
		length = $('.menuv .items .item:visible').length;
		$('.menuv .info').html(`${index}/${length}`);
		$('.menuv .placeholder').html($($('.menuv .item')[index-1]).data('placeholder') || '');
		$('.menuv .item:visible.active').removeClass('active');
		$($('.menuv .item:visible')[index-1]).addClass('active');
		//функция колбека при активаци определенного item
		if($('.menuv .item:visible.active').data('callpointenct')!=undefined){
			mp.trigger('menuvpointect',$('.menuv .item.active').data('callback'),$('.menuv .item.active').data('callpointenct'));
		}
		//сфокусировать активный input
		if($('.menuv .item.active').data('input')!=undefined){
				$('.menuv .item.active .input input').focus();
				exit = false;
		}
		
		let h = (index-1)*$('.menuv .item:visible.active').outerHeight().toFixed(1);
		$('.menuv .items').scrollTop(h);
}
let info2 = {
	name: 'tes1',
	items: [{
		type: 0,
		name: 'test5',
		placeholder: 'test',
	},
	{
		type: 0,
		name: 'test',
		placeholder: '',
	},
	{
		type: 1,
		name: 'close',
		placeholder: 'test',
	}
	]
}
let info = {
	name: 'tes1',
	items: [{
		type: 0,
		name: 'callback',
		placeholder: 'test',
		callback: 'test'
	},
	{
		type: 2,
		name: 'open',
		placeholder: '',
		infomenu: info2
	},
	{
		type: 3,
		name: 'maxint',
		placeholder: 'test',
		callback: 'test',
		max: 5
	},
	{
		type: 4,
		name: 'switch',
		placeholder: 'test',
		callback: 'test',
		swith: ['1','2','3','4']
	},
	{
		type: 5,
		name: 'input',
		placeholder: 'test',
		type_input: 'number'
	},
	{
		type: 6,
		name: 'toggle',
		checked: true,
		callback: 'vehlocked',
		callpointenct: '54',
		placeholder: 'test'
	},
	{
		type: 0,
		name: 'calpo',
		placeholder: 'test',
		callback: 'test',
		callpointenct: 'test'
	},
	{
		type: 1,
		name: 'close',
		placeholder: 'test',
	},
	{
		type: 1,
		name: 'close',
		placeholder: 'test',
	}
	]
}
function delitemsMenuv(id){
	if($($('.menuv .items .item')[id]).length == 1){
		$($('.menuv .items .item')[id]).remove();
	}
	refinfo(1);
}
function showitemsMenuv(id){
	if($($('.menuv .items .item')[id]).length == 1){
		$($('.menuv .items .item')[id]).show();
	}
	refinfo(1);
}
function hideitemsMenuv(id){
	if($($('.menuv .items .item')[id]).length == 1){
		$($('.menuv .items .item')[id]).hide();
	}
	refinfo(1);
}
function editmaxMenuv(id,max){
	$($('.menuv .items .item')[id]).data('maxint',max);
	$($('.menuv .items .item')[id]).find('span').html('0');
}
function editPlaceholderMenuv(id,placeholder){
	$($('.menuv .items .item')[id]).data('placeholder',placeholder);
	if(index == id){
		$('.menuv .placeholder').html(placeholder);

	}
}
function additem(item){
	$('.menuv .items').append(retitem(item));
	refinfo(index);
}
function retitem(iteminfo) {
	let item = '';
	let variabels = `
		${iteminfo.placeholder!=undefined?'data-placeholder="'+iteminfo.placeholder+'"':''} 
		${i == 0?'class="item '+iteminfo.placeholder+'"':'class="item"'} 
		${iteminfo.callback!=undefined ? 'data-callback="'+iteminfo.callback+'"' : ''} 
		${iteminfo.callpointenct!=undefined?'data-callpointenct="'+iteminfo.callpointenct+'"' : ''}
		${iteminfo.value!=undefined?'data-value="'+iteminfo.value+'"' : ''}
		${iteminfo.cswitch!=undefined?'data-cswitch="'+iteminfo.cswitch+'"' : ''}
		${iteminfo.callback_remote!=undefined?'data-callback_remote="'+iteminfo.callback_remote+'"' : ''}
		`

		if(i == 0)active = 'active';
		if(iteminfo.type == 0){
			item = item + `<div ${variabels}">${iteminfo.name}</div>`;
		}
		if(iteminfo.type == 1){
			item = item + `<div data-close='' ${variabels}">${iteminfo.name}</div>`;
		}
		if(iteminfo.type == 2){
			let menuto = `data-menu='${JSON.stringify(iteminfo.infomenu)}'`
			item = item + `<div  ${menuto} ${variabels}">${iteminfo.name}</div>`;
		}
		if(iteminfo.type == 3){
			let int = `data-maxint='${iteminfo.max}'`;
			item = item + `<div ${int} ${variabels}"><div class="left">${iteminfo.name}</div><div class="right"><span>${iteminfo.index ? iteminfo.index : 0}</span></div>	</div>`;
		}
		if(iteminfo.type == 4){
			let swith = `data-swith='${JSON.stringify(iteminfo.swith)}'`;
			let ins = iteminfo.index ? iteminfo.swith[iteminfo.index] : iteminfo.swith[0];
			item = item + `<div ${swith} data-index='${iteminfo.index?''+iteminfo.index:'0'}' ${variabels}"><div class="left">${iteminfo.name}</div><div class="right"><span>${ins}</span></div>	</div>`;
		}
		if(iteminfo.type == 5){
			let input = `data-input=''`;
			let inputValue = iteminfo.inputValue || ''
			item = item + `<div ${input} data-index='0' min='0' ${variabels}"><div class="left">${iteminfo.name}</div><div class="input"><input value="${inputValue}" type="${iteminfo.type_input ? iteminfo.type_input: 'text'   }" /></div>	</div>`;
		}
		if(iteminfo.type == 6){
			let toggle = `data-toggle='${iteminfo.checked}'`;
			let tog =  iteminfo.checked ? '<i class="fas fa-check"></i>':'';
			item = item + `<div ${toggle} data-index='0' ${variabels}"><div class="left">${iteminfo.name}</div><div class="toggle">${tog}</div></div>`;
		}
		return item;
}
function createMenuv(info,back){
	if(exit == false) return;
	if(run) $('.menuv').remove();
	let items = info.items;
	let item = '';
	if(!back) info.items.push({
		type: 1,
		name: 'Закрыть меню'
	})
	infomenu = info;
	if(info.exitmenu_callback) exitmenu_callback  = info.exitmenu_callback;
	backmenu_callback  = info.backmenu_callback ? info.backmenu_callback : '';
	exitmenu  = info.exitmenu ? info.exitmenu : '';
	for(i=0;i<items.length;i++){
		item = item + retitem(items[i]);
	}
	$('body').append(`
		<div class="menuv">
		<div class="title">
			<h1>${info.name}</h1>
		</div>
		<div class="info">
			<span>11/53</span>
		</div>
			<div class="items">
				${item}
			</div>
		<div class="placeholder"></div>
	</div>
		`);
	run = true;
	length = info.items.length;
	refinfo(1);
	$('input').bind('keydown', function(e){
		if(e.which == 40 || e.which==38) e.preventDefault();
	});
	sizeItem = $('.menuv .items .item.active').outerHeight();
}
function locked_menuv_tog(is) {
	locked_menuv = is;
}
$("body").keydown(function(event){
	if(locked_menuv == true) return;
		let elem = $('.menuv .item.active');
		if(event.which == 13){
			if(elem.data('toggle')!=undefined){
				let check = !elem.data('toggle');
				elem.data('toggle',check);
				let tog =  check ? '<i class="fas fa-check"></i>':'';
				elem.find('.toggle').html(tog);
			}
			if(elem.data('cswitch') != undefined){
				let vars = [{[elem.find('.left').html()]:elem.data('callpointenct')}];
				mp.trigger('menuvswitch',elem.data('cswitch'),JSON.stringify(vars));
			}
			if(elem.data('callback_remote') != undefined){
				let vars = [{[elem.find('.left').html()]:elem.data('callpointenct')}];
				mp.trigger('menuv_callback_remote',elem.data('callback_remote'),JSON.stringify(vars));
			}
			if(elem.data('callback')!=undefined){
				let vars = allinputs();
				if(elem.data('callpointenct')!=undefined){
					vars = [{[elem.find('.left').html()]:elem.data('callpointenct')}];
				}
				if(elem.data('toggle')!=undefined){
					vars = [{'toggle':elem.data('toggle'),[elem.html()]:elem.data('callpointenct')}]
				}
				mp.trigger('menuvcallback',elem.data('callback'),JSON.stringify(vars));
			}
			if(elem.data('menu') != undefined){
				openitem(elem.data('menu'));
			}

			
			if(elem.data('close') != undefined){
				closemenuv();
			}
		}
		if(event.which == 40){
			if(!run) return; 
			if(index < length) refinfo(index+1);
			else refinfo(1);
		}
		if(event.which == 38){
			if(!run) return; 
			if(index != 1) refinfo(index-1);
			else refinfo(length);
		}
		if(event.which == 8){
			if(!run) return;
			returnback();
		}
		
		if(event.which == 39){
			let elem = $('.menuv .item.active');
			if(elem.data('maxint') != undefined){
				let maxint = parseInt(elem.data('maxint'));
				let int = elem.find('.right span');
				let i = parseInt(int.html())+1;
				i = i <= maxint ? i : 0;  
				int.html(''+i);
				if(elem.data('callpointenct')!=undefined){
					let vars = [{[elem.html()]:i}];
					mp.trigger('menuvswitch',elem.data('callpointenct'),JSON.stringify(vars));
				}
			}
			if(elem.data('swith') != undefined){
				let swith = elem.data('swith');
				let index = parseInt(elem.data('index'))+1;
				if(index <= swith.length-1){
					elem.find('.right span').html(swith[index]);
					elem.data('index',''+index);
				}else{
					elem.find('.right span').html(swith[0]);
					elem.data('index','0');
				}
				if(elem.data('callpointenct')!=undefined){
					let vars = [{[elem.html()]:elem.data('index')}];
					mp.trigger('menuvswitch',elem.data('callpointenct'),JSON.stringify(vars));
				}
				let text = elem.find('.right span').html();
				let size  = 16/(text.length/10)
				elem.find('.right span').css('font-size',`${text.length > 10 ?size+'px'  :'1em' }`) 
				elem.find('.right span').css('margin-top',`${text.length > 10 ?(16/size)*2-1 : 0}px`)
				elem.find('.right span').css(' width:',`${text.length > 10 ? 'calc((95% - 20px) - 20px);' : 'auto'}`) 
			}
			
		}
		if(event.which == 37){
			let elem = $('.menuv .item.active');
			if(elem.data('maxint') != undefined){
				let maxint = parseInt(elem.data('maxint'));
				let int = elem.find('.right span');
				let i = parseInt(int.html())-1;
				i = i!=-1 ? i : maxint;  
				int.html(''+i);
				if(elem.data('callpointenct')!=undefined){
					let vars = [{[elem.html()]:i}];
					mp.trigger('menuvswitch',elem.data('callpointenct'),JSON.stringify(vars));
				}
			}
			if(elem.data('swith') != undefined){
				let swith = elem.data('swith');
				let index = parseInt(elem.data('index'))-1;
				if(index >= 0){
					elem.find('.right span').html(swith[index]);
					elem.data('index',''+index);
				}else{
					elem.find('.right span').html(swith[swith.length-1]);
					elem.data('index',''+swith.length-1);
				}
				if(elem.data('callpointenct')!=undefined){
					let vars = [{[elem.html()]:elem.data('index')}];
					mp.trigger('menuvswitch',elem.data('callpointenct'),JSON.stringify(vars));
				}
				let text = elem.find('.right span').html();
				let size  = 16/(text.length/10)
				elem.find('.right span').css('font-size',`${text.length > 10 ?size+'px'  :'1em' }`) 
				elem.find('.right span').css('margin-top',`${text.length > 10 ?(16/size)*2-1 : 0}px`) 
				elem.find('.right span').css(' width:',`${text.length > 10 ? 'calc((95% - 20px) - 20px);' : 'auto'}`) 
			}
		}
});
function closemenuv(cal){
	if(cal && cal != exitmenu) return;
	if(!run ) return;
	length = 0;
	index = 1;
	$('.menuv').remove();
	infomenu = {};
	backindex = 0;
	backs = [];
	if(exitmenu_callback!='') mp.trigger(exitmenu_callback);
	exitmenu_callback = '';
	backmenu_callback = '';
	exit = true;
	locked_menuv = false;
}
function openitem(info) {
	backs.push(infomenu);
	createMenuv(info);
	backindex++;
}
function returnback() {
	if(exit == false) return;
	if(backindex>0){
		if(backmenu_callback!='') mp.trigger(backmenu_callback);
		createMenuv(backs[backs.length-1],true);
		backs.pop();
		backindex--;
	}
	else{
		closemenuv();
	}
}
function allinputs() {
	let inputs = [];
	let length = $('.menuv .item').length;
	for(let i=0;i<length;i++){
		elem = $($('.menuv .item')[i]);
		if(elem.data('maxint')!=undefined){
			let str = elem.find('.left').html();
			inputs.push({[str]:elem.find('span').html()})
		}
		if(elem.data('swith')!=undefined){
			let str = elem.find('.left').html();
			inputs.push({[str]:elem.data('index')})
		}
		if(elem.data('input')!=undefined){
			let str = elem.find('.left').html();
			inputs.push({[str]:elem.find('input').val()})
		}
		if(elem.data('value')!=undefined){
			let str = elem.find('.left').html();
			inputs.push({[str]:elem.data('value')})
		}
	}
	return inputs;
}