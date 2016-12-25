/**
 * index.js in apis
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2016-12-20 16:22:50
 * @version $Id$
 */
'use strict'

let fs = require('fs');
let path = require('path');
let GeoJSON = require('geojson');

let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
let url = 'mongodb://192.168.1.42:27017/tdVC';

// 使用连接池，提升性能
let $sql = require('./mysqlMapping');
let pool = require('../../conf/db');

const lib = require('../../conf/lib');
const DATA = require('../../conf/data')

const shell = require('shelljs');
const ZERO = 0.00000001

// mongoDB 回调函数
let mongoCallback = function(err, result, res, prop) {
	let clalist = prop['clalist'],
		idstr = prop['idstr'],
		db = prop['db'],
		claidRelation = prop['claidRelation'],
		file = prop['file']

	let matrixsum = {},
		recnumdata = {}; // 存的所有人 matrix 集合加和, 以及分时段的定位次数加和

	console.time("Matrix sum result");
	if (err) {
		console.log(err);
	} else if (result.length) {
		// 计算每个类别下的累积 matrix 和分时段定位 array
		for (let i = 0; i < result.length; i++) {
			let id = result[i]['_id'].toString(),
				pVec = result[i]['pVec'],
				tpNumVec = result[i]['tpNumVec'],
				totalNum = result[i]['totalNum'],
				cla = claidRelation[id];

			if (!(cla in matrixsum)) {
				matrixsum[cla] = lib.MatrixAdd(result[i]['pVec'], result[i]['pVec'], 0.5, 2)
				recnumdata[cla] = result[i]['tpNumVec']
			} else {
				matrixsum[cla] = lib.MatrixAdd(result[i]['pVec'], matrixsum[cla], 1, 2)
				recnumdata[cla] = lib.MatrixAdd(recnumdata[cla], result[i]['tpNumVec'], 1, 1)
			}
		}
	} else {
		console.log('No document(s) found with defined "find" criteria!');
	}
	console.timeEnd("Matrix sum result")

	console.time("Class aggregation")
	let data = []
	for (let x = 0; x < clalist.length; x++) {
		// 统计档案
		let cla = clalist[x]
		let tmpresult = {},
			poirowsum = [],
			poiwholesum = 0,
			recsum = recnumdata[cla].reduce((a, b) => a + b, 0)

		// 删除 matrix 最后一栏 POI
		for (let i = 0; i < 12; i++) {
			matrixsum[cla][i].splice(10, 1);
			poirowsum.push(matrixsum[cla][i].reduce((a, b) => a + b, 0))
		}
		poiwholesum = poirowsum.reduce((a, b) => a + b, 0)

		tmpresult['userid'] = idstr
		tmpresult['id'] = cla
		tmpresult['poisum'] = poiwholesum
		tmpresult['recsum'] = recsum
		tmpresult['matrix'] = matrixsum[cla]


		// POI Types
		for (let i = 0; i < 10; i++) {
			// Time periods 0-5
			for (let j = 0; j < 6; j++) {
				let molecular = Number.parseFloat(matrixsum[cla][j][i] + matrixsum[cla][j + 6][i])
				if (molecular < ZERO) {
					tmpresult[`POI-${i}-t${j}`] = 0
				} else {
					tmpresult[`POI-${i}-t${j}`] = molecular / (poirowsum[j] + poirowsum[j + 6])
				}

			}
			// specific time periods 6-
			// 
			let moleculart6 = sixcolsum(i, 0, 'matrixsum'),
				moleculart7 = sixcolsum(i, 1, 'matrixsum'),
				moleculart8 = matrixsum[cla][1][i] + matrixsum[cla][2][i] + matrixsum[cla][3][i] + matrixsum[cla][7][i] + matrixsum[cla][8][i] + matrixsum[cla][9][i]

			if (moleculart6 < ZERO) {
				tmpresult[`POI-${i}-t6`] = 0
			} else {
				tmpresult[`POI-${i}-t6`] = moleculart6 / sixcolsum(i, 0, 'poirowsum')
			}

			if (moleculart7 < ZERO) {
				tmpresult[`POI-${i}-t7`] = 0
			} else {
				tmpresult[`POI-${i}-t7`] = moleculart7 / sixcolsum(i, 1, 'poirowsum')
			}

			if (moleculart8 < ZERO) {
				tmpresult[`POI-${i}-t8`] = 0
			} else {
				tmpresult[`POI-${i}-t8`] = moleculart8 / (poirowsum[1] + poirowsum[2] + poirowsum[3] + poirowsum[7] + poirowsum[8] + poirowsum[9])
			}

			function sixcolsum(poi, index, type) {
				let result = 0.0
				if (type === 'matrixsum') {
					for (let i = 0; i < 6; i++) {
						result += matrixsum[cla][i + index * 6][poi]
					}
				} else {
					for (let i = 0; i < 6; i++) {
						result += poirowsum[i + index * 6]
					}
				}

				return result
			}
		}

		data.push(tmpresult)
	}
	console.timeEnd("Class aggregation")

	console.time("Insert class results into mongo")
		// 插入统计档案数据,以便之后查询
	db.collection('tmp').deleteMany({ 'userid': idstr }, function(err, result) {
		db.collection('tmp').insertMany(data, function(err, result) {
			if (err) {
				console.log(err)
			} else {
				console.log("Inserted documents into the document collection");
				console.timeEnd('Insert class results into mongo')
				res.json({ 'scode': 1, 'clafilename': file, 'id': idstr, 'recomdData': data })
			}

			db.close()
		});
	})
}

