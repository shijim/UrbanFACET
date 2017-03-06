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
let getValRange = function(scales, esels, dsels, vuesels, index) {
	let sels = vuesels.objs[index],
		emin = Math.exp( Math.log(scales.e+1) * parseFloat(esels[0]) / 100.0 )-1,
		emax = Math.exp( Math.log(scales.e+1) * parseFloat(esels[1]) / 100.0 )-1,
		escales = scales.e;

	return {
		'e': { // entropy
			'min': emin,
			'max': emax,
			'scales': escales
		},
		'm': { // entropy
			'min': emin,
			'max': emax,
			'scales': escales
		},
		'd': { // density
			'min': Math.exp( Math.log(scales.d) * parseFloat(dsels[0]) / 100.0 ),
			'max': Math.exp( Math.log(scales.d) * parseFloat(dsels[1]) / 100.0 ),
			'scales': scales.d
		},
		'prop': {
			'type': sels.dtype,
			'maprev': sels.maprev,
			'multiColorSchema': vuesels.ctrsets.multiColorSchema,
			'useLocalExtrema': vuesels.ctrsets.useLocalExtrema,
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
		dtype = sels.dtype,
		ftpval = sels.ftpval;
	
	let p = new Promise(function(resolve, reject) {
		$.get(`/comp/overviewQuery?city=${city}&etype=${etype}&dtype=${dtype}&ftpval=${ftpval}`, function(res, err) {
			if (res['scode']) {
				resolve(res['data']);
			} else {
				reject(err);
			}
		});
	});

	return p;
};

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

export {
	getOverviewDatasets,
	getValRange,
	getSubGrids,
	getLinearNum,
	getRandomCenter,
	outOfRange
}