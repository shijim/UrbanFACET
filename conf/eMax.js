/**
 * eMax.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-03-02 12:00:50
 * @存储不同表中存在的字段的最大值信息
 */

'use strict'

let objs = {
    'sum': {
        "bjEmatrix": {
            "name": "bjEmatrix",
            "wpnumber": 2551139,
            "vpnumber": 2551139,
            "wrnumber": 2551139,
            "vrnumber": 2551139,
            "prsval": 3402949.25,
            "trsval": 4903684,
            "arsval": 2069241,
            "ppsval": 3474850.75,
            "tpsval": 5212207,
            "apsval": 944340.75
        },
        "tjEmatrix": {
            "name": "tjEmatrix",
            "wpnumber": 2103939,
            "vpnumber": 2103939,
            "wrnumber": 2103939,
            "vrnumber": 2103939,
            "prsval": 2482590,
            "trsval": 4553690,
            "arsval": 2863100,
            "ppsval": 2147860,
            "tpsval": 4550720,
            "apsval": 1424090
        },
        "tsEmatrix": {
            "name": "tsEmatrix",
            "wpnumber": 1117485,
            "vpnumber": 1117485,
            "wrnumber": 1117485,
            "vrnumber": 1117485,
            "prsval": 1810500,
            "trsval": 2393350,
            "arsval": 937627,
            "ppsval": 1565380,
            "tpsval": 2395000,
            "apsval": 480708
        },
        "zjkEmatrix": {
            "name": "zjkEmatrix",
            "wpnumber": 512232,
            "vpnumber": 512232,
            "wrnumber": 512232,
            "vrnumber": 512232,
            "prsval": 294782,
            "trsval": 1063390,
            "arsval": 225952,
            "ppsval": 255381,
            "tpsval": 1060100,
            "apsval": 144264
        },
        "bjF0mat": {
            "name": "bjF0mat",
            "wpnumber": 221070,
            "vpnumber": 221070,
            "wrnumber": 221070,
            "vrnumber": 221070,
            "prsval": 239960.234375,
            "trsval": 541064.1875,
            "arsval": 168336.59375,
            "ppsval": 238289.4375,
            "tpsval": 483346.09375,
            "apsval": 69280.3671875
        },
        "tjF0mat": {
            "name": "tjF0mat",
            "wpnumber": 219537,
            "vpnumber": 209818,
            "wrnumber": 219537,
            "vrnumber": 209818,
            "prsval": 251979,
            "trsval": 503930,
            "arsval": 171312,
            "ppsval": 217953,
            "tpsval": 482002,
            "apsval": 101570
        },
        "tsF0mat": {
            "name": "tsF0mat",
            "wpnumber": 121097,
            "vpnumber": 121097,
            "wrnumber": 121097,
            "vrnumber": 121097,
            "prsval": 198112,
            "trsval": 280865,
            "arsval": 86106,
            "ppsval": 161905,
            "tpsval": 269659,
            "apsval": 46899.30078125
        },
        "zjkF0mat": {
            "name": "zjkF0mat",
            "wpnumber": 87168,
            "vpnumber": 55903,
            "wrnumber": 87168,
            "vrnumber": 55903,
            "prsval": 27978.69921875,
            "trsval": 173383,
            "arsval": 18973.400390625,
            "ppsval": 25792.5,
            "tpsval": 185506,
            "apsval": 18539.099609375
        },
        "bjF1mat": {
            "name": "bjF1mat",
            "wpnumber": 477061,
            "vpnumber": 477061,
            "wrnumber": 477061,
            "vrnumber": 477061,
            "prsval": 621500.25,
            "trsval": 923251.1875,
            "arsval": 227689.640625,
            "ppsval": 643538.125,
            "tpsval": 972045.625,
            "apsval": 157942.453125
        },
        "tjF1mat": {
            "name": "tjF1mat",
            "wpnumber": 360854,
            "vpnumber": 360854,
            "wrnumber": 360854,
            "vrnumber": 360854,
            "prsval": 332477,
            "trsval": 740698,
            "arsval": 364296,
            "ppsval": 309065,
            "tpsval": 758087,
            "apsval": 245299
        },
        "tsF1mat": {
            "name": "tsF1mat",
            "wpnumber": 173660,
            "vpnumber": 173660,
            "wrnumber": 173660,
            "vrnumber": 173660,
            "prsval": 290834,
            "trsval": 363378,
            "arsval": 163007,
            "ppsval": 227552,
            "tpsval": 359452,
            "apsval": 88183.1015625
        },
        "zjkF1mat": {
            "name": "zjkF1mat",
            "wpnumber": 102557,
            "vpnumber": 72698,
            "wrnumber": 102557,
            "vrnumber": 72698,
            "prsval": 50629.30078125,
            "trsval": 198557,
            "arsval": 41493.6015625,
            "ppsval": 42964.5,
            "tpsval": 221607,
            "apsval": 25491.099609375
        },
        "bjF2mat": {
            "name": "bjF2mat",
            "wpnumber": 324099,
            "vpnumber": 324099,
            "wrnumber": 324099,
            "vrnumber": 324099,
            "prsval": 441380.90625,
            "trsval": 799014.4375,
            "arsval": 212194.921875,
            "ppsval": 441445.34375,
            "tpsval": 673414.8125,
            "apsval": 111203.2265625
        },
        "tjF2mat": {
            "name": "tjF2mat",
            "wpnumber": 253755,
            "vpnumber": 253755,
            "wrnumber": 253755,
            "vrnumber": 253755,
            "prsval": 348346,
            "trsval": 625223,
            "arsval": 353028,
            "ppsval": 231507,
            "tpsval": 536329,
            "apsval": 173767
        },
        "tsF2mat": {
            "name": "tsF2mat",
            "wpnumber": 133085,
            "vpnumber": 133085,
            "wrnumber": 133085,
            "vrnumber": 133085,
            "prsval": 232278,
            "trsval": 333074,
            "arsval": 151944,
            "ppsval": 173275,
            "tpsval": 277202,
            "apsval": 66826.703125
        },
        "zjkF2mat": {
            "name": "zjkF2mat",
            "wpnumber": 62433,
            "vpnumber": 53066,
            "wrnumber": 62433,
            "vrnumber": 53066,
            "prsval": 31578.099609375,
            "trsval": 137130,
            "arsval": 30314.599609375,
            "ppsval": 29580.80078125,
            "tpsval": 123632,
            "apsval": 17336
        },
        "bjF3mat": {
            "name": "bjF3mat",
            "wpnumber": 661373,
            "vpnumber": 661373,
            "wrnumber": 661373,
            "vrnumber": 661373,
            "prsval": 865300.3125,
            "trsval": 1200100.625,
            "arsval": 460632.15625,
            "ppsval": 891052.5,
            "tpsval": 1335512.875,
            "apsval": 214198.1875
        },
        "tjF3mat": {
            "name": "tjF3mat",
            "wpnumber": 409126,
            "vpnumber": 409126,
            "wrnumber": 409126,
            "vrnumber": 409126,
            "prsval": 581123,
            "trsval": 887998,
            "arsval": 617153,
            "ppsval": 398347,
            "tpsval": 860896,
            "apsval": 298641
        },
        "tsF3mat": {
            "name": "tsF3mat",
            "wpnumber": 225061,
            "vpnumber": 225061,
            "wrnumber": 225061,
            "vrnumber": 225061,
            "prsval": 384689,
            "trsval": 464269,
            "arsval": 229157,
            "ppsval": 295384,
            "tpsval": 463104,
            "apsval": 112876
        },
        "zjkF3mat": {
            "name": "zjkF3mat",
            "wpnumber": 82101,
            "vpnumber": 73237,
            "wrnumber": 82101,
            "vrnumber": 73237,
            "prsval": 51869.3984375,
            "trsval": 177425,
            "arsval": 49747.6015625,
            "ppsval": 44483.19921875,
            "tpsval": 173259,
            "apsval": 27704.19921875
        },
        "bjF4mat": {
            "name": "bjF4mat",
            "wpnumber": 720984,
            "vpnumber": 720984,
            "wrnumber": 720984,
            "vrnumber": 720984,
            "prsval": 975949.9375,
            "trsval": 1199994.625,
            "arsval": 725065.3125,
            "ppsval": 995901.75,
            "tpsval": 1466669.125,
            "apsval": 309871.5625
        },
        "tjF4mat": {
            "name": "tjF4mat",
            "wpnumber": 526727,
            "vpnumber": 526727,
            "wrnumber": 526727,
            "vrnumber": 526727,
            "prsval": 785994,
            "trsval": 995379,
            "arsval": 823656,
            "ppsval": 519490,
            "tpsval": 1107860,
            "apsval": 395818
        },
        "tsF4mat": {
            "name": "tsF4mat",
            "wpnumber": 239576,
            "vpnumber": 239576,
            "wrnumber": 239576,
            "vrnumber": 239576,
            "prsval": 421453,
            "trsval": 452584,
            "arsval": 250546,
            "ppsval": 330554,
            "tpsval": 504068,
            "apsval": 120340
        },
        "zjkF4mat": {
            "name": "zjkF4mat",
            "wpnumber": 112640,
            "vpnumber": 106252,
            "wrnumber": 112640,
            "vrnumber": 106252,
            "prsval": 66541.796875,
            "trsval": 202446,
            "arsval": 57550.1015625,
            "ppsval": 56396.30078125,
            "tpsval": 219267,
            "apsval": 33040
        },
        "bjF5mat": {
            "name": "bjF5mat",
            "wpnumber": 341902,
            "vpnumber": 341902,
            "wrnumber": 341902,
            "vrnumber": 341902,
            "prsval": 460277.59375,
            "trsval": 717082.875,
            "arsval": 393122.40625,
            "ppsval": 412649.625,
            "tpsval": 716541,
            "apsval": 174845.265625
        },
        "tjF5mat": {
            "name": "tjF5mat",
            "wpnumber": 357098,
            "vpnumber": 357098,
            "wrnumber": 357098,
            "vrnumber": 357098,
            "prsval": 412543,
            "trsval": 738869,
            "arsval": 427781,
            "ppsval": 381985,
            "tpsval": 763389,
            "apsval": 194731
        },
        "tsF5mat": {
            "name": "tsF5mat",
            "wpnumber": 219014,
            "vpnumber": 219014,
            "wrnumber": 219014,
            "vrnumber": 219014,
            "prsval": 341564,
            "trsval": 433343,
            "arsval": 72727.3984375,
            "ppsval": 310528,
            "tpsval": 465218,
            "apsval": 79133.3984375
        },
        "zjkF5mat": {
            "name": "zjkF5mat",
            "wpnumber": 119708,
            "vpnumber": 89407,
            "wrnumber": 119708,
            "vrnumber": 89407,
            "prsval": 49808.1015625,
            "trsval": 206098,
            "arsval": 22624,
            "ppsval": 49459.80078125,
            "tpsval": 229275,
            "apsval": 24941.30078125
        },
        "bjF6mat": {
            "name": "bjF6mat",
            "wpnumber": 386968,
            "vpnumber": 386968,
            "wrnumber": 386968,
            "vrnumber": 386968,
            "prsval": 453243.90625,
            "trsval": 714927.1875,
            "arsval": 304918.8125,
            "ppsval": 399824.75,
            "tpsval": 863212.4375,
            "apsval": 176911.125
        },
        "tjF6mat": {
            "name": "tjF6mat",
            "wpnumber": 338686,
            "vpnumber": 338686,
            "wrnumber": 338686,
            "vrnumber": 338686,
            "prsval": 367812,
            "trsval": 654139,
            "arsval": 144696,
            "ppsval": 346796,
            "tpsval": 734920,
            "apsval": 145502
        },
        "tsF6mat": {
            "name": "tsF6mat",
            "wpnumber": 139305,
            "vpnumber": 139305,
            "wrnumber": 139305,
            "vrnumber": 139305,
            "prsval": 213943,
            "trsval": 299486,
            "arsval": 45241.80078125,
            "ppsval": 197938,
            "tpsval": 302448,
            "apsval": 52591.80078125
        },
        "zjkF6mat": {
            "name": "zjkF6mat",
            "wpnumber": 64207,
            "vpnumber": 61669,
            "wrnumber": 64207,
            "vrnumber": 61669,
            "prsval": 27039.80078125,
            "trsval": 125358,
            "arsval": 15495.7998046875,
            "ppsval": 42520.1015625,
            "tpsval": 142394,
            "apsval": 18102.599609375
        },
        "bjF7mat": {
            "name": "bjF7mat",
            "wpnumber": 2304866,
            "vpnumber": 2304866,
            "wrnumber": 2304866,
            "vrnumber": 2304866,
            "prsval": 3057411.5,
            "trsval": 4194552,
            "arsval": 1331076.25,
            "ppsval": 3140331.75,
            "tpsval": 4682558.5,
            "apsval": 772634.75
        },
        "tjF7mat": {
            "name": "tjF7mat",
            "wpnumber": 1544250,
            "vpnumber": 1544250,
            "wrnumber": 1544250,
            "vrnumber": 1544250,
            "prsval": 1666200,
            "trsval": 2952750,
            "arsval": 1996770,
            "ppsval": 1525970,
            "tpsval": 3231220,
            "apsval": 1054860
        },
        "tsF7mat": {
            "name": "tsF7mat",
            "wpnumber": 780349,
            "vpnumber": 780349,
            "wrnumber": 780349,
            "vrnumber": 780349,
            "prsval": 1265050,
            "trsval": 1515570,
            "arsval": 640482,
            "ppsval": 1093400,
            "tpsval": 1667900,
            "apsval": 346804
        },
        "zjkF7mat": {
            "name": "zjkF7mat",
            "wpnumber": 357901,
            "vpnumber": 357901,
            "wrnumber": 357901,
            "vrnumber": 357901,
            "prsval": 203914,
            "trsval": 678019,
            "arsval": 154245,
            "ppsval": 177517,
            "tpsval": 740677,
            "apsval": 101459
        },
        "bjF8mat": {
            "name": "bjF8mat",
            "wpnumber": 789708,
            "vpnumber": 789708,
            "wrnumber": 789708,
            "vrnumber": 789708,
            "prsval": 939779.75,
            "trsval": 1927865.5,
            "arsval": 738164.625,
            "ppsval": 932022.1875,
            "tpsval": 1677558.625,
            "apsval": 279873.78125
        },
        "tjF8mat": {
            "name": "tjF8mat",
            "wpnumber": 625705,
            "vpnumber": 625705,
            "wrnumber": 625705,
            "vrnumber": 625705,
            "prsval": 864256,
            "trsval": 1656020,
            "arsval": 866332,
            "ppsval": 621897,
            "tpsval": 1367740,
            "apsval": 374558
        },
        "tsF8mat": {
            "name": "tsF8mat",
            "wpnumber": 337136,
            "vpnumber": 337136,
            "wrnumber": 337136,
            "vrnumber": 337136,
            "prsval": 545455,
            "trsval": 877781,
            "arsval": 297145,
            "ppsval": 471986,
            "tpsval": 727099,
            "apsval": 133904
        },
        "zjkF8mat": {
            "name": "zjkF8mat",
            "wpnumber": 154331,
            "vpnumber": 154331,
            "wrnumber": 154331,
            "vrnumber": 154331,
            "prsval": 90867.8984375,
            "trsval": 385376,
            "arsval": 71707.3984375,
            "ppsval": 77864.1015625,
            "tpsval": 319419,
            "apsval": 44193.3984375
        }
    },
    'ave': {
        "bjEmatrix": {
            "name": "bjEmatrix",
            "wpnumber": 2551139,
            "vpnumber": 2551139,
            "wrnumber": 2551139,
            "vrnumber": 2551139,
            "prsval": 5.75363032023112,
            "trsval": 7.48268175125122,
            "arsval": 9.21850681304932,
            "ppsval": 2.10282874107361,
            "tpsval": 2.59344506263733,
            "apsval": 2.56651973724365
        },
        "tjEmatrix": {
            "name": "tjEmatrix",
            "wpnumber": 2103939,
            "vpnumber": 2103939,
            "wrnumber": 2103939,
            "vrnumber": 2103939,
            "prsval": 2.97497908274333,
            "trsval": 5.37055015563965,
            "arsval": 6.98952007293701,
            "ppsval": 1.95552003383636,
            "tpsval": 2.55985999107361,
            "apsval": 2.22884618318998
        },
        "tsEmatrix": {
            "name": "tsEmatrix",
            "wpnumber": 1117485,
            "vpnumber": 1117485,
            "wrnumber": 1117485,
            "vrnumber": 1117485,
            "prsval": 2.52732202020615,
            "trsval": 6.50654983520508,
            "arsval": 7.58393351236979,
            "ppsval": 2.1335599899292,
            "tpsval": 2.59102988243103,
            "apsval": 2.41933751106262
        },
        "zjkEmatrix": {
            "name": "zjkEmatrix",
            "wpnumber": 512232,
            "vpnumber": 512232,
            "wrnumber": 512232,
            "vrnumber": 512232,
            "prsval": 3.52636003494263,
            "trsval": 7.25204992294312,
            "arsval": 9.3563404083252,
            "ppsval": 1.78929245471954,
            "tpsval": 2.61073575701032,
            "apsval": 2.35743999481201
        },
        "bjF0mat": {
            "name": "bjF0mat",
            "wpnumber": 221070,
            "vpnumber": 221070,
            "wrnumber": 221070,
            "vrnumber": 221070,
            "prsval": 8.20951366424561,
            "trsval": 6.8254599571228,
            "arsval": 9.92652034759521,
            "ppsval": 2.17646741867065,
            "tpsval": 2.61537599563599,
            "apsval": 2.56651973724365
        },
        "tjF0mat": {
            "name": "tjF0mat",
            "wpnumber": 219537,
            "vpnumber": 209818,
            "wrnumber": 219537,
            "vrnumber": 209818,
            "prsval": 4.19217491149902,
            "trsval": 6.77307987213135,
            "arsval": 9.57116031646729,
            "ppsval": 1.85357999801636,
            "tpsval": 2.60998010635376,
            "apsval": 2.41548752784729
        },
        "tsF0mat": {
            "name": "tsF0mat",
            "wpnumber": 121097,
            "vpnumber": 121097,
            "wrnumber": 121097,
            "vrnumber": 121097,
            "prsval": 3.86672496795654,
            "trsval": 6.63988018035889,
            "arsval": 9.13453960418701,
            "ppsval": 2.1335599899292,
            "tpsval": 2.60618011474609,
            "apsval": 2.43806927020733
        },
        "zjkF0mat": {
            "name": "zjkF0mat",
            "wpnumber": 87168,
            "vpnumber": 55903,
            "wrnumber": 87168,
            "vrnumber": 55903,
            "prsval": 3.79173994064331,
            "trsval": 7.427033106486,
            "arsval": 9.15260982513428,
            "ppsval": 1.78928995132446,
            "tpsval": 2.61831998825073,
            "apsval": 2.29651260375977
        },
        "bjF1mat": {
            "name": "bjF1mat",
            "wpnumber": 477061,
            "vpnumber": 477061,
            "wrnumber": 477061,
            "vrnumber": 477061,
            "prsval": 7.56700070699056,
            "trsval": 6.75576877593994,
            "arsval": 10.0356121063232,
            "ppsval": 2.12960958480835,
            "tpsval": 2.60599088668823,
            "apsval": 2.56308307647705
        },
        "tjF1mat": {
            "name": "tjF1mat",
            "wpnumber": 360854,
            "vpnumber": 360854,
            "wrnumber": 360854,
            "vrnumber": 360854,
            "prsval": 3.02042508125305,
            "trsval": 6.71174001693726,
            "arsval": 9.44050025939941,
            "ppsval": 1.87350499629974,
            "tpsval": 2.61048007011414,
            "apsval": 2.41548252105713
        },
        "tsF1mat": {
            "name": "tsF1mat",
            "wpnumber": 173660,
            "vpnumber": 173660,
            "wrnumber": 173660,
            "vrnumber": 173660,
            "prsval": 4.94063345591227,
            "trsval": 7.29301977157593,
            "arsval": 9.4476203918457,
            "ppsval": 2.07604450649685,
            "tpsval": 2.60651993751526,
            "apsval": 2.48688006401062
        },
        "zjkF1mat": {
            "name": "zjkF1mat",
            "wpnumber": 102557,
            "vpnumber": 72698,
            "wrnumber": 102557,
            "vrnumber": 72698,
            "prsval": 4.76909987131755,
            "trsval": 7.64107990264893,
            "arsval": 9.9284200668335,
            "ppsval": 1.78928995132446,
            "tpsval": 2.61073324415419,
            "apsval": 2.32158756256104
        },
        "bjF2mat": {
            "name": "bjF2mat",
            "wpnumber": 324099,
            "vpnumber": 324099,
            "wrnumber": 324099,
            "vrnumber": 324099,
            "prsval": 7.12446308135986,
            "trsval": 6.4329400062561,
            "arsval": 10.354022026062,
            "ppsval": 2.11580486297607,
            "tpsval": 2.61537599563599,
            "apsval": 2.5517783164978
        },
        "tjF2mat": {
            "name": "tjF2mat",
            "wpnumber": 253755,
            "vpnumber": 253755,
            "wrnumber": 253755,
            "vrnumber": 253755,
            "prsval": 4.45252513885498,
            "trsval": 7.451819896698,
            "arsval": 8.91691017150879,
            "ppsval": 1.89128255844116,
            "tpsval": 2.6041624546051,
            "apsval": 2.46469993591309
        },
        "tsF2mat": {
            "name": "tsF2mat",
            "wpnumber": 133085,
            "vpnumber": 133085,
            "wrnumber": 133085,
            "vrnumber": 133085,
            "prsval": 3.8667299747467,
            "trsval": 8.37977027893066,
            "arsval": 9.6032600402832,
            "ppsval": 2.07604002952576,
            "tpsval": 2.61392732100053,
            "apsval": 2.41353336970011
        },
        "zjkF2mat": {
            "name": "zjkF2mat",
            "wpnumber": 62433,
            "vpnumber": 53066,
            "wrnumber": 62433,
            "vrnumber": 53066,
            "prsval": 2.74084997177124,
            "trsval": 7.57814979553223,
            "arsval": 9.78855037689209,
            "ppsval": 1.78928995132446,
            "tpsval": 2.61073756217957,
            "apsval": 2.30799007415771
        },
        "bjF3mat": {
            "name": "bjF3mat",
            "wpnumber": 661373,
            "vpnumber": 661373,
            "wrnumber": 661373,
            "vrnumber": 661373,
            "prsval": 7.16473960876465,
            "trsval": 6.49794769287109,
            "arsval": 10.4612159729004,
            "ppsval": 2.17646741867065,
            "tpsval": 2.60683917999268,
            "apsval": 2.52238035202026
        },
        "tjF3mat": {
            "name": "tjF3mat",
            "wpnumber": 409126,
            "vpnumber": 409126,
            "wrnumber": 409126,
            "vrnumber": 409126,
            "prsval": 5.99519983927409,
            "trsval": 6.57367992401123,
            "arsval": 9.08216953277588,
            "ppsval": 2.06479001045227,
            "tpsval": 2.59409999847412,
            "apsval": 2.35379505157471
        },
        "tsF3mat": {
            "name": "tsF3mat",
            "wpnumber": 225061,
            "vpnumber": 225061,
            "wrnumber": 225061,
            "vrnumber": 225061,
            "prsval": 3.44999003410339,
            "trsval": 6.448890209198,
            "arsval": 9.2437801361084,
            "ppsval": 2.0550000667572,
            "tpsval": 2.60682511329651,
            "apsval": 2.45960006713867
        },
        "zjkF3mat": {
            "name": "zjkF3mat",
            "wpnumber": 82101,
            "vpnumber": 73237,
            "wrnumber": 82101,
            "vrnumber": 73237,
            "prsval": 6.20859003067017,
            "trsval": 7.52887010574341,
            "arsval": 9.78855037689209,
            "ppsval": 1.78928995132446,
            "tpsval": 2.61831998825073,
            "apsval": 2.35743999481201
        },
        "bjF4mat": {
            "name": "bjF4mat",
            "wpnumber": 720984,
            "vpnumber": 720984,
            "wrnumber": 720984,
            "vrnumber": 720984,
            "prsval": 6.57788753509521,
            "trsval": 6.25382900238037,
            "arsval": 10.0935297012329,
            "ppsval": 2.12852001190186,
            "tpsval": 2.58396458625793,
            "apsval": 2.55164546966553
        },
        "tjF4mat": {
            "name": "tjF4mat",
            "wpnumber": 526727,
            "vpnumber": 526727,
            "wrnumber": 526727,
            "vrnumber": 526727,
            "prsval": 3.15700006484985,
            "trsval": 5.71372985839844,
            "arsval": 8.68920040130615,
            "ppsval": 1.95552003383636,
            "tpsval": 2.58037118813426,
            "apsval": 2.58688998222351
        },
        "tsF4mat": {
            "name": "tsF4mat",
            "wpnumber": 239576,
            "vpnumber": 239576,
            "wrnumber": 239576,
            "vrnumber": 239576,
            "prsval": 3.46573495864868,
            "trsval": 5.92426013946533,
            "arsval": 9.28730010986328,
            "ppsval": 2.13689994812012,
            "tpsval": 2.60122990608215,
            "apsval": 2.43807506561279
        },
        "zjkF4mat": {
            "name": "zjkF4mat",
            "wpnumber": 112640,
            "vpnumber": 106252,
            "wrnumber": 112640,
            "vrnumber": 106252,
            "prsval": 1.94606665408973,
            "trsval": 7.23055982589722,
            "arsval": 9.31534957885742,
            "ppsval": 1.78929245471954,
            "tpsval": 2.61831998825073,
            "apsval": 2.32220005989075
        },
        "bjF5mat": {
            "name": "bjF5mat",
            "wpnumber": 341902,
            "vpnumber": 341902,
            "wrnumber": 341902,
            "vrnumber": 341902,
            "prsval": 8.98842144012451,
            "trsval": 7.04925473531087,
            "arsval": 9.32803440093994,
            "ppsval": 2.11433839797974,
            "tpsval": 2.60025191307068,
            "apsval": 2.56651992797852
        },
        "tjF5mat": {
            "name": "tjF5mat",
            "wpnumber": 357098,
            "vpnumber": 357098,
            "wrnumber": 357098,
            "vrnumber": 357098,
            "prsval": 4.47977495193481,
            "trsval": 6.79346990585327,
            "arsval": 9.65233039855957,
            "ppsval": 1.87691802978516,
            "tpsval": 2.60416194370815,
            "apsval": 2.58689999580383
        },
        "tsF5mat": {
            "name": "tsF5mat",
            "wpnumber": 219014,
            "vpnumber": 219014,
            "wrnumber": 219014,
            "vrnumber": 219014,
            "prsval": 3.63758993148804,
            "trsval": 6.50654983520508,
            "arsval": 8.73840999603271,
            "ppsval": 2.07604002952576,
            "tpsval": 2.60682988166809,
            "apsval": 2.44337005615234
        },
        "zjkF5mat": {
            "name": "zjkF5mat",
            "wpnumber": 119708,
            "vpnumber": 89407,
            "wrnumber": 119708,
            "vrnumber": 89407,
            "prsval": 2.9424250125885,
            "trsval": 8.38160037994385,
            "arsval": 9.67300987243652,
            "ppsval": 1.78928995132446,
            "tpsval": 2.61073811848958,
            "apsval": 2.32220005989075
        },
        "bjF6mat": {
            "name": "bjF6mat",
            "wpnumber": 386968,
            "vpnumber": 386968,
            "wrnumber": 386968,
            "vrnumber": 386968,
            "prsval": 7.54960918426514,
            "trsval": 7.82931232452393,
            "arsval": 8.95602893829346,
            "ppsval": 2.17289328575134,
            "tpsval": 2.59044596354167,
            "apsval": 2.52238035202026
        },
        "tjF6mat": {
            "name": "tjF6mat",
            "wpnumber": 338686,
            "vpnumber": 338686,
            "wrnumber": 338686,
            "vrnumber": 338686,
            "prsval": 4.47977018356323,
            "trsval": 7.79400014877319,
            "arsval": 8.87477493286133,
            "ppsval": 1.90562992095947,
            "tpsval": 2.6100800037384,
            "apsval": 2.46468758583069
        },
        "tsF6mat": {
            "name": "tsF6mat",
            "wpnumber": 139305,
            "vpnumber": 139305,
            "wrnumber": 139305,
            "vrnumber": 139305,
            "prsval": 3.43909994761149,
            "trsval": 7.86555004119873,
            "arsval": 8.44182014465332,
            "ppsval": 2.07604002952576,
            "tpsval": 2.61031498321115,
            "apsval": 2.45960998535156
        },
        "zjkF6mat": {
            "name": "zjkF6mat",
            "wpnumber": 64207,
            "vpnumber": 61669,
            "wrnumber": 64207,
            "vrnumber": 61669,
            "prsval": 5.36128997802734,
            "trsval": 8.34451007843018,
            "arsval": 8.68743991851807,
            "ppsval": 1.88860499858856,
            "tpsval": 2.61073591124337,
            "apsval": 2.35743999481201
        },
        "bjF7mat": {
            "name": "bjF7mat",
            "wpnumber": 2304866,
            "vpnumber": 2304866,
            "wrnumber": 2304866,
            "vrnumber": 2304866,
            "prsval": 5.75363032023112,
            "trsval": 7.48268175125122,
            "arsval": 10.0935297012329,
            "ppsval": 2.16156959533691,
            "tpsval": 2.59344506263733,
            "apsval": 2.56651973724365
        },
        "tjF7mat": {
            "name": "tjF7mat",
            "wpnumber": 1544250,
            "vpnumber": 1544250,
            "wrnumber": 1544250,
            "vrnumber": 1544250,
            "prsval": 2.1867361374787,
            "trsval": 5.37055015563965,
            "arsval": 7.98627996444702,
            "ppsval": 1.95552003383636,
            "tpsval": 2.5635741019363,
            "apsval": 2.27688002586365
        },
        "tsF7mat": {
            "name": "tsF7mat",
            "wpnumber": 780349,
            "vpnumber": 780349,
            "wrnumber": 780349,
            "vrnumber": 780349,
            "prsval": 2.73705709548224,
            "trsval": 5.92157983779907,
            "arsval": 9.14099025726318,
            "ppsval": 2.13355255126953,
            "tpsval": 2.59102988243103,
            "apsval": 2.4135272286155
        },
        "zjkF7mat": {
            "name": "zjkF7mat",
            "wpnumber": 357901,
            "vpnumber": 357901,
            "wrnumber": 357901,
            "vrnumber": 357901,
            "prsval": 4.51085996627808,
            "trsval": 6.76619005203247,
            "arsval": 9.17739963531494,
            "ppsval": 1.78928995132446,
            "tpsval": 2.61073575701032,
            "apsval": 2.35743999481201
        },
        "bjF8mat": {
            "name": "bjF8mat",
            "wpnumber": 789708,
            "vpnumber": 789708,
            "wrnumber": 789708,
            "vrnumber": 789708,
            "prsval": 6.79458665847778,
            "trsval": 7.04053640365601,
            "arsval": 10.0356121063232,
            "ppsval": 2.20869088172913,
            "tpsval": 2.60683917999268,
            "apsval": 2.56308307647705
        },
        "tjF8mat": {
            "name": "tjF8mat",
            "wpnumber": 625705,
            "vpnumber": 625705,
            "wrnumber": 625705,
            "vrnumber": 625705,
            "prsval": 4.45251860441985,
            "trsval": 7.79400014877319,
            "arsval": 7.50714015960693,
            "ppsval": 2.06479001045227,
            "tpsval": 2.59177494049072,
            "apsval": 2.48155999183655
        },
        "tsF8mat": {
            "name": "tsF8mat",
            "wpnumber": 337136,
            "vpnumber": 337136,
            "wrnumber": 337136,
            "vrnumber": 337136,
            "prsval": 3.18664995829264,
            "trsval": 8.0919303894043,
            "arsval": 8.36868953704834,
            "ppsval": 2.1335599899292,
            "tpsval": 2.6139300664266,
            "apsval": 2.44336748123169
        },
        "zjkF8mat": {
            "name": "zjkF8mat",
            "wpnumber": 154331,
            "vpnumber": 154331,
            "wrnumber": 154331,
            "vrnumber": 154331,
            "prsval": 3.79173994064331,
            "trsval": 7.66949987411499,
            "arsval": 9.73554039001465,
            "ppsval": 1.78929245471954,
            "tpsval": 2.6107349395752,
            "apsval": 2.35743761062622
        }
    }
};

module.exports = objs