// 预测结果计算函数
let recomdCal = function(dir, file, idstr, res) {
	fs.readFile(path.join(dir, file), readfileCallback);

	function readfileCallback(err, data) {
		// body...
		if (err) {
			return console.error(err);
		}
		// rawdata stores all origin data rows, groupedData stores the people records grouped by their belonged classes, clalist stores the classes string array, idlist stores all id string array

		console.log(`${file} loaded.`)
		let rawdata = data.toString().split('\n'),
			groupedData = {},
			clalist = [],
			idlist = [],
			claidRelation = {}

		console.log('File Row: ', rawdata.length)
		for (let i = 0; i < rawdata.length; i++) {
			let tmparr = rawdata[i].split(','),
				cla = Number.parseInt(tmparr[6]).toString(),
				id = Number.parseInt(tmparr[0]);

			claidRelation[id.toString()] = cla;

			// noise group
			if (cla === '-1') {
				continue
			}

			idlist.push(id);
			if (groupedData.hasOwnProperty(cla)) {
				groupedData[cla].push(tmparr);
			} else {
				clalist.push(cla);
				groupedData[cla] = [tmparr];
			}
		}
		console.log("Id number: ", idlist.length)
		console.time("Id Query")

		MongoClient.connect(url, function(err, db) {
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
				//HURRAY!! We are connected. :)
				console.log('Connection established to', url);

				let collection = db.collection('features_beijing');

				// console.log('idlist: ', idlist)
				collection.find({
					'_id': {
						"$in": idlist
					}
				}, { 'pVec': 1, 'tpNumVec': 1, 'totalNum': 1 }).toArray(function(err, result) {
					console.timeEnd("Id Query")
					mongoCallback(err, result, res, {
						"clalist": clalist,
						"idstr": idstr,
						"db": db,
						"claidRelation": claidRelation,
						"file": path.join(dir, file)
					})
				});
			}
		});
	}
}

