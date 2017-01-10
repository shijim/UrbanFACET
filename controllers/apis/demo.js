/**
 * demo.js apis
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-01-08 15:41:27
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
const DATA = require('../../conf/data');
let EP = require('../../conf/entropy');

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
	
	// 插入统计档案数据,以便之后查询,在每次插入清空该id所有记录
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

// 
let generateGridJSON = function(values, res) {
	let idEntropy = values[0],
		records = values[1],
		grids = values[2]

	let identropyrelation = {}
	for (let i = idEntropy.length - 1; i >= 0; i--) {
		identropyrelation[ idEntropy[i]['_id'].toString() ] = parseFloat(idEntropy[i]['entropy']['row'])
	}

	let recordslen = records.length

	for(let i = 0; i < recordslen; i++) {
		let id = records[i]['id'].toString(),
			lat = records[i]['geometry']['coordinates'][1],
			lng = records[i]['geometry']['coordinates'][0],
			lngind = parseInt((parseFloat(lng) - 115.64) / 0.01),
			latind = parseInt((parseFloat(lat) - 39.39) / 0.01),
			uid = lngind + latind * 152,
			entropy = identropyrelation[id]

		let currentEntropy = grids[uid]['properties']['entropy']['row'],
			currentNumber = grids[uid]['properties']['recordnum']

		grids[uid]['properties']['entropy']['row']=(currentEntropy * currentNumber + entropy) / (currentNumber + 1)
		grids[uid]['properties']['recordnum'] += 1
	}

	let parsedGeoJSON = { 
		"type": "FeatureCollection",
	    "features": []
	}

	for (let i = grids.length - 1; i >= 0; i--) {
		parsedGeoJSON['features'].push({
		  "type": "Feature",
		  "geometry": grids[i]['geometry'],
		  "properties": {
			"uid": grids[i]['properties']['uid'],
			"entropy": grids[i]['properties']['entropy']['row'],
			"number": grids[i]['properties']['recordnum'],
		  }
		})
	}

	res.json({ 'scode': 1, 'id': id, 'data': parsedGeoJSON })
	return ;
}

let demo = {
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
			entropytype = params.et,
			id = params.id === '-1'? Date.parse(new Date()):params.id;

		// t-sne in all data 
		let scriptdir = path.join(__dirname, '../../server/scripts/'),
			scatterdir = path.join(__dirname, '../../server/data/init'),
			imgdir = path.join(__dirname, '../../public/img/init'),
			oupscatterfile = `2D-ScatterData_1-in-${srate}_tsne-${DATA.getValue(feature, 'feature')}.csv`,
			oupimgfile = `2D-ScatterData_1-in-${srate}_tsne-${DATA.getValue(feature, 'feature')}(byRecNum).png`

		if (lib.checkDirectory(path.join(scatterdir, oupscatterfile)) && lib.checkDirectory(path.join(imgdir, oupimgfile))) {
			Promise.all([EP.readIdlistFile(scatterdir, oupscatterfile), EP.connectMongo()]).then(function(objs) {
				console.log('idlist and db are available now.')
				return EP.mongoQueries(objs[0], objs[1], { 'entropytype': entropytype })
			}).catch(function(error) {
				console.log(error);
			}).then(function(values) {
				console.log('Three asyncs examples got!')
				generateGridJSON(values, res);
			}).catch(function(error) {
				console.log(error);
			});
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
	entropyfilter(req, res, next) {
		let params = req.query,
			region = params.region,
			feature = params.feature,
			srate = params.srate,
			id = params.id,
			entropytype = params.et,
			entropymin = params.emin,
			entropymax = params.emax

		scriptdir = path.join(__dirname, '../../server/scripts/')
		scatterdir = path.join(__dirname, '../../server/data/decompose')
		imgdir = path.join(__dirname, '../../public/img/decompose')
		oupscatterfile = `2D-ScatterData_1-in-${srate}_tsne-${DATA.getValue(feature, 'feature')}.csv`
		oupimgfile = `2D-ScatterData_1-in-${srate}_tsne-${DATA.getValue(feature, 'feature')}(byRecNum).png`

		console.log('all params loaded:', params)

		shell.exec(`cd ${scriptdir} && python ./DecomposeFeature.py -q ${srate} -e ${entropytype} -i ${entropymin} -a ${entropymax} -t ${DATA.getValue(feature, 'feature')}`).stdout

		if (lib.checkDirectory(path.join(scatterdir, oupscatterfile)) && lib.checkDirectory(path.join(imgdir, oupimgfile))) {
			Promise.all([EP.readIdlistFile(scatterdir, oupscatterfile), EP.connectMongo()]).then(function(objs) {
				console.log('idlist and db are available now.')
				return EP.mongoQueries(objs[0], objs[1], { 'entropytype': entropytype })
			}).catch(function(error) {
				console.log(error);
			}).then(function(values) {
				console.log('Three asyncs examples got!')
				generateGridJSON(values, res);
			}).catch(function(error) {
				console.log(error);
			});

			
		} else {
			res.json({ 'scode': 0 })
		}

	},
	clustertrain(req, res, next) {
		let params = req.body,
			eps = params.eps,
			minpts = params.minpts,
			pkg = JSON.parse(params['pkg']),
			region = params.region,
			feature = params.feature,
			srate = params.srate,
			id = params.id === '-1'? Date.parse(new Date()):params.id;

		let ftypestr = DATA.getValue(feature, 'feature'),
			inpfile = `1-in-${srate}_tsne-${ftypestr}`,
			oupfile = `DBScanCluster-1-in-${srate}_tsne-${ftypestr}(eps=${eps},minpts=${minpts}).csv`,
			scriptdir = path.join(__dirname, '../../server/scripts/'),
			datadir = path.join(__dirname, '../../server/data')

		let clsrun;

		if (lib.checkDirectory(path.join(datadir + '/tmp', oupfile))) {
			recomdCal(datadir + '/tmp', oupfile, id, res)
				// if (params.id === '-1') {
				// 	recomdCal(datadir + '/tmp', oupfile, id, res)
				// } else {
				// 	res.json({ 'scode': 1, 'clafilename': `${datadir}/tmp/${oupfile}`, 'id': params.id, 'recomdData': [] })
				// }

		} else {
			clsrun = shell.exec(`cd ${scriptdir} && python ./ClusterUser.py -d ${datadir} -f ${inpfile} -x ${eps} -y ${minpts}`).stdout;
			if (lib.checkDirectory(path.join(datadir, '/tmp', oupfile))) {
				recomdCal(datadir + '/tmp', oupfile, id, res)
			} else {
				res.json({ 'scode': 0 })
			}
		}
	},
	/**
	 * [labeltrain description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	labeltrain(req, res, next) {
		let params = req.query,
			theme = params.theme,
			rangeval = Number.parseInt(params.rangeval),
			paramval = Number.parseInt(params.paramval),
			id = params.id;

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
	/**
	 * [vcquery description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	vcquery(req, res, next) {
		let params = req.body,
			// qmode = Number.parseInt(params['qmode']),
			daytype = params['daytype'],
			timeperiod = params['timeperiod'],
			cla = [ params['cla'] ],
			// compdaytype = params['compdaytype'],
			// comptimeperiod = params['comptimeperiod'],
			// compcla = Number.parseInt(params['compcla']),
			clafilename = params['clafilename']
		
		if (lib.checkDirectory(clafilename)) {
			fs.readFile(clafilename, function(err, data) {
				if (err) {
					return console.error(err);
				}

				let tp = DATA.getValue(timeperiod, 'timeperiod'),
					prop = [{
						'tpstr': `${daytype} ${tp['name']}`,
						'tp': tp,
						'daytype': daytype
					}]

				vcqueryCallback(data, cla, prop, res)

			});
		} else {
			res.json({ 'scode': 0 })
		}
	},
	/**
	 * [classplot description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	classplot(req, res, next) {
		let params = req.query,
			srate = params.srate,
			eps = params.eps,
			minpts = params.minpts,
			feature = params.feature,
			userid = params.id

		fs.readFile(path.join(__dirname, `../../server/data/tmp/DBScanCluster-1-in-${srate}_tsne-${DATA.getValue(feature, 'feature')}(eps=${eps},minpts=${minpts}).csv`), function(err, data) {
				if (err) {
				return console.error(err);
			}

			let rawdata = data.toString().split('\n'),
				seriesData = [],
				clanumlist = {},
				clanumarr = [],
				clalist = ['-1']

			console.log('File Row: ', rawdata.length)
			for (let i = 0; i < rawdata.length; i++) {
				let tmparr = rawdata[i].split(','),
					cla = Number.parseInt(tmparr[6]).toString(),
					id = Number.parseInt(tmparr[0])

				seriesData.push({
					'id': id,
					'cla': cla,
					'x': +tmparr[1],
					'y': +tmparr[2],
					'num': +tmparr[3]
				})

				// noise group
				if (cla === '-1') {
					continue
				}

				if (!(cla in clanumlist)) {
					clanumlist[cla] = 1

				} else {
					clanumlist[cla] += 1
				}
			}

			// Construct class and number array from json object
			for (let key in clanumlist) {
				clanumarr.push({ 
					'cla': key, 
					'num': clanumlist[key] 
				})
			}

			// sort array in 降序
			clanumarr.sort(function(a, b) {
				return a['num'] < b['num'] ? 1 : a['num'] == b['num'] ? 0 : -1;   
			})

			// filter top-10 class
			let clalistlen = clanumarr.length > 10 ? 10:clanumarr.length 
			console.log(`${clalistlen} classes are written into response`)
			for (let i = 0; i < clalistlen; i++) {
				clalist.push( clanumarr[i]['cla'] )
			}

			MongoClient.connect(url, function(err, db) {
				if (err) {
					console.log('Unable to connect to the mongoDB server. Error:', err);
				} else {
					//HURRAY!! We are connected. :)
					console.log('Connection established to', url);

					let collection = db.collection('tmp')

					console.log(userid)

					collection.find({ 'userid': userid }).toArray(function(err, result) {
						if (err) {
							console.log(err)
						} else {
							console.timeEnd("Label query from mongo")
							let matrixlist = {},
								clalen = Number.parseInt(result.length)

							for (let i = 0; i < clalen; i++) {
								matrixlist[result[i]['id']] = result[i]['matrix']
							}

							console.log('Class length:', clalen, 'Total result length:', result.length)

							res.json({
								'scode': 1,
								'data': seriesData,
								'length': clalen,
								'clalist': clalist,
								'matrixlist': matrixlist
							})
						}
					});
				}
			});
		})
	},
	/**
	 * [madisplayquery description]
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	madisplayquery(req, res, next) {
		let params = req.query,
			daytype = params['daytype'],
			timeperiod = params['timeperiod'],
			id = params.id === '-1'? Date.parse(new Date()):params.id;

		let tp = DATA.getValue(timeperiod, 'timeperiod'),
			prop = [{
				'tpstr': `${daytype} ${tp['name']}`,
				'tp': tp,
				'daytype': daytype
			}]
		pool.getConnection(function(err, connection) {
			let sql, param = [ prop[0]['daytype'], prop[0]['tp']['starthour'], prop[0]['tp']['endhour'] ]
			if (prop[0]['tp']['name'] === 'night') {
				sql = $sql.madisplayqueryNight
			} else {
				sql = $sql.madisplayquery
			}

			connection.query(sql, param, function(err, result) {
				if (err) throw err;

				for (var i = result.length - 1; i >= 0; i--) {
					result[i]['location'] = {
						'longitude': Number.parseFloat(result[i]['lng']),
						'latitude': Number.parseFloat(result[i]['lat'])
					}
				}

				// console.time('DBSCAN')
				// let dbscanner = jDBSCAN().eps(0.005).minPts(30).distance('HAVERSINE').data(result),
				//     point_assignment_result = dbscanner();
				// console.timeEnd('DBSCAN')

				let data = GeoJSON.parse(result, { Point: ['lat', 'lng'] });

				res.json({ 'scode': 1, 'data': data, 'group': prop[0]['tp']['hourlist'], 'id': id, 'other': [] });
			})
		})
	}
}

let vcqueryCallback = function(data, clalist, prop, res) {
	let rawdata = data.toString().split('\n'),
		idlist = [],
		idclaRelation = {}

	console.log('File Row: ', rawdata.length, 'clalist', clalist)

	for (let i = 0; i < rawdata.length; i++) {
		let tmparr = rawdata[i].split(','),
			cla = Number.parseInt(tmparr[6]).toString(),
			id = Number.parseInt(tmparr[0]);

		if (lib.ArrayContains(clalist, cla)) {
			idlist.push(id);
			idclaRelation[ id.toString() ] = cla;
		}
	}

	pool.getConnection(function(err, connection) {
		let sql, param
		if (prop[0]['daytype'] === 'all') {
			sql = $sql.spetpqueryrecords
			param = [idlist, prop[0]['tp']['name'] === 'all'? ['workday', 'holiday']:[prop[0]['tp']['name']]]
		} else {
			if (prop[0]['tp']['name'] === 'night') {
				sql = $sql.tpqueryrecordsNight
			} else {
				sql = $sql.tpqueryrecords
			}
			sql = $sql.tpqueryrecords
			param = [idlist, prop[0]['daytype'], prop[0]['tp']['starthour'], prop[0]['tp']['endhour']]
		}

		connection.query(sql, param, function(err, result) {
			if (err) throw err;

			for (let i = result.length - 1; i >= 0; i--) {
				let tmpclastr = idclaRelation[ result[i]['id'].toString() ]
				result[i]['cla'] = `Class ${tmpclastr}`
				result[i]['tp'] = prop[0]['tpstr']
			}

			let data = GeoJSON.parse(result, { Point: ['lat', 'lng'] });

			res.json({ 
				'scode': 1, 
				'data': data, 
				'prop': {
					'cla': `Class ${clalist[0]}`,
					'tp': prop[0]['tpstr']
				} 
			});
			connection.release();
		});
	})
}
module.exports = demo
