/**
 * apis.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-02-19 20:36:48
 * @version $Id$
 */

'use strict'
import $ from "jquery"

/**
 * 根据传回的数据确定当前 filter 以及 map 中的 value 范围
 * @param  {[type]} scales  [description]
 * @param  {[type]} esels   [description]
 * @param  {[type]} dsels   [description]
 * @param  {[type]} vuesels [vue instance 中存储的 selections object]
 * @return {[type]}         [description]
 */
let getDrawProps = function(scales, sels, ctrsets, props) {
	let emin = Math.exp( Math.log(scales.e+1) * parseFloat(sels[0]) / 100.0 )-1,
		emax = Math.exp( Math.log(scales.e+1) * parseFloat(sels[1]) / 100.0 )-1,
		escales = scales.e,
		dmin = Math.exp( Math.log(scales.d) * parseFloat(sels[0]) / 100.0 ),
		dmax = Math.exp( Math.log(scales.d) * parseFloat(sels[1]) / 100.0 ),
		dscales = scales.d,
		drawtype = 'e';

	if (props['etype'] === 'de') {
		drawtype = 'd';
	}

	return {
		'e': { // entropy
			'min': emin,
			'max': emax,
			'scales': escales
		},
		'd': { // density
			'min': dmin,
			'max': dmax,
			'scales': dscales
		},
		'prop': { // prop
			'rev': props['rev'],
			'drawtype': drawtype,
			'radius': ctrsets.radius * 0.0025,
			'opacity': ctrsets.opacity,
			'useLocalExtrema': ctrsets.useLocalExtrema,
		}
	}
};

let getSubGrids = function(poly, center, num=4) {
	if (num === 4) {
		return [
			{
				'nw': [center[1], poly[0][0]],
				'se': [poly[0][1], center[0]]
			},{
				'nw': [center[1], center[0]],
				'se': [poly[1][1], poly[1][0]]
			},{
				'nw': [poly[2][1], center[0]],
				'se': [center[1], poly[2][0]]
			},{
				'nw': [poly[3][1], poly[3][0]],
				'se': [center[1], center[0]]
			},
		]
	}
};

let getOverviewDatasets = function(sels) {
	let city = sels.city,
		etype = sels.etype,
		ftpval1 = sels.ftpval,
		ftpval2 = sels.ftpval2,
		ftpval = ftpval1;
	
	// 以时间段最为主要依据, 只有时间段在allday的时候才考虑日期类型信息,两者都在all的时候后台传送给服务器数据为空
	if (ftpval1 === '9') {
		if (ftpval2 === '10') {
			ftpval = '';
		} else {
			ftpval = ftpval2;
		}
	}

	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/overviewQuery?city=${city}&etype=${etype}&ftpval=${ftpval}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data']);
			} else {
				reject(err);
			}
		});
	});

	return p;
};

let getBoundaryDatasets = function(city) {
	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/boundaryQuery?city=${city}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data']);
			} else {
				reject(err);
			}
		})
	});

	return p;
}

let getAOIDatasets = function(city, type) {
	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/aoiQuery?city=${city}&type=${type}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data']);
			} else {
				reject(err);
			}
		})
	});

	return p;
}

let getSMecDatasets = function(city) {
	let p = new Promise(function(resolve, reject) {
		console.log(city);
		$.get(`/comp/mecStatQuery?city=${city}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data']);
			} else {
				reject(err);
			}
		})
	});

	return p;
}

let getAoiDisDatasets = function(city, type) {
	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/aoiDisQuery?city=${city}&type=${type}`, function (res, err) {
			if (res['scode']) {
				resolve(res['data']);
			} else {
				reject(err);
			}
		})
	})

	return p;
}

let getLinearNum = function(target, minVal, maxVal, minNum, maxNum) {
	if (target < minVal) {
		return 0;
	} else if (target > maxVal) {
		return maxNum;
	}

	let a = (maxNum-minNum) / Number.parseFloat(maxVal-minVal),
		b = minNum - minVal*a; 

	return Number.parseInt( a * target + b );
}

let getRandomCenter = function(point, base, scale) {
	let lng = (point[0]+base) + Math.random()*scale,
		lat = (point[1]+base) + Math.random()*scale;

	return [lng, lat]
}

let outOfRange = function(t, evalue, dvalue, emin, dmin) {
	if (t === 'e') {
		if (evalue < emin) {
    		return true;
    	}
	} else if (t === 'm') {
		if (evalue < emin || dvalue < dmin) {
    		return true;
    	}
	} else if (t === 'd') {
		if (dvalue < dmin) {
    		return true;
    	}
	}

	return false;
}

/**
 * object 复制函数， 未考虑传入数据的合法性
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
let objClone = function (obj) {
    let res = {};

    return JSON.parse(JSON.stringify(obj));;
};

let getPropName = function (argument) {
	if (argument === 'e') {
		return 'entropy';
	} else if (argument === 'd') {
		return 'density';
	}
}

let extraInfoIndex = function(val) {
	if (val === 'tg') {
		return 0;
	} else if (val === 'ag') {
		return 3;
	} else if (val === 'po') {
		return 1;
	} else {
		return 4;
	}
}

export {
	getOverviewDatasets,
	getBoundaryDatasets,
	getAOIDatasets,
	getSMecDatasets,
	getAoiDisDatasets,
	getDrawProps,
	getSubGrids,
	getLinearNum,
	getRandomCenter,
	outOfRange,
	objClone,
	getPropName,
	extraInfoIndex
}