let home = {
	/**
	 * [tsnetrain description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	tsnetrain(req, res, next) {
		let params = req.query,
			region = params.region,
			feature = params.feature,
			srate = params.srate,
			id = params.id;

		let file = `2D-ScatterData_1-in-${srate}_tsne-${DATA.getValue(feature, 'feature')}.csv`
		console.log(path.join('/home/joe/Documents/git/living-modes-visual-comparison/server/data', file))
		if (lib.checkDirectory(path.join('/home/joe/Documents/git/living-modes-visual-comparison/server/data', file))) {
			res.json({ 'scode': 1 })
		} else {
			res.json({ 'scode': 0 })
		}
	},
	/**
	 * [clustertrain description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	clustertrain(req, res, next) {
		let params = req.body,
			eps = params.eps,
			minpts = params.minpts,
			pkg = JSON.parse(params['pkg']),
			region = params.region,
			feature = params.feature,
			srate = params.srate,
			id = Date.parse(new Date());

		let ftypestr = DATA.getValue(feature, 'feature'),
			inpfile = `1-in-${srate}_tsne-${ftypestr}`,
			oupfile = `DBScanCluster-1-in-${srate}_tsne-${ftypestr}(eps=${eps},minpts=${minpts}).csv`,
			scriptdir = path.join(__dirname, '../../server/scripts/'),
			datadir = path.join(__dirname, '../../server/data')

		let clsrun;

		if (lib.checkDirectory(path.join(datadir + '/tmp', oupfile))) {
			// console.log('I am already exist.')
			// res.json({ 'scode': 1, 'filename': datadir + oupfile })
			if (params.id === '-1') {
				recomdCal(datadir + '/tmp', oupfile, id, res)
			} else {
				res.json({ 'scode': 1, 'clafilename': `${datadir}/tmp/${oupfile}`, 'id': params.id, 'recomdData': [] })
			}

		} else {
			clsrun = shell.exec(`cd ${scriptdir} && python ./ClusterUser.py -d ${datadir} -f ${inpfile} -x ${eps} -y ${minpts}`).stdout;
			if (lib.checkDirectory(path.join(datadir, '/tmp', oupfile))) {
				recomdCal(datadir + '/tmp', oupfile, id, res)
			} else {
				res.json({ 'scode': 0 })
			}
		}
	},
	labeltrain(req, res, next) {
		let params = req.query,
			theme = params.theme,
			rangeval = Number.parseInt(params.rangeval),
			paramval = Number.parseInt(params.paramval),
			id = parseInt(params.id);

		let poi = DATA.getValue(theme, 'theme')
		console.log('Params', params)

		console.time("Label query from mongo")
		MongoClient.connect(url, function(err, db) {
			if (err) {
				console.log('Unable to connect to the mongoDB server. Error:', err);
			} else {
				//HURRAY!! We are connected. :)
				console.log('Connection established to', url);

				let collection = db.collection('tmp'),
					sortstr = `POI-${poi}-t${paramval-1}`;

				console.log('sort property: ', sortstr)

				collection.find({ 'userid': id }).sort({ sortstr: -1 }).toArray(function(err, result) {
					if (err) {
						console.log(err)
					} else {
						console.timeEnd("Label query from mongo")
						let clalist = [],
							matrixlist = {},
							clalen = Number.parseInt(rangeval / 100.0 * result.length)

						if (clalen === 0) {
							res.json({ 'scode': 0 });
						}

						for (let i = 0; i < clalen; i++) {
							clalist.push(result[i]['id'])
							matrixlist[result[i]['id']] = result[i]['matrix']
						}

						console.log('Class length:', clalen, 'Total result length:', result.length)

						res.json({
							'scode': 1,
							'length': clalen,
							'clalist': clalist,
							'matrixlist': matrixlist
						})
					}
				});
			}
		});
	},
	vcquery(req, res, next) {
		let params = req.body,
			daytype = params.daytype,
			timeperiod = params.timeperiod,
			cla = params['cla[]'],
			clafilename = params['clafilename']

		console.log(clafilename)
		if (lib.checkDirectory(clafilename)) {
			fs.readFile(clafilename, function(err, data) {
				if (err) {
					return console.error(err);
				}

				let tp = DATA.getValue(timeperiod, 'timeperiod'),
					prop = {
						'tp': tp,
						'daytype': daytype
					}

				vcqueryCallback(data, cla, prop, res)
			});
		} else {
			res.json({ 'scode': 0 })
		}
	}
}

let vcqueryCallback = function(data, clalist, prop, res) {
	let rawdata = data.toString().split('\n'),
		idlist = []

	console.log('File Row: ', rawdata.length)
	for (let i = 0; i < rawdata.length; i++) {
		let tmparr = rawdata[i].split(','),
			cla = Number.parseInt(tmparr[6]).toString(),
			id = Number.parseInt(tmparr[0]);

		if (lib.ArrayContains(clalist, cla)) {
			idlist.push(id);
		}
	}

	console.log('prop is:', prop)

	pool.getConnection(function(err, connection) {
		connection.query($sql.tpqueryrecords, [idlist, prop['daytype'], prop['tp']['starthour'], prop['tp']['endhour'] ], function(err, result) {
			if (err) throw err;

			let data = GeoJSON.parse(result, {Point: ['lat', 'lng'], include: ['name']});

			res.json({ 'scode': 1, 'data': data, 'clalist': clalist });
			connection.release();
		});
	})
}
module.exports = home