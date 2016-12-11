var dataDump = {
	k: k,
	Pnk : [],
	Uk : [],
	Hkp : [],
	H : []
};

dataDump._findN = function() {
	var K = Math.pow(2, this.k)
	for (var i = 1; true; i++) {
		if (K <= Math.pow(2, i) / i +1 ) {
			this.n = i;
			return
		}
	}
};

dataDump._writeInputData = function() {
	this.p = this.n - this.k;
	this.d = 2;
};

dataDump._generateUk = function() {
	for (var j = 0; j < this.k; j++) {
		this.Uk[j] = [];
		for (var i = 0; i < this.k; i++) {
			//информационная подматрица
			this.Uk[j][i] = i == j? "1" : "0";
		}
	}
};

dataDump._generateHkp = function() {
	var i = 1,
		j = 0,
		rnd,
		used = [],
		p = this.p;

	while( used.length != this.k ) {
		rnd = Math.floor(Math.random() * (Math.pow(2, this.p) - 1));
		if( rnd.toString(2).match(/1/g) && rnd.toString(2).match(/1/g).length >= this.d) {
			if(used.indexOf(rnd) == -1) {
				used.push(rnd);
			}
		}
	}

	this.Hkp = used.map(function(item) {
		var x = item.toString(2).split('');
		while(x.length < p) {
			x.unshift("0");
		}
		return x;
	});
};

dataDump._generatePnk = function() {
	for (var i = 0; i < this.k; i++) {
		this.Pnk[i] = this.Uk[i].concat(this.Hkp[i]);
	}
};

dataDump._generateH = function() {
	var HkpT = [],
		Up = [];
    for (var i = 0; i < this.p; i++) {
    	HkpT[i] = [];
    	Up[i] = [];
        for (var j = 0; j < this.k; j++) 
        	HkpT[i][j] = this.Hkp[j][i];
    	
        for (var j = 0; j < this.p; j++) 
        	Up[i][j] = i == j? "1" : "0";

        this.H[i] = HkpT[i].concat(Up[i]);
    }
};

dataDump.makeCalc = function() {
	this._findN();
	this._writeInputData();
	this._generateUk();
	this._generateHkp();
	this._generatePnk();
	this._generateH();


};