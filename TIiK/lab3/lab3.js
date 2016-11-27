function generateInputValue(){
	var a = [], 
		b = 1,
		aSum = 0;
	for (var i = 1; i < N; i++) {
		a[i] = b* Math.random();
		a[i] = a[i] <= 0? eps : a[i];
		b-= a[i];
		aSum+=a[i];
	}
	a[N] = 1 - aSum;
	a[N] = a[N] <= 0? eps : a[N];
	return a;
};

function DataClean(inputPx, inputTx){
	this.inputPx = inputPx;
	this.inputTx = inputTx;
}

function DataInterference(inputPx, inputTx){
	DataClean.apply(this, arguments);
}

DataInterference.prototype = Object.create(DataClean.prototype);


DataClean.prototype._calculateH = function(){
	return this._calculateHx();
};

DataClean.prototype._calculateHx = function(){
	var Hx = 0;
	this.inputPx.forEach(function(item){
		Hx += item * Math.log2(item);
	});
	return -Hx;
};

DataClean.prototype._calculateTTx = function(){
	var tx = 0;
	var self = this;
	this.inputPx.forEach(function(item, i){
		tx += item * self.inputTx[i];
	});
	return tx;
};

DataClean.prototype._calculateII = function(){
	this.H = this._calculateH();
	this.tx = this._calculateTTx();
	return this.H / this.tx;
};

DataClean.prototype._calculateC = function(){
	return Math.log2(N) / this.tx;
};

DataClean.prototype.makeCalc = function() {
	this.II = this._calculateII();
	this.C = this._calculateC();
};

/**
* @override
* @protected
*/
DataInterference.prototype._calculateH = function(){
	this.uslPyz = this._generateUslownayaPyz();
	this.outputPz = this._generateOutputPz(this.inputPx);
	this.sowmPyz = this._generateSowmestnayaPyz(this.outputPz);
	this.Hy = this._calculateHx();
	this.Hyz = this._calculateHyz(this.sowmPyz);
	return Math.abs(this.Hy - this.Hyz);
};

/**
* @override
* @protected
*/
DataInterference.prototype._calculateC = function(){
	var Hy = Math.log2(N),
		input = [];
	for (var i = 1; i <= N; i++) {
		input[i] = 1 / N;
	}
	var outputPz = this._generateOutputPz(input);
	var sowmPyz = this._generateSowmestnayaPyz(outputPz);
	var Hyz = this._calculateHyz(sowmPyz);
	return (Hy - Hyz) / this.tx;

};

DataInterference.prototype._generateUslownayaPyz = function(){
	var p = [],
		b,
		pSum = 0,
		q = 1 / N;
	for (var i = 1; i <= N; i++) {
		p[i] = [];
		p[i][i] = 1 - q + q * Math.random();
		b = 1 - p[i][i];
		pSum = p[i][i];
		for (var j = 1; j < N; j++) {
			if(i != j) {
				p[i][j] = b * Math.random();
				//костыль связанный с погрешностью вычислений и вероятностью 0
				p[i][j] = p[i][j] <= 0 ? eps : p[i][j];
				//
				b -= p[i][j];
				pSum += p[i][j];
			}
		}
		if(i!=N){
			p[i][N] = 1 - pSum;
			p[i][N] = p[i][N] <= 0 ? eps : p[i][N]
		}
	}
	return p;
};

/**
* @params {input: Array}
*/
DataInterference.prototype._generateOutputPz = function(input){
	var p = [];
	for (var j = 1; j <= N; j++) {
		p[j] = 0;
		for (var i = 1; i <= N; i++) {
			p[j] += input[i] * this.uslPyz[i][j];
		}
	}
	return p;
};

/**
* @params {output: Array}
*/
DataInterference.prototype._generateSowmestnayaPyz = function(output){
	var sowmPyz = [];
	for (var i = 1; i <= N; i++) {
		sowmPyz[i] = [];
		for (var j = 1; j <= N; j++) {
			sowmPyz[i][j] = output[j] * this.uslPyz[i][j];
		}
	}
	return sowmPyz;
};

/**
* @params {sowmPyz}
*/
DataInterference.prototype._calculateHyz = function(sowmPyz){
	var Hyz = 0;
	for (var i = 1; i <= N; i++) {
		for (var j = 1; j <= N; j++) {
			Hyz += sowmPyz[i][j] * Math.log2(this.uslPyz[i][j]);
		}
	}
	return -Hyz;
};