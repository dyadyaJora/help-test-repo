var dataDump = {
	k: k,
	Pnk : [],
	Uk : [],
	Hkp : [],
	H : [],
	message : [],
	sums : [],
	sysB : [],
	sysKod : [],
	controlSum : []
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
    this.Up = Up;
};

dataDump.generateInputMessage = function() {
	for (var i = 0; i < this.k; i++) {
		this.message[i] = Math.floor(Math.random() * 2) + "";
	}
};

dataDump._findSums = function() {
	for (var i = 0; i < this.p; i++) {
		this.sums[i] = [];
		var pos = 0;
		while (true) {
			var foundPos = this.H[i].indexOf("1", pos);
			if (foundPos == -1) break;

			this.sums[i].push(foundPos);
  			pos = foundPos + 1; // продолжить поиск со следующей
		}
	}
};

dataDump.generateSystKod = function() {
	var x = 0;
	for (var i = 0; i < this.p; i++) {
		for (var j = 0; j < this.sums[i].length - 1; j++) {
			x = x ^ +this.message[this.sums[i][j]];
		}
		this.sysB[i] = x + "";
	}

	this.sysKod = this.message.concat(this.sysB);
};

dataDump._generateError = function() {
	this.pos =  Math.floor(Math.random() * this.n);
	this.messageWithError = this.message;
	this.messageWithError[this.pos] = this.messageWithError[this.pos]? "0" : "1";
};

dataDump._findError = function() {
	var x = 0;
	for (var i = 0; i < this.p; i++) {
		for (var j = 0; j < this.sums[i].length; j++) {
			x = x ^ +this.messageWithError[this.sums[i][j]];
		}
		this.controlSum[i] = x + "";
	}

	var cS = this.controlSum.join('');

	for (var i = 0; i < this.k; i++) {
		if(cS == this.Hkp[i].join(''))
			return i;
	}

	for (var i = 0; i < this.p; i++) {
		if(cS == this.Up[i].join(''))
			return i + this.k;
	}

	return  false;//this.p;
};

dataDump.makeCalc = function() {
	this._findN();
	this._writeInputData();
	this._generateUk();
	this._generateHkp();
	this._generatePnk();
	this._generateH();

	this._findSums();

	this.generateInputMessage();
	this.generateSystKod();

	this._generateError();

	this.errorPos = this._findError();
};